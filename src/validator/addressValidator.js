const joi = require("joi");
const { objectId } = require("../helper/objectIdValidator");

const Label = Object.freeze({
  HOME: "HOME",
  OFFICE: "OFFICE",
  OTHER: "OTHER",
});

const addressIdValidator = joi.object({
  id: objectId.required()
})

const label = joi
  .string()
  .uppercase()
  .valid(...Object.values(Label))
  .messages({
    "any.only": "Only HOME, OFFICE and OTHER are allowed as labels.",
  });

const street = joi.string().min(3).max(30);

const city = joi.string().min(3).max(30);

const state = joi.string().min(3).max(30);

const pincode = joi.string().length(6).pattern(/^\d+$/);

const country = joi.string().min(3).max(15);

const addAddressSchema = joi.object({
  label: label.required(),
  street: street.required(),
  city: city.required(),
  state: state.required(),
  pincode: pincode.required(),
  country: country.required(),
});

const updateAddressSchema = joi.object({
  label: label,
  street: street,
  city: city,
  state: state,
  pincode: pincode,
  country: country,
});

module.exports = { addAddressSchema, updateAddressSchema, addressIdValidator };
