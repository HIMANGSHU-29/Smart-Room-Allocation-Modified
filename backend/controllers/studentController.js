import Student from "../models/student.js";
import SeatAllocation from "../models/seatAllocation.js";
import csv from "csv-parser";
import fs from "fs";
import Joi from "joi";
import logger from "../utils/logger.js";

const studentValidationSchema = Joi.object({
  name: Joi.string().max(100).required(),
  rollNumber: Joi.string().required(),
  department: Joi.string().required(),
  semester: Joi.number().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  gender: Joi.string().valid("Male", "Female", "Other").required(),
});

// Helper for file cleanup
const cleanup = (path) => {
  if (path && fs.existsSync(path)) fs.unlinkSync(path);
};

/* Upload CSV */
export const uploadStudents = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const students = [];
    const rejected = [];

    // Normalize headers: lowercase, remove spaces/underscores
    const normalize = (str) =>
      str?.toString().toLowerCase().trim().replace(/\s|_/g, "");

    fs.createReadStream(filePath)
      .pipe(
        csv({
          mapHeaders: ({ header }) => normalize(header),
          skipEmptyLines: true,
        })
      )
      .on("data", (row) => {
        try {
          // Flexible mapping based on normalized headers
          const roll = row.rollnumber || row.rollno || row.roll || row.registrationid || row.roll_number;
          const name = row.name || row.studentname || row.fullname;
          const email = row.email || row.officialemail || row.mail;
          const phone = row.phone || row.mobile || row.contact || row.phonenumber;
          const dept = row.department || row.dept || row.stream || "General";
          const sem = row.semester || row.sem || "1";
          const gender = row.gender || row.sex || "Male";

          // Validation: Minimum required fields
          if (!roll || !name || !email) {
            rejected.push(row);
            return;
          }

          students.push({
            rollNumber: String(roll).trim(),
            name: String(name).trim(),
            department: String(dept).trim(),
            semester: Number(sem) || 1,
            email: String(email).trim().toLowerCase(),
            phone: phone ? String(phone).trim() : String(roll).trim(),
            gender: String(gender).trim(),
            allocationStatus: "Pending",
            roomNumber: null,
          });
        } catch (err) {
          rejected.push(row);
        }
      })
      .on("end", async () => {
        try {
          if (students.length === 0) {
            cleanup(filePath);
            return res.status(400).json({
              message: "No valid student data found in CSV. Required: rollNumber, name, email.",
              rejected: rejected.length,
            });
          }

          // insertMany with ordered: false lets it continue despite duplicate errors
          const result = await Student.insertMany(students, { ordered: false });

          cleanup(filePath);

          return res.json({
            message: "Upload completed",
            inserted: result.length,
            rejected: rejected.length,
          });
        } catch (err) {
          cleanup(filePath);

          // Handle partial success (some were duplicates)
          const inserted = err.insertedDocs?.length || err.result?.nInserted || 0;

          return res.status(200).json({
            message: inserted > 0
              ? `${inserted} new students added. Duplicates were skipped.`
              : "No students added. All records are already registered.",
            inserted,
            rejected: rejected.length,
            error: err.message,
          });
        }
      })
      .on("error", (err) => {
        cleanup(filePath);
        console.error("CSV STREAM ERROR:", err);
        return res.status(500).json({ message: "CSV parsing failed", error: err.message });
      });
  } catch (err) {
    logger.error("UPLOAD ERROR:", err);
    if (req.file?.path) cleanup(req.file.path);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

/* Get All Students (Search & Pagination) */
export const getStudents = async (req, res) => {
  try {
    const { search, department, status, page = 1, limit = 100 } = req.query;
    let query = {};

    if (search && search.trim() !== "") {
      const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { rollNumber: { $regex: escapedSearch, $options: "i" } },
        { name: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    if (department && department.trim() !== "") query.department = department.trim();
    if (status && status.trim() !== "") query.allocationStatus = status.trim();

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const students = await Student.find(query)
      .sort({ rollNumber: 1 })
      .skip(skip)
      .limit(take)
      .lean()
      .exec();

    const count = await Student.countDocuments(query);

    res.json({
      students,
      totalPages: Math.ceil(count / take),
      currentPage: parseInt(page),
      totalStudents: count,
    });
  } catch (err) {
    logger.error("getStudents Error:", err);
    res.status(500).json({ error: "Failed to fetch student records" });
  }
};

/* Get Distinct Departments */
export const getDistinctDepartments = async (req, res) => {
  try {
    const departments = await Student.distinct("department");
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* Add Student Manually */
export const addStudent = async (req, res) => {
  try {
    const { error, value } = studentValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    if (value.email) value.email = value.email.toLowerCase();

    const student = await Student.create(value);
    res.status(201).json(student);
  } catch (err) {
    logger.error("addStudent Error:", err);
    res.status(400).json({
      error: err.code === 11000 ? "Roll number, Email, or Phone already exists." : "Add failed",
      details: err.message
    });
  }
};

/* Update Student */
export const updateStudent = async (req, res) => {
  try {
    const { error, value } = studentValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    if (value.email) value.email = value.email.toLowerCase();

    const student = await Student.findByIdAndUpdate(req.params.id, value, { new: true, runValidators: true }).lean();
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) {
    logger.error("updateStudent Error:", err);
    res.status(400).json({
      error: err.code === 11000 ? "Roll number, Email, or Phone already exists." : "Update failed",
      details: err.message
    });
  }
};

/* Delete Student */
export const deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted" });
  } catch (err) {
    logger.error("deleteStudent Error:", err);
    res.status(500).json({ error: "Delete failed. Contact admin." });
  }
};

/* Delete All Students */
export const deleteAllStudents = async (req, res) => {
  try {
    await Student.deleteMany({});
    res.json({ message: "All student records have been deleted" });
  } catch (err) {
    logger.error("deleteAllStudents Error:", err);
    res.status(500).json({ error: "Failed to delete all records. Contact admin." });
  }
};

/* Public Search by Roll Number */
export const getStudentByRoll = async (req, res) => {
  try {
    const { rollNo } = req.params;
    const student = await Student.findOne({ rollNumber: rollNo.trim() }).lean();
    if (!student) return res.status(404).json({ message: "Candidate not found in registry." });

    // Look for their most recent seat allocation
    const allocation = await SeatAllocation.findOne({ studentId: student._id })
      .populate("roomId", "roomNo")
      .populate("examId", "examName date")
      .sort({ createdAt: -1 })
      .lean();

    if (allocation) {
      student.assignedRoom = allocation.roomId?.roomNo;
      student.assignedSeat = allocation.seatNumber;
      student.examName = allocation.examId?.examName;
      student.examDate = allocation.examId?.date;
    }

    res.json(student);
  } catch (err) {
    logger.error("getStudentByRoll Error:", err);
    res.status(500).json({ error: "Registry query failed. Please try again later." });
  }
};