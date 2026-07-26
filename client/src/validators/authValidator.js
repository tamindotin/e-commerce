import * as z from "zod";

const emailRule = z.email("Enter valid email address");

const passwordRule = z
  .string()
  .min(8, "Must be at least 8 characters")
  .regex(/[A-Z]/, "Must include an uppercase letter")
  .regex(/[a-z]/, "Must include a lowercase letter")
  .regex(/[0-9]/, "Must include a number")
  .regex(/[^A-Za-z0-9]/, "Must include a special character");

const otpRule = z.string().length(6, "Enter the full 6-digit code");

export const loginSchema = z.object({
  email: emailRule,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string().min(3, "Name must be 3 character long"),
    email: emailRule,
    password: passwordRule,
    confirmPassword: z.string(),
  })
  .refine((data) => {
    (data.password === data.confirmPassword,
      {
        message: "Password do not match",
        path: ["confirmPassword"],
      });
  });

export const otpSchema = z.object({
  otp: otpRule,
});

export const resetPasswordSchema = z
  .object({
    otp: otpRule,
    password: passwordRule,
    confirmPassword: z.string(),
  })
  .refine((data) => {
    (data.password === data.confirmPassword,
      {
        message: "Password do not match",
        path: ["confirmPassword"],
      });
  });
