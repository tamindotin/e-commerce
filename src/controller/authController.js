const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const generateOtp = require("../utils/otpGenerator");
const sendEmail = require("../helper/sendEmail");
const otpEmailTemplate = require("../utils/otpEmailTemplate");
const resetPasswordOtpTemplate = require("../utils/resetPasswordOtpTemplate");

const otpExpireMin = 5;

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = new Error("Name, Email and Password is required. ");
    error.status = 400;
    throw error;
  }

  if (await User.findOne({ email })) {
    const error = new Error("An account with this email already exists. ");
    error.status = 409;
    throw error;
  }

  const otp = await generateOtp();
  const isMail = await sendEmail(
    email,
    "Account verification OTP",
    otpEmailTemplate(name, otp),
  );

  if (!isMail) {
    const error = new Error("Internal server error. ");
    error.status = 500;
    throw error;
  }

  const otpExpiresAt = Date.now() + otpExpireMin * 60 * 1000;

  await User.create({ name, email, password, otp, otpExpiresAt });

  res.status(201).json({
    success: true,
    message: "Account created. OTP sent for account verification. ",
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

  if (!user.verified) {
    const error = new Error("Account is not verified. ");
    error.status = 403;
    throw error;
  }

  const isMatch = await user.comparePassword(password);

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

const verifyAccount = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email }).select("+otp +otpExpiresAt");

  if (!user) {
    const error = new Error("No account is associated with this email. ");
    error.status = 404;
    throw error;
  }

  if (user.verified) {
    const error = new Error("Account is already verified. ");
    error.status = 409;
    throw error;
  }

  const isValid = await user.compareOtp(otp);

  if (!isValid) {
    const error = new Error("Invalid OTP. ");
    error.status = 400;
    throw error;
  }

  if (user.otpExpiresAt < Date.now()) {
    const error = new Error("OTP is expired. ");
    error.status = 410;
    throw error;
  }

  user.otp = null;
  user.otpExpiresAt = null;
  user.verified = true;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Account verified successfully. ",
  });
});

const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("No account is associated with this email. ");
    error.status = 404;
    throw error;
  }

  const otp = await generateOtp();
  user.otp = otp;

  const isMail = await sendEmail(
    email,
    "Account verification OTP",
    otpEmailTemplate(user.name, otp),
  );

  if (!isMail) {
    const error = new Error("Internal server error. ");
    error.status = 500;
    throw error;
  }

  const otpExpiresAt = Date.now() + otpExpireMin * 60 * 1000;
  user.otpExpiresAt = otpExpiresAt;

  await user.save();

  res.status(200).json({
    success: true,
    message: "OTP sent to your email. ",
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("No account is associated with this email. ");
    error.status = 404;
    throw error;
  }

  const otp = await generateOtp();
  user.otp = otp;

  const isMail = await sendEmail(
    email,
    "Password reset OTP",
    resetPasswordOtpTemplate(user.name, otp),
  );

  if (!isMail) {
    const error = new Error("Internal server error. ");
    error.status = 500;
    throw error;
  }

  const otpExpiresAt = Date.now() + otpExpireMin * 60 * 1000;
  user.otpExpiresAt = otpExpiresAt;

  await user.save();

  res.status(200).json({
    success: true,
    message: "OTP sent to your email. ",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, password } = req.body;

  const user = await User.findOne({ email }).select(
    "+otp +otpExpiresAt +password",
  );

  if (!user) {
    const error = new Error("No account is associated with this email. ");
    error.status = 404;
    throw error;
  }

  if (!user.verified) {
    const error = new Error("Account is not verified. ");
    error.status = 403;
    throw error;
  }

  const isValid = await user.compareOtp(otp);

  if (!isValid) {
    const error = new Error("Invalid OTP. ");
    error.status = 400;
    throw error;
  }

  if (user.otpExpiresAt < Date.now()) {
    const error = new Error("OTP is expired. ");
    error.status = 400;
    throw error;
  }

  if (await user.comparePassword(password)) {
    const error = new Error(
      "Current password and new password cannot be same. ",
    );
    error.status = 400;
    throw error;
  }

  user.password = password;
  user.otp = null;
  user.otpExpiresAt = null;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully. ",
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const id = req.user;

  const { password, newPassword } = req.body;

  const user = await User.findById(id).select("+password");

  if (!(await user.comparePassword(password))) {
    const error = new Error("Invalid password. ");
    error.status = 401;
    throw error;
  }

  user.password = newPassword;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully. ",
  });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logout successfully. ",
  });
});

module.exports = {
  register,
  login,
  verifyAccount,
  resendOtp,
  forgotPassword,
  resetPassword,
  changePassword,
  logout,
};
