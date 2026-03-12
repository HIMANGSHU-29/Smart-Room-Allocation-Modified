import fs from 'fs';

const departments = ['BCA', 'BBA', 'BCOM', 'HM', 'BMLT'];
const headers = 'rollNumber,name,email,phone,department,semester,gender\n';

let csvContent = headers;

for (let i = 1; i <= 100; i++) {
    const rollNumber = `2024${String(i).padStart(4, '0')}`;
    const name = `Student ${i}`;
    const email = `student${i}@example.com`;
    const phone = `98765${String(i).padStart(5, '0')}`;
    const department = departments[Math.floor(Math.random() * departments.length)];
    const semester = Math.floor(Math.random() * 8) + 1; // 1 to 8
    const gender = Math.random() > 0.5 ? 'Male' : 'Female';

    csvContent += `${rollNumber},${name},${email},${phone},${department},${semester},${gender}\n`;
}

fs.writeFileSync('d:/Room_Allocation - Copy 1/tmp/dummy_students.csv', csvContent);
console.log('Successfully generated 100 students in d:/Room_Allocation - Copy 1/tmp/dummy_students.csv');
