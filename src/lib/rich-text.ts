/**
 * Transform CMS rich-text HTML by replacing custom embed tags
 * (<goodtoknow>, <cta>) with properly-structured HTML that matches
 * the design-system CSS classes in the bundle.
 */

const INFO_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;

/**
 * Replace <goodtoknow>...</goodtoknow> with styled callout boxes.
 * CSS: .post_goodtoknow, .post_goodtoknow_icon (in devlink-bundle.css)
 */
function transformGoodToKnow(html: string): string {
  return html.replace(
    /<div\s+data-rt-embed-type=['"]true['"]>\s*<goodtoknow>([\s\S]*?)<\/goodtoknow>\s*<\/div>/gi,
    (_, content) => {
      return `<div class="post_goodtoknow"><div class="post_goodtoknow_icon">${INFO_ICON_SVG}</div><div>${content.trim()}</div></div>`;
    },
  );
}

/**
 * Replace <cta>...</cta> with styled inline CTA blocks.
 * CSS: .post_richtext_cta (in devlink-bundle.css)
 */
function transformCta(html: string): string {
  return html.replace(
    /<div\s+data-rt-embed-type=['"]true['"]>\s*<cta>([\s\S]*?)<\/cta>\s*<\/div>/gi,
    (_, inner) => {
      const title = inner.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "";
      const text = inner.match(/<text>([\s\S]*?)<\/text>/i)?.[1]?.trim() ?? "";
      const buttonText = inner.match(/<button-text>([\s\S]*?)<\/button-text>/i)?.[1]?.trim() ?? "";
      const buttonLink = inner.match(/<button-link>([\s\S]*?)<\/button-link>/i)?.[1]?.trim() ?? "";

      return [
        `<div class="post_richtext_cta">`,
        title ? `<p class="heading-size-2rem">${title}</p>` : "",
        title && text ? `<div class="spacer-1rem"></div>` : "",
        text ? `<p class="text-size-1rem">${text}</p>` : "",
        buttonText ? `<div class="spacer-1x5rem"></div>` : "",
        buttonText
          ? `<a data-wf--button--variant="primary" href="${buttonLink}" class="button w-inline-block"><div>${buttonText}</div></a>`
          : "",
        `</div>`,
      ].join("");
    },
  );
}

/**
 * Convert absolute trustditto.com URLs to relative paths so links
 * work in dev and on any deployment domain.
 */
function relativizeLinks(html: string): string {
  return html.replace(/https?:\/\/(?:www\.)?trustditto\.com(\/[^"'\s]*)/gi, "$1");
}

export const QUOTE_OPEN_SVG = `<svg width="30" height="25" viewBox="0 0 30 25" fill="none" xmlns="http://www.w3.org/2000/svg"> <g style="mix-blend-mode:multiply"> <path d="M23.04 24.908C20.992 24.908 19.328 24.172 18.048 22.7C16.832 21.164 16.224 19.084 16.224 16.46C16.224 13.452 17.152 10.54 19.008 7.72403C20.864 4.90803 23.808 2.44403 27.84 0.332031L29.472 2.63603C26.016 4.68403 23.68 6.76403 22.464 8.87603C21.312 10.924 20.736 13.164 20.736 15.596L18.528 19.628C18.528 18.092 19.008 16.844 19.968 15.884C20.992 14.86 22.24 14.348 23.712 14.348C25.184 14.348 26.4 14.828 27.36 15.788C28.384 16.748 28.896 17.996 28.896 19.532C28.896 21.068 28.352 22.348 27.264 23.372C26.176 24.396 24.768 24.908 23.04 24.908ZM6.816 24.908C4.768 24.908 3.104 24.172 1.824 22.7C0.608001 21.164 0 19.084 0 16.46C0 13.452 0.928 10.54 2.784 7.72403C4.64 4.90803 7.584 2.44403 11.616 0.332031L13.248 2.63603C9.792 4.68403 7.456 6.76403 6.24 8.87603C5.088 10.924 4.512 13.164 4.512 15.596L2.304 19.628C2.304 18.092 2.784 16.844 3.744 15.884C4.768 14.86 6.016 14.348 7.488 14.348C8.96 14.348 10.176 14.828 11.136 15.788C12.16 16.748 12.672 17.996 12.672 19.532C12.672 21.068 12.128 22.348 11.04 23.372C9.952 24.396 8.544 24.908 6.816 24.908Z" fill="#FFE228"></path> </g> </svg>`;
export const QUOTE_CLOSE_SVG = `<svg width="30" height="25" viewBox="0 0 30 25" fill="none" xmlns="http://www.w3.org/2000/svg"> <g style="mix-blend-mode:multiply"> <path d="M6.42875 0.33025C8.47675 0.33025 10.1407 1.06625 11.4207 2.53825C12.6367 4.07425 13.2447 6.15425 13.2447 8.77825C13.2447 11.7863 12.3167 14.6982 10.4607 17.5142C8.60475 20.3302 5.66075 22.7943 1.62875 24.9062L-0.00325203 22.6023C3.45275 20.5543 5.78875 18.4743 7.00475 16.3623C8.15675 14.3143 8.73275 12.0742 8.73275 9.64225L10.9407 5.61024C10.9407 7.14625 10.4607 8.39425 9.50075 9.35425C8.47675 10.3782 7.22875 10.8902 5.75675 10.8902C4.28475 10.8902 3.06875 10.4102 2.10875 9.45025C1.08475 8.49025 0.57275 7.24225 0.57275 5.70625C0.57275 4.17025 1.11675 2.89025 2.20475 1.86625C3.29275 0.842249 4.70075 0.33025 6.42875 0.33025ZM22.6527 0.33025C24.7007 0.33025 26.3647 1.06625 27.6447 2.53825C28.8607 4.07425 29.4688 6.15425 29.4688 8.77825C29.4688 11.7863 28.5407 14.6982 26.6847 17.5142C24.8287 20.3302 21.8847 22.7943 17.8527 24.9062L16.2207 22.6023C19.6767 20.5543 22.0127 18.4743 23.2287 16.3623C24.3807 14.3143 24.9567 12.0742 24.9567 9.64225L27.1647 5.61024C27.1647 7.14625 26.6847 8.39425 25.7247 9.35425C24.7007 10.3782 23.4527 10.8902 21.9807 10.8902C20.5087 10.8902 19.2927 10.4102 18.3327 9.45025C17.3087 8.49025 16.7967 7.24225 16.7967 5.70625C16.7967 4.17025 17.3407 2.89025 18.4287 1.86625C19.5167 0.842249 20.9247 0.33025 22.6527 0.33025Z" fill="#FFE228"></path> </g> </svg>`;

/**
 * Replace plain <blockquote> with the testimonial-style quote UI
 * (yellow quotation marks, post_testimonial classes). A trailing
 * "<br>— author" line becomes a separate attribution row, and literal
 * surrounding quotation marks are dropped (the yellow marks replace them).
 */
function transformBlockquote(html: string): string {
  return html.replace(/<blockquote>([\s\S]*?)<\/blockquote>/gi, (_, inner) => {
    let content = inner.trim();
    let attribution = "";
    const m = content.match(/^([\s\S]*?)(?:<br\s*\/?>\s*)+([—–-][\s\S]*)$/);
    if (m) {
      content = m[1].trim();
      attribution = m[2].trim();
    }
    content = content.replace(/^["\u201C\u00AB]\s*/, "").replace(/\s*["\u201D\u00BB]$/, "");
    return (
      `<div class="post_testimonial_wrapper"><div class="post_testimonial"><div class="post_testimonial_content">` +
      `<p class="heading-size-2rem display-inline"><span>${content}</span>` +
      `<span class="post_testimonial_quote_bottom_span"><span class="post_testimonial_quote_bottom"><span class="icon w-embed">${QUOTE_CLOSE_SVG}</span></span></span></p>` +
      `<div class="post_testimonial_quote_top"><div class="icon w-embed">${QUOTE_OPEN_SVG}</div></div>` +
      (attribution ? `<div class="spacer-1rem"></div><p class="text-size-1rem text-color-neutral">${attribution}</p>` : "") +
      `</div></div></div>`
    );
  });
}

/**
 * Ensure every table renders with the design's styles, regardless of how
 * it was stored: legacy bodies carry table-wrap/blog-table markup, while
 * the admin editor (Tiptap) re-serializes bare <table> tags. Normalize
 * both to <div class="table-wrap"><table class="blog-table">.
 */
function transformTables(html: string): string {
  let out = html.replace(
    /<div class="table-wrap"[^>]*>\s*(<table[\s\S]*?<\/table>)\s*<\/div>/gi,
    "$1"
  );
  out = out.replace(/<table([^>]*)>([\s\S]*?)<\/table>/gi, (_, attrs, inner) => {
    let a = attrs;
    if (!/blog-table/.test(a)) {
      a = /class="/.test(a)
        ? a.replace(/class="/, 'class="blog-table ')
        : ` class="blog-table"${a}`;
    }
    return `<div class="table-wrap" tabindex="0"><table${a}>${inner}</table></div>`;
  });
  return out;
}

const LEGACY_FRAMEWORKS = ["ecovadis", "cdp", "csrd", "iso-14001", "vsme"];

/**
 * CMS bodies still contain links using the original site's URL structure
 * (no locale prefix, old sections): /blog/{slug}, /{framework}/{slug},
 * /demo, /resources/... — rewrite them to current localized URLs.
 * Slugs inside a body are already in that body's language, so the current
 * locale's path pattern is the right target.
 */
function rewriteLegacyLinks(html: string, locale: string): string {
  const blogBase = locale === "fr" ? "/fr/ressources/blog" : "/en/resources/blog";
  const resourcesBase = locale === "fr" ? "/fr/ressources" : "/en/resources";
  const getStarted = locale === "fr" ? "/fr/demo" : "/en/demo";

  return html.replace(/href="(\/[^"]*)"/gi, (full, path: string) => {
    // Already locale-prefixed — leave untouched
    if (/^\/(en|fr)(\/|$)/.test(path)) return full;

    if (path.startsWith("/blog/")) {
      return `href="${blogBase}${path.slice("/blog".length)}"`;
    }
    for (const fw of LEGACY_FRAMEWORKS) {
      if (path.startsWith(`/${fw}/`)) {
        return `href="/${locale}/collection${path}"`;
      }
    }
    if (path === "/demo" || path === "/contact") {
      return `href="${getStarted}"`;
    }
    if (path.startsWith("/resources/")) {
      return `href="${resourcesBase}${path.slice("/resources".length)}"`;
    }
    if (path.startsWith("/customer-stories/")) {
      return locale === "fr"
        ? `href="/fr/cas-clients${path.slice("/customer-stories".length)}"`
        : `href="/en${path}"`;
    }
    return full;
  });
}

/**
 * Apply all rich-text transformations to CMS body HTML.
 */
export function transformRichText(html: string, locale: string = "en"): string {
  let result = html;
  result = transformGoodToKnow(result);
  result = transformCta(result);
  result = transformBlockquote(result);
  result = transformTables(result);
  result = relativizeLinks(result);
  result = rewriteLegacyLinks(result, locale);
  return result;
}
