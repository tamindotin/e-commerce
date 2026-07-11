const joi = require("joi");

const objectId = joi.string().hex().length(24);

module.exports = {
  objectId,
};
