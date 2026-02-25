import mongoose from "mongoose";
import dotenv from "dotenv";
import Student from "./models/student.js";

dotenv.config();

const fixIndexes = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected.");

        const collection = mongoose.connection.collection("students");

        console.log("Checking existing indexes...");
        const indexes = await collection.indexes();
        console.log("Current indexes:", JSON.stringify(indexes, null, 2));

        // 1. Drop the incorrect index 'roll_1' if it exists
        const hasRoll1 = indexes.some(idx => idx.name === "roll_1");
        if (hasRoll1) {
            console.log("Dropping incorrect index 'roll_1'...");
            await collection.dropIndex("roll_1");
            console.log("Index 'roll_1' dropped successfully.");
        } else {
            console.log("Index 'roll_1' not found, skipping drop.");
        }

        // 2. Ensure the correct unique index on 'rollNumber'
        console.log("Creating unique index on 'rollNumber'...");
        await collection.createIndex({ rollNumber: 1 }, { unique: true });
        console.log("Unique index on 'rollNumber' created successfully.");

        // 3. Optional: drop any other null-related unique indexes if they exist
        // sometimes it's rollNumber_1 but based on roll: null

        console.log("Index fix completed successfully.");
        process.exit(0);
    } catch (err) {
        console.error("ERROR fixing indexes:", err);
        process.exit(1);
    }
};

fixIndexes();
