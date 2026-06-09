import { getTestimonials } from "../lib/cms";
import { SectionTestimonialsI18n as SectionTestimonialsClient } from "./SectionTestimonialsI18n";

import type { SectionTestimonialsI18nProps } from "./SectionTestimonialsI18n";

export async function SectionTestimonials(props: Omit<SectionTestimonialsI18nProps, "serverTestimonials"> & { locale: string }) {
  const { locale, ...rest } = props;
  const testimonials = await getTestimonials(locale as "en" | "fr").catch(() => []);

  return (
    <SectionTestimonialsClient
      {...rest}
      serverTestimonials={testimonials || []}
    />
  );
}
