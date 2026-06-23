"use client";

import type React from "react";
import { useTranslations, useLocale } from "next-intl";
import { localizedHref, localizedCmsHref } from "../lib/localized-paths";
import { DEVLINK_SCOPE_CLASS } from "../../devlink/devlinkScope";
import Block from "../../devlink/modules/Basic/components/Block";
import Heading from "../../devlink/modules/Basic/components/Heading";
import Section from "../../devlink/modules/Layout/components/Section";
import { Background } from "../../devlink/Background";
import { Padding } from "../../devlink/Padding";
import { LogoTile } from "./LogoTile";
import { CUSTOMER_LOGOS_FALLBACK, type CustomerLogo } from "../lib/customer-logos";

type StorySlugMap = Record<string, { slug: string; slug_fr: string | null }>;

/** Split the flat (homepage-ordered) list into rows of at most ROW_SIZE. */
const ROW_SIZE = 6;
function chunkRows(logos: CustomerLogo[]): CustomerLogo[][] {
  const rows: CustomerLogo[][] = [];
  for (let i = 0; i < logos.length; i += ROW_SIZE) rows.push(logos.slice(i, i + ROW_SIZE));
  return rows;
}

export type SectionCustomerLogosProps = {
  /** Homepage customers (from the DB), already ordered. */
  serverCustomers?: CustomerLogo[];
  serverStorySlugMap?: StorySlugMap;
  afterContent?: React.ReactNode;
};

export function SectionCustomerLogos({
  serverCustomers,
  serverStorySlugMap = {},
  afterContent,
}: SectionCustomerLogosProps) {
  const t = useTranslations("socialProof");
  const locale = useLocale();

  // Resolve a logo's EN case-study path to the locale-correct customer-story URL.
  const caseStudyHref = (logo: CustomerLogo) => {
    if (!logo.caseStudyUrl) return null;
    const enSlug = logo.caseStudyUrl.split("/").pop() as string;
    const story = serverStorySlugMap[enSlug];
    return story
      ? localizedCmsHref("/customer-stories", story.slug, story.slug_fr, locale)
      : localizedHref(logo.caseStudyUrl, locale);
  };

  const renderLogo = (logo: CustomerLogo) => (
    <LogoTile
      key={logo.name}
      name={logo.name}
      logoUrl={logo.logo_url}
      smaller={logo.smaller}
      caseStudyHref={caseStudyHref(logo)}
      caseStudyLabel={t("caseStudy")}
    />
  );

  return (
    <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
      <Section className="logostrip_section" grid={{ type: "section" }} tag="section">
        <Block className="padding-global" tag="div">
          <Padding space="Small (3rem)" />
          <Block className="container-80rem" tag="div">
            <Block className="header" tag="div">
              <Heading className="text-size-1rem text-weight-400" tag="h2">
                {t("title")}
              </Heading>
            </Block>
            <Block className="spacer-2rem" tag="div" />
            <div className="customer-logos_rows">
              {chunkRows(serverCustomers?.length ? serverCustomers : CUSTOMER_LOGOS_FALLBACK).map(
                (row, i) => (
                  <div
                    key={i}
                    className="customer-logos_row"
                    id={i === 0 ? "customer-logos-primary-row" : undefined}
                  >
                    {row.map(renderLogo)}
                  </div>
                ),
              )}
            </div>
          </Block>
          {afterContent && (
            <div style={{ display: "flex", justifyContent: "center", paddingTop: "1.5rem" }}>
              {afterContent}
            </div>
          )}
          <Padding space="Small (3rem)" />
        </Block>
        <Block className="layer-4" tag="div">
          <Background color="Secondary" />
        </Block>
      </Section>
    </div>
  );
}
