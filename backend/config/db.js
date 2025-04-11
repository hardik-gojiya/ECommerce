import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    const connection = await mongoose.connect("mongodb://localhost:27017/Ecommerce");
    if (connection) {
      console.log(`MongoDB connected: ${connection.connection.host}`);
    }
  } catch (error) {
    console.error("MongoDB connection failed :", err.message);
    process.exit(1);
  }
};
