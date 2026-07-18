import { Router } from "express";

import upload from "../middleware/multerMiddleware.js";
import validator from "../middleware/validateMiddleware.js";
import {
  apiLimiter,
  writeLimiter,
} from "../middleware/rateLimiterMiddleware.js";
import parseProductFields from "../middleware/parseJsonFields.js";
import auth from "../middleware/authMiddleware.js";
import authorize from "../middleware/authorizeMiddleware.js";

import {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  updateImage,
  deleteImage,
  addImage,
  deleteProduct,
} from "../controller/productController.js";

import {
  addProductValidator,
  updateProductValidator,
  getProductsQueryValidator,
  productIdValidator,
  imageIdValidator,
  productImageIdValidator,
} from "../validator/productValidator.js";

const router = Router();

router.post(
  "/",
  writeLimiter,
  auth,
  authorize("admin"),
  upload.array("images", 5),
  parseProductFields(["specifications", "tags"]),
  validator({ body: addProductValidator }),
  addProduct,
);

router.post(
  "/:productId",
  writeLimiter,
  auth,
  authorize("admin"),
  upload.single("image"),
  validator({ params: productIdValidator }),
  addImage,
);

router.get(
  "/",
  apiLimiter,
  validator({ query: getProductsQueryValidator }),
  getProducts,
);

router.get(
  "/:productId",
  apiLimiter,
  validator({ params: productIdValidator }),
  getProduct,
);

router.patch(
  "/:productId",
  writeLimiter,
  auth,
  authorize("admin"),
  parseProductFields(["specifications", "tags"]),
  validator({ params: productIdValidator, body: updateProductValidator }),
  updateProduct,
);

router.patch(
  "/:productId/image/:imageId",
  writeLimiter,
  auth,
  authorize("admin"),
  upload.single("image"),
  validator({ params: productImageIdValidator }),
  updateImage,
);

router.delete(
  "/:productId/image/:imageId",
  writeLimiter,
  auth,
  authorize("admin"),
  validator({ params: productImageIdValidator }),
  deleteImage,
);

router.delete(
  "/:productId",
  writeLimiter,
  auth,
  authorize("admin"),
  validator({ params: productIdValidator }),
  deleteProduct,
);

export default router;
