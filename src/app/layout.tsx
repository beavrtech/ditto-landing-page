import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ditto — Your CSR Copilot",
  description:
    "Get the CSR recognition you deserve. Prove your sustainability work across EcoVadis, ISO 14001, CDP, and CSRD with AI-powered tools and expert guidance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
