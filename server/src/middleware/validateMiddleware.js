const validate = (schemas) => {
  return (req, res, next) => {
    try {
      if (schemas.body) {
        const { error, value } = schemas.body.validate(req.body, {
          abortEarly: false,
        });

        if (error) throw error;

        Object.assign(req.query, value);
      }

      if (schemas.params) {
        const { error, value } = schemas.params.validate(req.params, {
          abortEarly: false,
        });

        if (error) throw error;

        Object.assign(req.query, value);
      }

      if (schemas.query) {
        const { error, value } = schemas.query.validate(req.query, {
          abortEarly: false,
        });

        if (error) throw error;

        Object.assign(req.query, value);
      }

      next();
    } catch (error) {
      if (error.isJoi) {
        return next(
          Object.assign(
            new Error(error.details.map((d) => d.message).join(", ")),
            { status: 400 },
          ),
        );
      }

      next(error);
    }
  };
};

export default validate;
