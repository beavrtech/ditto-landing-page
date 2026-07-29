import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { JsonLd } from "@/components/JsonLd";
import { NORTHSTAR_PUBLISHER_JSONLD } from "@/features/media/lib/jsonld";
import { nsInter, nsHedvig } from "@/features/media/fonts";
import "@/features/media/styles/media.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.trustditto.com"),
  title: {
    default: "The Scope — the QHSE, CSR & Supply Chain magazine by Ditto",
    template: "%s | The Scope",
  },
  description:
    "The Scope is Ditto's magazine for the people who own QHSE, CSR and supply chain compliance.",
  // The Scope is not indexed until launch. Remove this block and the two
  // /media entries in src/app/robots.ts to go live.
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: "The Scope",
    images: [{ url: "/media/og-default.svg", width: 1200, height: 630 }],
  },
};

export default function MediaLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nsInter.variable} ${nsHedvig.variable}`}>
      <head>
        <JsonLd data={NORTHSTAR_PUBLISHER_JSONLD} />
      </head>
      <body className="ns-body">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
