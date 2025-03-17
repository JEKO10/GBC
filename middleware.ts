import NextAuth from "next-auth";

import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

import { NextResponse } from "next/server";

import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "@/routes";

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiRoute = apiAuthPrefix.some((prefix) =>
    nextUrl.pathname.startsWith(prefix)
  );
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiRoute) return;

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  // @TODO check for optimal answer, prikazuje /restaurants prije /:id
  if (nextUrl.pathname.startsWith("/restaurants/")) {
    await delay(1000);

    const requestedRestaurantName = decodeURIComponent(
      nextUrl.pathname.split("/restaurants/")[1]
    );
    const cameFromMap = req.cookies.get("cameFromMap")?.value;
    const refererHeader = req.headers.get("referer");

    if (cameFromMap === requestedRestaurantName) {
      return NextResponse.next();
    }

    if (refererHeader) {
      const refererURL = new URL(refererHeader);
      if (refererURL.pathname === "/map") {
        const response = NextResponse.next();
        response.cookies.set("cameFromMap", requestedRestaurantName, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 600,
          path: "/",
          sameSite: "strict",
        });
        return response;
      }
    }

    return NextResponse.redirect(new URL("/restaurants", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
  runtime: "nodejs",
};
