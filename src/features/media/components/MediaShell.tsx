import type { ReactNode } from "react";
import { NorthstarMasthead } from "./NorthstarMasthead";
import { NorthstarFooter } from "./NorthstarFooter";
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
      <NorthstarMasthead locale={locale} mirrorPath={mirrorPath} />
      <main className="ns-main">{children}</main>
      <NorthstarFooter locale={locale} />
    </div>
  );
}
