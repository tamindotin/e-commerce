const router = require("express").Router();

const upload = require("../middleware/multerMiddleware");
const validate = require("../middleware/validateMiddleware");
const {
  apiLimiter,
  writeLimiter,
} = require("../middleware/rateLimiterMiddleware");

const {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controller/categoryController");

const {
  addCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator,
  getCategoriesQueryValidator,
} = require("../validator/categoryValidator");

router.post(
  "/",
  writeLimiter,
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
  upload.single("image"),
  validate({ params: categoryIdValidator, body: updateCategoryValidator }),
  updateCategory,
);

router.delete(
  "/:id",
  writeLimiter,
  validate({ params: categoryIdValidator }),
  deleteCategory,
);

module.exports = router;
