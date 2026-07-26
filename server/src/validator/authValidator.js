import Joi from "joi";

const email = Joi.string().email().trim().required();

const password = Joi.string()
  .min(8)
  .max(32)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
  .required()
  .messages({
    "string.pattern.base":
      "Password must contain uppercase, lowercase, number and special character.",
  });

const confirmPassword = Joi.any()
  .valid(Joi.ref("password"))
  .required()
  .messages({
    "any.only": "Passwords do not match.",
  });

const otp = Joi.string().length(6).pattern(/^\d+$/).required();

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(15).trim().required(),
  email: email,
  password: password,
  confirmPassword: confirmPassword,
});

export const loginSchema = Joi.object({
  email: email,
  password: Joi.string().required(),
});

export const verifyAccountSchema = Joi.object({
  email: email,
  otp: otp,
});

export const forgotPasswordSchema = Joi.object({
  email: email,
});

export const resendOtpSchema = Joi.object({
  email: email,
});

export const resetPasswordSchema = Joi.object({
  email: email,
  password: password,
  confirmPassword: confirmPassword,
  otp: otp,
});

export const changePasswordSchema = Joi.object({
  password: password,
  newPassword: Joi.string()
    .min(8)
    .max(32)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain uppercase, lowercase, number and special character.",
    })
    .invalid(Joi.ref("password"))
    .messages({
      "any.invalid": "Current password and new password cannot be same.",
    }),
  confirmPassword: Joi.any().valid(Joi.ref("newPassword")).required().messages({
    "any.only": "Passwords do not match.",
  }),
});
