const {
  getAllAddresses,
  addAddress,
  setDefaultAddress,
  deleteAddress,
  updateAddress,
} = require("../controller/userController");
const auth = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const {
  addAddressSchema,
  updateAddressSchema,
} = require("../validator/userValidator");
const router = require("express").Router();

router.get("/address", auth, getAllAddresses);
router.post("/address", auth, validate(addAddressSchema), addAddress);
router.patch("/address/:id/default", auth, setDefaultAddress);
router.delete("/address/:id", auth, deleteAddress);
router.put("/address/:id", auth, validate(updateAddressSchema), updateAddress);

module.exports = router;
