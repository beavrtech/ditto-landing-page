"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";

/**
 * Listens for clicks on any link pointing to /demo and fires demo_cta_clicked.
 * Placement is read from the closest ancestor with data-cta-placement; falls
 * back to the current pathname so pages without explicit tagging still report
 * their location (e.g. "/en/frameworks/ecovadis").
 */
export function DemoCTATracker() {
  const pathname = usePathname();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const link = (e.target as Element).closest("a");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      if (!/\/demo$/.test(href)) return;

      const placement =
        link.closest("[data-cta-placement]")?.getAttribute("data-cta-placement") ??
        pathname;

      try {
        posthog.capture("demo_cta_clicked", {
          placement,
          page: pathname,
          button_text: link.textContent?.trim(),
        });
      } catch {}
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, [pathname]);

  return null;
}
