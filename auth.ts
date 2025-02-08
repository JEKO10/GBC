import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";

import db from "@/prisma/db";

import authConfig from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt", maxAge: 7200 },
  ...authConfig,
});
