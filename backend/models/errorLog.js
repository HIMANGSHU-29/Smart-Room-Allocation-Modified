import mongoose from "mongoose";

const errorLogSchema = new mongoose.Schema({
    message: { type: String, required: true },
    stack: { type: String },
    component: { type: String },
    route: { type: String },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("ErrorLog", errorLogSchema);
