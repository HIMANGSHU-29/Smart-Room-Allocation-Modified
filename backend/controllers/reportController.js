import PDFDocument from "pdfkit";
import Student from "../models/student.js";
import Room from "../models/room.js";
import Exam from "../models/exam.js";
import DutyRoster from "../models/dutyRoster.js";
import SeatAllocation from "../models/seatAllocation.js";

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
export const generateExamRoomPDF = async (req, res) => {
    try {
        const { examId, roomId } = req.params;

        const exam = await Exam.findById(examId);
        const room = await Room.findById(roomId);
        
        if (!exam || !room) {
            return res.status(404).json({ message: "Exam or Venue not found." });
        }

        // Fetch students allocated to this specific room for this specific exam
        const allocations = await SeatAllocation.find({ examId, roomId })
            .populate("studentId")
            .sort({ seatNumber: 1 });

        // Fetch the Duty Roster to find the Invigilator
        const duty = await DutyRoster.findOne({ examId, roomId }).populate("teacherId");
        const invigilator = duty && duty.teacherId ? `${duty.teacherId.name} (${duty.teacherId.designation})` : "UNASSIGNED";

        if (!allocations.length) {
            return res.status(404).json({ message: "No students mapped to this Venue for this Exam." });
        }

        const doc = new PDFDocument({ margin: 50 });
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=Exam_${exam.subjectName}_Room_${room.roomNo}.pdf`);
        doc.pipe(res);

        // Header Block
        doc.fontSize(20).font('Helvetica-Bold').text(`EXAMINATION VENUE REGISTRY`, { align: "center" });
        doc.moveDown(0.5);
        doc.fontSize(12).font('Helvetica').text(`Generated: ${new Date().toLocaleString()}`, { align: "center", fontStyle: 'italic' });
        doc.moveDown(1.5);

        // Context Matrix Box
        doc.rect(50, doc.y, 500, 100).stroke();
        const boxTop = doc.y;
        
        doc.fontSize(11).font('Helvetica-Bold');
        doc.text(`EXAM NAME:`, 60, boxTop + 15).font('Helvetica').text(`${exam.subjectName} (${exam.year} Year / ${exam.semester} Sem)`, 150, boxTop + 15);
        
        doc.font('Helvetica-Bold').text(`DATE & TIME:`, 60, boxTop + 40)
           .font('Helvetica').text(`${new Date(exam.date).toLocaleDateString()} | ${exam.startTime} - ${exam.endTime}`, 150, boxTop + 40);

        doc.font('Helvetica-Bold').text(`VENUE IDENTIFIER:`, 60, boxTop + 65).font('Helvetica').text(`Room ${room.roomNo}`, 180, boxTop + 65);
        
        doc.font('Helvetica-Bold').text(`INVIGILATOR:`, 300, boxTop + 65).font('Helvetica').fillColor(duty ? 'blue' : 'red').text(invigilator, 385, boxTop + 65);

        // Reset fill color for the list
        doc.fillColor('black');
        doc.moveDown(4);

        // Candidates Table Header
        doc.fontSize(14).font('Helvetica-Bold').text("Targeted Candidate Roster", { underline: true });
        doc.moveDown();

        // Draw Table Columns
        const tableTop = doc.y;
        doc.fontSize(11).font('Helvetica-Bold');
        doc.text("Seat / Grid", 50, tableTop);
        doc.text("Roll Number", 150, tableTop);
        doc.text("Candidate Profile", 280, tableTop);
        doc.text("Signature", 450, tableTop);
        
        doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
        
        let yPos = tableTop + 25;
        doc.font('Helvetica');

        // Loop Students
        allocations.forEach((alloc, i) => {
            const st = alloc.studentId;
            if (!st) return;

            if (yPos > 700) {
                doc.addPage();
                yPos = 50;
            }

            doc.text(`${alloc.seatNumber}`, 50, yPos);
            doc.text(`${st.rollNumber}`, 150, yPos);
            doc.text(`${st.name.substring(0,25)}`, 280, yPos);
            doc.moveTo(450, yPos + 10).lineTo(540, yPos + 10).dash(2, { space: 2 }).stroke(); // Signature line
            doc.undash();

            yPos += 25;
        });

        doc.moveDown(2);
        
        // Footer Verification Signatures
        if (yPos > 650) {
             doc.addPage();
             yPos = 50;
        }

        doc.y = yPos + 30;
        doc.moveTo(50, doc.y).lineTo(200, doc.y).stroke();
        doc.moveTo(350, doc.y).lineTo(500, doc.y).stroke();
        
        doc.fontSize(10).font('Helvetica-Bold');
        doc.text("Invigilator Signature", 50, doc.y + 5);
        doc.text("Examinations Dispatcher", 350, doc.y + 5);

        doc.end();
    } catch (err) {
        console.error("PDF Generate Error:", err);
        res.status(500).json({ error: err.message });
    }
};
