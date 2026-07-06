const Product = require("../model/productModel");
const Category = require("../model/categoryModel");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../config/cloudinary");
const fs = require("fs/promises");
const cleanupImages = require("../helper/imageCleanup");

const addProduct = asyncHandler(async (req, res) => {
  const {
    name,
    slug,
    description,
    brand,
    category_slug,
    model,
    price,
    stock,
    sku,
  } = req.body;

  if (!req.files || req.files.length === 0) {
    const error = new Error("At least 1 image is required. ");
    error.status = 400;
    throw error;
  }

  if (await Product.findOne({ slug })) {
    const error = new Error("A product with this slug exists. ");
    error.status = 409;
    throw error;
  }

  const category = await Category.findOne({ slug: category_slug });

  if (!category) {
    const error = new Error("There is no category associated with this slug.");
    error.status = 404;
    throw error;
  }

  let specifications = req.body.specifications;
  let tags = req.body.tags;

  try {
    if (typeof specifications === "string") {
      specifications = JSON.parse(specifications);
    }
  } catch {
    const error = new Error("Invalid specifications format.");
    error.status = 400;
    throw error;
  }

  try {
    if (typeof tags === "string") {
      tags = JSON.parse(tags);
    }
  } catch {
    const error = new Error("Invalid tags format.");
    error.status = 400;
    throw error;
  }

  const images = [];
  const uploadedImages = [];

  for (const file of req.files) {
    try {
      const result = await cloudinary.uploader.upload(file.path);

      uploadedImages.push(result.public_id);

      images.push({
        publicId: result.public_id,
        url: result.secure_url,
      });
    } catch (error) {
      await cleanupImages(uploadedImages)

      throw error;
    } finally {
      await fs.unlink(file.path);
    }
  }

  let newProduct

  try {
    newProduct = await Product.create({
      name,
      slug,
      description,
      brand,
      category: category._id,
      model,
      price,
      stock,
      sku,
      images,
      specifications,
      tags,
    });
  } catch (error) {
    await cleanupImages(uploadedImages)
    throw error
  }

  return res.status(201).json({
    success: true,
    message: "New product added. ",
    newProduct,
  });
});

module.exports = { addProduct };
