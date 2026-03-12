import express from "express";
import { logError, getErrors } from "../controllers/errorController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Allow public access to logError so client doesn't need to be authenticated to report crashes
router.post("/", logError);
// Protect viewing errors so only admins can see them
router.get("/", protect, getErrors);

export default router;
