import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Navbar } from "../../../components/NavbarServer";
import { Footer } from "../../../components/FooterServer";
import { SectionBreadcrumbs } from "../../../../webflow/sections/SectionBreadcrumbs";
import { SectionContactSidebar } from "../../../components/SectionContactSidebarI18n";
import { SectionLogostrip } from "../../../components/LogostripServer";
import { SectionNumbers } from "../../../../webflow/sections/SectionNumbers";
import { SectionCta } from "../../../../webflow/sections/SectionCta";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("getStarted.title"),
    description: t("getStarted.description"),
    alternates: {
      canonical: locale === "fr" ? "https://www.trustditto.com/fr/contact" : "https://www.trustditto.com/en/get-started",
      languages: {
        "x-default": "https://www.trustditto.com/en/get-started",
        en: "https://www.trustditto.com/en/get-started",
        fr: "https://www.trustditto.com/fr/contact",
      },
    },
  };
}

export const revalidate = 3600;

export default async function GetStartedPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();
  const prefix = `/${locale}`;

  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar />

        {/* 1. Breadcrumbs */}
        <SectionBreadcrumbs
          backgroundBackground="Primary"
          item1Item1Text={t("getStarted.breadcrumb")}
          item1Item1Link={{ href: `${prefix}/get-started` }}
          item2Item2Visibility={false}
          item3Item3Visibility={false}
        />

        {/* 2. Contact section with form */}
        <SectionContactSidebar
          title={t("getStarted.hero.title")}
          subtitle={t("getStarted.hero.subtitle")}
          hubspotFormId={process.env.NEXT_PUBLIC_HUBSPOT_CONTACT_FORM_ID!}
        />

        {/* 3. Logo strip */}
        <SectionLogostrip variant="Base" locale={locale} />

        {/* 4. Numbers */}
        <SectionNumbers
          title={<>{t("getStarted.numbers.title")}</>}
          card1Card1Number={<>{t("getStarted.numbers.card1.number")}</>}
          card1Card1Text={<>{t("getStarted.numbers.card1.text")}</>}
          card2Card2Number={<>{t("getStarted.numbers.card2.number")}</>}
          card2Card2Text={<>{t("getStarted.numbers.card2.text")}</>}
          card3Card3Number={<>{t("getStarted.numbers.card3.number")}</>}
          card3Card3Text={<>{t("getStarted.numbers.card3.text")}</>}
        />

        {/* 5. CTA */}
        <SectionCta
          title={t("cta.title")}
          paragraph={t("cta.subtitle")}
          buttonText={t("cta.button")}
          buttonLink={{ href: `${prefix}/get-started` }}
        />

        <Footer />
      </main>
    </div>
  );
}
