import axios from 'axios';

async function test() {
    try {
        const payload = {
            examId: "TEST-" + Date.now(),
            subjectName: "Test Subject",
            year: 1,
            semester: 1,
            courses: ["CSE", "IT"],
            date: "2024-12-01",
            startTime: "10:00",
            endTime: "13:00",
            duration: 180
        };

        console.log("Creating exam...");
        // Assuming no strict auth needed for test if token is missing
        const res = await axios.post('http://localhost:5000/api/exams', payload);
        console.log("Exam created successfully with ID", res.data.exam.examId);
        console.log("Linked students:", res.data.exam.linkedStudents.length);

        console.log("Fetching analytics...");
        const analytics = await axios.get('http://localhost:5000/api/exams/analytics');
        console.log("Analytics data:", analytics.data);

    } catch (e) {
        console.error("Error:", e.response ? e.response.data : e.message);
    }
}

test();
