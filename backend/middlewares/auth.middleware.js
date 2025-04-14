import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";
import dotenv from "dotenv";
dotenv.config();

export const AuthMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "You are already logout" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decodedToken.id }).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("error in AuthMiddleware ", error);
    return res.status(400).json({ message: "Invalid token" });
  }
};
