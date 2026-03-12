import mongoose from "mongoose";

const invigilatorSchema = new mongoose.Schema({
    teacherId: { type: String, required: true, unique: true, trim: true },
    teacherName: { type: String, required: true, trim: true }
}, { timestamps: true });

export default mongoose.model("Invigilator", invigilatorSchema);
