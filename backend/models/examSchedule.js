import mongoose from "mongoose";

const examScheduleSchema = new mongoose.Schema({
    examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    invigilatorId: { type: mongoose.Schema.Types.ObjectId, ref: "Invigilator" }
}, { timestamps: true });

export default mongoose.model("ExamSchedule", examScheduleSchema);
