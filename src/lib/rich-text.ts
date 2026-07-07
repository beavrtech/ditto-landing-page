/**
 * Transform CMS rich-text HTML by replacing custom embed tags
 * (<goodtoknow>, <keytakeaways>, <faq>, <cta>) with properly-structured
 * HTML that matches the design-system CSS classes in the bundle.
 */

const INFO_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;

const KEYTAKEAWAYS_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h12"/></svg>`;

/**
 * Replace <goodtoknow>...</goodtoknow> with styled callout boxes.
 * CSS: .post_goodtoknow, .post_goodtoknow_icon (in devlink-bundle.css)
 */
function transformGoodToKnow(html: string): string {
  // Match the <goodtoknow> tag itself rather than its data-rt-embed-type
  // wrapper: multiple embeds can share one wrapper (e.g. a <goodtoknow>
  // immediately followed by a <cta>), and anchoring on </goodtoknow></div>
  // makes the lazy match span past the sibling embed and swallow all the
  // content up to the next callout. The (harmless, unstyled) wrapper div is
  // left in place.
  return html.replace(
    /<goodtoknow>([\s\S]*?)<\/goodtoknow>/gi,
    (_, content) => {
      return `<div class="post_goodtoknow"><div class="post_goodtoknow_icon">${INFO_ICON_SVG}</div><div>${content.trim()}</div></div>`;
    },
  );
}

/**
 * Replace <keytakeaways>...</keytakeaways> with a summary callout.
 * CSS: .post_keytakeaways, .post_keytakeaways_icon (in GlobalStyles)
 */
