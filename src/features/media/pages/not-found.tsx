import Link from "next/link";
import { MediaShell } from "../components/MediaShell";
import { mediaPath } from "../lib/urls";
import { t } from "../dictionary";
import type { MediaLocale } from "../data/taxonomy";

export function MediaNotFound({ locale }: { locale: MediaLocale }) {
  const copy = t(locale);
  return (
    <MediaShell locale={locale}>
      <div className="ns-wrap ns-notfound">
        <h1>{copy.notFoundTitle}</h1>
        <p className="ns-dek" style={{ marginTop: "1rem" }}>
          {copy.notFoundBody}
        </p>
        <p style={{ marginTop: "1.5rem" }}>
          <Link href={mediaPath(locale)}>{copy.backToNorthstar}</Link>
        </p>
      </div>
    </MediaShell>
  );
}
