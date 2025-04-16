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
    const user = await User.findOne({
      $or: [{ email: email }, { phone: phone }],
    });
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

const checkAuth = async (req, res) => {
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

    return res.status(200).json({
      isLoggedIn: true,
      userId: user._id,
      role: user.role,
      email: user.email,
      mobileno: user.mobileno,
      name: user.name || "",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.log("error in AuthMiddleware ", error);
    return res.status(400).json({ message: "Invalid token" });
  }
};

const editUserProfile = async (req, res) => {
  const { name, email, phone, address } = req.body;
  let userid = req.params.id;

  try {
    let user = await User.findById(userid).select("-password");

    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }
    const asmobuser = await User.findOne({
      phone: phone,
    }).select("-password");
    const asemuser = await User.findOne({
      email,
    }).select("-password");
    if (asmobuser && asmobuser._id.toString() != user._id.toString()) {
      return res.status(400).json({ error: " mobile no already exists" });
    }
    if (asemuser && asemuser._id.toString() != user._id.toString()) {
      return res.status(400).json({ error: "email already exists" });
    }
    user.name = name;
    user.email = email;
    user.phone = phone;
    user.address = address;
    await user.save();
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

const addNewAdmin = async (req, res) => {
  const loginuser = req.user;
  const { name, email, phone, password, address } = req.body;

  if (!name || !email || !phone || !password || !address) {
    return res.status(400).json({ error: "all fields are required" });
  }

  if (loginuser.role != "master admin") {
    return res
      .status(400)
      .json({ error: "only master admin can add new admin" });
  }
  try {
    let user = await User.findOne({
      $and: [{ role: "admin" }, { $or: [{ email: email }, { phone: phone }] }],
    }).select("-password");
    console.log(user);
    if (user) {
      return res.status(400).json({
        error: "admin already exists or phone number or email already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let newuser = new User({
      role: "admin",
      name,
      email,
      phone,
      password: hashedPassword,
      address,
    });

    if (!newuser) {
      return res.status(400).json({ error: "admin doesn't created" });
    }
    await newuser.save();
    const sendUser = await User.findOne({ email: newuser.email }).select(
      "-password"
    );
    if (!sendUser) {
      return res.status(404).json({ error: "admin not found after created" });
    }
    return res
      .status(201)
      .json({ error: "admin created successfully", sendUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
};

export {
  registerUser,
  login,
  logout,
  editUserProfile,
  updateProfilePassword,
  addNewAdmin,
  checkAuth,
};
