import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import NextAuth from "next-auth";

import db from "@/lib/db";

import authConfig from "./auth.config";
import { getUserById } from "./data/user";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const existingUser = user.id && (await getUserById(user.id));

      if (existingUser && !existingUser?.emailVerified) return false;

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) session.user.id = token.sub;

      if (token.phone && session.user) {
        session.user.phone = token.phone as string;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (existingUser && existingUser.phone && existingUser.role) {
        token.phone = existingUser.phone;
        token.role = existingUser.role;
      }

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt", maxAge: 7200 },
  ...authConfig,
});
