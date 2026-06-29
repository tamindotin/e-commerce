const createRateLimiter = require("../utils/createRateLimiter");

exports.authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many authentication attempts.",
});

exports.apiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 100,
});

exports.otpLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 3,
});
