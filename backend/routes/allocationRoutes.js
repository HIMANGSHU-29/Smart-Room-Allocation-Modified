import express from "express";
import { runAllocation, resetAllocation } from "../controllers/allocationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/run", runAllocation);
router.post("/reset", resetAllocation);

export default router;