import { getTestimonials } from "../lib/cms";
import { SectionTestimonialsI18n as SectionTestimonialsClient } from "./SectionTestimonialsI18n";
import { getLocale } from "next-intl/server";

import type { SectionTestimonialsI18nProps } from "./SectionTestimonialsI18n";

export async function SectionTestimonials(props: Omit<SectionTestimonialsI18nProps, "serverTestimonials">) {
  const locale = await getLocale();
  const testimonials = await getTestimonials(locale as "en" | "fr").catch(() => []);

  return (
    <SectionTestimonialsClient
      {...props}
      serverTestimonials={testimonials || []}
    />
  );
}
