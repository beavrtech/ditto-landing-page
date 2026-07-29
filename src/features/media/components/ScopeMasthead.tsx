import Link from "next/link";
import { t } from "../dictionary";
import { mediaPath } from "../lib/urls";
import { IndustryDropdown } from "./IndustryDropdown";
import { TAXONOMY, taxonomyLabel, type MediaLocale } from "../data/taxonomy";

/**
 * @param mirrorPath path of the current page relative to the media root
 *   (e.g. "/reach-2026" or ""), used for the locale switch and to work out
 *   which level-1 theme and which industry are currently selected.
 */
export function ScopeMasthead({
  locale,
  mirrorPath = "",
}: {
  locale: MediaLocale;
  mirrorPath?: string;
}) {
  const copy = t(locale);
  const other: MediaLocale = locale === "fr" ? "en" : "fr";

  const segments = mirrorPath.split("/").filter(Boolean);
  const activeTheme = segments[0] === "theme" ? segments[1] : undefined;
  const activeIndustry = segments[0] === "industry" ? segments[1] : undefined;
  // The home page and theme pages carry a filterable list; everywhere else the
  // picker navigates instead.
  const pickerMode = mirrorPath === "" || segments[0] === "theme" ? "filter" : "navigate";

  return (
    <header className="ns-masthead">
      <div className="ns-wrap">
        <div className="ns-masthead-top">
          <div className="ns-masthead-identity">
            {/* Stacked two-line nameplate on the yellow plate, The Economist way. */}
            <Link href={mediaPath(locale)} className="ns-wordmark">
              <span className="ns-wordmark-name">
                <span className="ns-wordmark-line">The</span>
                <span className="ns-wordmark-line">Scope</span>
              </span>
            </Link>
            <p className="ns-tagline">{copy.tagline}</p>
          </div>
          <div className="ns-masthead-actions">
            <Link href={mediaPath(locale, "/about")} className="ns-about-link">
              {copy.aboutUs}
            </Link>
            <Link
              href={mediaPath(other, mirrorPath)}
              className="ns-locale-switch"
              hrefLang={other}
              aria-label={copy.switchLocaleLabel}
            >
              {copy.switchLocale}
            </Link>
          </div>
        </div>
        <div className="ns-masthead-bottom">
          <nav className="ns-masthead-nav" aria-label={copy.themes}>
            {TAXONOMY.map((node) => (
              <Link
                key={node.slug}
                href={mediaPath(locale, `/theme/${node.slug}`)}
                className="ns-nav-theme"
                aria-current={activeTheme === node.slug ? "page" : undefined}
              >
                {taxonomyLabel(node, locale)}
              </Link>
            ))}
          </nav>
          <IndustryDropdown locale={locale} mode={pickerMode} current={activeIndustry ?? ""} />
        </div>
      </div>
    </header>
  );
}
