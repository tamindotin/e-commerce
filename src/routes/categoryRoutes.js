const router = require("express").Router();
const upload = require("../middleware/multerMiddleware");
const { addCategory, getCategories, updateCategory } = require("../controller/categoryController");

router.post("/", upload.single("image"), addCategory);
router.get("/", getCategories);
router.patch("/:id", upload.single("image"), updateCategory);

module.exports = router;
