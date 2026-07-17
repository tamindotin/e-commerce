const joi = require("joi");
const {objectId} = require("../helper/objectIdValidator");

const name = joi.string().min(3).max(100).trim();
const slug = joi
  .string()
  .min(3)
  .max(30)
  .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const description = joi.string().min(10).max(500).trim();
const brand = joi.string().min(3).max(50).trim();
const model = joi.string().min(3).max(30).trim();
const price = joi.number().greater(0);
const compareAtPrice = joi.number().greater(joi.ref("price"));
const stock = joi.number().integer().min(0);
const sku = joi.string().pattern(/^[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+$/);
const specifications = joi
  .object()
  .pattern(joi.string().min(1).trim(), joi.string().min(1).trim())
  .max(30)
  .default({});
const tags = joi
  .array()
  .items(joi.string().trim().min(1).lowercase())
  .unique()
  .default([]);
const isFeatured = joi.boolean();
const isPublished = joi.boolean();
const page = joi.number().integer().min(1).default(1);
const limit = joi.number().integer().min(1).max(100).default(10);
const minPrice = joi.number().min(0);
const maxPrice = joi.number().greater(joi.ref("minPrice"));
const rating = joi.number().min(0).max(5);
const inStock = joi.boolean().default(true);
const queryTags = joi.string();
const sort = joi
  .valid("-createdAt", "createdAt", "price", "-price", "name", "-name")
  .default("-createdAt");

const addProductValidator = joi.object({
  name: name.required(),
  category_slug: slug.required(),
  description: description.required(),
  brand: brand.required(),
  model: model.required(),
  price: price.required(),
  compareAtPrice,
  stock: stock.required(),
  sku: sku.required(),
  specifications,
  tags,
  isFeatured,
  isPublished,
});

const updateProductValidator = joi.object({
  name,
  category_slug: slug,
  sku,
  specifications,
  tags,
  isFeatured,
  isPublished,
  description,
  brand,
  model,
  price,
  compareAtPrice,
  stock,
});

const getProductsQueryValidator = joi.object({
  name,
  category: model,
  brand,
  minPrice,
  maxPrice,
  tags: queryTags,
  rating,
  sort,
  limit,
  page,
  inStock,
});

const productIdValidator = joi.object({
  productId: objectId.required(),
});

const imageIdValidator = joi.object({
  imageId: objectId.required(),
});

const productImageIdValidator = joi.object({
  productId: objectId.required(),
  imageId: objectId.required(),
});

module.exports = {
  addProductValidator,
  updateProductValidator,
  getProductsQueryValidator,
  productIdValidator,
  imageIdValidator,
  productImageIdValidator,
};
