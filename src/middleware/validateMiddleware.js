const validate = (schema) => {
  return (req, res, next) => {
    const error = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const error = new Error(
        error.details.map((detail) => detail.message).join(", "),
      );
      error.status = 400;
      return next(error);
    }
    next();
  };
};

module.exports = validate