function transformKeyTakeaways(html: string): string {
  return html.replace(
    /<div\s+data-rt-embed-type=['"]true['"]>\s*<keytakeaways>([\s\S]*?)<\/keytakeaways>\s*<\/div>/gi,
    (_, content) => {
      return `<div class="post_keytakeaways"><div class="post_keytakeaways_icon">${KEYTAKEAWAYS_ICON_SVG}</div><div>${content.trim()}</div></div>`;
    },
  );
}

function stripHtmlTags(s: string): string {
  return s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

/**
 * Replace <faq>...</faq> with a <details>/<summary> accordion + FAQPage JSON-LD.
 * CSS: .post_faq, .post_faq_item, .post_faq_question, .post_faq_answer (in GlobalStyles)
 */
function transformFaq(html: string): string {
  return html.replace(
    /<div\s+data-rt-embed-type=['"]true['"]>\s*<faq>([\s\S]*?)<\/faq>\s*<\/div>/gi,
    (_, inner) => {
      const items: { question: string; answer: string }[] = [];
      const itemRe = /<item>([\s\S]*?)<\/item>/gi;
      let m: RegExpExecArray | null;
      while ((m = itemRe.exec(inner)) !== null) {
        const q = m[1].match(/<question>([\s\S]*?)<\/question>/i)?.[1]?.trim() ?? "";
        const a = m[1].match(/<answer>([\s\S]*?)<\/answer>/i)?.[1]?.trim() ?? "";
        if (q) items.push({ question: q, answer: a });
      }
      if (items.length === 0) return "";

      const accordion = items
        .map(
          (it) =>
            `<details class="post_faq_item"><summary class="post_faq_question">${it.question}</summary><div class="post_faq_answer">${it.answer}</div></details>`,
        )
        .join("");

      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((it) => ({
          "@type": "Question",
          name: stripHtmlTags(it.question),
          acceptedAnswer: {
            "@type": "Answer",
            text: stripHtmlTags(it.answer),
          },
        })),
      };

      return (
        `<div class="post_faq"><h2 class="heading-size-2rem">FAQ</h2><div class="post_faq_list">${accordion}</div></div>` +
        `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
      );
    },
  );
}

/**
 * Replace <cta>...</cta> with styled inline CTA blocks.
 * CSS: .post_richtext_cta (in devlink-bundle.css)
 */
function transformCta(html: string): string {
  // Match the <cta> tag itself (not its data-rt-embed-type wrapper) — see
  // transformGoodToKnow: shared wrappers otherwise break the lazy match.
  return html.replace(
    /<cta>([\s\S]*?)<\/cta>/gi,
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
 * Small "opens in a new tab" marker appended after external link text.
 * Mirrors lucide-react's ArrowUpRight icon (already used elsewhere on the
 * site via lucide-react) so it matches the design system's icon style.
 */
const EXTERNAL_LINK_ICON_SVG = `<svg class="richtext-external-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>`;

// Only the apex domain counts as "internal" — subdomains like
// esg.trustditto.com are separate products and are already treated as
// external, new-tab destinations elsewhere on the site (see NavbarI18n).
const INTERNAL_HOST_RE = /^(?:www\.)?trustditto\.com$/i;

/**
 * Decide whether a CMS-authored href points off-site. Relative links
 * (starting with "/", "#", or with no protocol at all) and same-domain
 * absolute links are internal; everything else is external.
 */
function isExternalHref(href: string): boolean {
  const trimmed = href.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("/") || trimmed.startsWith("#")) return false;

  if (trimmed.startsWith("//")) {
    try {
      return !INTERNAL_HOST_RE.test(new URL(`https:${trimmed}`).hostname);
    } catch {
      return false;
    }
  }

  const hasProtocol = /^[a-z][a-z0-9+.-]*:/i.test(trimmed);
  if (!hasProtocol) return false; // no protocol -> treat as internal
  if (/^(mailto|tel):/i.test(trimmed)) return false; // not a site navigation

  try {
    return !INTERNAL_HOST_RE.test(new URL(trimmed).hostname);
  } catch {
    // Unparseable but protocol-bearing URL — err on the side of treating it
    // as an outbound link per "anything else = external".
    return true;
  }
}

function mergeClass(attrs: string, extraClass: string): string {
  const doubleQuoted = attrs.match(/\sclass\s*=\s*"([^"]*)"/i);
  if (doubleQuoted) {
    return attrs.replace(doubleQuoted[0], ` class="${doubleQuoted[1]} ${extraClass}"`);
  }
  const singleQuoted = attrs.match(/\sclass\s*=\s*'([^']*)'/i);
  if (singleQuoted) {
    return attrs.replace(singleQuoted[0], ` class="${singleQuoted[1]} ${extraClass}"`);
  }
  return `${attrs} class="${extraClass}"`;
}

function setAttr(attrs: string, name: string, value: string): string {
  const stripped = attrs.replace(new RegExp(`\\s${name}\\s*=\\s*("[^"]*"|'[^']*')`, "gi"), "");
  return `${stripped} ${name}="${value}"`;
}

/**
 * Mark every <a href="..."> as internal or external and set target/rel
 * accordingly, computed solely from the href — never from any
 * content-supplied target/rel, which are stripped and ignored. This is
 * necessary because CMS-authored target/rel attributes aren't reliably
 * preserved through the pipeline, and content shouldn't be able to opt out
 * of this behavior anyway.
 *
 * External links open in a new tab (target="_blank" rel="noopener
 * noreferrer") and get a small "opens in new tab" ↗ icon after the link
 * text. Internal links are left completely untouched.
 */
function markExternalLinks(html: string): string {
  return html.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (full, rawAttrs: string, inner: string) => {
    const hrefMatch = rawAttrs.match(/\shref\s*=\s*("([^"]*)"|'([^']*)')/i);
    const href = hrefMatch ? hrefMatch[2] ?? hrefMatch[3] ?? "" : "";
    if (!href || !isExternalHref(href)) return full;

    let attrs = rawAttrs;
    attrs = setAttr(attrs, "target", "_blank");
    attrs = setAttr(attrs, "rel", "noopener noreferrer");
    attrs = mergeClass(attrs, "richtext-external-link");

    // Button-styled links (e.g. the CTA embed) already have a strong visual
    // affordance of their own — keep the target/rel fix but skip the inline
    // icon so it doesn't get squeezed into the button layout.
    const classMatch = rawAttrs.match(/\sclass\s*=\s*("([^"]*)"|'([^']*)')/i);
    const classValue = classMatch ? classMatch[2] ?? classMatch[3] ?? "" : "";
    const isButtonStyled = /\bbutton\b/i.test(classValue);

    const content = isButtonStyled ? inner : `${inner}${EXTERNAL_LINK_ICON_SVG}`;
    return `<a${attrs}>${content}</a>`;
  });
}

/**
 * Apply all rich-text transformations to CMS body HTML.
 */
export function transformRichText(html: string, locale: string = "en"): string {
  let result = html;
  result = transformGoodToKnow(result);
  result = transformKeyTakeaways(result);
  result = transformFaq(result);
  result = transformCta(result);
  result = transformBlockquote(result);
  result = transformTables(result);
  result = relativizeLinks(result);
  result = rewriteLegacyLinks(result, locale);
  result = markExternalLinks(result);
  return result;
}
