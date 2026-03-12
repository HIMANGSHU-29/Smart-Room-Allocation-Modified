import mongoose from "mongoose";
import Exam from "../models/exam.js";
import ExamSchedule from "../models/examSchedule.js";
import SeatAllocation from "../models/seatAllocation.js";
import Room from "../models/room.js";
import Student from "../models/student.js";

export const allocateSeatsForExam = async (req, res) => {
    try {
        const { examId, targetStudentIds } = req.body;

        const exam = await Exam.findById(examId);
        if (!exam) return res.status(404).json({ message: "Exam not found" });

        // 1. Fetch all assigned rooms for this exam from ExamSchedule
        const schedules = await ExamSchedule.find({ examId }).populate("roomId").sort({ "roomId.roomNo": 1 });
        if (!schedules.length) {
            return res.status(400).json({ message: "No rooms scheduled for this exam yet" });
        }

        // 2. Fetch target students
        if (!targetStudentIds || !targetStudentIds.length) {
            return res.status(400).json({ message: "No target students provided" });
        }

        // Sort students ascending by rollNumber
        const students = await Student.find({ _id: { $in: targetStudentIds } }).sort({ rollNumber: 1 });

        let totalCapacity = 0;
        const rooms = schedules.map(s => {
            totalCapacity += s.roomId.capacity;
            return s.roomId;
        });

        if (students.length > totalCapacity) {
            return res.status(400).json({ message: "Total students exceed total capacity of scheduled rooms" });
        }

        // 3. Group students into buckets by department
        const deptBuckets = {};
        for (const student of students) {
            if (!deptBuckets[student.department]) {
                deptBuckets[student.department] = [];
            }
            deptBuckets[student.department].push(student);
        }

        // Array of department names for interleaving
        const departments = Object.keys(deptBuckets);
        if (departments.length === 0) return res.status(400).json({ message: "No students mapped to departments" });

        // 4. Iterate through rooms and allocate seats maintaining alternate branch logic
        let deptIdx = 0;
        let studentIndex = 0;
        let studentsAllocated = 0;

        // Clear any previous allocations for this specific exam
        await SeatAllocation.deleteMany({ examId });

        const newAllocations = [];

        // Helper to get next student from an alternating department
        const getNextStudent = (previousDept) => {
            let loops = 0;
            while (loops < departments.length) {
                const dept = departments[deptIdx];

                // Prevent consecutive same-department in the same row if possible
                if (dept !== previousDept && deptBuckets[dept].length > 0) {
                    const student = deptBuckets[dept].shift();
                    deptIdx = (deptIdx + 1) % departments.length;
                    return { student, dept };
                }

                deptIdx = (deptIdx + 1) % departments.length;
                loops++;
            }

            // If we couldn't find a different department (only 1 dept left), just pick the first available
            for (const dept of departments) {
                if (deptBuckets[dept].length > 0) {
                    const student = deptBuckets[dept].shift();
                    return { student, dept };
                }
            }

            return null;
        };

        for (const room of rooms) {
            let roomAllocationCount = 0;
            const totalRows = room.totalRows || 10;
            const totalColumns = room.totalColumns || 6;

            let previousDept = null;

            for (let row = 1; row <= totalRows; row++) {
                for (let col = 1; col <= totalColumns; col++) {

                    if (studentsAllocated >= students.length) break;
                    if (roomAllocationCount >= room.capacity) break;

                    const next = getNextStudent(previousDept);
                    if (!next) break;

                    const { student, dept } = next;
                    previousDept = dept;

                    // Generate formal string
                    const seatNumber = `${room.roomNo}-${String(row).padStart(2, '0')}-${String(col).padStart(2, '0')}`;

                    newAllocations.push({
                        examId,
                        studentId: student._id,
                        roomId: room._id,
                        seatNumber
                    });

                    roomAllocationCount++;
                    studentsAllocated++;
                }
                previousDept = null; // Reset prev department at start of new row so we can start fresh
            }
        }

        if (studentsAllocated < students.length) {
            // Rollback if something failed (though capacity checks should prevent this logic branch mostly)
            return res.status(500).json({ message: "Algorithm failed to assign all students, potentially due to bad matrix layout vs target limits." });
        }

        // Batch insert
        const inserted = await SeatAllocation.insertMany(newAllocations);

        res.status(201).json({
            message: "Seats allocated successfully",
            allocatedCount: inserted.length
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
