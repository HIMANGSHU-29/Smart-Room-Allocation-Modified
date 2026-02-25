import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (err) {
    console.error("Mongo Error:", err.message);

    // DON'T kill server in dev
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
