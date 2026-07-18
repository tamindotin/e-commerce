import Joi from "joi";
import objectId from "../helper/objectIdValidator.js";

const name = Joi.string().min(3).max(100).trim();

const slug = Joi.string()
  .min(3)
  .max(30)
  .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const description = Joi.string().min(10).max(500).trim();
const brand = Joi.string().min(3).max(50).trim();
const model = Joi.string().min(3).max(30).trim();

const price = Joi.number().greater(0);
const compareAtPrice = Joi.number().greater(Joi.ref("price"));
const stock = Joi.number().integer().min(0);

const sku = Joi.string().pattern(/^[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+$/);

const specifications = Joi.object()
  .pattern(Joi.string().min(1).trim(), Joi.string().min(1).trim())
  .max(30)
  .default({});

const tags = Joi.array()
  .items(Joi.string().trim().min(1).lowercase())
  .unique()
  .default([]);

const isFeatured = Joi.boolean();
const isPublished = Joi.boolean();

const page = Joi.number().integer().min(1).default(1);
const limit = Joi.number().integer().min(1).max(100).default(10);

const minPrice = Joi.number().min(0);
const maxPrice = Joi.number().greater(Joi.ref("minPrice"));

const rating = Joi.number().min(0).max(5);

const inStock = Joi.boolean().default(true);

const queryTags = Joi.string();

const sort = Joi.valid(
  "-createdAt",
  "createdAt",
  "price",
  "-price",
  "name",
  "-name",
).default("-createdAt");

export const addProductValidator = Joi.object({
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

export const updateProductValidator = Joi.object({
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

export const getProductsQueryValidator = Joi.object({
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

export const productIdValidator = Joi.object({
  productId: objectId.required(),
});

export const imageIdValidator = Joi.object({
  imageId: objectId.required(),
});

export const productImageIdValidator = Joi.object({
  productId: objectId.required(),
  imageId: objectId.required(),
});
