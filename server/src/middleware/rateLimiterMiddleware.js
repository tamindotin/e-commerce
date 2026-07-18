import createRateLimiter from "../utils/createRateLimiter.js";

export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many authentication attempts.",
});

export const apiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 100,
});

export const otpLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 3,
});

export const writeLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 50,
});
