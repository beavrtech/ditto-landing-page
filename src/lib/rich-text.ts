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

/**
 * Apply all rich-text transformations to CMS body HTML.
 */
export function transformRichText(html: string): string {
  let result = html;
  result = transformGoodToKnow(result);
  result = transformCta(result);
  result = relativizeLinks(result);
  return result;
}
