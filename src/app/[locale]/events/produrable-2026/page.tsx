import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Navbar } from "../../../../components/NavbarServer";
import { Footer } from "../../../../components/FooterServer";
import { Breadcrumbs } from "../../../../components/BreadcrumbsWithSchema";
import { localizedHref } from "../../../../lib/localized-paths";
import { SectionFeaturesHeader } from "../../../../../devlink/sections/SectionFeaturesHeader";
import { SectionCta } from "../../../../../devlink/sections/SectionCta";
import { Label } from "../../../../../devlink/elements/Label";
import { Button } from "../../../../../devlink/elements/Button";
import { Padding } from "../../../../../devlink/Padding";
import { Background } from "../../../../../devlink/Background";
import { DEVLINK_SCOPE_CLASS } from "../../../../../devlink/devlinkScope";

// Canonical (English) path for this page. Localized via the pathnames map in
// src/i18n/routing.ts and src/lib/localized-paths.ts — the FR URL is
// /evenements/produrable-2026 (translated "events" segment, matching how
// /resources/events itself keeps the un-translated form only because it's a
// redirect stub; a real content page here gets the FR word).
const EVENT_PATH = "/events/produrable-2026";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const enUrl = "https://www.trustditto.com/en/events/produrable-2026";
  const frUrl = "https://www.trustditto.com/fr/evenements/produrable-2026";
  return {
    title: t("produrable.title"),
    description: t("produrable.description"),
    alternates: {
      canonical: locale === "fr" ? frUrl : enUrl,
      languages: {
        "x-default": enUrl,
        en: enUrl,
        fr: frUrl,
      },
    },
    openGraph: {
      title: t("produrable.title"),
      description: t("produrable.description"),
      images: [{ url: "https://www.trustditto.com/images/og-default.jpg" }],
    },
  };
}

export const revalidate = 3600;

export default async function ProdurablePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const prefix = `/${locale}`;
  const demoHref = `${prefix}/demo`;

  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar />

        {/* 1. Breadcrumbs */}
        <Breadcrumbs
          item1Item1Text={t("produrable.breadcrumb")}
          item1Item1Link={{ href: localizedHref(EVENT_PATH, locale) }}
          item2Item2Visibility={false}
          item3Item3Visibility={false}
        />

        {/* 2. Hero — title, date/location, stand, and the stand-meeting CTA.
            Built from the same classes as the generated SectionHero2 (hero2_section /
            container-48rem / header), but without its decorative illustration strip:
            that graphic is a fixed-width SVG with no responsive rule to stretch it,
            so at this container width it renders cut off rather than edge-to-edge —
            dropped rather than shipped clipped. */}
        <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
          <section className="hero2_section">
            <div className="padding-global">
              <Padding space="Small (3rem)" />
              <div className="container-48rem">
                <div className="header">
                  <h1 className="heading-size-4rem">{t("produrable.hero.title")}</h1>
                  <div className="spacer-1x5rem spacer-mob-1rem" />
                  <p className="text-size-1x375rem text-wrap-balance">
                    {t("produrable.hero.dateLocation")}
                    <br />
                    {t("produrable.hero.stand")}
                  </p>
                  <div className="spacer-1x5rem spacer-mob-1rem" />
                  <div className="button-group">
                    <Button
                      text={t("produrable.ctaBlock.button")}
                      link={{ href: demoHref }}
                      variant="Primary"
                    />
                  </div>
                </div>
              </div>
              <Padding space="Small (3rem)" />
            </div>
            <div className="layer-4">
              <Background color="Primary" />
            </div>
          </section>
        </div>

        {/* 3. Workshops header */}
        <SectionFeaturesHeader
          title={t("produrable.workshops.title")}
          textVisibility={false}
        />

        {/* 4. Workshops — full-width text, not boxed into card components, so the
            long descriptions get room to breathe at the page's own typographic
            scale rather than a compact card's. */}
        <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
          <section className="generic_section">
            <div className="padding-global">
              <Padding space="Small (3rem)" />
              <div className="container-64rem">
                {/* Workshop 1 */}
                <Label label={t("produrable.workshops.card1.meta")} />
                <div className="spacer-1x5rem" />
                <h3 className="heading-size-3rem">{t("produrable.workshops.card1.title")}</h3>
                <div className="spacer-0x75rem" />
                <p className="text-size-1rem text-color-neutral">{t("produrable.workshops.card1.speakers")}</p>
                <div className="spacer-1x5rem" />
                <p className="text-size-1x375rem">{t("produrable.workshops.card1.intro")}</p>
                <div className="spacer-0x75rem" />
                <p className="text-size-1x375rem">▪︎ {t("produrable.workshops.card1.bullet1")}</p>
                <div className="spacer-0x75rem" />
                <p className="text-size-1x375rem">▪︎ {t("produrable.workshops.card1.bullet2")}</p>
                <div className="spacer-0x75rem" />
                <p className="text-size-1x375rem">▪︎ {t("produrable.workshops.card1.bullet3")}</p>
                <div className="spacer-1x5rem" />
                <p className="text-size-1x375rem">{t("produrable.workshops.card1.outro")}</p>

                <div className="spacer-6rem" />

                {/* Workshop 2 */}
                <Label label={t("produrable.workshops.card2.meta")} />
                <div className="spacer-1x5rem" />
                <h3 className="heading-size-3rem">{t("produrable.workshops.card2.title")}</h3>
                <div className="spacer-0x75rem" />
                <p className="text-size-1rem text-color-neutral">{t("produrable.workshops.card2.speakers")}</p>
                <div className="spacer-1x5rem" />
                <p className="text-size-1x375rem">{t("produrable.workshops.card2.intro")}</p>
                <div className="spacer-0x75rem" />
                <p className="text-size-1x375rem">▪︎ {t("produrable.workshops.card2.bullet1")}</p>
                <div className="spacer-0x75rem" />
                <p className="text-size-1x375rem">▪︎ {t("produrable.workshops.card2.bullet2")}</p>
                <div className="spacer-0x75rem" />
                <p className="text-size-1x375rem">▪︎ {t("produrable.workshops.card2.bullet3")}</p>
                <div className="spacer-1x5rem" />
                <p className="text-size-1x375rem">{t("produrable.workshops.card2.outro")}</p>
              </div>
              <Padding space="Small (3rem)" />
            </div>
            <div className="layer-4">
              <Background color="Secondary" />
            </div>
          </section>
        </div>

        {/* 5. Barometer teaser — a plain centered header, not a boxed callout,
            at the same generous scale as the rest of the page. */}
        <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
          <section className="generic_section">
            <div className="padding-global">
              <Padding space="Medium (6rem)" />
              <div className="container-55rem">
                <div className="header">
                  <Label label={t("produrable.barometer.label")} />
                  <div className="spacer-1x5rem" />
                  <p className="heading-size-2rem text-wrap-balance">{t("produrable.barometer.text")}</p>
                </div>
              </div>
              <Padding space="Medium (6rem)" />
            </div>
            <div className="layer-4">
              <Background color="Primary" />
            </div>
          </section>
        </div>

        {/* 6. Final CTA — same stand-meeting CTA as the hero */}
        <SectionCta
          title={t("produrable.ctaBlock.title")}
          paragraph={t("produrable.ctaBlock.paragraph")}
          buttonText={t("produrable.ctaBlock.button")}
          buttonLink={{ href: demoHref }}
        />

        <Footer />
      </main>
    </div>
  );
}
