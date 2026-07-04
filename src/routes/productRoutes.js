const { addProduct } = require("../controller/productController")
const upload = require("../middleware/multerMiddleware")

const router = require("express").Router()

router.post("/", upload.array("images", 5), addProduct)

module.exports = router
