"use client";

import { useState } from "react";

type TocItem = { id: string; text: string; level: 2 | 3 };

export function CollapsibleToc({ items, locale }: { items: TocItem[]; locale: string }) {
  const [open, setOpen] = useState(true);

  if (items.length === 0) return null;

  return (
    <>
      <div className="post_sidebar_toc hide-tablet">
        <div
          className="post_toc_heading"
          onClick={() => setOpen(!open)}
          role="button"
          tabIndex={0}
          style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <p className="text-size-1rem text-weight-600">
            {locale === "fr" ? "Table des matières" : "Table of contents"}
          </p>
          <div className="icon-wrapper" style={{ transition: "transform 200ms", transform: open ? "rotate(0deg)" : "rotate(180deg)" }}>
            <div className="icon w-embed" dangerouslySetInnerHTML={{
              __html: '<svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.5919 13.42C15.2664 13.7454 14.7388 13.7454 14.4133 13.42L10.0026 9.00924L5.59186 13.42C5.26642 13.7454 4.73879 13.7454 4.41335 13.42C4.08791 13.0945 4.08791 12.5669 4.41335 12.2415L9.41335 7.24147C9.73879 6.91604 10.2664 6.91604 10.5919 7.24147L15.5919 12.2415C15.9173 12.5669 15.9173 13.0945 15.5919 13.42Z" fill="#130E30"/></svg>'
            }} />
          </div>
        </div>
        {open && (
          <div className="post_toc_content_grid">
            <div className="post_toc_content_clip">
              <div className="post_toc_content">
                <div className="post_toc_content_list">
                  {items.map((item) => (
                    <div key={item.id} className="toc_link_wrapper">
                      <a
                        href={`#${item.id}`}
                        className={item.level === 2 ? "toc_link_h2" : "toc_link_h3"}
                        style={{ display: "block", textDecoration: "none" }}
                      >
                        <div className={item.level === 2 ? "text-size-1rem" : "text-size-0x875rem text-color-neutral"}>
                          {item.text}
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="spacer-1x5rem hide-tablet" />
    </>
  );
}
