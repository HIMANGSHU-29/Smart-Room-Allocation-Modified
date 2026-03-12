import fs from 'fs';

const departments = ['BCA', 'BBA', 'BCOM', 'HM', 'BMLT'];
const headers = 'rollNumber,name,email,phone,department,semester,gender\n';

const firstNamesMale = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan", "Shaurya", "Atharv", "Ansh", "Aarush", "Devansh", "Kabir", "Aryan", "Dhruv", "Rudra", "Ojas", "Rishi", "Kartik", "Shivansh", "Ayush", "Samar", "Pranav", "Rohan", "Rahul", "Nikhil", "Amit"];
const firstNamesFemale = ["Saanvi", "Aanya", "Aadhya", "Aaradhya", "Ananya", "Pari", "Diya", "Navya", "Manya", "Aliya", "Avni", "Sara", "Kavya", "Riya", "Aashvi", "Ishita", "Anjali", "Neha", "Pooja", "Maya", "Kirti", "Sneha", "Nisha", "Swati", "Nandini", "Shruti", "Megha", "Jyoti", "Tanvi", "Aditi"];
const lastNames = ["Sharma", "Verma", "Gupta", "Malhotra", "Singh", "Patel", "Kumar", "Das", "Bose", "Roy", "Jain", "Mehta", "Chopra", "Chauhan", "Yadav", "Rajput", "Iyer", "Nair", "Reddy", "Menon"];

let csvContent = headers;

for (let i = 1; i <= 100; i++) {
    const rollNumber = `2024${String(i).padStart(4, '0')}`;
    const isMale = Math.random() > 0.5;
    const gender = isMale ? 'Male' : 'Female';
    const firstNames = isMale ? firstNamesMale : firstNamesFemale;

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;

    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
    const phone = `98765${String(i).padStart(5, '0')}`;
    const department = departments[Math.floor(Math.random() * departments.length)];
    const semester = Math.floor(Math.random() * 8) + 1;

    csvContent += `${rollNumber},${name},${email},${phone},${department},${semester},${gender}\n`;
}

fs.writeFileSync('d:/Room_Allocation - Copy 1/tmp/dummy_students_unique.csv', csvContent);
console.log('done');
