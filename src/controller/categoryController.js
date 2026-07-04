const Category = require("../model/categoryModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const cloudinary = require("../config/cloudinary");
const fs = require("fs/promises");

const addCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const slug = slugify(name, {
    lower: true,
    strict: true,
  });

  if (await Category.findOne({ slug })) {
    const error = new Error("A category with this slug exists. ");
    error.status = 400;
    throw error;
  }

  if (req.file === undefined) {
    const error = new Error("Image is required for creating category. ");
    error.status = 400;
    throw error;
  }

  const image = {};

  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    image.publicId = result.public_id;
    image.url = result.secure_url;
  } finally {
    await fs.unlink(req.file.path);
  }

  const category = await Category.create({ name, slug, image });

  res.status(201).json({
    success: true,
    message: "New category added. ",
    category,
  });
});

module.exports = { addCategory };
