"use client";

import { useRouter } from "next/navigation";
import { INDUSTRIES, taxonomyLabel, type MediaLocale } from "../data/taxonomy";
import { mediaPath } from "../lib/urls";
import { t } from "../dictionary";

/**
 * Compact industry picker in the masthead. Navigating rather than filtering
 * client-side keeps every industry on its own indexable path (robots.ts
 * disallows query-string URLs).
 */
export function IndustryDropdown({
  locale,
  current = "",
}: {
  locale: MediaLocale;
  current?: string;
}) {
  const router = useRouter();
  const copy = t(locale);

  return (
    <label className="ns-select-wrap">
      <span className="ns-select-label">{copy.industries}</span>
      <select
        className="ns-select"
        value={current}
        aria-label={copy.industries}
        onChange={(event) => {
          const value = event.target.value;
          router.push(value ? mediaPath(locale, `/industry/${value}`) : mediaPath(locale));
        }}
      >
        <option value="">{copy.allIndustries}</option>
        {INDUSTRIES.map((industry) => (
          <option key={industry.slug} value={industry.slug}>
            {taxonomyLabel(industry, locale)}
          </option>
        ))}
      </select>
    </label>
  );
}
