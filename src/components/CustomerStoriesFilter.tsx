"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { localizedCmsHref } from "../lib/localized-paths";

type Story = {
  slug: string;
  slug_fr?: string | null;
  name: string;
  description: string;
  banner_url?: string;
  banner_alt_desc?: string;
  team_size?: string | null;
  industry?: { id: string; name_en: string; name_fr?: string | null } | null;
  customer_story_frameworks?: Array<{
    framework: { id: string; name: string; slug: string } | null;
  }>;
};

type FilterOption = { id: string; label: string };

function ChevronIcon() {
  return (
    <div className="filterui_dropdown_icon">
      <div className="icon w-embed" dangerouslySetInnerHTML={{
        __html: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      }} />
    </div>
  );
}

function FilterDropdown({
  label,
  options,
  selected,
  onToggle,
  onClear,
  clearLabel,
}: {
  label: string;
  options: FilterOption[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onClear: () => void;
  clearLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const hasSelection = selected.size > 0;

  return (
    <div
      ref={ref}
      className="filterui_dropdown"
      style={{ position: "relative" }}
    >
      <div
        className={`filterui_dropdown_toggle${open ? " w--open" : ""}`}
        style={{
          ...(hasSelection ? { backgroundColor: "var(--_colors-•-primitives---brand--yellow)", borderRadius: "100vw" } : {}),
          cursor: "pointer",
          width: "auto",
          minWidth: "10rem",
          position: "relative",
          zIndex: open ? 11 : undefined,
        }}
        onClick={() => setOpen(!open)}
        role="button"
        tabIndex={0}
      >
        <div style={{ fontWeight: hasSelection || open ? 600 : 400 }}>{label}</div>
        <ChevronIcon />
      </div>
      {open && (
        <div
          className="filterui_dropdown_list w--open"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 10,
            minWidth: "100%",
            width: "max-content",
          }}
        >
          {/* Scrollable options area — auto height, max 20rem */}
          <div
            className="filterui_dropdown_collection-list"
            style={{ height: "auto", maxHeight: "20rem", overflow: "auto" }}
          >
            {options.map((opt) => (
              <label key={opt.id} className="filterui_dropdown_option" style={{ cursor: "pointer" }}>
                <input
                  type="checkbox"
                  className="filterui_dropdown_checkbox"
                  checked={selected.has(opt.id)}
                  onChange={() => onToggle(opt.id)}
                />
                <span style={{ fontWeight: selected.has(opt.id) ? 600 : 400 }}>{opt.label}</span>
                {selected.has(opt.id) && (
                  <div className="icon w-embed" style={{ width: 16, height: 16, flexShrink: 0, marginLeft: "auto" }} dangerouslySetInnerHTML={{
                    __html: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 8L6.5 11.5L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
                  }} />
                )}
              </label>
            ))}
          </div>
          {hasSelection && (
            <div
              className="filterui_dropdown_clear"
              onClick={onClear}
              role="button"
              tabIndex={0}
              style={{ cursor: "pointer" }}
            >
              <div className="icon w-embed" style={{ width: 12, height: 12 }} dangerouslySetInnerHTML={{
                __html: '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 2L10 10M10 2L2 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
              }} />
              <span className="text-size-1rem">{clearLabel}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function CustomerStoriesFilter({
  stories,
  locale,
  title,
  subtitle,
  frameworkLabel,
  teamSizeLabel,
  industryLabel,
}: {
  stories: Story[];
  locale: string;
  title: string;
  subtitle: string;
  frameworkLabel: string;
  teamSizeLabel: string;
  industryLabel: string;
}) {
  const [selectedFrameworks, setSelectedFrameworks] = useState<Set<string>>(new Set());
  const [selectedTeamSizes, setSelectedTeamSizes] = useState<Set<string>>(new Set());
  const [selectedIndustries, setSelectedIndustries] = useState<Set<string>>(new Set());

  const clearLabel = locale === "fr" ? "Effacer" : "Clear";

  // Extract unique filter options from data
  const frameworkOptions: FilterOption[] = [];
  const frameworkSeen = new Set<string>();
  for (const story of stories) {
    for (const csf of story.customer_story_frameworks || []) {
      if (csf.framework && !frameworkSeen.has(csf.framework.id)) {
        frameworkSeen.add(csf.framework.id);
        frameworkOptions.push({ id: csf.framework.id, label: csf.framework.name });
      }
    }
  }
  frameworkOptions.sort((a, b) => a.label.localeCompare(b.label));

  const teamSizeOptions: FilterOption[] = [];
  const teamSizeSeen = new Set<string>();
  for (const story of stories) {
    if (story.team_size && !teamSizeSeen.has(story.team_size)) {
      teamSizeSeen.add(story.team_size);
      let label = story.team_size;
      if (story.team_size === "<100") {
        label = locale === "fr" ? "<100 employés" : "<100 employees";
      }
      teamSizeOptions.push({ id: story.team_size, label });
    }
  }
  teamSizeOptions.sort((a, b) => {
    const firstNum = (s: string) => {
      const m = s.replace(/\s/g, "").match(/\d+/);
      return m ? parseInt(m[0], 10) : 0;
    };
    return firstNum(a.label) - firstNum(b.label);
  });

  const industryOptions: FilterOption[] = [];
  const industrySeen = new Set<string>();
  for (const story of stories) {
    if (story.industry && !industrySeen.has(story.industry.id)) {
      industrySeen.add(story.industry.id);
      const label = locale === "fr" && story.industry.name_fr ? story.industry.name_fr : story.industry.name_en;
      industryOptions.push({ id: story.industry.id, label });
    }
  }
  industryOptions.sort((a, b) => a.label.localeCompare(b.label));

  function toggle(set: Set<string>, setter: (s: Set<string>) => void, id: string) {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setter(next);
  }

  // Filter stories
  const filtered = stories.filter((story) => {
    if (selectedFrameworks.size > 0) {
      const storyFrameworkIds = (story.customer_story_frameworks || [])
        .map((csf) => csf.framework?.id)
        .filter(Boolean) as string[];
      if (!storyFrameworkIds.some((id) => selectedFrameworks.has(id))) return false;
    }
    if (selectedTeamSizes.size > 0) {
      if (!story.team_size || !selectedTeamSizes.has(story.team_size)) return false;
    }
    if (selectedIndustries.size > 0) {
      if (!story.industry || !selectedIndustries.has(story.industry.id)) return false;
    }
    return true;
  });

  return (
    <>
      {/* Header + Filters */}
      <section className="filterui_section">
        <div className="padding-global">
          <div data-wf--padding--space="small-3rem" className="spacer-component"></div>
          <div className="container-55rem">
            <div className="header">
              <h1 className="heading-size-4rem">{title}</h1>
              <div className="spacer-1x5rem"></div>
              <p className="text-size-1x375rem">{subtitle}</p>
            </div>
            <div className="spacer-3rem"></div>
            <div className="filterui_form_block">
              <div className="filterui_form">
                <FilterDropdown
                  label={frameworkLabel}
                  options={frameworkOptions}
                  selected={selectedFrameworks}
                  onToggle={(id) => toggle(selectedFrameworks, setSelectedFrameworks, id)}
                  onClear={() => setSelectedFrameworks(new Set())}
                  clearLabel={clearLabel}
                />
                <FilterDropdown
                  label={teamSizeLabel}
                  options={teamSizeOptions}
                  selected={selectedTeamSizes}
                  onToggle={(id) => toggle(selectedTeamSizes, setSelectedTeamSizes, id)}
                  onClear={() => setSelectedTeamSizes(new Set())}
                  clearLabel={clearLabel}
                />
                <FilterDropdown
                  label={industryLabel}
                  options={industryOptions}
                  selected={selectedIndustries}
                  onToggle={(id) => toggle(selectedIndustries, setSelectedIndustries, id)}
                  onClear={() => setSelectedIndustries(new Set())}
                  clearLabel={clearLabel}
                />
              </div>
            </div>
          </div>
          <div data-wf--padding--space="small-3rem" className="spacer-component"></div>
        </div>
        <div className="layer-4">
          <div data-wf--background--color="secondary" className="background w-variant-d4e67767-ab3f-6e5c-2116-e9a6d2688920"></div>
        </div>
      </section>

      {/* Customer stories list */}
      <section className="blog-preview_section">
        <div className="padding-global">
          <div data-wf--padding--space="small-3rem" className="spacer-component"></div>
          <div className="container-84rem">
            {filtered.length > 0 ? (
              <div className="blog_list_wrapper">
                <div className="blog_list" role="list">
                  {filtered.map((item) => {
                    const href = localizedCmsHref("/customer-stories", item.slug, item.slug_fr, locale);
                    return (
                      <div key={item.slug} className="blog_list_item" role="listitem">
                        <a href={href} className="card-image w-inline-block">
                          {item.banner_url && (
                            <div className="card-image_thumbnail">
                              <Image src={item.banner_url} alt={item.banner_alt_desc || ""} width={1200} height={630} className="media-full-size" />
                            </div>
                          )}
                          <div className="card-image_content">
                            <div className="spacer-1x5rem spacer-mob-1rem" />
                            <p className="label">
                              {locale === "fr" && item.industry?.name_fr
                                ? item.industry.name_fr
                                : item.industry?.name_en || (locale === "fr" ? "Témoignage client" : "Customer Story")}
                            </p>
                            <div className="spacer-0x75rem" />
                            <div className="card-image_link_wrapper">
                              <p className="heading-size-2rem link-hover-parent text-style-2lines">{item.name}</p>
                            </div>
                            <div className="spacer-0x75rem" />
                            <p className="text-size-1rem text-style-3lines">{item.description}</p>
                          </div>
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="w-dyn-empty"><div>{locale === "fr" ? "Aucun résultat." : "No items found."}</div></div>
            )}
          </div>
          <div data-wf--padding--space="medium-6rem" className="spacer-component w-variant-4e707de5-bf1e-dd42-7fb6-ac24ce686a4c"></div>
        </div>
        <div className="layer-4">
          <div data-wf--background--color="primary" className="background"></div>
        </div>
      </section>
    </>
  );
}
