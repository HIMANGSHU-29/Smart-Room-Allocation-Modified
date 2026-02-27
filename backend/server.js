import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import admin from "firebase-admin";

import connectDB from "./config/db.js";

import studentRoutes from "./routes/studentRoutes.js";
import allocationRoutes from "./routes/allocationRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();
connectDB();

// Initialize Firebase Admin
admin.initializeApp({
  projectId: "allocateu-dab0d"
});

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/students", studentRoutes);
app.use("/api/allocation", allocationRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on all interfaces at port ${PORT}`);
});