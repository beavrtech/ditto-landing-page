import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
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
    },
  };
}

export const revalidate = 3600;

export default async function CareersPage() {
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
