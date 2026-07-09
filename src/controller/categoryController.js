const Category = require("../model/categoryModel");
const Product = require("../model/productModel");
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
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "e-commerce/categories",
    });
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

const getCategories = asyncHandler(async (req, res) => {
  const filters = {};

  if (req.query.name) {
    filters.name = {
      $regex: req.query.name,
      $options: "i",
    };
  }

  if (req.query.slug) {
    filters.slug = req.query.slug;
  }

  if (req.query.isActive !== undefined) {
    filters.isActive = req.query.isActive === "true";
  }

  const allowedSortFields = ["name", "slug", "createdAt", "-createdAt"];
  const sort = allowedSortFields.includes(req.query.sort)
    ? req.query.sort
    : "-createdAt";

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const [totalCategories, categories] = await Promise.all([
    Category.countDocuments(filters),
    Category.find(filters).sort(sort).skip(skip).limit(limit),
  ]);
  const totalPages = Math.ceil(totalCategories / limit);

  res.status(200).json({
    success: true,
    pagination: {
      page,
      limit,
      totalCategories,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
    categories,
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;

  const category = await Category.findById(categoryId);

  if (!category) {
    const error = new Error("Category not found. ");
    error.status = 400;
    throw error;
  }

  if (req.file) {
    try {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "e-commerce/categories",
      });

      if (category.image?.publicId) {
        await cloudinary.uploader.destroy(category.image.publicId);
      }

      category.image.publicId = uploaded.public_id;
      category.image.url = uploaded.secure_url;
    } finally {
      await fs.unlink(req.file.path);
    }
  }

  if (req.body.name !== undefined) {
    const slug = slugify(req.body.name, {
      lower: true,
      strict: true,
    });

    const existingCategory = await Category.findOne({
      slug,
      _id: { $ne: category._id },
    });

    if (existingCategory) {
      const error = new Error("A category with this slug exists. ");
      error.status = 404;
      throw error;
    }

    category.name = req.body.name;
    category.slug = slug;
  }

  if (req.body.isActive !== undefined) {
    const isActive = req.body.isActive === "true";

    category.isActive = isActive;
  }

  await category.save();

  res.status(200).json({
    success: true,
    category,
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;

  const category = await Category.findById(categoryId);

  if (!category) {
    const error = new Error("Category not found. ");
    error.status = 404;
    throw error;
  }

  const productExists = await Product.exists({ category: category._id });

  if (productExists) {
    const error = new Error(
      "Category cannot be deleted because products reference it. ",
    );
    error.status = 409;
    throw error;
  }

  await cloudinary.uploader.destroy(category.image.publicId);

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: "Category deleted successfully. ",
  });
});

module.exports = { addCategory, getCategories, updateCategory, deleteCategory };
