// Build timestamp: 2026-03-11T21:30:00+05:00
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { FavoritesProvider } from "../context/FavoritesProvider";
import { NotificationProvider } from "../context/NotificationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "234 Deals",
  description: "Marketplace platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased pb-20 md:pb-0`}>
        <Providers>
          <NotificationProvider>
            <FavoritesProvider>{children}</FavoritesProvider>
          </NotificationProvider>
        </Providers>
      </body>
    </html>
  );
}
