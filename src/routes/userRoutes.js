const {getAllAddresses} = require("../controller/userController");
const auth = require("../middleware/authMiddleware");
const router = require("express").Router();

router.get("/address", auth, getAllAddresses);

module.exports = router
