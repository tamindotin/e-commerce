const { addProduct, getProducts } = require("../controller/productController");
const upload = require("../middleware/multerMiddleware");

const router = require("express").Router();

router.post("/", upload.array("images", 5), addProduct);
router.get("/", getProducts);

module.exports = router;
