import Product from "../model/productModel.js";
import Category from "../model/categoryModel.js";
import asyncHandler from "express-async-handler";
import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";
import fs from "fs/promises";
import cleanupImages from "../helper/imageCleanup.js";
import getSlug from "../helper/getSlug.js";
import parseToJson from "../helper/parseToJson.js";
import checkDuplicate from "../helper/checkDuplicate.js";

export const addProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    brand,
    category_slug,
    model,
    price,
    stock,
    sku,
    specifications,
    tags,
  } = req.body;

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

export const addImage = asyncHandler(async (req, res) => {
  const MAX_IMAGES = 5;

  const id = req.params.productId;

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

export const getProducts = asyncHandler(async (req, res) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  const skip = (page - 1) * limit;

  const {
    name,
    category,
    brand,
    model,
    minPrice,
    maxPrice,
    tags,
    rating,
    inStock,
    sort,
  } = req.query;
  const filters = {};

  if (name) {
    filters.name = {
      $regex: name,
      $options: "i",
    };
  }

  if (category) {
    const category_slug = slugify(category, {
      lower: true,
      strict: true,
    });

    const categoryObject = await Category.findOne({ slug: category_slug });

    if (!categoryObject) {
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

    filters.category = categoryObject._id;
  }

  if (brand) {
    filters.brand = {
      $regex: brand,
      $options: "i",
    };
  }

  if (model) {
    filters.model = {
      $regex: req.query.model,
      $options: "i",
    };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filters.price = {};

    filters.price.$gte = minPrice;

    filters.price.$lte = maxPrice;
  }

  if (tags) {
    filters.tags = {
      $in: req.query.tags.split(",").map((tag) => tag.trim().toLowerCase()),
    };
  }

  if (rating) {
    const rating = Number(req.query.rating);

    filters["rating.average"] = {
      $gte: rating,
    };
    filters["rating.count"] = {
      $gt: 0,
    };
  }

  if (inStock === true) {
    filters.stock = {
      $gt: 0,
    };
  }

  if (req.query.inStock === false) {
    filters.stock = 0;
  }

  const [totalProducts, products] = await Promise.all([
    Product.countDocuments(filters),
    Product.find(filters).populate("category").sort(sort).skip(skip).limit(limit).lean(),
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

export const getProduct = asyncHandler(async (req, res) => {
  const id = req.params.productId;

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

export const updateProduct = asyncHandler(async (req, res) => {
  const id = req.params.productId;

  const product = await Product.findById(id);

  if (!product) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }

  if (req.body.name) {
    const slug = getSlug(req.body.name);

    await checkDuplicate(Product, "slug", slug, product._id);

    product.name = req.body.name;
    product.slug = slug;
  }

  if (req.body.category_slug) {
    const category = await Category.findOne({ slug: req.body.category_slug });

    if (!category) {
      const error = new Error("Category not found. ");
      error.status = 404;
      throw error;
    }

    product.category = category._id;
  }

  if (req.body.sku) {
    await checkDuplicate(Product, "sku", req.body.sku, product._id);

    product.sku = req.body.sku;
  }

  const otherFields = [
    "description",
    "brand",
    "model",
    "price",
    "compareAtPrice",
    "stock",
    "specifications",
    "tags",
    "isFeatured",
    "isPublished",
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

export const updateImage = asyncHandler(async (req, res) => {
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

export const deleteImage = asyncHandler(async (req, res) => {
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

export const deleteProduct = asyncHandler(async (req, res) => {
  const id = req.params.productId;

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
    message: "Product deleted successfully. ",
  });
});
