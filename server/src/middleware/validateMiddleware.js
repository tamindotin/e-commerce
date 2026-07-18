const validate = (schemas) => {
  return (req, res, next) => {
    try {
      if (schemas.body) {
        const { error, value } = schemas.body.validate(req.body, {
          abortEarly: false,
        });

        if (error) throw error;

        req.body = value;
      }

      if (schemas.params) {
        const { error, value } = schemas.params.validate(req.params, {
          abortEarly: false,
        });

        if (error) throw error;

        req.params = value;
      }

      if (schemas.query) {
        const { error, value } = schemas.query.validate(req.query, {
          abortEarly: false,
        });

        if (error) throw error;

        req.query = value;
      }

      next();
    } catch (error) {
      const err = new Error(
        error.details.map((detail) => detail.message).join(", "),
      );
      err.status = 400;
      next(err);
    }
  };
};

export default validate;
