import "./globals.css";

import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Script from "next/script";
import { SessionProvider } from "next-auth/react";

import { auth } from "@/auth";
import Navbar from "@/components/Navbar";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "General Bilimoria's Canteen",
  description:
    "Personal favourites from the General’s postings across India. Authentic Flavours. Quality & Quantity.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={`${outfit.variable} antialiased`}>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=AW-16773442177"
            strategy="afterInteractive"
          />
          <Script id="google-ads" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-16773442177');
            `}
          </Script>
          <Navbar />
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
