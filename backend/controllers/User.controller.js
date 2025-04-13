import { User } from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { nodeMailerFunc } from "../utils/mailer.util.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const generateOtp = () => {
  return Math.floor(10000 + Math.random() * 90000);
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

const editUserProfile = async (req, res) => {
  const { name, email, password, phone, address } = req.body;
  let userid = req.params.id;

  try {
    let user = await User.findByIdAndUpdate(userid, {
      name,
      email,
      password,
      phone,
      address,
    });
    if (!user) {
      return res.status(400).json({ error: "error while updating profile" });
    }
    return res.status(201).json({ message: "user updated sucessfully", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

const updateProfilePassword = async (req, res) => {
  const userid = req.params.id;
  const { oldpassword, newpassword } = req.body;

  if (userid.toString() != req.user._id.toString()) {
    return res.status(400).json({ error: "you only change your password" });
  }

  try {
    let user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    const isPasswordValid = await bcrypt.compare(oldpassword, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ error: "password doesn't match to your old password" });
    }
    const hashedPassword = await bcrypt.hash(newpassword, 10);
    user.password = hashedPassword;
    user.save();
    return res.status(200).json({ message: "passsword updated succesfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
};

export { registerUser, login, logout, editUserProfile, updateProfilePassword };
