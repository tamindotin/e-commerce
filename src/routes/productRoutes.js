const router = require("express").Router();

const upload = require("../middleware/multerMiddleware");
const validator = require("../middleware/validateMiddleware");
const {
  apiLimiter,
  writeLimiter,
} = require("../middleware/rateLimiterMiddleware");
const parseProductFields = require("../middleware/parseJsonFields");
const auth = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");

const {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  updateImage,
  deleteImage,
  addImage,
  deleteProduct,
} = require("../controller/productController");

const {
  addProductValidator,
  updateProductValidator,
  getProductsQueryValidator,
  productIdValidator,
  imageIdValidator,
  productImageIdValidator,
} = require("../validator/productValidator");

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

module.exports = router;
