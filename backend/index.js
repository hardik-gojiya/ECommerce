import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3001;

var corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3001"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(
  express.json({
    strict: false,
  })
);
app.use(cookieParser());
connectDB();

import userRoutes from "./routes/user.route.js";
app.use("/api/user", userRoutes);

import productRoutes from "./routes/product.route.js";
app.use("/api/products", productRoutes);

import categoryRoutes from "./routes/category.route.js";
app.use("/api/category", categoryRoutes);

import cartRoutes from "./routes/cart.route.js";
app.use("/api/cart", cartRoutes);

import orderRoute from "./routes/order.route.js";
app.use("/api/order", orderRoute);

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON input" });
  }
  return res.status(500).json({ message: "Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
