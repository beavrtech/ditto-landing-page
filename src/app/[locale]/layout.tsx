import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Inter, Hedvig_Letters_Serif } from "next/font/google";
import { routing } from "@/i18n/routing";
import { SafeDevLinkProvider } from "../../components/SafeDevLinkProvider";
import { AlternateUrlProvider } from "../../components/AlternateUrlContext";
import { GlobalStyles } from "../../../devlink/GlobalStyles";
import { JsonLd, SOFTWARE_APP_JSONLD, ORGANIZATION_JSONLD } from "../../components/JsonLd";
import { AxeptioConsent } from "../../components/AxeptioConsent";
import { GoogleTagManager, GoogleTagManagerNoScript } from "../../components/GoogleTagManager";
import { Analytics } from "@vercel/analytics/next";
import { PostHogInit } from "../../components/PostHogInit";
import "../globals.css";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    metadataBase: new URL("https://www.trustditto.com"),
    robots: { index: true, follow: true },
    title: "Ditto – Your CSR copilot | More impact, less effort",
    openGraph: {
      type: "website",
      siteName: "Ditto",
      locale,
      images: [{ url: "/images/og-default.jpg", width: 1200, height: 630 }],
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
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <html lang={locale} className={`${inter.variable} ${hedvig.variable}`}>
      <head>
        <GoogleTagManager />
        <link rel="stylesheet" href="/devlink-css/devlink-bundle.css" />
        <JsonLd data={SOFTWARE_APP_JSONLD} />
        <JsonLd data={ORGANIZATION_JSONLD} />
      </head>
      <body>
        <GoogleTagManagerNoScript />
        <AxeptioConsent locale={locale} />
        <PostHogInit />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AlternateUrlProvider>
            <SafeDevLinkProvider>
              <GlobalStyles />
              {children}
            </SafeDevLinkProvider>
          </AlternateUrlProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
