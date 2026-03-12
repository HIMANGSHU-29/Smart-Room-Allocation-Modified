import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allocateSeatsForExam } from "../controllers/examAllocationController.js";

const router = express.Router();

router.post("/allocate", protect, allocateSeatsForExam);

export default router;
