import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    rollNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
    },

    semester: {
      type: Number,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    allocationStatus: {
      type: String,
      enum: ["Pending", "Allocated"],
      default: "Pending",
    },
    roomNumber: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

studentSchema.index({ allocationStatus: 1 });
studentSchema.index({ roomNumber: 1 });

const Student = mongoose.model("Student", studentSchema);

export default Student;