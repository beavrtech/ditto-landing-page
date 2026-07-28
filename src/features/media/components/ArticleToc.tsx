import type { TocEntry } from "../lib/toc";
import { t } from "../dictionary";
import type { MediaLocale } from "../data/taxonomy";

/** Rail version: a plain list, sticky via its container. */
export function ArticleToc({
  entries,
  locale,
}: {
  entries: TocEntry[];
  locale: MediaLocale;
}) {
  if (entries.length < 2) return null;
  const copy = t(locale);
  return (
    <nav className="ns-toc" aria-labelledby="ns-toc-title">
      <p className="ns-kicker" id="ns-toc-title">
        {copy.onThisPage}
      </p>
      <ol className="ns-toc-list">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a href={`#${entry.id}`}>{entry.label}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Narrow-screen version: the rail has nowhere to go, so the same list collapses
 * into an accordion above the article rather than disappearing.
 */
export function ArticleTocCollapsible({
  entries,
  locale,
}: {
  entries: TocEntry[];
  locale: MediaLocale;
}) {
  if (entries.length < 2) return null;
  const copy = t(locale);
  return (
    <details className="ns-toc-collapsible">
      <summary>{copy.onThisPage}</summary>
      <ol className="ns-toc-list">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a href={`#${entry.id}`}>{entry.label}</a>
          </li>
        ))}
      </ol>
    </details>
  );
}
