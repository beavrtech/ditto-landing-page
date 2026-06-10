import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Navbar } from "../../../components/NavbarServer";
import { Footer } from "../../../components/FooterServer";
import { CareersClient } from "./CareersClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("careers.title"),
    description: t("careers.description"),
    alternates: {
      canonical: `https://www.trustditto.com/${locale}/careers`,
      languages: {
        "x-default": "https://www.trustditto.com/en/careers",
        en: "https://www.trustditto.com/en/careers",
        fr: "https://www.trustditto.com/fr/careers",
      },
    },
    openGraph: {
      title: t("careers.title"),
      description: t("careers.description"),
      images: [{ url: "https://www.trustditto.com/images/og-default.jpg" }],
    },
  };
}

export const revalidate = 3600;

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar />
        <CareersClient />
        <Footer />
      </main>
    </div>
  );
}
