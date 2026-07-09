const {
  register,
  login,
  verifyAccount,
  resendOtp,
  forgotPassword,
  resetPassword,
  changePassword,
  logout,
} = require("../controller/authController");

const auth = require("../middleware/authMiddleware");

const {
  authLimiter,
  otpLimiter,
} = require("../middleware/rateLimiterMiddleware");

const validate = require("../middleware/validateMiddleware");

const {
  registerSchema,
  loginSchema,
  verifyAccountSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} = require("../validator/authValidator");

const router = require("express").Router();

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/logout", auth, logout);

router.post(
  "/verify-account",
  authLimiter,
  validate(verifyAccountSchema),
  verifyAccount,
);
router.post("/resend-otp", otpLimiter, validate(resendOtpSchema), resendOtp);

router.post(
  "/forgot-password",
  otpLimiter,
  validate(forgotPasswordSchema),
  forgotPassword,
);
router.post(
  "/reset-password",
  authLimiter,
  validate(resetPasswordSchema),
  resetPassword,
);
router.put(
  "/change-password",
  authLimiter,
  auth,
  validate(changePasswordSchema),
  changePassword,
);

module.exports = router;
