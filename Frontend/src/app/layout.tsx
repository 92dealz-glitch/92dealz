// Build timestamp: 2026-03-11T21:30:00+05:00
import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit, Inter } from "next/font/google";
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

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

import { AlertProvider } from "../context/AlertContext";
import { LocationFilterProvider } from "../context/LocationFilterContext";
import { CurrencyProvider } from "../context/CurrencyContext";

export const metadata: Metadata = {
  title: {
    default: "92Dealz | Pakistan's Smartest Marketplace",
    template: "%s | 92Dealz"
  },
  description: "Buy and sell everything from cars and phones to houses and fashion. 92Dealz connects buyers and sellers across Pakistan for the best localized deals.",
  keywords: ["Pakistan marketplace", "buy and sell Pakistan", "online shopping Pakistan", "92dealz", "classifieds Pakistan", "Karachi deals", "Lahore marketplace", "Islamabad deals", "OLX Pakistan alternative"],
  authors: [{ name: "92Dealz Team" }],
  creator: "92Dealz",
  publisher: "92Dealz",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://92dealz.pk"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "92Dealz | Pakistan's Smartest Marketplace",
    description: "Connect with verified sellers and find the best deals across Pakistan. Safe, fast, and easy marketplace.",
    url: "https://92dealz.pk",
    siteName: "92Dealz",
    images: [
      {
        url: "/92dealzlogo.svg",
        width: 1200,
        height: 630,
        alt: "92Dealz Pakistan Marketplace",
      },
    ],
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "92Dealz | Pakistan's Smartest Marketplace",
    description: "Buy and sell anything in Pakistan. Verified sellers, best prices.",
    images: ["/92dealzlogo.svg"],
  },
  icons: {
    icon: "/92dealzlogo.svg",
    apple: "/92dealzlogo.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${inter.variable} antialiased pb-20 md:pb-0`}>
        <LocationFilterProvider>
          <Providers>
            <AlertProvider>
              <NotificationProvider>
                <CurrencyProvider>
                  <FavoritesProvider>{children}</FavoritesProvider>
                </CurrencyProvider>
              </NotificationProvider>
            </AlertProvider>
          </Providers>
        </LocationFilterProvider>
      </body>
    </html>
  );
}


