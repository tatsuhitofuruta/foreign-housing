import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter'
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: '--font-noto-sans-jp',
  weight: ['400', '500', '700']
});

export const metadata: Metadata = {
  title: "Foreign Housing - Real Estate Reviews in Japan",
  description: "Find your perfect home in Japan with reviews from residents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
