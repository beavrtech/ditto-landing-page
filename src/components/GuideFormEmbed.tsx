"use client";

import { useRef, useEffect, useMemo } from "react";
import Script from "next/script";
import { usePostHog } from "posthog-js/react";

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
export default function GuideFormEmbed({ html, guideSlug }: { html: string; guideSlug?: string }) {
  const config = useMemo(() => extractHubSpotConfig(html), [html]);
  const posthog = usePostHog();
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

  // Track HubSpot form submissions in PostHog: identify the lead by email and
  // capture both a generic form_submitted event and a guide_downloaded event
  // (the form gates the guide download).
  useEffect(() => {
    if (!config) return;

    function onMessage(event: MessageEvent) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = event.data as any;
      if (!msg || msg.type !== "hsFormCallback" || msg.eventName !== "onFormSubmitted") return;
      // Multiple HubSpot forms can coexist on a page — only handle ours.
      if (msg.id && config && msg.id !== config.formId) return;

      // msg.data holds the submitted fields, either as [{ name, value }] or an object.
      const fields = msg.data;
      let email: string | undefined;
      if (Array.isArray(fields)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        email = fields.find((f: any) => f?.name === "email")?.value;
      } else if (fields && typeof fields === "object") {
        email = fields.submissionValues?.email ?? fields.email;
      }

      try {
        if (email) posthog.identify(email, { email });
        posthog.capture("form_submitted", { form_id: msg.id });
        posthog.capture("guide_downloaded", {
          form_id: msg.id,
          guide_slug: guideSlug,
          page: window.location.pathname,
        });
      } catch {
        // analytics must never break the form experience
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [config, posthog, guideSlug]);

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
