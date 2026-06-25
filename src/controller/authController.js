const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = new Error("Name, Email and Password is required. ");
    error.status = 400;
    throw error;
  }

  if (await User.findOne({ email })) {
    const error = new Error("An account with this email already exists. ");
    error.status = 400;
    throw error;
  }

  await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    message: "Account created. You can login with this credentials. ",
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("Email and Password required. ");
    error.status = 400;
    throw error;
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    const error = new Error("Invalid credentials. ");
    error.status = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password)

  if (!isMatch) {
    const error = new Error("Invalid credentials. ");
    error.status = 401;
    throw error;
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const cookieAge = 7 * 24 * 60 * 60 * 1000;

  res.cookie("token", token, {
    maxAge: cookieAge,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  });

  res.status(200).json({
    success: true,
    message: "Login successful. ",
  });
});

module.exports = { register, login };
