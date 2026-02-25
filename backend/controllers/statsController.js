import Student from "../models/student.js";
import Room from "../models/room.js";

export const getDashboardStats = async (req, res) => {
    try {
        const [totalStudents, totalHalls, seatedStudents] = await Promise.all([
            Student.countDocuments({}),
            Room.countDocuments({}),
            Student.countDocuments({ allocationStatus: "Allocated" })
        ]);

        const halls = await Room.find({});
        const totalCapacity = halls.reduce((acc, r) => acc + r.capacity, 0);
        const totalFilled = halls.reduce((acc, r) => acc + r.filled, 0);

        const utilization = totalCapacity > 0 ? Math.round((totalFilled / totalCapacity) * 100) : 0;

        const recentExaminees = await Student.find({})
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalStudents,
            totalHalls,
            seated: seatedStudents,
            unassigned: totalStudents - seatedStudents,
            utilization,
            recentExaminees
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
