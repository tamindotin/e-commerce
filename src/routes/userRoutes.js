const {
  getAllAddresses,
  addAddress,
  setDefaultAddress,
  deleteAddress,
} = require("../controller/userController");
const auth = require("../middleware/authMiddleware");
const {
  addAddressSchema,
} = require("../validator/userValidator");
const router = require("express").Router();

router.get("/address", auth, getAllAddresses);
router.post("/address", auth,addAddressSchema, addAddress);
router.patch("/address/:id/default", auth, setDefaultAddress);
router.delete("/address/:id", auth, deleteAddress);

module.exports = router;
