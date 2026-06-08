import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ditto - Your CSR copilot | More impact, less effort",
  description:
    "Ditto empowers SMEs and mid-sized enterprises to build reliable, structured, and value-driven CSR strategies through a platform and expert guidance on EcoVadis, CSRD, ISO, and CDP.",
  icons: {
    icon: "/images/favicon.png",
    apple: "/images/webclip.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <head>
        <link rel="stylesheet" href="/webflow-css/webflow-bundle.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
