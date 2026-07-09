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
const upload = require("../middleware/multerMiddleware");

const router = require("express").Router();

router.post("/", upload.array("images", 5), addProduct);
router.post("/:id", upload.single("image"), addImage);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.patch("/:id", updateProduct);
router.patch("/:productId/image/:imageId", upload.single("image"), updateImage);
router.delete("/:productId/image/:imageId", deleteImage);
router.delete("/:id", deleteProduct);

module.exports = router;
