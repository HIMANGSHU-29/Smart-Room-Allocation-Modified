import mongoose from "mongoose";

const dutyRosterSchema = new mongoose.Schema({
    examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true }
}, { timestamps: true });

// Prevent duplicate teachers in the same room for the same exam
dutyRosterSchema.index({ examId: 1, roomId: 1, teacherId: 1 }, { unique: true });

export default mongoose.model("DutyRoster", dutyRosterSchema);
