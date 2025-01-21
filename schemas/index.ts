import * as z from "zod";

export const SignUpSchema = z.object({
  name: z.string().min(1, { message: "Name is required!" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address!" })
    .trim(),
});
