"use client";

import { useRef, useEffect, useCallback } from "react";

/**
 * Client component that renders raw CMS HTML (typically a HubSpot form embed)
 * and activates any <script> tags that would otherwise be inert when inserted
 * via dangerouslySetInnerHTML (per the HTML5 spec).
 */
export default function GuideFormEmbed({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const activateScripts = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!/<script/i.test(html)) return;

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
  }, [html]);

  useEffect(() => {
    activateScripts();
  }, [activateScripts]);

  return (
    <div
      ref={containerRef}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
