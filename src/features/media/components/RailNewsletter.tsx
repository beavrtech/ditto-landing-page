import { t } from "../dictionary";
import type { MediaLocale } from "../data/taxonomy";

/**
 * The article rail's standing offer. Northstar is a magazine, so the ask is to
 * keep reading rather than to book a demo: the newsletter is the only CTA an
 * article carries. Design-only until a list is wired up.
 */
export function RailNewsletter({ locale }: { locale: MediaLocale }) {
  const copy = t(locale);
  return (
    <section className="ns-rail-cta" aria-labelledby="ns-rail-cta-title">
      <p className="ns-kicker" id="ns-rail-cta-title">
        {copy.newsletterTitle}
      </p>
      <p className="ns-rail-cta-body">{copy.railNewsletterBody}</p>
      <input
        className="ns-input is-block"
        type="email"
        placeholder={copy.newsletterPlaceholder}
        aria-label={copy.newsletterTitle}
        disabled
      />
      <button className="ns-button is-block" type="button" disabled>
        {copy.newsletterCta}
      </button>
      <p className="ns-newsletter-note">{copy.newsletterSoon}</p>
    </section>
  );
}
