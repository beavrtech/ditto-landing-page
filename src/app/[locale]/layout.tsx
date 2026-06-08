import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SafeDevLinkProvider } from "../../components/SafeDevLinkProvider";
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
    <NextIntlClientProvider messages={messages}>
      <SafeDevLinkProvider>
        <GlobalStyles />
        {children}
      </SafeDevLinkProvider>
    </NextIntlClientProvider>
  );
}
