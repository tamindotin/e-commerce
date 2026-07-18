import { Router } from "express";

import upload from "../middleware/multerMiddleware.js";
import validate from "../middleware/validateMiddleware.js";
import {
  apiLimiter,
  writeLimiter,
} from "../middleware/rateLimiterMiddleware.js";
import auth from "../middleware/authMiddleware.js";
import authorize from "../middleware/authorizeMiddleware.js";

import {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controller/categoryController.js";

import {
  addCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator,
  getCategoriesQueryValidator,
} from "../validator/categoryValidator.js";

const router = Router();

router.post(
  "/",
  writeLimiter,
  auth,
  authorize("admin"),
  upload.single("image"),
  validate({ body: addCategoryValidator }),
  addCategory,
);

router.get(
  "/",
  apiLimiter,
  validate({ query: getCategoriesQueryValidator }),
  getCategories,
);

router.patch(
  "/:id",
  writeLimiter,
  auth,
  authorize("admin"),
  upload.single("image"),
  validate({ params: categoryIdValidator, body: updateCategoryValidator }),
  updateCategory,
);

router.delete(
  "/:id",
  writeLimiter,
  auth,
  authorize("admin"),
  validate({ params: categoryIdValidator }),
  deleteCategory,
);

export default router;
