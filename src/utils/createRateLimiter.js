const rateLimit = require("express-rate-limit");

const createRateLimiter = ({ windowMs, max, message = "Too many requests." }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message,
    },
  });

module.exports = createRateLimiter;
