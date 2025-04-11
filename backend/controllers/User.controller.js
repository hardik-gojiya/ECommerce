import { User } from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const registerUser = async (req, res) => {
  const { name, email, password, phone, address } = req.body;
  if (!email && !password) {
    return res.status(400).json({ error: "email and password require" });
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
      return res.status(400).json({ error: "Password hashing failed" });
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    });
    await newUser.save();

    if (!newUser) {
      return res.status(400).json({ error: "User not created" });
    }
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log("error while register", error);
    return res
      .status(500)
      .json({ error: "Internal server error while register" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    return res.status(400).json({ error: "email and password are require" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" });
    }
    const token = generateToken(user._id);
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "login successfull",
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
        },
      });
  } catch (error) {
    console.log("error in login", error);
    res.status(500).json({ error: "Internal server error while login" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log(error);
    res.status(200).json({ error: "error Logout" });
  }
};

export { registerUser, login, logout };
