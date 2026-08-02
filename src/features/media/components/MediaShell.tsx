import type { ReactNode } from "react";
import { BetaBanner } from "./BetaBanner";
import { ScopeMasthead } from "./ScopeMasthead";
import { ScopeFooter } from "./ScopeFooter";
import type { MediaLocale } from "../data/taxonomy";

export function MediaShell({
  locale,
  mirrorPath = "",
  children,
}: {
  locale: MediaLocale;
  mirrorPath?: string;
  children: ReactNode;
}) {
  return (
    <div className="ns-shell">
      <BetaBanner locale={locale} mirrorPath={mirrorPath} />
      <ScopeMasthead locale={locale} mirrorPath={mirrorPath} />
      <main className="ns-main">{children}</main>
      <ScopeFooter locale={locale} />
    </div>
  );
}
