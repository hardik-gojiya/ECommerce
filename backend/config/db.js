import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    if (connection) {
      console.log(`MongoDB connected: ${connection.connection.host}`);
    }
  } catch (error) {
    console.error("MongoDB connection failed :", err.message);
    process.exit(1);
  }
};
