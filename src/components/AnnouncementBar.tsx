"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";

// Bump this id whenever the campaign/copy changes so dismissing an old
// announcement doesn't also suppress a future, unrelated one.
const ANNOUNCEMENT_ID = "esg-ai-barometer-2026-07";
const STORAGE_KEY = `ditto_announcement_dismissed_${ANNOUNCEMENT_ID}`;

/**
 * Sitewide, dismissible announcement bar rendered above the navbar on every
 * page (see src/app/[locale]/layout.tsx). Dismissal is persisted in
 * localStorage under a versioned key so it survives page loads/navigation
 * but doesn't hide a later, different announcement.
 */
export function AnnouncementBar() {
  const t = useTranslations("announcementBar");
  // Default to hidden: localStorage isn't available during SSR, and this
  // avoids a flash of the bar on every load for users who already dismissed it.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "1") {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  function handleDismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setVisible(false);
  }

  return (
    <div className="announcement-bar" role="region" aria-label={t("tag")}>
      <div className="announcement-bar_inner">
        <a
          className="announcement-bar_link"
          href={t("href")}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="announcement-bar_tag">{t("tag")}</span>
          <span className="announcement-bar_text">
            {t("message")} <span className="announcement-bar_arrow" aria-hidden="true">&rarr;</span>
          </span>
        </a>
        <button
          type="button"
          className="announcement-bar_close"
          aria-label={t("dismiss")}
          onClick={handleDismiss}
        >
          <X size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
