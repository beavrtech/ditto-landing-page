"use client";

import { useState } from "react";
import { t } from "../dictionary";
import { TAXONOMY, INDUSTRIES, taxonomyLabel, type MediaLocale } from "../data/taxonomy";

/**
 * Design-only for now: the preferences are real UI state, but nothing is
 * submitted until a list is wired up.
 */
export function NewsletterBox({ locale }: { locale: MediaLocale }) {
  const copy = t(locale);
  const [themes, setThemes] = useState<string[]>(TAXONOMY.map((node) => node.slug));
  const [industry, setIndustry] = useState("");

  const toggleTheme = (slug: string) => {
    setThemes((current) =>
      current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug]
    );
  };

  return (
    <section className="ns-newsletter" aria-labelledby="ns-newsletter-title">
      <h2 className="ns-newsletter-title" id="ns-newsletter-title">
        {copy.newsletterTitle}
      </h2>
      <p className="ns-newsletter-body">{copy.newsletterBody}</p>

      <fieldset className="ns-field">
        <legend className="ns-field-label">{copy.newsletterThemes}</legend>
        <div className="ns-toggles">
          {TAXONOMY.map((node) => (
            <button
              key={node.slug}
              type="button"
              className="ns-toggle"
              aria-pressed={themes.includes(node.slug)}
              onClick={() => toggleTheme(node.slug)}
            >
              {taxonomyLabel(node, locale)}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="ns-field">
        <label className="ns-field-label" htmlFor="ns-newsletter-industry">
          {copy.newsletterIndustry}
        </label>
        <select
          id="ns-newsletter-industry"
          className="ns-select is-block"
          value={industry}
          onChange={(event) => setIndustry(event.target.value)}
        >
          <option value="">{copy.allIndustries}</option>
          {INDUSTRIES.map((item) => (
            <option key={item.slug} value={item.slug}>
              {taxonomyLabel(item, locale)}
            </option>
          ))}
        </select>
      </div>

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
    </section>
  );
}
