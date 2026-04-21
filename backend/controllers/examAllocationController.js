import mongoose from "mongoose";
import Exam from "../models/exam.js";
import ExamSchedule from "../models/examSchedule.js";
import SeatAllocation from "../models/seatAllocation.js";
import Room from "../models/room.js";
import Student from "../models/student.js";
import Teacher from "../models/teacher.js";
import DutyRoster from "../models/dutyRoster.js";

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

        // Batch insert seat mappings
        const inserted = await SeatAllocation.insertMany(newAllocations);

        // Batch update student statuses to 'Allocated' so the dashboard syncs
        const allocatedStudentIds = newAllocations.map(a => a.studentId);
        await Student.updateMany(
            { _id: { $in: allocatedStudentIds } },
            { $set: { allocationStatus: "Allocated" } }
        );

        res.status(201).json({
            message: "Seats allocated successfully",
            allocatedCount: inserted.length
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const allocateInvigilatorsForExam = async (req, res) => {
    try {
        const { examId } = req.body;

        const exam = await Exam.findById(examId);
        if (!exam) return res.status(404).json({ message: "Exam not found" });

        // 1. Fetch all assigned rooms for this exam
        const schedules = await ExamSchedule.find({ examId }).populate("roomId").sort({ "roomId.roomNo": 1 });
        if (!schedules.length) {
            return res.status(400).json({ message: "No rooms scheduled for this exam yet" });
        }

        const rooms = schedules.map(s => s.roomId);

        // 2. Fetch all eligible invigilators
        // Optional future enhancement: filter out teachers where `unavailableDates` includes the exam date
        const eligibleTeachers = await Teacher.find({ isInvigilator: true });
        
        if (eligibleTeachers.length < rooms.length) {
            return res.status(400).json({ 
                message: `Not enough eligible teachers. Need ${rooms.length}, but only found ${eligibleTeachers.length}.` 
            });
        }

        // 3. To enforce maxExamDuties, we need to know how many duties each teacher already has globally
        // This aggregation counts how many times each teacherId appears across ALL DutyRosters
        const currentDutyCounts = await DutyRoster.aggregate([
            { $group: { _id: "$teacherId", count: { $sum: 1 } } }
        ]);
        
        const dutyMap = {};
        currentDutyCounts.forEach(t => {
            dutyMap[t._id.toString()] = t.count;
        });

        // 4. Sort teachers by fewest existing duties first to ensure fair distribution
        let availablePool = [...eligibleTeachers].sort((a, b) => {
            const countA = dutyMap[a._id.toString()] || 0;
            const countB = dutyMap[b._id.toString()] || 0;
            return countA - countB;
        });

        // 5. Clear previous duty roster for this specific exam to allow re-running the algorithm safely
        await DutyRoster.deleteMany({ examId });

        const newDuties = [];

        // 6. Assign one teacher per room
        for (const room of rooms) {
            
            // Find the next teacher who hasn't exceeded their limit
            let selectedTeacherIdx = -1;
            
            for (let i = 0; i < availablePool.length; i++) {
                const teacher = availablePool[i];
                const currentCount = dutyMap[teacher._id.toString()] || 0;
                const maxDuties = teacher.maxExamDuties || 5;

                if (currentCount < maxDuties) {
                    selectedTeacherIdx = i;
                    // Increment their theoretical count for the next iteration
                    dutyMap[teacher._id.toString()] = currentCount + 1;
                    break;
                }
            }

            if (selectedTeacherIdx === -1) {
                // If we get here, everyone available is maxed out
                return res.status(400).json({ 
                    message: `Algorithm failed. All remaining ${availablePool.length} teachers have reached their maxExamDuties limit.` 
                });
            }

            const assignedTeacher = availablePool[selectedTeacherIdx];
            
            newDuties.push({
                examId,
                roomId: room._id,
                teacherId: assignedTeacher._id
            });

            // Remove this teacher from the pool so they don't get assigned to a second room in the SAME exam
            availablePool.splice(selectedTeacherIdx, 1);
        }

        // 7. Batch insert
        const inserted = await DutyRoster.insertMany(newDuties);

        res.status(201).json({
            message: "Invigilators allocated successfully",
            allocatedCount: inserted.length,
            roster: inserted
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
