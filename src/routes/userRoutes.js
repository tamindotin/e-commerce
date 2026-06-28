const { getAllAddresses, addAddress, setDefaultAddress } = require("../controller/userController");
const auth = require("../middleware/authMiddleware");
const router = require("express").Router();

router.get("/address", auth, getAllAddresses);
router.post("/address", auth, addAddress);
router.patch("/address/:id/default", auth, setDefaultAddress);

module.exports = router;
