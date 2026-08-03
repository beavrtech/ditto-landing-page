import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { JsonLd } from "@/components/JsonLd";
import { SCOPE_PUBLISHER_JSONLD } from "@/features/media/lib/jsonld";
import { nsInter, nsHedvig } from "@/features/media/fonts";
import "@/features/media/styles/media.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.trustditto.com"),
  title: {
    default: "The Scope — le média QHSE, RSE & Supply Chain par Ditto",
    template: "%s | The Scope",
  },
  description:
    "The Scope est le média de Ditto pour celles et ceux qui portent la conformité QHSE, RSE et supply chain.",
  openGraph: {
    type: "website",
    siteName: "The Scope",
    images: [{ url: "/media/og-default.svg", width: 1200, height: 630 }],
  },
  icons: {
    icon: [
      { url: "/media/favicon.svg", type: "image/svg+xml" },
      { url: "/media/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/media/apple-icon.png",
    shortcut: "/media/favicon.svg",
  },
};

export default function MediaLayoutFr({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${nsInter.variable} ${nsHedvig.variable}`}>
      <head>
        <JsonLd data={SCOPE_PUBLISHER_JSONLD} />
      </head>
      <body className="ns-body">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
