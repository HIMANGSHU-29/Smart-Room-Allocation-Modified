import Teacher from "../models/teacher.js";

export const addTeacher = async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.email) data.email = data.email.toLowerCase();

        const teacher = await Teacher.create(data);
        res.status(201).json(teacher);
    } catch (err) {
        res.status(400).json({
            message: err.code === 11000 ? "Teacher ID or Email already exists." : "Add failed",
            error: err.message
        });
    }
};

export const getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find().sort({ teacherId: 1 });
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateTeacher = async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.email) data.email = data.email.toLowerCase();

        const teacher = await Teacher.findByIdAndUpdate(req.params.id, data, { new: true });
        if (!teacher) return res.status(404).json({ message: "Teacher not found" });
        res.json(teacher);
    } catch (err) {
        res.status(400).json({
            message: err.code === 11000 ? "Teacher ID or Email already exists." : "Update failed",
            error: err.message
        });
    }
};

export const deleteTeacher = async (req, res) => {
    try {
        await Teacher.findByIdAndDelete(req.params.id);
        res.json({ message: "Teacher deleted" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed", error: err.message });
    }
};
