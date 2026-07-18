import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import redis from "../config/redis.js";
import User from "../model/userModel.js";
import generateOtp from "../utils/otpGenerator.js";
import sendEmail from "../helper/sendEmail.js";
import otpEmailTemplate from "../utils/otpEmailTemplate.js";
import resetPasswordOtpTemplate from "../utils/resetPasswordOtpTemplate.js";
import {
  getAccessToken,
  getRefreshToken,
} from "../helper/generateJwtTokens.js";
import getKey from "../helper/getRedisKey.js";

const otpExpireMin = 5;

export const register = asyncHandler(async (req, res) => {
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

export const login = asyncHandler(async (req, res) => {
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

  const refreshToken = getRefreshToken(user);
  const accessToken = getAccessToken(user);

  const ACCESS_TOKEN_AGE = 10 * 60 * 1000; // ms
  const REFRESH_TOKEN_AGE = 15 * 24 * 60 * 60 * 1000; // ms

  const REFRESH_TOKEN_TTL = 15 * 24 * 60 * 60; // seconds

  await redis.set(
    getKey("refreshToken", user._id),
    refreshToken,
    "EX",
    REFRESH_TOKEN_TTL,
  );

  res.cookie("accessToken", accessToken, {
    maxAge: ACCESS_TOKEN_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  });

  res.cookie("refreshToken", refreshToken, {
    maxAge: REFRESH_TOKEN_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  });

  res.status(200).json({
    success: true,
    message: "Login successful. ",
  });
});

export const verifyAccount = asyncHandler(async (req, res) => {
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

export const resendOtp = asyncHandler(async (req, res) => {
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

export const forgotPassword = asyncHandler(async (req, res) => {
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

export const resetPassword = asyncHandler(async (req, res) => {
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

export const changePassword = asyncHandler(async (req, res) => {
  const id = req.user.id;

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

export const logout = asyncHandler(async (req, res) => {
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

export const refresh = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    const error = new Error("Unauthenticated user. ");
    error.status = 401;
    throw error;
  }

  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  const existing = await redis.get(getKey("refreshToken", decoded.id));

  if (existing !== token) {
    const error = new Error("Unauthenticated user. ");
    error.status = 401;
    throw error;
  }

  const user = await User.findById(decoded.id).select("_id role");

  if (!user) {
    const error = new error("User not found")
    error.status = 404
    throw error
  }

  const refreshToken = getRefreshToken(user);
  const accessToken = getAccessToken(user);

  const ACCESS_TOKEN_AGE = 10 * 60 * 1000; // ms
  const REFRESH_TOKEN_AGE = 15 * 24 * 60 * 60 * 1000; // ms

  const REFRESH_TOKEN_TTL = 15 * 24 * 60 * 60; // seconds

  await redis.set(
    getKey("refreshToken", user._id),
    refreshToken,
    "EX",
    REFRESH_TOKEN_TTL,
  );

  res.cookie("accessToken", accessToken, {
    maxAge: ACCESS_TOKEN_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  });

  res.cookie("refreshToken", refreshToken, {
    maxAge: REFRESH_TOKEN_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  });

  return res.status(200).json({
    success: true
  });
};
