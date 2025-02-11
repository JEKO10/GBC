import * as z from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, {
    message: "Name is required!",
  }),
  email: z.string().email({
    message: "Email is required!",
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
  code: z.optional(z.string()),
});

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    email: z.optional(z.string().email()),
    phone: z.optional(z.string()),
    password: z.optional(z.string()).refine((val) => !val || val.length >= 6, {
      message: "Password must be at least 6 characters",
    }),
    newPassword: z
      .optional(z.string())
      .refine((val) => !val || val.length >= 6, {
        message: "New password must be at least 6 characters",
      }),
    isTwoFactorEnabled: z.optional(z.boolean()),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    }
  );

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required!",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 characters required!",
  }),
});
