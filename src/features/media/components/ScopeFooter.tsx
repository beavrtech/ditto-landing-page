import Link from "next/link";
import { t } from "../dictionary";
import { mediaPath, SITE_URL } from "../lib/urls";
import { TAXONOMY, taxonomyLabel, type MediaLocale } from "../data/taxonomy";

export function ScopeFooter({ locale }: { locale: MediaLocale }) {
  const copy = t(locale);
  const sitePrefix = locale === "fr" ? "/fr" : "/en";

  return (
    <footer className="ns-footer">
      <div className="ns-wrap">
        <div className="ns-footer-grid">
          <div>
            <p className="ns-wordmark-name">The Scope</p>
            <p className="ns-meta" style={{ marginTop: "0.5rem" }}>
              {copy.aboutLine}
            </p>
          </div>
          <div className="ns-footer-links">
            <p className="ns-kicker">{copy.themes}</p>
            {TAXONOMY.map((node) => (
              <Link key={node.slug} href={mediaPath(locale, `/theme/${node.slug}`)}>
                {taxonomyLabel(node, locale)}
              </Link>
            ))}
          </div>
          <div className="ns-footer-links">
            <p className="ns-kicker">Ditto</p>
            <a href={`${SITE_URL}${sitePrefix}`}>{copy.backToDitto}</a>
            <a href={`${SITE_URL}${sitePrefix}/legal/legal-notices`}>{copy.legal}</a>
            <a href={`${SITE_URL}${sitePrefix}/legal/privacy-policy`}>{copy.privacy}</a>
          </div>
        </div>
        <p className="ns-footer-bottom">
          © {new Date().getFullYear()} Ditto. The Scope.
        </p>
      </div>
    </footer>
  );
}
