import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addTeacher, getTeachers, updateTeacher, deleteTeacher } from "../controllers/teacherController.js";

const router = express.Router();

router.get("/", protect, getTeachers);
router.post("/", protect, addTeacher);
router.put("/:id", protect, updateTeacher);
router.delete("/:id", protect, deleteTeacher);

export default router;
