const Product = require("../model/productModel");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../config/cloudinary");
const fs = require("fs/promises");

const addProduct = asyncHandler(async (req, res) => {
  const {
    name,
    slug,
    description,
    brand,
    category,
    model,
    price,
    stock,
    sku
  } = req.body;

  if (req.files.length === 0) {
    const error = new Error("At least 1 image is required. ");
    error.status = 400;
    throw error;
  }

  if (await Product.findOne({ slug })) {
    const error = new Error("A product with this slug exists. ");
    error.status = 409;
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
      await Promise.all(
        uploadedImages.map(async (id) => await cloudinary.uploader.destroy(id)),
      );

      throw error;
    } finally {
      await fs.unlink(file.path);
    }
  }

  let specifications = req.body.specifications;
  let tags = req.body.tags;

  console.log(specifications);
  console.log(typeof specifications);

  if (typeof specifications === "string") {
    specifications = JSON.parse(specifications);
  }

  if (typeof tags === "string") {
    tags = JSON.parse(tags);
  }

  console.log(typeof specifications);

  const newProduct = await Product.create({
    name,
    slug,
    description,
    brand,
    category,
    model,
    price,
    stock,
    sku,
    images,
    specifications,
    tags,
  });

  return res.status(201).json({
    success: true,
    message: "New product added. ",
    newProduct,
  });
});

module.exports = { addProduct };
