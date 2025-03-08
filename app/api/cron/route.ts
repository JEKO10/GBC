import { NextResponse } from "next/server";

import db from "@/lib/db";

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();

    const deletedVerificationTokens = await db.verificationToken.deleteMany({
      where: {
        expires: { lt: now },
      },
    });
    const deletedTwoFactorTokens = await db.twoFactorToken.deleteMany({
      where: { expires: { lt: now } },
    });
    const deletedPasswordResetTokens = await db.passwordResetToken.deleteMany({
      where: { expires: { lt: now } },
    });

    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const deletedUsers = await db.user.deleteMany({
      where: {
        emailVerified: null,
        createdAt: { lt: twentyFourHoursAgo },
      },
    });

    return NextResponse.json({
      message: `Deleted ${deletedVerificationTokens.count} verification tokens, 
      ${deletedTwoFactorTokens.count} two-factor tokens, 
      ${deletedPasswordResetTokens.count} password reset tokens, 
      ${deletedUsers.count} unverified users.`,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to clean expired tokens and unverified users." },
      { status: 500 }
    );
  }
}
