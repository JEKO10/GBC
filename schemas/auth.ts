import * as z from "zod";

export const RegisterSchema = z.object({
  name: z.string().trim().min(2, {
    message: "Name is required!",
  }),
  email: z.string().trim().email({
    message: "Email is required!",
  }),
  password: z.string().trim().min(6, {
    message: "Minimum 6 characters required!",
  }),
  captchaToken: z.string().min(1, {
    message: "Captcha verification is required!",
  }),
  nickname: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().trim().email({
    message: "Email is required!",
  }),
  password: z.string().trim().min(6, {
    message: "Minimum 6 characters required!",
  }),
  code: z.optional(z.string().trim()),
});

const ukPhoneNumberRegex = /^\+44\s?\d{3,5}[\s-]?\d{6,7}$/;
const ukPostcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/i;

export const SettingsSchema = z
  .object({
    name: z.optional(z.string().trim()),
    email: z.optional(z.string().trim().email()),
    password: z
      .optional(z.string().trim())
      .refine((val) => !val || val.length >= 6, {
        message: "Password must be at least 6 characters",
      }),
    newPassword: z
      .optional(z.string().trim())
      .refine((val) => !val || val.length >= 6, {
        message: "New password must be at least 6 characters",
      }),
    isTwoFactorEnabled: z.optional(z.boolean()),

    // phone and address
    phone: z.optional(
      z.string().trim().regex(ukPhoneNumberRegex, {
        message: "Invalid UK phone number format. Use +44 XXXXX XXXXXX",
      })
    ),
    houseNumber: z.optional(
      z.string().trim().min(1, { message: "House number is required!" })
    ),
    address: z.optional(
      z
        .string()
        .trim()
        .min(5, { message: "Address must be at least 5 characters!" })
    ),
    postcode: z.optional(
      z
        .string()
        .trim()
        .regex(ukPostcodeRegex, { message: "Invalid UK postcode format!" })
    ),
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
  email: z.string().trim().email({
    message: "Email is required!",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().trim().min(6, {
    message: "Minimum 6 characters required!",
  }),
});
