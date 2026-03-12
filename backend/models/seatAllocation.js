import mongoose from "mongoose";

const seatAllocationSchema = new mongoose.Schema({
    examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    seatNumber: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("SeatAllocation", seatAllocationSchema);
