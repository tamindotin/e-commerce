const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error. ",
    router: req.originalUrl,
  });
};

export default errorHandler;
