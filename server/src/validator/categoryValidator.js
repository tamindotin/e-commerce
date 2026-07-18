import Joi from "joi";
import objectId from "../helper/objectIdValidator.js";

const name = Joi.string().min(3).max(50).trim();
const isActive = Joi.boolean();

export const addCategoryValidator = Joi.object({
  name: name.required(),
});

export const updateCategoryValidator = Joi.object({
  name,
  isActive,
});

export const categoryIdValidator = Joi.object({
  id: objectId.required(),
});

export const getCategoriesQueryValidator = Joi.object({
  name,

  slug: Joi.string()
    .min(3)
    .max(30)
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),

  isActive,

  sort: Joi.valid(
    "name",
    "-name",
    "slug",
    "-slug",
    "createdAt",
    "-createdAt",
  ).default("-createdAt"),

  page: Joi.number().integer().min(1).default(1),

  limit: Joi.number().integer().min(1).max(100).default(10),
});
