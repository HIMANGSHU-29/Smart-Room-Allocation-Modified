import PDFDocument from "pdfkit";
import Student from "../models/student.js";
import Room from "../models/room.js";

export const generateMasterPDF = async (req, res) => {
    try {
        const students = await Student.find({ allocationStatus: "Allocated" }).sort({ roomNumber: 1, name: 1 });

        const doc = new PDFDocument();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=master_allocation.pdf");
        doc.pipe(res);

        doc.fontSize(20).text("Master Seating Allocation Table", { align: "center" });
        doc.moveDown();
        doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: "center" });
        doc.moveDown(2);

        students.forEach((s, i) => {
            doc.fontSize(12).text(`${i + 1}. ${s.name} - Roll: ${s.rollNumber} - Room: ${s.roomNumber}`);
            if ((i + 1) % 25 === 0) doc.addPage();
        });

        doc.end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const generateRoomPDF = async (req, res) => {
    try {
        const { roomNo } = req.params;
        const students = await Student.find({ roomNumber: roomNo }).sort({ name: 1 });

        if (!students.length) return res.status(404).json({ message: "No assignments found for this venue." });

        const doc = new PDFDocument();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=room_${roomNo}_allocation.pdf`);
        doc.pipe(res);

        doc.fontSize(22).text(`Venue Seating Plan: ${roomNo}`, { align: "center" });
        doc.moveDown();
        doc.fontSize(10).text(`Registry Protocol: Room-Specific Export`, { align: "center" });
        doc.moveDown(2);

        doc.fontSize(14).text("Assigned Candidates:", { underline: true });
        doc.moveDown();

        students.forEach((s, i) => {
            doc.fontSize(12).text(`${i + 1}. [${s.rollNumber}] ${s.name} (${s.department})`);
            doc.moveDown(0.5);
        });

        doc.end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
