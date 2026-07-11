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
  validate(verifyAccountSchema),
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

module.exports = router;
