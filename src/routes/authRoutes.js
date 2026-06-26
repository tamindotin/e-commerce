const { register, login, verifyAccount } = require("../controller/authController")

const router = require("express").Router()

router.post("/register", register)
router.post("/login", login)
router.post("/verify-account", verifyAccount)

module.exports = router
