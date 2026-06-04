/**
 * @file SectionTestimonialsI18n
 * i18n copy of the Webflow SectionTestimonials component.
 * Replaces NotSupported Collection List with real testimonials from Supabase.
 */
"use client";

import { useEffect, useState, useRef } from "react";
import { useLocale } from "next-intl";
import "@splidejs/splide/css/core";
import { getTestimonials } from "../lib/cms";

import { DEVLINK_SCOPE_CLASS } from "../../webflow/devlinkScope";
import Block from "../../webflow/webflow_modules/Basic/components/Block";
import Heading from "../../webflow/webflow_modules/Basic/components/Heading";
import Paragraph from "../../webflow/webflow_modules/Basic/components/Paragraph";
import Section from "../../webflow/webflow_modules/Layout/components/Section";
import { Background } from "../../webflow/Background";
import { Button } from "../../webflow/elements/Button";
import { CardTestimonial } from "../../webflow/elements/CardTestimonial";
import { CarouselButtonNext } from "../../webflow/elements/CarouselButtonNext";
import { CarouselButtonPrevious } from "../../webflow/elements/CarouselButtonPrevious";
import { Padding } from "../../webflow/Padding";

/**
 * Props for {@link SectionTestimonialsI18n}
 */
export type SectionTestimonialsI18nProps = {
  buttonLink?: {
    href: string;
    preload?: "prerender" | "prefetch" | "none";
    target?: "_self" | "_blank";
  };
  buttonText?: React.ReactNode;
  text?: React.ReactNode;
  title?: React.ReactNode;
};

export function SectionTestimonialsI18n({
  buttonLink = {
    href: "/en/customer-stories",
  },
  buttonText = "Read More",
  text = "Customers of all sizes love Ditto for its simplicity, smarts, and impact, above all.",
  title = "What teams are saying",
}: SectionTestimonialsI18nProps) {
  const locale = useLocale() as "en" | "fr";
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const splideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getTestimonials(locale).then((data) => {
      if (data) setTestimonials(data);
    });
  }, [locale]);

  useEffect(() => {
    if (testimonials.length === 0) return;

    let splideInstance: any = null;

    async function initSplide() {
      const { default: Splide } = await import("@splidejs/splide");

      if (splideRef.current) {
        const el = splideRef.current.querySelector(".splide");
        if (el && !(el as any).__splide) {
          splideInstance = new Splide(el as HTMLElement, {
            type: "loop",
            autoWidth: true,
            gap: "3rem",
            arrows: false,
            pagination: false,
            drag: true,
            breakpoints: {
              991: { gap: "1.5rem" },
              479: { gap: "1rem" },
            },
          });
          splideInstance.mount();
          (el as any).__splide = true;
        }
      }
    }

    initSplide();

    return () => {
      if (splideInstance) {
        try {
          splideInstance.destroy();
        } catch {}
      }
    };
  }, [testimonials]);

  return (
    <div
      className={DEVLINK_SCOPE_CLASS}
      style={{
        display: "contents",
      }}
      ref={splideRef}
    >
      <Section
        className={"carousel_section"}
        grid={{
          type: "section",
        }}
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
          <Block className={"container-84rem"} tag={"div"}>
            <Block
              className={"carousel_component"}
              // @ts-ignore - User-defined custom attribute(s)
              splide={"carousel"}
              splide-direction={"ltr"}
              splide-gap={"3rem"}
              splide-gap-mobile={"1rem"}
              splide-interval={"5000"}
              tag={"div"}
            >
              <Block className={"carousel_splide_wrapper"} tag={"div"}>
                <Block className={"carousel_splide splide"} tag={"div"}>
                  <Block
                    className={"carousel_track splide__track"}
                    tag={"div"}
                  >
                    <Block
                      className={"carousel_list splide__list"}
                      tag={"div"}
                    >
                      {testimonials.map((t) => (
                        <Block
                          key={t.id}
                          className={"carousel_slide splide__slide"}
                          tag={"div"}
                        >
                          <CardTestimonial
                            testimonial={t.quote}
                            logo={t.logo_url}
                            authorAuthorName={t.name}
                            authorAuthorRole={t.job_title}
                            authorAuthorImage={t.profile_picture_url}
                          />
                        </Block>
                      ))}
                    </Block>
                  </Block>
                </Block>
                <Block className={"carousel_navigation_wrapper"} tag={"div"}>
                  <CarouselButtonPrevious />
                  <CarouselButtonNext />
                </Block>
              </Block>
              <Block className={"spacer-1x5rem"} tag={"div"} />
              <Block className={"carousel_pagination_list"} tag={"div"}>
                <Block
                  className={"carousel_pagination_button"}
                  splide-button={"pagination"}
                  tag={"div"}
                />
                <Block
                  className={"carousel_pagination_button is-active"}
                  tag={"div"}
                />
              </Block>
            </Block>
          </Block>
          <Padding space={"Medium (6rem)"} />
        </Block>
        <Block className={"layer-4"} tag={"div"}>
          <Background color={"Tertiary"} />
        </Block>
      </Section>
    </div>
  );
}
