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
import {
  CUSTOMER_LOGOS_PRIMARY,
  CUSTOMER_LOGOS_SECONDARY,
  type CustomerLogo,
} from "../lib/customer-logos";

type StorySlugMap = Record<string, { slug: string; slug_fr: string | null }>;

export type SectionCustomerLogosProps = {
  serverStorySlugMap?: StorySlugMap;
  afterContent?: React.ReactNode;
};

export function SectionCustomerLogos({
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
              <div className="customer-logos_row" id="customer-logos-primary-row">
                {CUSTOMER_LOGOS_PRIMARY.map(renderLogo)}
              </div>
              <div className="customer-logos_row">
                {CUSTOMER_LOGOS_SECONDARY.map(renderLogo)}
              </div>
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
