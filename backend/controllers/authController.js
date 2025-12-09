import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || "7d" }
  );
};

export const signup = async (req, res, next) => {
  try {
    const { username, email, password, name, profilePic } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email: email.toLowerCase() }],
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "Username or email already in use" });
    }

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password,
      name: name || "",
      profilePic: profilePic || "",
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          name: user.name,
          profilePic: user.profilePic,
        },
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body; // identifier can be username or email

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier.toLowerCase() }],
    });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          name: user.name,
          profilePic: user.profilePic,
        },
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};
