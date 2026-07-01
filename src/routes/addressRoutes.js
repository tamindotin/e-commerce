const {
  getAllAddresses,
  addAddress,
  setDefaultAddress,
  deleteAddress,
  updateAddress,
} = require("../controller/addressController");

const auth = require("../middleware/authMiddleware");

const { addressLimiter } = require("../middleware/rateLimiterMiddleware");

const validate = require("../middleware/validateMiddleware");

const {
  addAddressSchema,
  updateAddressSchema,
} = require("../validator/addressValidator");

const router = require("express").Router();

router.get(
  "/",
  addressLimiter,
  auth,
  getAllAddresses);

router.post(
  "/",
  addressLimiter,
  auth,
  validate(addAddressSchema),
  addAddress,
);

router.patch(
  "/:id/default",
  addressLimiter,
  auth,
  setDefaultAddress);

router.delete(
  "/:id",
  addressLimiter,
  auth,
  deleteAddress);

router.put(
  "/:id",
  addressLimiter,
  auth,
  validate(updateAddressSchema),
  updateAddress,
);

module.exports = router;
