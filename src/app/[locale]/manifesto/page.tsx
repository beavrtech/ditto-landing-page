import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Navbar } from "../../../components/NavbarServer";
import { Footer } from "../../../components/FooterServer";
import { ManifestoClient } from "./ManifestoClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("manifesto.title"),
    description: t("manifesto.description"),
    alternates: {
      canonical: `https://www.trustditto.com/${locale}/manifesto`,
      languages: {
        "x-default": "https://www.trustditto.com/en/manifesto",
        en: "https://www.trustditto.com/en/manifesto",
        fr: "https://www.trustditto.com/fr/manifesto",
      },
    },
    openGraph: {
      title: t("manifesto.title"),
      description: t("manifesto.description"),
      images: [{ url: "https://www.trustditto.com/images/ditto-frameworks-hero.jpg" }],
    },
  };
}

export const revalidate = 3600;

export default async function ManifestoPage() {
  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar />
        <ManifestoClient />
        <Footer />
      </main>
    </div>
  );
}
