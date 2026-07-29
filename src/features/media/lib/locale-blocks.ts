import type { MediaLocale } from "../data/taxonomy";

export const MEDIA_LOCALES: MediaLocale[] = ["en", "fr"];

/**
 * Bilingual files keep both bodies in one place, each introduced by a locale
 * marker. The marker is an HTML comment on purpose: MDX rejects HTML comments,
 * so a marker can never collide with real content.
 */
const LOCALE_MARKER = /^<!--\s*locale:(en|fr)\s*-->$/gm;

export function splitByLocale(content: string, file: string): Record<MediaLocale, string> {
  const markers = [...content.matchAll(LOCALE_MARKER)];
  if (!markers.length) {
    throw new Error(
      `Invalid ${file}: no locale markers. Each body must be introduced by "<!-- locale:en -->" or "<!-- locale:fr -->".`
    );
  }
  const bodies = {} as Record<MediaLocale, string>;
  markers.forEach((marker, index) => {
    const locale = marker[1] as MediaLocale;
    const start = marker.index! + marker[0].length;
    const end = index + 1 < markers.length ? markers[index + 1].index! : content.length;
    bodies[locale] = content.slice(start, end).trim();
  });
  for (const locale of MEDIA_LOCALES) {
    if (!bodies[locale]) {
      throw new Error(`Invalid ${file}: missing or empty "<!-- locale:${locale} -->" body.`);
    }
  }
  return bodies;
}
