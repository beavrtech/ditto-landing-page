"use client";

import { useRef, useEffect, useCallback } from "react";

/**
 * The CMS "form" field was typed as richtext (Tiptap), which HTML-entity-encodes
 * elements it doesn't recognise — <script> becomes &lt;script&gt;. Decode common
 * HTML entities so the browser parses actual <script> elements.
 */
function decodeFormHtml(raw: string): string {
  if (!raw.includes("&lt;script")) return raw;
  return raw
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&amp;/g, "&");
}

/**
 * Client component that renders raw CMS HTML (typically a HubSpot form embed)
 * and activates any <script> tags that would otherwise be inert when inserted
 * via dangerouslySetInnerHTML (per the HTML5 spec).
 */
export default function GuideFormEmbed({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const decoded = decodeFormHtml(html);

  const activateScripts = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!/<script/i.test(decoded)) return;

    const scripts = container.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      for (const attr of Array.from(oldScript.attributes)) {
        newScript.setAttribute(attr.name, attr.value);
      }
      if (oldScript.textContent) {
        let text = oldScript.textContent;
        // DOMContentLoaded has already fired by the time this component mounts.
        // Replace the listener wrapper so the callback runs immediately.
        text = text.replace(
          /document\.addEventListener\(\s*['"]DOMContentLoaded['"]\s*,\s*function\s*\([^)]*\)\s*\{/g,
          "(function(){"
        );
        newScript.textContent = text;
      }
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, [decoded]);

  useEffect(() => {
    activateScripts();
  }, [activateScripts]);

  return (
    <div
      ref={containerRef}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: decoded }}
    />
  );
}
