const Product = require("../model/productModel");
const Category = require("../model/categoryModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const cloudinary = require("../config/cloudinary");
const fs = require("fs/promises");
const cleanupImages = require("../helper/imageCleanup");
const getSlug = require("../helper/getSlug");
const parseToJson = require("../helper/parseToJson");
const checkDuplicate = require("../helper/checkDuplicate");

const addProduct = asyncHandler(async (req, res) => {
  const { name, description, brand, category_slug, model, price, stock, sku } =
    req.body;

  if (!req.files || req.files.length === 0) {
    const error = new Error("At least 1 image is required. ");
    error.status = 400;
    throw error;
  }

  const slug = slugify(name, {
    lower: true,
    strict: true,
  });

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

  specifications = parseToJson(specifications);
  tags = parseToJson(tags);

  const images = [];
  const uploadedImages = [];

  for (const file of req.files) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "e-commerce/products",
      });

      uploadedImages.push(result.public_id);

      images.push({
        publicId: result.public_id,
        url: result.secure_url,
      });
    } catch (error) {
      await cleanupImages(uploadedImages);

      throw error;
    } finally {
      await fs.unlink(file.path);
    }
  }

  let newProduct;

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
    await cleanupImages(uploadedImages);
    throw error;
  }

  return res.status(201).json({
    success: true,
    message: "New product added. ",
    newProduct,
  });
});

const addImage = asyncHandler(async (req, res) => {
  const MAX_IMAGES = 5;

  const id = req.params.id;

  if (!req.file) {
    const error = new Error("Image is required. ");
    error.status = 400;
    throw error;
  }

  const product = await Product.findById(id).select("images");

  if (!product) {
    const error = new Error("Product not found. ");
    error.status = 404;
    throw error;
  }

  if (product.images.length >= MAX_IMAGES) {
    const error = new Error("A product cannot have more than 5 images. ");
    error.status = 400;
    throw error;
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "e-commerce/products",
    });

    product.images.push({
      publicId: result.public_id,
      url: result.secure_url,
    });

    await product.save();
  } finally {
    await fs.unlink(req.file.path);
  }

  res.status(200).json({
    success: true,
    message: "New image added. ",
    product,
  });
});

