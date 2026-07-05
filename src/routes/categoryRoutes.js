const router = require("express").Router();
const upload = require("../middleware/multerMiddleware");
const { addCategory, getCategories } = require("../controller/categoryController");

router.post("/", upload.single("image"), addCategory);
router.get("/", getCategories);

module.exports = router;
