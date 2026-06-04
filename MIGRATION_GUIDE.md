# How to Migrate a Webflow Page to Next.js

This guide explains how to add a new page to the ditto-landing-page Next.js project, migrating from the Webflow export.

## Project Structure

```
ditto-landing-page/
├── webflow/                    # READ-ONLY — Webflow DevLink export
│   ├── sections/               # Section components (SectionHero, SectionFeature, etc.)
│   ├── elements/               # Element components (Button, Navbar, CardIcon, etc.)
│   ├── css/                    # Webflow CSS (loaded via public bundle)
│   ├── webflow_modules/        # Runtime components (Block, Link, Image, etc.)
│   ├── DevLinkProvider.tsx     # Context provider (already wired in layout)
│   └── GlobalStyles.tsx        # Global style injection (already wired in layout)
├── src/
│   ├── app/[locale]/           # Next.js pages (one folder per route)
│   │   ├── layout.tsx          # Locale layout (DevLinkProvider + i18n + CSS)
│   │   └── page.tsx            # Homepage (reference example)
│   ├── components/             # Our custom components (i18n wrappers, etc.)
│   │   └── NavbarI18n.tsx      # i18n-enabled copy of webflow Navbar
│   └── i18n/                   # next-intl routing config
├── messages/
│   ├── en.json                 # English translations
│   └── fr.json                 # French translations
├── public/
│   ├── fonts/                  # Local font files (.woff2)
│   ├── images/                 # All images/assets from Webflow
│   └── webflow-css/            # Bundled Webflow CSS (served as static file)
└── /Users/stanislasbertrand/Downloads/ditto-preprod.webflow/
    └── *.html                  # Original Webflow HTML pages (source of truth for content)
```

## Golden Rules

1. **NEVER edit files inside `webflow/`** — treat the entire folder as read-only. If you need to modify a Webflow component, copy it to `src/components/` first and edit the copy.

2. **Use Webflow components directly** when possible. They have the correct CSS classes and structure. Only copy+modify when you need i18n or dynamic behavior.

3. **Keep the exact JSX structure** of Webflow components. When making an i18n copy, only replace hardcoded strings and link hrefs — never restructure the JSX, rename classes, or change component nesting.

4. **All text must go through `useTranslations()`** for i18n support (EN/FR).

5. **All internal links must be locale-prefixed** using `` `/${locale}/path` `` — never hardcode `/en/`.

## Step-by-Step: Migrating a Page

### 1. Identify the source HTML

Find the original Webflow HTML file in:
```
/Users/stanislasbertrand/Downloads/ditto-preprod.webflow/
```

For example, `frameworks.html`, `manifesto.html`, `careers.html`, etc.
For subpages in folders, check `frameworks/ecovadis.html`, `solutions/management-system.html`, etc.

Read the HTML to understand:
- What sections appear and in what order
- What text content is on the page (headings, paragraphs, button labels)
- What images are used (check `src` attributes)
- What links exist and where they point

### 2. Create the Next.js route

Create the page file following Next.js App Router conventions:
```
src/app/[locale]/your-page/page.tsx
```

For nested routes:
```
src/app/[locale]/frameworks/ecovadis/page.tsx
src/app/[locale]/solutions/management-system/page.tsx
```

### 3. Systematically verify section order against the source HTML

**This is critical.** Before writing any code, extract the exact section list from the Webflow HTML and use it as your checklist. Do NOT guess what sections a page has — always verify against the HTML source.

Run this to get the section list:
```bash
grep '<section' /Users/stanislasbertrand/Downloads/ditto-preprod.webflow/YOUR_PAGE.html
```

This gives you every `<section>` tag with its class name and variant. Read the HTML around each `<section>` line to understand:
- What content is inside (headings, text, images, buttons)
- Which DevLink component matches it (compare the class name, e.g. `hero_section` → `SectionHero`, `feature1_section` → `SectionFeature`)
- Which sections have NO matching DevLink component and need to be built inline

Create a numbered checklist like this before writing any JSX:
```
Original HTML sections:
1. line 1000: hero_section (heading-4rem)     → SectionHero
2. line 1073: hero_section (base)             → SKIP (unused)
3. line 1101: logostrip_section               → SectionLogostrip
4. line 1138: carousel_section (frameworks)   → SectionCompliantCarousel
5. line 1204: home-illus_section              → INLINE (no DevLink component)
...
```

**After composing the page, verify your component count matches the section count in the HTML. Every section in the HTML must be accounted for — either rendered, or explicitly marked as skipped with a reason.**

Sections that exist in the HTML but have NO DevLink component must be built inline using the exact Webflow class names from the HTML. See the homepage `home-illus_section` and `ExpertiseCarousel` as examples.

### 4. Matching HTML sections to DevLink components

Not every HTML section has a DevLink component. Here's how to handle each case:

