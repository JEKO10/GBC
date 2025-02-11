"use server";

import bcrypt from "bcryptjs";
import * as z from "zod";

import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { SettingsSchema } from "@/schemas/auth";

export const settings = async (formData: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized!" };
  }

  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return { error: "Unauthorized!" };
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

  if (formData.password && formData.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      formData.password,
      dbUser.password
    );

    if (!passwordsMatch) {
      return { error: "Incorrect password!" };
    }

    const hashedPassword = await bcrypt.hash(formData.newPassword, 10);

    await db.user.update({
      where: { id: dbUser.id },
      data: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: hashedPassword,
        isTwoFactorEnabled: formData.isTwoFactorEnabled,
      },
    });
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      isTwoFactorEnabled: formData.isTwoFactorEnabled,
    },
  });

  return { success: "Settings updated!" };
};
