import Link from "next/link";
import { INDUSTRIES, taxonomyLabel, type MediaLocale } from "../data/taxonomy";
import { mediaPath } from "../lib/urls";
import { t } from "../dictionary";

export function IndustrySelector({
  locale,
  current,
}: {
  locale: MediaLocale;
  current?: string;
}) {
  const copy = t(locale);
  return (
    <nav className="ns-industries" aria-label={copy.industries}>
      <div className="ns-wrap">
        <div className="ns-industries-inner">
          <span className="ns-industry-label">{copy.industries}</span>
          {INDUSTRIES.map((industry) => (
            <Link
              key={industry.slug}
              href={mediaPath(locale, `/industry/${industry.slug}`)}
              className="ns-industry-link"
              aria-current={current === industry.slug ? "page" : undefined}
            >
              {taxonomyLabel(industry, locale)}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
