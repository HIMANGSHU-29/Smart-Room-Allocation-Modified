import mongoose from "mongoose";
import dotenv from "dotenv";
import Student from "./models/student.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

await Student.deleteMany();

await Student.insertMany([
  {
    name: "Rahul",
    roll: "BCA101",
    room: "A-101",
    seat: "12",
    status: "Assigned",
  },
  {
    name: "Amit",
    roll: "BCA102",
    room: "B-201",
    seat: "5",
    status: "Assigned",
  },
]);

console.log("Seeded");

process.exit();