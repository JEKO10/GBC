"use server";

import bcrypt from "bcryptjs";
import * as z from "zod";

import db from "@/prisma/db";
import { RegisterSchema } from "@/schemas/auth";

import { getUserByEmail } from "./user";

export const register = async (formData: z.infer<typeof RegisterSchema>) => {
  const validateFields = RegisterSchema.safeParse(formData);

  if (!validateFields.success) {
    return { error: "Nevažeća polja!" };
  }

  const { name, email, password } = validateFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingEmail = await getUserByEmail(email);
  // const existingPhone = await getUserByPhone(phone);

  if (existingEmail)
    return { error: "E-mail address or phone number already in use!" };

  await db.user.create({
    data: {
      name,
      email,
      phone: "",
      password: hashedPassword,
    },
  });

  return { success: "User created!" };
};
