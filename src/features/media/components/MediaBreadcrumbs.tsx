import Link from "next/link";
import { Fragment } from "react";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "../lib/jsonld";
import { mediaPath, mediaUrl } from "../lib/urls";
import { t } from "../dictionary";
import type { MediaLocale } from "../data/taxonomy";

export interface Crumb {
  name: string;
  /** Path relative to the media root, e.g. "/theme/rse". Omit for the current page. */
  path?: string;
}

export function MediaBreadcrumbs({
  locale,
  crumbs,
}: {
  locale: MediaLocale;
  crumbs: Crumb[];
}) {
  const copy = t(locale);
  const all: Crumb[] = [{ name: copy.backToScope, path: "" }, ...crumbs];

  return (
    <nav className="ns-breadcrumbs" aria-label="Breadcrumb">
      <div className="ns-wrap">
        {all.map((crumb, index) => (
          <Fragment key={`${crumb.name}-${index}`}>
            {index > 0 ? <span className="ns-sep">/</span> : null}
            {crumb.path !== undefined ? (
              <Link href={mediaPath(locale, crumb.path)}>{crumb.name}</Link>
            ) : (
              <span>{crumb.name}</span>
            )}
          </Fragment>
        ))}
      </div>
      <JsonLd
        data={breadcrumbJsonLd(
          all.map((crumb) => ({
            name: crumb.name,
            url: crumb.path !== undefined ? mediaUrl(locale, crumb.path) : undefined,
          }))
        )}
      />
    </nav>
  );
}
