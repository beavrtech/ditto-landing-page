/**
 * Static customer logos shown in the homepage logo section and the sticky
 * bottom bar. Images live in `public/customer-logos/`.
 *
 * - `smaller` flags visually "heavier" logos so they get the tighter caps
 *   (88×32 instead of 120×40) and don't dominate the row.
 * - `caseStudyUrl` is the EN customer-story path; it is localized at render
 *   time via the story slug map (see CustomerLogosServer).
 */
export type CustomerLogo = {
  name: string;
  logo_url: string;
  smaller?: boolean;
  caseStudyUrl?: string;
};

/** First row — also reused by the sticky bottom bar. */
export const CUSTOMER_LOGOS_PRIMARY: CustomerLogo[] = [
  { name: "WAAT", logo_url: "/customer-logos/waat.png" },
  { name: "Mobsuccess", logo_url: "/customer-logos/mobsuccess.png" },
  { name: "Stanco", logo_url: "/customer-logos/stanco.png", smaller: true },
  {
    name: "Adenes",
    logo_url: "/customer-logos/adenes.png",
    caseStudyUrl: "/customer-stories/first-cdp-assessment-one-month-adenes",
  },
  {
    name: "Aico",
    logo_url: "/customer-logos/aico.png",
    smaller: true,
    caseStudyUrl: "/customer-stories/aico-building-a-strong-csr-framework-to-aim-for-excellence",
  },
  {
    name: "Émile Maurin",
    logo_url: "/customer-logos/maurin.png",
    caseStudyUrl: "/customer-stories/emile-maurin-a-family-business-strengthening-its-csr-strategy-with-ditto",
  },
];

/** Second row. */
export const CUSTOMER_LOGOS_SECONDARY: CustomerLogo[] = [
  {
    name: "Niedax",
    logo_url: "/customer-logos/niedax.png",
    caseStudyUrl: "/customer-stories/niedax-client-pressure-gold-ecovadis-medal",
  },
  {
    name: "Superga Beauty",
    logo_url: "/customer-logos/superga-beauty.png",
    caseStudyUrl: "/customer-stories/superga-beauty-structuring-and-promoting-its-csr-approach-for-sustainable-leadership",
  },
  { name: "ECS Group", logo_url: "/customer-logos/ecs-group.png" },
  {
    name: "Yesss Electrique",
    logo_url: "/customer-logos/yesss-electrique.png",
    caseStudyUrl: "/customer-stories/yesss-electrique-structuring-its-csr-approach-and-standing-out-in-tenders",
  },
  { name: "France TV Publicité", logo_url: "/customer-logos/france-tv.png" },
  { name: "Malt", logo_url: "/customer-logos/malt.png" },
];
