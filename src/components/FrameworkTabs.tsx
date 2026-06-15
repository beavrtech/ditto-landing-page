"use client";

import { useState } from "react";
import Link from "next/link";

export type FrameworkCard = {
  key: string;
  name: string;
  urgency: string;
  cta: string;
  href: string;
};

export type FrameworkTab = {
  key: string;
  label: string;
  frameworks: FrameworkCard[];
};

/**
 * Client tab switcher for the homepage launchpad. A segmented control flips the
 * card grid between categories (Sustainability / Quality); each card routes
 * straight into its product-specific framework page.
 */
export function FrameworkTabs({ tabs }: { tabs: FrameworkTab[] }) {
  const [active, setActive] = useState(tabs[0]?.key);
  const current = tabs.find((t) => t.key === active) ?? tabs[0];

  return (
    <div className="framework-tabs">
      <div className="framework-tabs_list" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={tab.key === active}
            className={`framework-tabs_tab${
              tab.key === active ? " is-active" : ""
            }`}
            onClick={() => setActive(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="framework-tabs_panel" role="tabpanel">
        <div className="framework-tabs_grid">
          {current?.frameworks.map((fw) => (
            <Link key={fw.key} href={fw.href} className="framework-chooser_card">
              <span className="framework-chooser_name">
                {fw.name}
                <span aria-hidden="true" className="framework-chooser_arrow">
                  ↗
                </span>
              </span>
              <span className="framework-chooser_urgency">{fw.urgency}</span>
              <span className="framework-chooser_cta">{fw.cta}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
