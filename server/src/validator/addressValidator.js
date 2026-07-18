import Joi from "joi";
import objectId from "../helper/objectIdValidator.js";

const Label = Object.freeze({
  HOME: "HOME",
  OFFICE: "OFFICE",
  OTHER: "OTHER",
});

const label = Joi.string()
  .uppercase()
  .valid(...Object.values(Label))
  .messages({
    "any.only": "Only HOME, OFFICE and OTHER are allowed as labels.",
  });

const street = Joi.string().min(3).max(30);

const city = Joi.string().min(3).max(30);

const state = Joi.string().min(3).max(30);

const pincode = Joi.string().length(6).pattern(/^\d+$/);

const country = Joi.string().min(3).max(15);

export const addressIdValidator = Joi.object({
  id: objectId.required(),
});

export const addAddressSchema = Joi.object({
  label: label.required(),
  street: street.required(),
  city: city.required(),
  state: state.required(),
  pincode: pincode.required(),
  country: country.required(),
});

export const updateAddressSchema = Joi.object({
  label: label,
  street: street,
  city: city,
  state: state,
  pincode: pincode,
  country: country,
});
