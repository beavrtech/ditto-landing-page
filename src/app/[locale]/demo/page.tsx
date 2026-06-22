import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Navbar } from "../../../components/NavbarServer";
import { Footer } from "../../../components/FooterServer";
import { Breadcrumbs } from "../../../components/BreadcrumbsWithSchema";
import { SectionContactSidebar } from "../../../components/SectionContactSidebarI18n";
import { SectionLogostrip } from "../../../components/LogostripServer";
import { SectionNumbers } from "../../../../devlink/sections/SectionNumbers";
import { CalBookingEmbed } from "../../../components/CalBookingEmbed";
import { ElementSocialproofTrustpilot } from "../../../../devlink/elements/ElementSocialproofTrustpilot";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("getStarted.title"),
    description: t("getStarted.description"),
    alternates: {
      canonical: `https://www.trustditto.com/${locale}/demo`,
      languages: {
        "x-default": "https://www.trustditto.com/en/demo",
        en: "https://www.trustditto.com/en/demo",
        fr: "https://www.trustditto.com/fr/demo",
      },
    },
    openGraph: {
      title: t("getStarted.title"),
      description: t("getStarted.description"),
      images: [{ url: "https://www.trustditto.com/images/og-default.jpg" }],
    },
  };
}

export const revalidate = 3600;

export default async function DemoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const prefix = `/${locale}`;

  return (
    <div className="page-wrapper booking-page">
      <main className="main-wrapper">
        <Navbar />

        {/* 1. Breadcrumbs */}
        <Breadcrumbs
          backgroundBackground="Primary"
          item1Item1Text={t("getStarted.breadcrumb")}
          item1Item1Link={{ href: `${prefix}/demo` }}
          item2Item2Visibility={false}
          item3Item3Visibility={false}
        />

        {/* 2. Value prop + benefits + Trustpilot (left), Cal.com booking (right) */}
        <SectionContactSidebar
          title={t("getStarted.hero.title")}
          subtitle={t("getStarted.hero.subtitle")}
          contentFooter={
            <div className="pricing-cal_trustpilot">
              <ElementSocialproofTrustpilot />
            </div>
          }
          formSlot={
            <div className="pricing-cal_embed">
              <CalBookingEmbed />
            </div>
          }
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

        <Footer />
      </main>
    </div>
  );
}
