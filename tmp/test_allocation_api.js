const runAllocationTest = async () => {
    const BASE_URL = "http://localhost:5000/api";
    const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer bypass_token"
    };

    try {
        // We already have an Exam scheduled from the previous test: CS101-Midterm
        console.log("Fetching Exams and Rooms...");

        // Actually we don't have a GET /api/exams yet, but we know the exam created earlier
        // Let's just create 3 dummy students directly via the /api/students endpoint 
        // to test the allocation.

        const students = [
            { rollNumber: "CSE001", name: "Alice", department: "CSE", semester: 1, email: "alice@test.com", phone: "1111111111", gender: "Female" },
            { rollNumber: "ECE001", name: "Bob", department: "ECE", semester: 1, email: "bob@test.com", phone: "2222222222", gender: "Male" },
            { rollNumber: "CSE002", name: "Charlie", department: "CSE", semester: 1, email: "charlie@test.com", phone: "3333333333", gender: "Male" }
        ];

        const studentIds = [];
        for (const student of students) {
            console.log("Creating student", student.name);
            const res = await fetch(`${BASE_URL}/students`, {
                method: "POST",
                headers,
                body: JSON.stringify(student)
            });
            const data = await res.json();
            if (data.student && data.student._id) {
                studentIds.push(data.student._id);
            } else if (data.message && data.message.includes("duplicate")) {
                // Maybe already created, fetch roll number
                const fetchRes = await fetch(`${BASE_URL}/students/${student.rollNumber}`, { headers });
                const existing = await fetchRes.json();
                if (existing._id) studentIds.push(existing._id);
            }
        }

        console.log("Target Student IDs:", studentIds);

        // We need the examId we created in the last script. Since I don't have a GET exams route, I'll connect to DB directly here to get it.
        import mongoose from "mongoose";
        await mongoose.connect("mongodb://127.0.0.1:27017/roomAllocation");

        const exam = await mongoose.connection.collection('exams').findOne({ courseCode: "CS101" });
        if (!exam) {
            console.log("Could not find exam.");
            process.exit(1);
        }

        console.log("Found Exam:", exam.examId);

        // Call Allocation Endpoint
        console.log("\nCalling Seat Allocation...");
        const allocRes = await fetch(`${BASE_URL}/exam-allocation/allocate`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                examId: exam._id,
                targetStudentIds: studentIds
            })
        });

        const allocData = await allocRes.json();
        console.log("Allocation Result:", allocData);

        // Fetch Seat Allocations to verify the pattern
        const allocations = await mongoose.connection.collection('seatallocations').find({ examId: exam._id }).toArray();
        console.log("\nGenerated Seat Matrices:");
        for (let a of allocations) {
            console.log(`Student: ${a.studentId} -> Seat: ${a.seatNumber}`);
        }

        process.exit(0);
    } catch (err) {
        console.error("Allocation Test failed", err);
        process.exit(1);
    }
};

runAllocationTest();
