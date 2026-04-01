import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AveLot — No-Loss Savings & Prizes",
  description: "Deposit, earn yield, win prizes. Nobody ever loses their money.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
