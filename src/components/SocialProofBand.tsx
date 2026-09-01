"use client";

/**
 * @file SocialProofBand — trust band shown right after the homepage hero.
 *
 * Layout is driven by the MEASURED viewport width (see useSocialProofBreakpoint
 * below), not CSS media queries, per design spec: badges/stats stack into a
 * column and the logo grid becomes a 6-per-row 2-row block on desktop, then
 * both switch to side-by-side / 4-per-row 3-row on narrower viewports.
 */

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { localizedHref } from "../lib/localized-paths";

type Breakpoint = "desktop" | "narrow" | "phone";

/**
 * Fixed draft list of 12 logos for the band — intentionally NOT wired to the
 * live customer DB (unlike the homepage logo strip), so it won't drift as
 * that list changes. Update by hand if the roster changes.
 */
const SOCIAL_PROOF_LOGOS: { name: string; logoUrl: string }[] = [
  { name: "WAAT", logoUrl: "/customer-logos/waat.png" },
  { name: "Mobsuccess", logoUrl: "/customer-logos/mobsuccess.png" },
  { name: "Stanco", logoUrl: "/customer-logos/stanco.png" },
  { name: "Adenes", logoUrl: "/customer-logos/adenes.png" },
  { name: "Aico", logoUrl: "/customer-logos/aico.png" },
  { name: "Émile Maurin", logoUrl: "/customer-logos/maurin.png" },
  { name: "Niedax", logoUrl: "/customer-logos/niedax.png" },
  { name: "Superga Beauty", logoUrl: "/customer-logos/superga-beauty.png" },
  { name: "ECS Group", logoUrl: "/customer-logos/ecs-group.png" },
  { name: "Yesss Electrique", logoUrl: "/customer-logos/yesss-electrique.png" },
  { name: "France TV Publicité", logoUrl: "/customer-logos/france-tv.png" },
  { name: "Malt", logoUrl: "/customer-logos/malt.png" },
];

