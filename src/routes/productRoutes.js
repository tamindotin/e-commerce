const { addProduct, getProducts, getProduct } = require("../controller/productController");
const upload = require("../middleware/multerMiddleware");

const router = require("express").Router();

router.post("/", upload.array("images", 5), addProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);

module.exports = router;
