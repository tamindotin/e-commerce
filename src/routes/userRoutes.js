const { getAllAddresses, addAddress, setDefaultAddress, deleteAddress } = require("../controller/userController");
const auth = require("../middleware/authMiddleware");
const router = require("express").Router();

router.get("/address", auth, getAllAddresses);
router.post("/address", auth, addAddress);
router.patch("/address/:id/default", auth, setDefaultAddress);
router.delete("/address/:id", auth, deleteAddress);

module.exports = router;
