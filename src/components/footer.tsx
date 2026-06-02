import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ExternalLink } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const year = new Date().getFullYear();

  const sections = [
    {
      title: t("frameworks"),
      links: [
        { href: "/frameworks/ecovadis", label: nav("ecovadis") },
        { href: "/frameworks/iso-14001", label: nav("iso14001") },
        { href: "/frameworks/cdp", label: nav("cdp") },
        { href: "/frameworks/csrd", label: nav("csrd") },
      ],
    },
    {
      title: t("solutions"),
      links: [
        { href: "/solutions/management-system", label: nav("managementSystem") },
        { href: "/solutions/questionnaire-automation", label: nav("questionnaireAutomation") },
        { href: "/solutions/ai-intelligence", label: nav("aiIntelligence") },
        { href: "/solutions/supplier-engagement", label: nav("supplierEngagement") },
      ],
    },
    {
      title: t("resources"),
      links: [
        { href: "/resources/blog", label: nav("blog") },
        { href: "/resources/guides", label: nav("guides") },
        { href: "/resources/case-studies", label: nav("caseStudies") },
      ],
    },
    {
      title: t("about"),
      links: [
        { href: "/about/manifesto", label: nav("manifesto") },
        { href: "/about/careers", label: nav("careers") },
        { href: "/about/contact", label: nav("contact") },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-6">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple text-white font-bold text-sm">
                D
              </div>
              <span className="text-xl font-bold text-foreground">Ditto</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs mb-4">
              {t("tagline")}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-yellow">&#9733; 4.6/5</span>
              <span className="text-xs text-muted-foreground">Trustpilot</span>
            </div>
            <div className="mt-4">
              <a
                href="https://linkedin.com/company/trustditto"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {sections.map((section) => (
            <div key={section.title}>
              <p className="mb-3 text-sm font-semibold text-foreground">
                {section.title}
              </p>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border py-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            {t("copyright", { year: String(year) })}
          </p>
          <div className="flex gap-4">
            <Link
              href="/legal/terms"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("terms")}
            </Link>
            <Link
              href="/legal/privacy"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("privacy")}
            </Link>
            <Link
              href="/legal/notices"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("legal")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
