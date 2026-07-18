import { Router } from "express";

import auth from "../middleware/authMiddleware.js";
import {
  writeLimiter,
  apiLimiter,
} from "../middleware/rateLimiterMiddleware.js";
import validate from "../middleware/validateMiddleware.js";

import {
  getAllAddresses,
  addAddress,
  setDefaultAddress,
  deleteAddress,
  updateAddress,
} from "../controller/addressController.js";

import {
  addAddressSchema,
  updateAddressSchema,
  addressIdValidator,
} from "../validator/addressValidator.js";

const router = Router();

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

export default router;
