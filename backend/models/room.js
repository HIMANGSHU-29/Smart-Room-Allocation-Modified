import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomNo: String,
  block: String,
  capacity: Number,
  totalRows: { type: Number, default: 10 },
  totalColumns: { type: Number, default: 6 },
  filled: { type: Number, default: 0 },
  gender: {
    type: String,
    enum: ["Male", "Female", "Both"],
    default: "Both",
  },
  status: {
    type: String,
    enum: ["Active", "Maintenance"],
    default: "Active",
  },
  type: {
    type: String,
    enum: ["Hall", "Classroom", "Lab", "Gallery"],
    default: "Hall",
  },
});

export default mongoose.model("Room", roomSchema);
