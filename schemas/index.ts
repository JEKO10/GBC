import * as z from "zod";

export const SignUpSchema = z.object({
  name: z.string().min(1, { message: "Name is required!" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address!" })
    .trim(),
});

export const PostSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Post name is required!" })
    .max(100, { message: "Post name cannot exceed 100 characters!" }),
  image: z
    .any()
    .refine((file) => file instanceof File || typeof file === "string", {
      message: "Image must be a valid file or a valid URL!",
    }),
  description: z.string().min(1, { message: "Description is required!" }),
  restaurant: z
    .object({
      id: z.string().min(1, { message: "Restaurant ID is required!" }),
      // name: z.string().optional(),
    })
    .optional(),
});
