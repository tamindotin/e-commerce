const router = require("express").Router();

const auth = require("../middleware/authMiddleware");
const {
  writeLimiter,
  apiLimiter,
} = require("../middleware/rateLimiterMiddleware");
const validate = require("../middleware/validateMiddleware");

const {
  getAllAddresses,
  addAddress,
  setDefaultAddress,
  deleteAddress,
  updateAddress,
} = require("../controller/addressController");

const {
  addAddressSchema,
  updateAddressSchema,
  addressIdValidator,
} = require("../validator/addressValidator");

router.get("/", apiLimiter, auth, getAllAddresses);

router.post(
  "/",
  writeLimiter,
  auth,
  validate({ body: addAddressSchema }),
  addAddress,
);

router.patch(
  "/:id/default",
  writeLimiter,
  auth,
  validate({ params: addressIdValidator }),
  setDefaultAddress,
);

router.delete(
  "/:id",
  writeLimiter,
  auth,
  validate({ params: addressIdValidator }),
  deleteAddress,
);

router.put(
  "/:id",
  writeLimiter,
  auth,
  validate({ body: updateAddressSchema, params: addressIdValidator }),
  updateAddress,
);

module.exports = router;
