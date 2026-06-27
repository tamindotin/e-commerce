const {
  register,
  login,
  verifyAccount,
  resendOtp,
  forgotPassword,
} = require("../controller/authController");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-account", verifyAccount);
router.post("/resend-otp", resendOtp);
router.post("/forgot-password", forgotPassword);

module.exports = router;