**Case A: DevLink component exists and accepts the right props** — use it directly.
```tsx
<SectionFeature
  variant="Layout • Reversed"
  title={t("page.feature.title")}
  ...
/>
```

**Case B: DevLink component exists but has hardcoded text you need to translate** — copy to `src/components/`, fix imports, add i18n (see section 9 below).

**Case C: No DevLink component exists** — build the section inline using the exact HTML structure and Webflow class names from the source HTML. Wrap in the DevLink scope class:
```tsx
<div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
  <section className="your_section_class">
    <div className="padding-global">
      {/* Copy the exact structure from the Webflow HTML, converting to JSX */}
    </div>
    <div className="layer-4">
      <div className="background" data-wf--background--color="primary" />
    </div>
  </section>
</div>
```

When building inline sections, you must also check if the CSS classes exist in the Webflow CSS bundle (`public/webflow-css/webflow-bundle.css`). If they don't, find them in `/Users/stanislasbertrand/Downloads/ditto-preprod.webflow/css/ditto-preprod.webflow.css` and append them to the bundle.

**Case D: Section uses a carousel (Splide)** — the DevLink export includes the Splide HTML structure (`splide`, `splide__track`, `splide__list`) but NOT the JS initialization. You must:
1. Copy the component or build it inline
2. Remove the `.designer` class from `splide__list` (it forces a CSS grid layout that conflicts with Splide)
3. Add `width-26rem` class to ALL `splide__slide` elements (not just the first one)
4. Initialize Splide with a `useEffect`:
```tsx
import { useEffect, useRef } from "react";
import "@splidejs/splide/css/core";

// In the component:
const splideRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  let splideInstance: any = null;
  async function initSplide() {
    const { default: Splide } = await import("@splidejs/splide");
    if (splideRef.current) {
      const el = splideRef.current.querySelector(".splide");
      if (el && !(el as any).__splide) {
        splideInstance = new Splide(el as HTMLElement, {
          type: "loop",
          autoWidth: true,
          gap: "3rem",
          arrows: false,
          pagination: false,
          drag: true,
          breakpoints: {
            991: { gap: "1.5rem" },
            479: { gap: "1rem" },
          },
        });
        splideInstance.mount();
        (el as any).__splide = true;
      }
    }
  }
  initSplide();
  return () => { if (splideInstance) try { splideInstance.destroy(); } catch {} };
}, []);
```
See `src/components/SectionCompliantCarouselInit.tsx` and `src/components/ExpertiseCarousel.tsx` as reference implementations.

### 5. Compose the page using Webflow components

Use the reference homepage at `src/app/[locale]/page.tsx` as your template.

Every page follows this pattern:

```tsx
"use client";

import { useTranslations, useLocale } from "next-intl";
import { Navbar } from "../../components/NavbarI18n";
import { Footer } from "../../../webflow/sections/Footer";
// Import other Webflow sections as needed
import { SectionHero } from "../../../webflow/sections/SectionHero";
import { SectionFeature } from "../../../webflow/sections/SectionFeature";
// etc.

export default function YourPage() {
  const t = useTranslations();
  const locale = useLocale();
  const prefix = `/${locale}`;

  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar />

        {/* Compose sections here, matching the order from the Webflow HTML */}
        <SectionHero
          title={t("yourPage.hero.title")}
          paragraph={t("yourPage.hero.subtitle")}
          image="/images/your-hero-image.jpg"
        />

        {/* More sections... */}

        <Footer />
      </main>
    </div>
  );
}
```

### 4. Available Webflow Section Components

These are in `webflow/sections/` — read the `.tsx` file to see the props interface:

| Component | Use for | Key props |
|---|---|---|
| `SectionHero` | Page hero | `variant` ("Base" \| "Heading 4rem"), `title`, `paragraph`, `image`, `buttonLeft`, `buttonRight`, `buttonsVisibility`, `paddingBottom` |
| `SectionHero1` | Alternative hero | `title`, `subtitle`, `image`, `displayNewsletter`, `displayButtons`, `slot`, `slot2` |
| `SectionHero2` | Simple hero | `title`, `loremIpsum` |
| `SectionFeature` | Feature block (image + text) | `variant` ("Layout • Base" \| "Layout • Reversed" \| "Image • Overflow" \| "Title • Bigger" \| "Layout • Reversed + Title • Bigger"), `title`, `paragraph`, `image`, `labelLabelText`, `buttonButtonText`, `buttonButtonLink` |
| `SectionFeaturesHeader` | Centered heading + subtext | `title`, `text`, `textVisibility` |
| `SectionCompliantCarousel` | Framework cards carousel | `title`, `spaceTop`, `spaceBottom`, `variant` |
| `SectionLogostrip` | Company logos | `variant` ("Base" \| "Not clickable") |
| `SectionTestimonials` | Customer quotes | `title`, `text`, `buttonText`, `buttonLink` |
| `SectionResources` | Blog/resource cards | `title` |
| `SectionCta` | Call-to-action | `title`, `paragraph`, `buttonText`, `buttonLink` |
| `SectionCtaPill` | Decorative CTA with pills | (no props) |
| `SectionPillIllus` | Full-width image with pill shapes | `image` |
| `SectionBreadcrumbs` | Breadcrumb nav | check props in file |
| `SectionCareersIntro` | Careers page intro | check props in file |
| `SectionContactSidebar` | Contact sidebar | check props in file |
| `SectionNumbers` | Stats/numbers | check props in file |
| `SectionInvestors` | Investors section | check props in file |
| `Footer` | Site footer | (no props, hardcoded) |

