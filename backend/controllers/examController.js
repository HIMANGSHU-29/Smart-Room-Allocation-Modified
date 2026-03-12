import Exam from "../models/exam.js";
import ExamSchedule from "../models/examSchedule.js";
import SeatAllocation from "../models/seatAllocation.js";
import Room from "../models/room.js";
import Invigilator from "../models/invigilator.js";
import Student from "../models/student.js";

// Helper to check time overlap
const isOverlapping = (startA, endA, startB, endB) => {
    const toMinutes = (time) => {
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m;
    };
    const sA = toMinutes(startA), eA = toMinutes(endA);
    const sB = toMinutes(startB), eB = toMinutes(endB);

    return Math.max(sA, sB) < Math.min(eA, eB);
};

// 1. Create an Exam
export const createExam = async (req, res) => {
    try {
        const { examId, subjectName, courses, year, semester, date, startTime, endTime, duration } = req.body;

        // Find relevant students
        const students = await Student.find({
            semester: semester,
            department: { $in: courses }
        });

        const linkedStudents = students.map(student => student._id);

        const exam = new Exam({
            examId,
            subjectName,
            courses,
            year,
            semester,
            date: new Date(date),
            startTime,
            endTime,
            duration,
            linkedStudents
        });
        await exam.save();
        res.status(201).json({ message: "Exam created successfully", exam });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 1.5. Get all Exams
export const getExams = async (req, res) => {
    try {
        const exams = await Exam.find().sort({ date: 1, startTime: 1 });
        res.status(200).json(exams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 1.6. Get Exam Analytics
export const getExamAnalytics = async (req, res) => {
    try {
        const exams = await Exam.find().populate('linkedStudents');
        const analytics = exams.reduce((acc, exam) => {
            const subject = exam.subjectName;
            const count = exam.linkedStudents.length;

            const existing = acc.find(item => item.subject === subject);
            if (existing) {
                existing.students += count;
            } else {
                acc.push({ subject, students: count });
            }
            return acc;
        }, []);
        res.status(200).json(analytics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Create an Invigilator
export const createInvigilator = async (req, res) => {
    try {
        const { teacherId, teacherName } = req.body;
        const invig = new Invigilator({ teacherId, teacherName });
        await invig.save();
        res.status(201).json({ message: "Invigilator created successfully", invigilator: invig });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Schedule an Exam in a Room with an Invigilator
export const scheduleExamToRoom = async (req, res) => {
    try {
        const { examId, roomId, invigilatorId, targetStudentIds = [] } = req.body;

        const exam = await Exam.findById(examId);
        if (!exam) return res.status(404).json({ message: "Exam not found" });

        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ message: "Room not found" });

        // Step 4: Room Capacity Validation (before allocation)
        if (targetStudentIds.length > room.capacity) {
            return res.status(400).json({ message: "Target students exceed room capacity" });
        }

        // Fetch existing schedules for the same date
        // We need to join with Exam to check date and time
        const existingSchedules = await ExamSchedule.find()
            .populate("examId")
            .populate("roomId")
            .populate("invigilatorId");

        const dailySchedules = existingSchedules.filter(s => {
            // Check if dates match precisely
            return s.examId.date.toISOString().split('T')[0] === exam.date.toISOString().split('T')[0];
        });

        for (let schedule of dailySchedules) {
            const isTimeOverlap = isOverlapping(exam.startTime, exam.endTime, schedule.examId.startTime, schedule.examId.endTime);

            if (isTimeOverlap) {
                // Step 1: Time Conflict Detection
                if (schedule.roomId._id.toString() === roomId.toString()) {
                    return res.status(400).json({ message: "Room is already booked during this time." });
                }

                // Step 3: Invigilator Conflict Detection
                if (invigilatorId && schedule.invigilatorId && schedule.invigilatorId._id.toString() === invigilatorId.toString()) {
                    return res.status(400).json({ message: "Invigilator is already assigned to an overlapping exam in another room." });
                }
            }
        }

        // Step 2: Student Clash Prevention
        // Check if any of the target students are already allocated to an exam that overlaps
        if (targetStudentIds.length > 0) {
            const studentAllocations = await SeatAllocation.find({ studentId: { $in: targetStudentIds } }).populate("examId");
            for (const allocation of studentAllocations) {
                if (allocation.examId.date.toISOString().split('T')[0] === exam.date.toISOString().split('T')[0]) {
                    const clash = isOverlapping(exam.startTime, exam.endTime, allocation.examId.startTime, allocation.examId.endTime);
                    if (clash) {
                        return res.status(400).json({ message: `Student clash detected for student ${allocation.studentId}. Overlapping exam: ${allocation.examId.examId}` });
                    }
                }
            }
        }

        // All constraints passed -> create schedule
        const newSchedule = new ExamSchedule({
            examId,
            roomId,
            invigilatorId: invigilatorId || null
        });

        await newSchedule.save();
        return res.status(201).json({ message: "Exam scheduled to room successfully", schedule: newSchedule });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Delete an Exam
export const deleteExam = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete associated ExamSchedules
        await ExamSchedule.deleteMany({ examId: id });

        // Delete associated SeatAllocations
        await SeatAllocation.deleteMany({ examId: id });

        // Delete the Exam
        const deletedExam = await Exam.findByIdAndDelete(id);

        if (!deletedExam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        res.status(200).json({ message: "Exam and associated records deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
