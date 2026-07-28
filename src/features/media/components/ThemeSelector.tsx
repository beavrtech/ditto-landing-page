"use client";

import { useState, type ReactNode } from "react";

/**
 * Level-1 theme tabs on the home page. State stays client-side so no
 * query-string URLs are created (robots.txt disallows "/*?*").
 */
export function ThemeSelector({
  tabs,
}: {
  tabs: { slug: string; label: string; panel: ReactNode }[];
}) {
  const [active, setActive] = useState(tabs[0]?.slug);

  return (
    <div>
      <div className="ns-tabs" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.slug}
            type="button"
            role="tab"
            id={`ns-tab-${tab.slug}`}
            aria-selected={active === tab.slug}
            aria-controls={`ns-panel-${tab.slug}`}
            className="ns-tab"
            onClick={() => setActive(tab.slug)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.slug}
          role="tabpanel"
          id={`ns-panel-${tab.slug}`}
          aria-labelledby={`ns-tab-${tab.slug}`}
          hidden={active !== tab.slug}
        >
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
