import { t } from "../dictionary";
import type { MediaLocale } from "../data/taxonomy";

/**
 * Design-only for now: the field and button are inert until a list is wired up.
 */
export function NewsletterBox({ locale }: { locale: MediaLocale }) {
  const copy = t(locale);
  return (
    <section className="ns-newsletter">
      <div>
        <h2 className="ns-section-title">{copy.newsletterTitle}</h2>
        <p className="ns-meta" style={{ marginTop: "0.75rem" }}>
          {copy.newsletterBody}
        </p>
      </div>
      <div>
        <div className="ns-newsletter-form">
          <input
            className="ns-input"
            type="email"
            placeholder={copy.newsletterPlaceholder}
            aria-label={copy.newsletterTitle}
            disabled
          />
          <button className="ns-button" type="button" disabled>
            {copy.newsletterCta}
          </button>
        </div>
        <p className="ns-newsletter-note">{copy.newsletterSoon}</p>
      </div>
    </section>
  );
}
