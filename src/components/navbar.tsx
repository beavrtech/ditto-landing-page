"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, ChevronDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const currentLocale = pathname.startsWith("/fr") ? "fr" : "en";
  const otherLocale = currentLocale === "en" ? "fr" : "en";

  function switchLocale() {
    const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, "") || "/";
    router.push(`/${otherLocale}${pathWithoutLocale}`);
  }

  const frameworkLinks = [
    { href: "/frameworks/ecovadis" as const, label: t("ecovadis") },
    { href: "/frameworks/iso-14001" as const, label: t("iso14001") },
    { href: "/frameworks/cdp" as const, label: t("cdp") },
    { href: "/frameworks/csrd" as const, label: t("csrd") },
  ];

  const solutionLinks = [
    { href: "/solutions/management-system" as const, label: t("managementSystem") },
    { href: "/solutions/questionnaire-automation" as const, label: t("questionnaireAutomation") },
    { href: "/solutions/ai-intelligence" as const, label: t("aiIntelligence") },
    { href: "/solutions/supplier-engagement" as const, label: t("supplierEngagement") },
  ];

  const resourceLinks = [
    { href: "/resources/blog" as const, label: t("blog") },
    { href: "/resources/guides" as const, label: t("guides") },
    { href: "/resources/case-studies" as const, label: t("caseStudies") },
  ];

  const aboutLinks = [
    { href: "/about/manifesto" as const, label: t("manifesto") },
    { href: "/about/careers" as const, label: t("careers") },
    { href: "/about/contact" as const, label: t("contact") },
  ];

  const navGroups = [
    { label: t("frameworks"), links: frameworkLinks },
    { label: t("solutions"), links: solutionLinks },
    { label: t("resources"), links: resourceLinks },
    { label: t("about"), links: aboutLinks },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-ivory/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple text-white font-bold text-sm">
            D
          </div>
          <span className="text-xl font-bold text-foreground">Ditto</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navGroups.map((group) => (
            <div
              key={group.label}
              className="relative"
              onMouseEnter={() => setOpenDropdown(group.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted transition-colors">
                {group.label}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {openDropdown === group.label && (
                <div className="absolute left-0 top-full pt-1 z-50">
                  <div className="rounded-xl border border-border bg-card p-2 shadow-lg min-w-[220px]">
                    {group.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={switchLocale}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
          >
            <Globe className="h-4 w-4" />
            {otherLocale.toUpperCase()}
          </button>
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            {t("login")}
          </Link>
          <Link
            href="/get-started"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-purple hover:bg-purple-dark text-white"
            )}
          >
            {t("getStarted")}
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "lg:hidden")}>
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-80 bg-ivory">
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            <div className="flex flex-col gap-6 pt-6">
              {navGroups.map((group) => (
                <div key={group.label}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {group.label}
                  </p>
                  <div className="flex flex-col gap-1">
                    {group.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <div className="border-t border-border pt-4 flex flex-col gap-2">
                <button
                  onClick={() => {
                    switchLocale();
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/70 hover:bg-muted"
                >
                  <Globe className="h-4 w-4" />
                  {otherLocale === "fr" ? "Français" : "English"}
                </button>
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "justify-start"
                  )}
                >
                  {t("login")}
                </Link>
                <Link
                  href="/get-started"
                  className={cn(
                    buttonVariants(),
                    "bg-purple hover:bg-purple-dark text-white"
                  )}
                >
                  {t("getStarted")}
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
