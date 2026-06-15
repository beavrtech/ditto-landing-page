/**
 * @file SectionTestimonialsI18n
 * i18n copy of the DevLink SectionTestimonials component.
 * Uses CSS scroll-snap instead of Splide for the carousel.
 */
"use client";

import { DEVLINK_SCOPE_CLASS } from "../../devlink/devlinkScope";
import Block from "../../devlink/modules/Basic/components/Block";
import Heading from "../../devlink/modules/Basic/components/Heading";
import Paragraph from "../../devlink/modules/Basic/components/Paragraph";
import Section from "../../devlink/modules/Layout/components/Section";
import { Background } from "../../devlink/Background";
import { Button } from "../../devlink/elements/Button";
import { CardTestimonial } from "../../devlink/elements/CardTestimonial";
import { Padding } from "../../devlink/Padding";

export type SectionTestimonialsI18nProps = {
  buttonLink?: {
    href: string;
    preload?: "prerender" | "prefetch" | "none";
    target?: "_self" | "_blank";
  };
  buttonText?: React.ReactNode;
  text?: React.ReactNode;
  title?: React.ReactNode;
  serverTestimonials?: any[];
};

export function SectionTestimonialsI18n({
  buttonLink = { href: "/en/customer-stories" },
  buttonText = "Read More",
  text = "Customers of all sizes love Ditto for its simplicity, smarts, and impact, above all.",
  title = "What teams are saying",
  serverTestimonials = [],
}: SectionTestimonialsI18nProps) {
  const testimonials = serverTestimonials;
  // Render the set twice so the marquee can loop seamlessly.
  const marqueeItems = testimonials.length > 0 ? [...testimonials, ...testimonials] : [];

  return (
    <div
      className={DEVLINK_SCOPE_CLASS}
      style={{ display: "contents" }}
    >
      <Section
        className={"carousel_section"}
        grid={{ type: "section" }}
        id={"w-node-_3bc96074-d8ef-94b2-8c5e-1514982ed182-982ed182"}
        tag={"section"}
      >
        <Block className={"padding-global"} tag={"div"}>
          <Padding space={"Medium (6rem)"} />
          <Block className={"container-48rem"} tag={"div"}>
            <Block className={"header"} tag={"div"}>
              <Heading className={"heading-size-3rem"} tag={"h2"}>
                {title}
              </Heading>
              <Block className={"spacer-1x5rem"} tag={"div"} />
              <Paragraph className={"text-size-1x375rem text-wrap-balance"}>
                {text}
              </Paragraph>
              <Block className={"spacer-1x5rem"} tag={"div"} />
              <Block tag={"div"}>
                <Button
                  arrow={false}
                  link={buttonLink}
                  text={buttonText}
                  variant={"Secondary"}
                />
              </Block>
            </Block>
          </Block>
          <Block className={"spacer-3rem"} tag={"div"} />
          {testimonials.length > 0 && (
            <div className="testimonials-marquee_viewport">
              <div className="testimonials-marquee">
                {marqueeItems.map((t, i) => (
                  <div
                    key={`${t.id}-${i}`}
                    className="testimonials-marquee_item"
                    aria-hidden={i >= testimonials.length ? true : undefined}
                  >
                    <CardTestimonial
                      testimonial={t.quote}
                      logo={t.logo_url || undefined}
                      authorAuthorName={<>{t.customer_name}{t.name ? `, ${t.name}` : ""}</>}
                      authorAuthorRole={t.job_title}
                      authorAuthorImage={t.profile_picture_url || undefined}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          <Padding space={"Medium (6rem)"} />
        </Block>
        <Block className={"layer-4"} tag={"div"}>
          <Background color={"Tertiary"} />
        </Block>
      </Section>
    </div>
  );
}

// Keep the same export name for compatibility
export { SectionTestimonialsI18n as SectionTestimonials };
