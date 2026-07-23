import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Navbar } from "../../../components/NavbarServer";
import { Footer } from "../../../components/FooterServer";
import { Breadcrumbs } from "../../../components/BreadcrumbsWithSchema";
import { SectionHero2 } from "../../../../devlink/sections/SectionHero2";
import { SectionCta } from "../../../../devlink/sections/SectionCta";
import { ElementSocialproofTrustpilot } from "../../../../devlink/elements/ElementSocialproofTrustpilot";
import { SectionCustomerLogos } from "../../../components/CustomerLogosServer";
import { PressMentions } from "../../../components/PressServer";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("press.title"),
    description: t("press.description"),
    alternates: {
      canonical: `https://www.trustditto.com/${locale}/press`,
      languages: {
        "x-default": "https://www.trustditto.com/en/press",
        en: "https://www.trustditto.com/en/press",
        fr: "https://www.trustditto.com/fr/press",
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: t("press.title"),
      description: t("press.description"),
      images: [{ url: "https://www.trustditto.com/images/og-default.jpg" }],
    },
  };
}

export const revalidate = 3600;

export default async function PressPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const prefix = `/${locale}`;

  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar />

        <Breadcrumbs
          backgroundBackground="Primary"
          item1Item1Text={t("press.breadcrumb")}
          item1Item1Link={{ href: `${prefix}/press` }}
          item2Item2Visibility={false}
          item3Item3Visibility={false}
        />

        <SectionHero2
          title={t("press.hero.title")}
          loremIpsum={t("press.hero.subtitle")}
        />

        <PressMentions locale={locale} />

        <SectionCustomerLogos locale={locale} afterContent={<ElementSocialproofTrustpilot />} />

        <SectionCta
          title={t("cta.title")}
          paragraph={t("cta.subtitle")}
          buttonText={t("cta.button")}
          buttonLink={{ href: `${prefix}/demo` }}
        />

        <Footer />
      </main>
    </div>
  );
}