/** phone < 720px, narrow < 1024px, desktop otherwise. */
function useSocialProofBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");

  useEffect(() => {
    const measure = () => {
      const width = window.innerWidth;
      setBreakpoint(width < 720 ? "phone" : width < 1024 ? "narrow" : "desktop");
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return breakpoint;
}

function TrustpilotStar() {
  return (
    <svg
      width="14"
      height="13"
      viewBox="0 0 799.89 761"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="spb_star"
    >
      <path
        d="M799.89 290.83H494.44L400.09 0l-94.64 290.83L0 290.54l247.37 179.92L152.72 761l247.37-179.63L647.16 761l-94.35-290.54z"
        fill="#00B67A"
      />
      <path d="M574.04 536.24l-21.23-65.78-152.72 110.91z" fill="#005128" />
    </svg>
  );
}

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

const SOCIAL_PROOF_BAND_CSS = `
.spb { background: #FFFFFF; border-top: 1px solid #D9DDBC; border-bottom: 1px solid #D9DDBC; padding: 24px clamp(24px, 3vw, 48px); }
.spb_inner { max-width: 1344px; margin: 0 auto; display: flex; flex-wrap: wrap; align-items: center; }
.spb[data-bp="desktop"] .spb_inner { justify-content: flex-start; gap: clamp(20px, 2.6vw, 40px); }
.spb[data-bp="narrow"] .spb_inner, .spb[data-bp="phone"] .spb_inner { justify-content: center; gap: 28px; }

.spb_badges { display: flex; flex: none; }
.spb[data-bp="desktop"] .spb_badges { flex-direction: column; gap: 18px; }
.spb[data-bp="narrow"] .spb_badges, .spb[data-bp="phone"] .spb_badges { flex-direction: row; gap: 28px; }
.spb_badge { height: 56px; width: auto; flex: none; }

.spb_stats { display: flex; flex: none; }
.spb[data-bp="desktop"] .spb_stats { flex-direction: column; gap: 18px; align-items: flex-start; }
.spb[data-bp="narrow"] .spb_stats, .spb[data-bp="phone"] .spb_stats { flex-direction: row; gap: 28px; align-items: center; justify-content: center; }
.spb_stat { display: flex; flex-direction: column; }
.spb_stat-number { font-family: var(--font-hedvig), "Hedvig Letters Serif", Georgia, serif; font-size: 34px; line-height: 1; color: var(--_colors-•-primitives---neutral--neutral-navy, #130E30); }
.spb_stat-label { font-family: var(--font-inter), Inter, Arial, sans-serif; font-size: 14px; letter-spacing: -0.01em; color: #6B6880; display: inline-flex; align-items: center; gap: 5px; margin-top: 2px; }

.spb_logos { display: flex; flex-direction: column; gap: 18px; flex: 1 1 auto; }
.spb[data-bp="desktop"] .spb_logos { flex-basis: 0%; min-width: 420px; gap: 30px; }
.spb[data-bp="narrow"] .spb_logos, .spb[data-bp="phone"] .spb_logos { flex-basis: 100%; min-width: 240px; }
.spb_logos-row { display: flex; justify-content: center; gap: clamp(20px, 2.6vw, 40px); }
.spb[data-bp="narrow"] .spb_logos-row, .spb[data-bp="phone"] .spb_logos-row { justify-content: space-between; }
.spb_logo { flex: 1 1 0; min-width: 0; max-width: 135px; height: 30.6px; object-fit: contain; }

.spb_link { display: inline-flex; align-items: center; gap: 6px; height: 48px; white-space: nowrap; font-family: var(--font-inter), Inter, Arial, sans-serif; font-size: 15px; color: var(--_colors-•-primitives---neutral--neutral-navy, #130E30); text-decoration: none; }
.spb_link:hover { text-decoration: underline; }
.spb[data-bp="desktop"] .spb_link { width: auto; }
.spb[data-bp="narrow"] .spb_link, .spb[data-bp="phone"] .spb_link { width: 100%; justify-content: center; }
`;

export function SocialProofBand() {
  const t = useTranslations("socialProofBand");
  const locale = useLocale();
  const breakpoint = useSocialProofBreakpoint();
  const logosPerRow = breakpoint === "desktop" ? 6 : 4;
  const logoRows = chunk(SOCIAL_PROOF_LOGOS, logosPerRow);

  return (
    <section className="spb" data-bp={breakpoint}>
      <style dangerouslySetInnerHTML={{ __html: SOCIAL_PROOF_BAND_CSS }} />
      <div className="spb_inner">
        <div className="spb_badges">
          <Image
            src="/images/ecovadis-medal-2026.svg"
            alt="EcoVadis Platinum — Top 1% Sustainability Rating"
            width={96}
            height={96}
            className="spb_badge"
          />
          <Image
            src="/images/ecovadis-partner-2026.svg"
            alt="EcoVadis Accredited Consulting Partner"
            width={96}
            height={96}
            className="spb_badge"
          />
        </div>

        <div className="spb_stats">
          <div className="spb_stat">
            <span className="spb_stat-number">500+</span>
            <span className="spb_stat-label">{t("companies")}</span>
          </div>
          <div className="spb_stat">
            <span className="spb_stat-number">4.6/5</span>
            <span className="spb_stat-label">
              {t("trustpilot")}
              <TrustpilotStar />
            </span>
          </div>
        </div>

        <div className="spb_logos">
          {logoRows.map((row, i) => (
            <div className="spb_logos-row" key={i}>
              {row.map((logo) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={logo.name}
                  src={logo.logoUrl}
                  alt={logo.name}
                  className="spb_logo"
                  loading="lazy"
                />
              ))}
            </div>
          ))}
        </div>

        <a href={localizedHref("/customer-stories", locale)} className="spb_link">
          {t("allCustomerStories")}
          <ArrowRight size={16} />
        </a>
      </div>
    </section>
  );
}
