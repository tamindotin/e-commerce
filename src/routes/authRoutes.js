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

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/verify-account", validate(verifyAccountSchema), verifyAccount);
router.post("/resend-otp", validate(resendOtpSchema), resendOtp);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.put(
  "/change-password",
  auth,
  validate(changePasswordSchema),
  changePassword,
);
router.post("/logout", logout);

module.exports = router;
