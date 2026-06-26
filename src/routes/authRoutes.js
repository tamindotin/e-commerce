const { register, login, verifyAccount, resendOtp } = require("../controller/authController")

const router = require("express").Router()

router.post("/register", register)
router.post("/login", login)
router.post("/verify-account", verifyAccount)
router.post("/resend-otp", resendOtp)

module.exports = router
