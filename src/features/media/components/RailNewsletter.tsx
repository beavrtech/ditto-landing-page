"use client";

import { useState } from "react";
import posthog from "posthog-js";
import { t } from "../dictionary";
import { subscribe } from "../lib/subscribe";
import type { MediaLocale } from "../data/taxonomy";

/**
 * The article rail's standing offer. The Scope is a magazine, so the ask is to
 * keep reading rather than to book a demo: the newsletter is the only CTA an
 * article carries. The address is all it asks for — the preferences belong to
 * the home page box, and a rail that interrogated the reader mid-article would
 * not get filled in.
 */
export function RailNewsletter({ locale }: { locale: MediaLocale }) {
  const copy = t(locale);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "failed">("idle");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    const ok = await subscribe({ email, locale });
    setStatus(ok ? "done" : "failed");
    if (ok) {
      try {
        posthog.capture("newsletter_subscribed", { placement: "scope_article_rail" });
      } catch {}
    }
  };

  return (
    <section className="ns-rail-cta" aria-labelledby="ns-rail-cta-title">
      <p className="ns-kicker" id="ns-rail-cta-title">
        {copy.newsletterTitle}
      </p>
      <p className="ns-rail-cta-body">{copy.railNewsletterBody}</p>

      {status === "done" ? (
        <p className="ns-newsletter-note is-message" role="status">
          {copy.newsletterDone}
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            className="ns-input is-block"
            type="email"
            placeholder={copy.newsletterPlaceholder}
            aria-label={copy.newsletterTitle}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <button className="ns-button is-block" type="submit" disabled={status === "sending"}>
            {status === "sending" ? copy.newsletterSending : copy.newsletterCta}
          </button>
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
