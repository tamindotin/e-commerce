const {
  getAllAddresses,
  addAddress,
  setDefaultAddress,
  deleteAddress,
  updateAddress,
} = require("../controller/userController");
const auth = require("../middleware/authMiddleware");
const { addressLimiter } = require("../middleware/rateLimiterMiddleware");
const validate = require("../middleware/validateMiddleware");
const {
  addAddressSchema,
  updateAddressSchema,
} = require("../validator/userValidator");
const router = require("express").Router();

router.get("/address", addressLimiter, auth, getAllAddresses);
router.post(
  "/address",
  addressLimiter,
  auth,
  validate(addAddressSchema),
  addAddress,
);
router.patch("/address/:id/default", addressLimiter, auth, setDefaultAddress);
router.delete("/address/:id", addressLimiter, auth, deleteAddress);
router.put(
  "/address/:id",
  addressLimiter,
  auth,
  validate(updateAddressSchema),
  updateAddress,
);

module.exports = router;
