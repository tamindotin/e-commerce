const joi = require("joi");

const email = joi.string().email().trim().required();

const password = joi
  .string()
  .min(8)
  .max(32)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
  .required()
  .messages({
    "string.pattern.base":
      "Password must contain uppercase, lowercase, number and special character.",
  });

const confirmPassword = joi
  .any()
  .valid(joi.ref("password"))
  .required()
  .messages({
    "any.only": "Passwords do not match.",
  });

const otp = joi.string().length(6).pattern(/^\d+$/).required();

const registerSchema = joi.object({
  name: joi.string().min(3).max(15).trim().required(),
  email: email,
  password: password,
  confirmPassword: confirmPassword,
});

const loginSchema = joi.object({
  email: email,
  password: password,
});

const verifyAccountSchema = joi.object({
  email: email,
  otp: otp,
});

const forgotPasswordSchema = joi.object({
  email: email,
});

const resendOtpSchema = joi.object({
  email: email,
});

const resetPasswordSchema = joi.object({
  email: email,
  password: password,
  confirmPassword: confirmPassword,
  otp: otp,
});

const changePasswordSchema = joi.object({
  password: password,
  newPassword: joi
    .string()
    .min(8)
    .max(32)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain uppercase, lowercase, number and special character.",
    })
    .invalid(joi.ref("password"))
    .messages({
      "any.invalid": "Current password and new password cannot be same.",
    }),
  confirmPassword: joi.any().valid(joi.ref("newPassword")).required().messages({
    "any.only": "Passwords do not match.",
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  verifyAccountSchema,
  forgotPasswordSchema,
  resendOtpSchema,
  resetPasswordSchema,
  changePasswordSchema,
};
