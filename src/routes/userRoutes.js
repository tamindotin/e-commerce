const { getAllAddresses, addAddress } = require("../controller/userController");
const auth = require("../middleware/authMiddleware");
const router = require("express").Router();

router.get("/address", auth, getAllAddresses);
router.post("/address", auth, addAddress);

module.exports = router;
