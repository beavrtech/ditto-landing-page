"use client";

import { useRef, useEffect } from "react";
import Script from "next/script";

/**
 * Extract HubSpot form parameters from CMS embed HTML, regardless of whether
 * the HTML is raw or entity-encoded by Tiptap's richtext editor.
 */
function extractHubSpotConfig(html: string) {
  const text = html
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&amp;/g, "&");

  const portalId = text.match(/portalId\s*:\s*["'](\d+)["']/)?.[1];
  const formId = text.match(/formId\s*:\s*["']([a-f0-9-]+)["']/)?.[1];
  const region = text.match(/region\s*:\s*["']([a-z0-9]+)["']/)?.[1];
  const sdkUrl = text.match(
    /src\s*=\s*["']((?:https?:)?\/\/[^"']*hsforms[^"']*)["']/
  )?.[1];

  if (!portalId || !formId) return null;
  return {
    portalId,
    formId,
    region: region || "eu1",
    sdkUrl: sdkUrl || "//js-eu1.hsforms.net/forms/embed/v2.js",
  };
}

/**
 * Renders a HubSpot form by extracting portalId/formId/region from the CMS
 * embed HTML and loading the SDK programmatically — the same pattern used by
 * the contact page (SectionContactSidebarI18n).
 */
export default function GuideFormEmbed({ html }: { html: string }) {
  const config = extractHubSpotConfig(html);
  const containerRef = useRef<HTMLDivElement>(null);
  const formCreated = useRef(false);

  useEffect(() => {
    if (!config || formCreated.current) return;
    const { portalId, formId, region } = config;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as unknown as Record<string, any>;

    function tryCreate() {
      if (formCreated.current || !containerRef.current) return;
      if (!win.hbspt) return;

      win.hbspt.forms.create({
        portalId,
        formId,
        region,
        target: `#guide-hs-form-${formId}`,
      });
      formCreated.current = true;
    }

    if (win.hbspt) {
      tryCreate();
      return;
    }

    const interval = setInterval(() => {
      if (win.hbspt) {
        tryCreate();
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [config]);

  if (!config) {
    return (
      <div
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <>
      <Script src={config.sdkUrl} strategy="afterInteractive" />
      <div id={`guide-hs-form-${config.formId}`} ref={containerRef} />
    </>
  );
}
