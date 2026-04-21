import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allocateSeatsForExam, allocateInvigilatorsForExam } from "../controllers/examAllocationController.js";

const router = express.Router();

router.post("/allocate/seats", protect, allocateSeatsForExam);
router.post("/allocate/invigilators", protect, allocateInvigilatorsForExam);

export default router;
