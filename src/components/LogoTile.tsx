import type React from "react";

export type LogoTileProps = {
  name: string;
  logoUrl: string;
  smaller?: boolean;
  /** Locale-resolved customer-story URL. When set, the tile becomes a link. */
  caseStudyHref?: string | null;
  /** Translated "Case study" label. */
  caseStudyLabel?: string;
};

const ChevronRight = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M4.14645 2.64645C4.34171 2.45118 4.65829 2.45118 4.85355 2.64645L7.85355 5.64645C8.04882 5.84171 8.04882 6.15829 7.85355 6.35355L4.85355 9.35355C4.65829 9.54882 4.34171 9.54882 4.14645 9.35355C3.95118 9.15829 3.95118 8.84171 4.14645 8.64645L6.79289 6L4.14645 3.35355C3.95118 3.15829 3.95118 2.84171 4.14645 2.64645Z" fill="currentColor" />
  </svg>
);

/**
 * A logo in a fixed-size container with an optional case-study link.
 * The case-study tile is absolutely positioned at the bottom, so the logo
 * stays put whether or not a case study exists (no layout shift between tiles).
 * Linked tiles change background on hover.
 */
export function LogoTile({ name, logoUrl, smaller, caseStudyHref, caseStudyLabel }: LogoTileProps) {
  const logo = (
    <span className="logo-tile_logo-wrapper">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoUrl}
        alt={name}
        className={`logo-tile_logo${smaller ? " is-smaller" : ""}`}
        loading="lazy"
      />
    </span>
  );

  if (!caseStudyHref) {
    return <div className="logo-tile">{logo}</div>;
  }

  return (
    <a
      href={caseStudyHref}
      className="logo-tile logo-tile--link"
      aria-label={caseStudyLabel ? `${name} — ${caseStudyLabel}` : name}
    >
      {logo}
      <span className="logo-tile_casestudy">
        {caseStudyLabel}
        <ChevronRight />
      </span>
    </a>
  );
}