const getProducts = asyncHandler(async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  const page = Math.max(Number(req.query.page) || 1, 1);
  const skip = (page - 1) * limit;

  const filters = {};

  if (req.query.name) {
    filters.name = {
      $regex: req.query.name,
      $options: "i",
    };
  }

  if (req.query.category) {
    const category_slug = slugify(req.query.category, {
      lower: true,
      strict: true,
    });

    const category = await Category.findOne({ slug: category_slug });

    if (!category) {
      return res.status(200).json({
        success: true,
        pagination: {
          page,
          limit,
          totalProducts: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
        products: [],
      });
    }

    filters.category = category._id;
  }

  if (req.query.brand) {
    filters.brand = {
      $regex: req.query.brand,
      $options: "i",
    };
  }

  if (req.query.minPrice || req.query.maxPrice) {
    filters.price = {};

    const minPrice = Number(req.query.minPrice);
    const maxPrice = Number(req.query.maxPrice);

    if (!isNaN(minPrice)) {
      filters.price.$gte = minPrice;
    }

    if (!isNaN(maxPrice)) {
      filters.price.$lte = maxPrice;
    }
  }

  if (req.query.tags) {
    filters.tags = {
      $all: req.query.tags.split(",").map((tag) => tag.trim().toLowerCase()),
    };
  }

  if (req.query.rating) {
    const rating = Number(req.query.rating);

    if (!isNaN(rating) && rating >= 0 && rating <= 5) {
      filters["rating.average"] = {
        $gte: rating,
      };
      filters["rating.count"] = {
        $gt: 0,
      };
    }
  }

  if (req.query.inStock === "true") {
    filters.stock = {
      $gt: 0,
    };
  }

  if (req.query.inStock === "false") {
    filters.stock = 0;
  }

  const sortOptions = {
    newest: "-createdAt",
    oldest: "createdAt",
    priceAsc: "price",
    priceDesc: "-price",
    nameAsc: "name",
    nameDesc: "-name",
  };

  const sort = sortOptions[req.query.sort] || "-createdAt";

  const [totalProducts, products] = await Promise.all([
    Product.countDocuments(filters),
    Product.find(filters).sort(sort).skip(skip).limit(limit).lean(),
  ]);
  const totalPages = Math.ceil(totalProducts / limit);

  res.status(200).json({
    success: true,
    pagination: {
      page,
      limit,
      totalProducts,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
    products,
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const product = await Product.findById(id).populate("category");

  if (!product) {
    const error = new Error("Product not found. ");
    error.status = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    product,
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const product = await Product.findById(id);

  if (!product) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }

  if (req.body.name !== undefined) {
    const slug = getSlug(req.body.name);

    await checkDuplicate(Product, "slug", slug, product._id);

    product.name = req.body.name;
    product.slug = slug;
  }

  if (req.body.category_slug !== undefined) {
    const category = await Category.findOne({ slug: req.body.category_slug });

    if (!category) {
      const error = new Error("Category not found. ");
      error.status = 404;
      throw error;
    }

    product.category = category._id;
  }

  if (req.body.sku !== undefined) {
    await checkDuplicate(Product, "sku", req.body.sku, product._id);

    product.sku = req.body.sku;
  }

  if (req.body.specifications !== undefined) {
    let specifications = req.body.specifications;

    specifications = parseToJson(specifications);

    product.specifications = specifications;
  }

  if (req.body.tags !== undefined) {
    let tags = req.body.tags;

    tags = parseToJson(tags);

    product.tags = tags;
  }

  if (req.body.isFeatured !== undefined) {
    product.isFeatured = req.body.isFeatured;
  }

  if (req.body.isPublished !== undefined) {
    product.isPublished = req.body.isPublished;
  }

  const otherFields = [
    "description",
    "brand",
    "model",
    "price",
    "compareAtPrice",
    "stock",
  ];

  otherFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product details updated. ",
    product,
  });
});

const updateImage = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const imageId = req.params.imageId;

  if (!req.file) {
    const error = new Error("Image is required. ");
    error.status = 400;
    throw error;
  }

  const product = await Product.findById(productId).select("images");

  if (!product) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }

  const image = product.images.id(imageId);

  if (!image) {
    const error = new Error("Image not found");
    error.status = 404;
    throw error;
  }

  try {
    const oldImageId = image.publicId;
    const uploaded = await cloudinary.uploader.upload(req.file.path, {
      folder: "e-commerce/products",
    });

    image.publicId = uploaded.public_id;
    image.url = uploaded.secure_url;

    await product.save();

    try {
      if (oldImageId) {
        await cloudinary.uploader.destroy(oldImageId);
      }
    } catch (error) {
      console.error("Image deletion failed: ", error);
    }
  } finally {
    await fs.unlink(req.file.path);
  }

  res.status(200).json({
    success: true,
    message: "Product image updated. ",
    product,
  });
});

const deleteImage = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const imageId = req.params.imageId;

  const product = await Product.findById(productId).select("images");

  if (!product) {
    const error = new Error("Product not found.");
    error.status = 404;
    throw error;
  }

  if (product.images.length === 1) {
    const error = new Error("At least 1 image is required for a product. ");
    error.status = 400;
    throw error;
  }

  const image = product.images.id(imageId);

  if (!image) {
    const error = new Error("Image not found.");
    error.status = 404;
    throw error;
  }

  await image.deleteOne();

  await product.save();

  const result = await cloudinary.uploader.destroy(image.publicId);

  if (!["ok", "not found"].includes(result.result)) {
    const error = new Error("Failed to delete image.");
    error.status = 500;
    throw error;
  }

  res.status(200).json({
    success: true,
    message: "Image deleted successfully. ",
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const product = await Product.findById(id).select("images");

  if (!product) {
    const error = new Error("Product not found. ");
    error.status = 404;
    throw error;
  }

  await Promise.all(
    product.images.map((image) => cloudinary.uploader.destroy(image.publicId)),
  );

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully. "
  });
});

module.exports = {
  addProduct,
  addImage,
  getProducts,
  getProduct,
  updateProduct,
  updateImage,
  deleteImage,
  deleteProduct,
};
