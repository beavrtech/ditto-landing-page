"use client";

import { useState } from "react";
import Link from "next/link";
import { t } from "../dictionary";
import { mediaPath } from "../lib/urls";
import type { MediaLocale } from "../data/taxonomy";

const FEEDBACK_EMAIL = "etienne@trustditto.com";

/** Yellow strip above the masthead, announcing the beta and the daily cadence. */
export function BetaBanner({
  locale,
  mirrorPath = "",
}: {
  locale: MediaLocale;
  mirrorPath?: string;
}) {
  const copy = t(locale);
  const [copied, setCopied] = useState(false);
  // No point pointing at About us from the About us page itself.
  const showLink = mirrorPath !== "/about";

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(FEEDBACK_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context or denied permission): leave the
      // address on screen rather than claiming a copy that did not happen.
    }
  };

  return (
    <div className="ns-beta">
      <div className="ns-wrap ns-beta-inner">
        <span className="ns-beta-flag">{copy.betaFlag}</span>
        <p className="ns-beta-text">
          {copy.betaBody}
          {showLink && (
            <>
              {" "}
              <Link href={mediaPath(locale, "/about")} className="ns-beta-link">
                {copy.betaLink}
              </Link>
              .
            </>
          )}{" "}
          {copy.betaFeedback}{" "}
          <button type="button" className="ns-beta-email" onClick={copyEmail} aria-live="polite">
            {copied ? copy.betaCopied : FEEDBACK_EMAIL}
          </button>
          .
        </p>
      </div>
    </div>
  );
}
