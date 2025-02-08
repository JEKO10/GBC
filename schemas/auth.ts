import * as z from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, {
    message: "Name is required!",
  }),
  email: z.string().email({
    message: "Email is required!",
  }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    message: "Invalid phone number format!",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required!",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required!",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required!",
  }),
});
