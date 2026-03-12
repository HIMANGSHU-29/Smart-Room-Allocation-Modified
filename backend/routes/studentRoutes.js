import express from "express";
import multer from "multer";

import { protect } from "../middleware/authMiddleware.js";

import {
  uploadStudents,
  getStudents,
  deleteStudent,
  addStudent,
  updateStudent,
  getDistinctDepartments,
} from "../controllers/studentController.js";
import { getDashboardStats } from "../controllers/statsController.js";

import { getStudentByRoll } from "../controllers/studentController.js";

const router = express.Router();

/* File Storage */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* Routes */
router.get("/stats", getDashboardStats);
router.get("/departments", protect, getDistinctDepartments);
router.get("/", protect, getStudents);
router.post("/", protect, addStudent);
router.put("/:id", protect, updateStudent);
router.delete("/:id", protect, deleteStudent);
router.post("/upload", protect, upload.single("file"), uploadStudents);

/* Public Search Route - Moved to end to avoid collision */
router.get("/:rollNo", getStudentByRoll);

export default router;