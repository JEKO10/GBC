"use server";

import bcrypt from "bcryptjs";
import * as z from "zod";

import { getUserByEmail, getUserById } from "@/data/user";
import { filterPrismaFields } from "@/helpers/filterPrismaFields";
import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { SettingsSchema } from "@/schemas/auth";

// @TODO IMPORTANT verify phone number and number already in use
export const settings = async (formData: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized!" } as const;
  }

  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return { error: "Unauthorized!" } as const;
  }

  if (user.isOAuth) {
    formData.email = undefined;
    formData.password = undefined;
    formData.newPassword = undefined;
    formData.isTwoFactorEnabled = undefined;
  }

  if (formData.email && formData.email !== user.email) {
    const existingUser = await getUserByEmail(formData.email);
    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" };
    }

    const verificationToken = await generateVerificationToken(formData.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Verification email sent!" };
  }

  if (formData.phone && formData.phone !== dbUser.phone) {
    const existingUserWithPhone = await db.user.findUnique({
      where: { phone: formData.phone },
    });

    if (existingUserWithPhone && existingUserWithPhone.id !== dbUser.id) {
      return { error: "Phone number is already in use!" };
    }
  }

  if (formData.password && formData.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      formData.password,
      dbUser.password
    );

    if (!passwordsMatch) {
      return { error: "Incorrect password!" };
    }

    formData.password = await bcrypt.hash(formData.newPassword, 10);
    formData.newPassword = undefined;
  }

  const updatedData = filterPrismaFields(formData, ["houseNumber", "postcode"]);

  await db.user.update({
    where: { id: dbUser.id },
    data: updatedData,
  });

  return { success: "Settings updated!" };
};
