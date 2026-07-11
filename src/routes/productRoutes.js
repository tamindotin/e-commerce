const router = require("express").Router();

const upload = require("../middleware/multerMiddleware");
const validator = require("../middleware/validateMiddleware");
const {
  apiLimiter,
  writeLimiter,
} = require("../middleware/rateLimiterMiddleware");
const parseProductFields = require("../middleware/parseJsonFields")

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
  upload.array("images", 5),
  parseProductFields(["specifications", "tags"]),
  validator({ body: addProductValidator }),
  addProduct,
);
router.post(
  "/:productId",
  writeLimiter,
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
  parseProductFields(["specifications", "tags"]),
  validator({ params: productIdValidator, body: updateProductValidator }),
  updateProduct,
);
router.patch(
  "/:productId/image/:imageId",
  writeLimiter,
  upload.single("image"),
  validator({ params: productImageIdValidator }),
  updateImage,
);
router.delete(
  "/:productId/image/:imageId",
  writeLimiter,
  validator({ params: productImageIdValidator }),
  deleteImage,
);
router.delete(
  "/:productId",
  writeLimiter,
  validator({ params: productIdValidator }),
  deleteProduct,
);

module.exports = router;
