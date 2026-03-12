import axios from 'axios';

async function testAllocation() {
    try {
        const response = await axios.post('http://localhost:5000/api/allocation/run', { mixingType: 'random' });
        console.log("Success:", response.data);
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
}

testAllocation();
