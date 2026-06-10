import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Inter, Hedvig_Letters_Serif } from "next/font/google";
import "./globals.css";
import { JsonLd, SOFTWARE_APP_JSONLD } from "../components/JsonLd";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const hedvig = Hedvig_Letters_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hedvig",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.trustditto.com"),
  title: "Ditto – Your CSR copilot | More impact, less effort",
  openGraph: {
    type: "website",
    siteName: "Ditto",
    locale: "en",
    images: [{ url: "/images/ditto-frameworks-hero.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
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
    <html lang={locale} className={`${inter.variable} ${hedvig.variable}`}>
      <head>
        <link rel="stylesheet" href="/webflow-css/webflow-bundle.css" />
        <JsonLd data={SOFTWARE_APP_JSONLD} />
      </head>
      <body>{children}</body>
    </html>
  );
}
