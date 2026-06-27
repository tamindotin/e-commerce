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

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-account", verifyAccount);
router.post("/resend-otp", resendOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/change-password", auth, changePassword);
router.post("/logout", logout);

module.exports = router;
