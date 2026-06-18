/**
 * @file SectionTestimonialsI18n
 * i18n copy of the DevLink SectionTestimonials component.
 * Uses CSS scroll-snap instead of Splide for the carousel.
 */
"use client";

import { useCallback, useEffect, useRef } from "react";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);
  const isPaused = useRef(false);
  const autoScrollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const AUTO_SCROLL_INTERVAL_MS = 4000;

  const getScrollUnit = useCallback(() => {
    if (!scrollRef.current) return 400;
    const card = scrollRef.current.querySelector(".card-testimonial");
    return (card?.getBoundingClientRect().width || 400) + 48;
  }, []);

  const scroll = useCallback(
    (direction: "left" | "right") => {
      const container = scrollRef.current;
      if (!container) return;
      const scrollAmount = getScrollUnit();
      container.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    },
    [getScrollUnit],
  );

  const advanceOrLoop = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (container.scrollLeft >= maxScroll - 2) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      scroll("right");
    }
  }, [scroll]);

  // Auto-scroll interval
  useEffect(() => {
    if (testimonials.length === 0) return;

    const start = () => {
      if (autoScrollTimer.current) return;
      autoScrollTimer.current = setInterval(() => {
        if (!isPaused.current) advanceOrLoop();
      }, AUTO_SCROLL_INTERVAL_MS);
    };

    start();

    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
        autoScrollTimer.current = null;
      }
    };
  }, [testimonials, advanceOrLoop]);

  const pauseAutoScroll = useCallback(() => {
    isPaused.current = true;
  }, []);

  const resumeAutoScroll = useCallback(() => {
    isPaused.current = false;
  }, []);

  // Drag to scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      startX.current = e.pageX - el.offsetLeft;
      scrollLeftPos.current = el.scrollLeft;
      el.style.cursor = "grabbing";
      pauseAutoScroll();
    };
    const onMouseUp = () => {
      isDragging.current = false;
      el.style.cursor = "grab";
      resumeAutoScroll();
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX.current) * 1.5;
      el.scrollLeft = scrollLeftPos.current - walk;
    };

    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseUp);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseUp);
    };
  }, [testimonials, pauseAutoScroll, resumeAutoScroll]);

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
          <Block className={"container-84rem"} tag={"div"}>
            {testimonials.length > 0 && (
              <div style={{ position: "relative" }}>
                {/* Scroll container */}
                <div
                  ref={scrollRef}
                  className="testimonials-scroll"
                  onMouseEnter={pauseAutoScroll}
                  onMouseLeave={resumeAutoScroll}
                  onTouchStart={pauseAutoScroll}
                  onTouchEnd={resumeAutoScroll}
                  style={{
                    display: "flex",
                    gap: "3rem",
                    overflowX: "auto",
                    scrollSnapType: "x mandatory",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none" as any,
                    WebkitOverflowScrolling: "touch",
                    paddingBottom: "1rem",
                    cursor: "grab",
                    userSelect: "none",
                  }}
                >
                  <style>{`.testimonials-scroll::-webkit-scrollbar { display: none; }`}</style>
                  {testimonials.map((t) => (
                    <div
                      key={t.id}
                      style={{
                        flex: "0 0 auto",
                        scrollSnapAlign: "start",
                        display: "flex",
                        alignItems: "stretch",
                      }}
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
                {/* Navigation arrows */}
                <div className="carousel_navigation_wrapper">
                  <button
                    className="carousel_navigation_button_left"
                    onClick={() => scroll("left")}
                  >
                    <div className="icon-wrapper">
                      <div className="icon w-embed" dangerouslySetInnerHTML={{ __html: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(180deg)"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.29289 5.29289C8.68342 4.90237 9.31658 4.90237 9.70711 5.29289L15.7071 11.2929C16.0976 11.6834 16.0976 12.3166 15.7071 12.7071L9.70711 18.7071C9.31658 19.0976 8.68342 19.0976 8.29289 18.7071C7.90237 18.3166 7.90237 17.6834 8.29289 17.2929L13.5858 12L8.29289 6.70711C7.90237 6.31658 7.90237 5.68342 8.29289 5.29289Z" fill="currentColor"/></svg>' }} />
                    </div>
                  </button>
                  <button
                    className="carousel_navigation_button_right"
                    onClick={() => scroll("right")}
                  >
                    <div className="icon-wrapper">
                      <div className="icon w-embed" dangerouslySetInnerHTML={{ __html: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.29289 5.29289C8.68342 4.90237 9.31658 4.90237 9.70711 5.29289L15.7071 11.2929C16.0976 11.6834 16.0976 12.3166 15.7071 12.7071L9.70711 18.7071C9.31658 19.0976 8.68342 19.0976 8.29289 18.7071C7.90237 18.3166 7.90237 17.6834 8.29289 17.2929L13.5858 12L8.29289 6.70711C7.90237 6.31658 7.90237 5.68342 8.29289 5.29289Z" fill="currentColor"/></svg>' }} />
                    </div>
                  </button>
                </div>
              </div>
            )}
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

// Keep the same export name for compatibility
export { SectionTestimonialsI18n as SectionTestimonials };
