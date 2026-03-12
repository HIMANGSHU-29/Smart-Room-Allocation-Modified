import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createExam, createInvigilator, scheduleExamToRoom, getExams, getExamAnalytics, deleteExam } from "../controllers/examController.js";

const router = express.Router();

router.get("/", protect, getExams);
router.get("/analytics", protect, getExamAnalytics);
router.post("/", protect, createExam);
router.post("/invigilator", protect, createInvigilator);
router.post("/schedule", protect, scheduleExamToRoom);
router.delete("/:id", protect, deleteExam);

export default router;