### 5. Available Webflow Element Components

These are in `webflow/elements/`:

| Component | Use for | Key props |
|---|---|---|
| `Button` | CTA buttons | `text`, `link` ({href, target}), `variant` ("Primary" \| "Secondary" \| "Tertiary" \| "Primary - Small"), `arrow` |
| `CardIcon` | Icon + title + description card | `icon`, `title`, `description`, `variant` |
| `CardImage` | Image card (blog etc.) | check props in file |
| `CardTestimonial` | Testimonial card | `testimonial`, `logo`, `authorAuthorName`, `authorAuthorRole`, `authorAuthorImage` |
| `Label` | Small label text | check props in file |
| `NewsletterForm` | Email signup form | (no props) |
| `ElementSocialproofTrustpilot` | Trustpilot badge | `text1`, `text2`, `image`, `link` |

### 6. Add translations

Add the page's text content to both `messages/en.json` and `messages/fr.json`.

Structure translations under a key matching the page:
```json
{
  "frameworksEcovadis": {
    "hero": {
      "title": "EcoVadis",
      "subtitle": "Structure your approach..."
    },
    "feature1": {
      "label": "Assessment preparation",
      "title": "...",
      "description": "..."
    }
  }
}
```

Get the **English text** from the Webflow HTML file.
Get the **French text** from the corresponding French Webflow page (check `/Users/stanislasbertrand/Downloads/ditto-preprod.webflow/` — the French HTML may not be exported separately; if not, check the live site at `https://www.trustditto.com/fr/...`).

### 7. Copy images

Any images referenced in the page's HTML that aren't already in `public/images/` need to be copied from:
```
/Users/stanislasbertrand/Downloads/ditto-preprod.webflow/images/
```
to:
```
/Users/stanislasbertrand/devenv/ditto-landing-page/public/images/
```

Use local paths in component props: `/images/your-image.avif`

### 8. Components that need i18n copies

If a Webflow component has **hardcoded text that changes per page or per locale**, and it doesn't accept that text as a prop, you need to make a copy:

1. Copy from `webflow/elements/Foo.tsx` to `src/components/FooI18n.tsx`
2. Fix the import paths: change `"../devlinkScope"` to `"../../webflow/devlinkScope"`, `"../webflow_modules/"` to `"../../webflow/webflow_modules/"`, `"./Button"` to `"../../webflow/elements/Button"`, etc.
3. Add `import { useTranslations, useLocale } from "next-intl"` at the top
4. Add `const t = useTranslations("yourKey")` and `const locale = useLocale()` in the function body
5. Replace hardcoded `"/en/"` in hrefs with `` `/${locale}/` ``
6. Replace hardcoded English strings with `t("key")` calls
7. **Change nothing else** — keep all JSX structure, class names, and component usage identical

### 9. Handling "NotSupported" elements

Some Webflow components show `"This builtin is not currently supported: Collection List"` or `"Locales Wrapper"`. These are CMS-driven dynamic content that couldn't be exported. For now, leave them as-is. They will be addressed separately when we implement CMS integration.

### 10. Verify

After creating the page:

1. Run `npm run build` — must pass with no errors
2. Run `npm run dev` and check both:
   - `http://localhost:3000/en/your-page`
   - `http://localhost:3000/fr/your-page`
3. Compare visually with the live Webflow page at `https://www.trustditto.com/en/your-page`

## Common Pitfalls

- **Don't use Tailwind classes** on Webflow components — they have their own CSS via the Webflow class system
- **Don't restructure Webflow JSX** — even small changes (reordering props, removing wrapper divs) can break the CSS
- **Always read the component's `.tsx` file** to understand its props before using it — don't guess
- **Import paths differ** between `webflow/` components (they use `../`) and `src/components/` copies (they need `../../webflow/`)
- **The `"use client"` directive** is required on page components that use `useTranslations()` or `useLocale()`
- **The `<div className="page-wrapper"><main className="main-wrapper">` wrapper** is required on every page for Webflow CSS to work correctly
