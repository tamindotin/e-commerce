const { getProfile } = require("../controller/userController");
const auth = require("../middleware/authMiddleware");
const { apiLimiter } = require("../middleware/rateLimiterMiddleware");

const router = require("express").Router();

router.get("/", apiLimiter, auth, getProfile);

module.exports = router;
