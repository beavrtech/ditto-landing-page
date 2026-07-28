"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { INDUSTRIES, taxonomyLabel, type MediaLocale } from "../data/taxonomy";
import { mediaPath } from "../lib/urls";
import { t } from "../dictionary";

/**
 * Two behaviours, because industry is both a place and a lens.
 *
 * "filter" — on the home page and theme pages, choosing an industry sets
 * `?industry=` and narrows the list in place, so it composes with whatever
 * theme you are reading. Read on the client, so the page stays static.
 *
 * "navigate" — everywhere else there is nothing to narrow, so it goes to that
 * industry's own page.
 */
export type IndustryPickerMode = "filter" | "navigate";

function Picker({
  locale,
  mode,
  current,
}: {
  locale: MediaLocale;
  mode: IndustryPickerMode;
  current: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const copy = t(locale);
  const selected = mode === "filter" ? params.get("industry") ?? "" : current;

  const onChange = (value: string) => {
    if (mode === "filter") {
      router.replace(value ? `${pathname}?industry=${value}` : pathname, { scroll: false });
      return;
    }
    router.push(mediaPath(locale, value ? `/industry/${value}` : ""));
  };

  return (
    <label className="ns-select-wrap">
      <span className="ns-select-label">{copy.industries}</span>
      <select
        className="ns-select"
        value={selected}
        aria-label={copy.industries}
        onChange={(event) => onChange(event.target.value)}
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

export function IndustryDropdown(props: {
  locale: MediaLocale;
  mode: IndustryPickerMode;
  current?: string;
}) {
  // Same reason as the article grid: useSearchParams must sit under a boundary
  // or the route stops being statically rendered.
  return (
    <Suspense fallback={<span className="ns-select-wrap" aria-hidden />}>
      <Picker locale={props.locale} mode={props.mode} current={props.current ?? ""} />
    </Suspense>
  );
}
