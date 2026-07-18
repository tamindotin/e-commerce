import Joi from "joi";

const objectId = Joi.string().hex().length(24);

export default objectId;
