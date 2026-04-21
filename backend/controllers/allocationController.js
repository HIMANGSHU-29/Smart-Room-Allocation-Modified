import Student from "../models/student.js";
import Room from "../models/room.js";
import SeatAllocation from "../models/seatAllocation.js";

// Helper to shuffle array (Fisher-Yates)
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const runAllocation = async (req, res) => {
  try {
    const { mixingType = "random" } = req.body;

    // 1. Get all pending students and active halls
    const students = await Student.find({ allocationStatus: "Pending" });
    const halls = await Room.find({ status: "Active" }).sort({ roomNo: 1 });

    if (!students.length) return res.json({ message: "No pending students" });
    if (!halls.length) return res.status(400).json({ message: "No active halls available" });

    // 2. Process mixing protocol
    let processedStudents = [...students];
    if (mixingType === "random") {
      processedStudents = shuffle(processedStudents);
    } else if (mixingType === "department") {
      processedStudents.sort((a, b) => a.department.localeCompare(b.department));
    } else if (mixingType === "sequential") {
      processedStudents.sort((a, b) => a.rollNumber.localeCompare(b.rollNumber, undefined, { numeric: true }));
    }

    let allocatedCount = 0;
    let hallIndex = 0;

    // 3. Assign seating plan
    for (let student of processedStudents) {
      // Find suitable hall (respect gender and capacity)
      let hall = halls[hallIndex];

      // If current hall is full or gender doesn't match, move to next
      while (hallIndex < halls.length) {
        hall = halls[hallIndex];
        const genderMatch = (hall.gender === "Both" || hall.gender === student.gender);
        const hasSpace = hall.filled < hall.capacity;

        if (genderMatch && hasSpace) break;
        hallIndex++;
      }

      if (hallIndex >= halls.length) break; // No more capacity in any hall

      // Assign student to hall
      student.roomNumber = hall.roomNo;
      student.allocationStatus = "Allocated";
      hall.filled += 1;

      await student.save();
      await hall.save();
      allocatedCount++;
    }

    res.json({
      message: `Seating Plan (${mixingType}) generated successfully`,
      allocated: allocatedCount,
      totalPending: processedStudents.length - allocatedCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const resetAllocation = async (req, res) => {
  try {
    // 1. Reset base entities
    await Student.updateMany({}, { allocationStatus: "Pending", roomNumber: null });
    await Room.updateMany({}, { filled: 0 });
    
    // 2. Clear out advanced routing records
    await SeatAllocation.deleteMany({});
    
    res.json({ message: "Seating Plan reset successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
