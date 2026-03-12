import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
    examId: { type: String, required: true, unique: true, trim: true },
    subjectName: { type: String, required: true, trim: true },
    courses: { type: [String], required: true },
    year: { type: Number, required: true },
    semester: { type: Number, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    duration: { type: Number, required: true },
    linkedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
}, { timestamps: true });

export default mongoose.model("Exam", examSchema);
