import express from "express";
import { generateMasterPDF, generateRoomPDF, generateExamRoomPDF } from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/pdf", generateMasterPDF);
router.get("/pdf/room/:roomNo", generateRoomPDF); // Legacy route
router.get("/pdf/exam/:examId/room/:roomId", generateExamRoomPDF);

export default router;
