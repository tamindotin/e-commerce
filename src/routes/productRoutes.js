const {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  updateImage,
  deleteImage,
} = require("../controller/productController");
const upload = require("../middleware/multerMiddleware");

const router = require("express").Router();

router.post("/", upload.array("images", 5), addProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.patch("/:id", updateProduct);
router.patch("/:productId/image/:imageId", upload.single("image"), updateImage);
router.delete("/:productId/image/:imageId", deleteImage);

module.exports = router;
