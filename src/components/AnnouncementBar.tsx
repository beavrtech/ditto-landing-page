"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

/**
 * Sitewide announcement bar rendered above the navbar on every page (see
 * src/app/[locale]/layout.tsx). Always renders once mounted — there is no
 * dismissal state.
 */
export function AnnouncementBar() {
  const t = useTranslations("announcementBar");
  // Default to hidden, then reveal on mount. This keeps the bar's
  // client-mount pattern consistent with the rest of the app and avoids any
  // SSR/CSR markup flash.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  if (!visible) return null;

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
            {t("message")}{" "}
            <span className="announcement-bar_arrow" aria-hidden="true">
              &rarr;
            </span>
          </span>
        </a>
      </div>
    </div>
  );
}
