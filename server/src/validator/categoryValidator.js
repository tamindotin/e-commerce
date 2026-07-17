const joi = require("joi");
const {objectId} = require("../helper/objectIdValidator");

const name = joi.string().min(3).max(50).trim();
const isActive = joi.boolean();

const addCategoryValidator = joi.object({
  name: name.required(),
});

const updateCategoryValidator = joi.object({
  name,
  isActive,
});

const categoryIdValidator = joi.object({
  id: objectId.required(),
});

const getCategoriesQueryValidator = joi.object({
  name,
  slug: joi
    .string()
    .min(3)
    .max(30)
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),

  isActive,

  sort: joi.valid("name", "-name", "slug", "-slug", "createdAt", "-createdAt").default("-createdAt"),

  page: joi.number().integer().min(1).default(1),

  limit: joi.number().integer().min(1).max(100).default(10),
});

module.exports = {
  categoryIdValidator,
  addCategoryValidator,
  updateCategoryValidator,
  getCategoriesQueryValidator,
};
