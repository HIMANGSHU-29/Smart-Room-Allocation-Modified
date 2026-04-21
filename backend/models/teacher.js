import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
    teacherId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    designation: { type: String, required: true, default: "Assistant Professor", trim: true },
    isInvigilator: { type: Boolean, default: true },
    maxExamDuties: { type: Number, default: 5 },
    unavailableDates: { type: [Date], default: [] },
    compatibleCourses: { type: [String], default: [] }, // Departments like 'BCA', 'BBA'
    teachingSubjects: { type: [String], default: [] }   // Specific subjects
}, { timestamps: true });

export default mongoose.model("Teacher", teacherSchema);
