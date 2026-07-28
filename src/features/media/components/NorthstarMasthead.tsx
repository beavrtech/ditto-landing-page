import Link from "next/link";
import { t } from "../dictionary";
import { mediaPath } from "../lib/urls";
import type { MediaLocale } from "../data/taxonomy";
import { TAXONOMY, taxonomyLabel } from "../data/taxonomy";

/**
 * @param mirrorPath path of the current page relative to the media root
 *   (e.g. "/reach-2026" or ""), used to point the locale switch at the twin URL.
 */
export function NorthstarMasthead({
  locale,
  mirrorPath = "",
}: {
  locale: MediaLocale;
  mirrorPath?: string;
}) {
  const copy = t(locale);
  const other: MediaLocale = locale === "fr" ? "en" : "fr";

  return (
    <header className="ns-masthead">
      <div className="ns-wrap">
        <div className="ns-masthead-top">
          <Link href={mediaPath(locale)} className="ns-wordmark">
            <span className="ns-wordmark-name">Northstar</span>
            <span className="ns-wordmark-by">by Ditto</span>
          </Link>
          <nav className="ns-masthead-nav">
            {TAXONOMY.map((node) => (
              <Link key={node.slug} href={mediaPath(locale, `/theme/${node.slug}`)}>
                {taxonomyLabel(node, locale)}
              </Link>
            ))}
            <Link
              href={mediaPath(other, mirrorPath)}
              className="ns-locale-switch"
              hrefLang={other}
              aria-label={copy.switchLocaleLabel}
            >
              {copy.switchLocale}
            </Link>
          </nav>
        </div>
        <p className="ns-tagline">{copy.tagline}</p>
      </div>
    </header>
  );
}
