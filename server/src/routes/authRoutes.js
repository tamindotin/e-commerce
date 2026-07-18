import { Router } from "express";

import {
  register,
  login,
  verifyAccount,
  resendOtp,
  forgotPassword,
  resetPassword,
  changePassword,
  logout,
  refresh
} from "../controller/authController.js";

import auth from "../middleware/authMiddleware.js";

import {
  authLimiter,
  otpLimiter,
} from "../middleware/rateLimiterMiddleware.js";

import validate from "../middleware/validateMiddleware.js";

import {
  registerSchema,
  loginSchema,
  verifyAccountSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "../validator/authValidator.js";

const router = Router();

router.post(
  "/register",
  authLimiter,
  validate({ body: registerSchema }),
  register,
);

router.post("/login", authLimiter, validate({ body: loginSchema }), login);

router.post("/logout", auth, logout);

router.post(
  "/verify-account",
  authLimiter,
  validate({ body: verifyAccountSchema }),
  verifyAccount,
);

router.post(
  "/resend-otp",
  otpLimiter,
  validate({ body: resendOtpSchema }),
  resendOtp,
);

router.post(
  "/forgot-password",
  otpLimiter,
  validate({ body: forgotPasswordSchema }),
  forgotPassword,
);

router.post(
  "/reset-password",
  authLimiter,
  validate({ body: resetPasswordSchema }),
  resetPassword,
);

router.put(
  "/change-password",
  authLimiter,
  auth,
  validate({ body: changePasswordSchema }),
  changePassword,
);

router.post("/refresh", authLimiter, refresh);

export default router;
