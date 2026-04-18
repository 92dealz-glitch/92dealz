// Build timestamp: 2026-03-11T21:30:00+05:00
import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito } from "next/font/google";
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

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

import { AlertProvider } from "../context/AlertContext";
import { LocationFilterProvider } from "../context/LocationFilterContext";
import { CurrencyProvider } from "../context/CurrencyContext";

export const metadata: Metadata = {
  title: {
    default: "234 Deals | Nigeria's Smartest Marketplace",
    template: "%s | 234 Deals"
  },
  description: "Buy and sell everything from cars and phones to houses and fashion. 234 Deals connects buyers and sellers across Nigeria for the best localized deals.",
  keywords: ["Nigeria marketplace", "buy and sell Nigeria", "online shopping Nigeria", "234 deals", "classifieds Nigeria", "Lagos deals", "Abuja marketplace"],
  authors: [{ name: "234 Deals Team" }],
  creator: "234 Deals",
  publisher: "234 Deals",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://234deals.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "234 Deals | Nigeria's Smartest Marketplace",
    description: "Connect with verified sellers and find the best deals across Nigeria. Safe, fast, and easy marketplace.",
    url: "https://234deals.vercel.app",
    siteName: "234 Deals",
    images: [
      {
        url: "/234dealslogo.svg",
        width: 1200,
        height: 630,
        alt: "234 Deals Marketplace",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "234 Deals | Nigeria's Smartest Marketplace",
    description: "Buy and sell anything in Nigeria. Verified sellers, best prices.",
    images: ["/234dealslogo.svg"],
  },
  icons: {
    icon: "/234dealslogo.svg",
    apple: "/234dealslogo.svg",
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
      <body className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable} antialiased pb-20 md:pb-0`}>
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
