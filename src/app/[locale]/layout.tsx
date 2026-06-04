import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { DevLinkProvider } from "../../../webflow/DevLinkProvider";
import { GlobalStyles } from "../../../webflow/GlobalStyles";

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

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <head>
        <link rel="stylesheet" href="/webflow-css/webflow-bundle.css" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <DevLinkProvider>
            <GlobalStyles />
            {children}
          </DevLinkProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
