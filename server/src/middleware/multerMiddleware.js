import multer from "multer";

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    const error = new Error("Only image files are allowed. ");
    error.status = 400;
    cb(error, false);
  }
};

const upload = multer({
  dest: "/uploads",
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;
