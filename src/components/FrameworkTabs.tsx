"use client";

import Link from "next/link";
import posthog from "posthog-js";

export type FrameworkCard = {
  key: string;
  name: string;
  urgency: string;
  href: string;
};

function ArrowUpRight() {
  return (
    <svg className="framework-chooser_arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/**
 * Flat 2×3 grid of framework cards for the homepage hero. No tabs.
 */
export function FrameworkGrid({ frameworks }: { frameworks: FrameworkCard[] }) {
  function handleTileClick(fw: FrameworkCard) {
    try {
      posthog.capture("framework_tile_clicked", { framework: fw.key });
    } catch {}
  }

  const rows = [frameworks.slice(0, 3), frameworks.slice(3)];

  return (
    <div className="framework-grid">
      {rows.map((row, i) => (
        <div key={i} className="framework-grid_row">
          {row.map((fw) => (
            <Link
              key={fw.key}
              href={fw.href}
              className="framework-chooser_card"
              onClick={() => handleTileClick(fw)}
            >
              <span className="framework-chooser_name">
                {fw.name}
                <ArrowUpRight />
              </span>
              <span className="framework-chooser_urgency">{fw.urgency}</span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
