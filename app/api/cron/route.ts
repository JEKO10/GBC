import { NextResponse } from "next/server";

import db from "@/lib/db";

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();

    const deletedTokens = await db.verificationToken.deleteMany({
      where: {
        expires: { lt: now },
      },
    });

    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const deletedUsers = await db.user.deleteMany({
      where: {
        emailVerified: null,
        createdAt: { lt: twentyFourHoursAgo },
      },
    });

    console.log(
      `Deleted ${deletedTokens.count} expired tokens and ${deletedUsers.count} unverified users.`
    );

    return NextResponse.json({
      message: `Deleted ${deletedTokens.count} expired tokens and ${deletedUsers.count} unverified users.`,
    });
  } catch (error) {
    console.error("Error deleting expired tokens or unverified users:", error);
    return NextResponse.json(
      { error: "Failed to clean expired tokens and unverified users." },
      { status: 500 }
    );
  }
}
