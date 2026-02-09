import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AveLot - Betting Pool",
  description: "Decentralized betting pool on Base",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <html lang="en">
            <head>
                <link rel="icon" href="/Avelot.png" sizes="any" />
            </head>
            <body className="bg-zinc-50 antialiased">
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
  );
}
