import express from "express";
import { generateMasterPDF, generateRoomPDF } from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/pdf", generateMasterPDF);
router.get("/pdf/room/:roomNo", generateRoomPDF);

export default router;
