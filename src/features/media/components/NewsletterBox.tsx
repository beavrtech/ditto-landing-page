"use client";

import { useState } from "react";
import posthog from "posthog-js";
import { t } from "../dictionary";
import { subscribe } from "../lib/subscribe";
import { TAXONOMY, INDUSTRIES, taxonomyLabel, type MediaLocale } from "../data/taxonomy";

/**
 * The full sign-up: the pillars the reader wants and their industry travel
 * with the address, because the channel that receives it needs to know what
 * was asked for, not just who asked.
 */
export function NewsletterBox({ locale }: { locale: MediaLocale }) {
  const copy = t(locale);
  const [themes, setThemes] = useState<string[]>(TAXONOMY.map((node) => node.slug));
  const [industry, setIndustry] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "failed">("idle");

  const toggleTheme = (slug: string) => {
    setThemes((current) =>
      current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug]
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    const ok = await subscribe({ email, themes, industry, locale });
    setStatus(ok ? "done" : "failed");
    if (ok) {
      try {
        posthog.capture("newsletter_subscribed", {
          placement: "scope_home",
          themes,
          industry: industry || null,
        });
      } catch {}
    }
  };

  return (
    <section className="ns-newsletter" aria-labelledby="ns-newsletter-title">
      <h2 className="ns-newsletter-title" id="ns-newsletter-title">
        {copy.newsletterTitle}
      </h2>
      <p className="ns-newsletter-body">{copy.newsletterBody}</p>

      {status === "done" ? (
        <p className="ns-newsletter-note is-message" role="status">
          {copy.newsletterDone}
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
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
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button className="ns-button" type="submit" disabled={status === "sending"}>
              {status === "sending" ? copy.newsletterSending : copy.newsletterCta}
            </button>
          </div>

          {status === "failed" ? (
            <p className="ns-newsletter-note is-message" role="alert">
              {copy.newsletterFailed}
            </p>
          ) : null}
        </form>
      )}
    </section>
  );
}
