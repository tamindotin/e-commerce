const router = require("express").Router();
const upload = require("../middleware/multerMiddleware");
const { addCategory } = require("../controller/categoryController");

router.post("/", upload.single("image"), addCategory);

module.exports = router;
