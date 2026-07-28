# SEO and answer-engine optimisation

Northstar's job is to be the thing a practitioner finds and a machine can quote correctly. Most of that is automatic; this document says what the code does for you, what you control while writing, and what is still missing.

## What is emitted automatically

You do not hand-write any of this.

**Every page**

- `Organization` for Northstar, with `parentOrganization` pointing at Ditto, plus a `WebSite` node. Northstar is never presented as independent from Ditto.
- `BreadcrumbList`, built from the taxonomy. The last crumb carries no URL, per Google's guidance.
- `<html lang>` matching the page's language, one canonical URL, and `hreflang` linking the EN and FR twins with an `x-default`.

**Article pages**

- `Article` with `headline`, `description`, `image`, `datePublished`, `dateModified`, `inLanguage`, `mainEntityOfPage`, `url`, an `author` `Person` (with their LinkedIn as `sameAs`), `publisher` and `isPartOf` pointing at the Northstar nodes, `about` from the canonical section plus industries, and `keywords` including secondary placements.
- Also `articleSection` (the canonical taxonomy labels), `wordCount`, `timeRequired` as an ISO 8601 duration matching the byline's read time, and `isAccessibleForFree`. All derived, none authored.
- Open Graph: `og:type=article`, title, description, `publishedTime`, `modifiedTime`, author, image.

**Listing pages** — the home page, theme pages and industry pages emit a `CollectionPage` whose `mainEntity` is an ordered `ItemList` of the articles shown, so an engine sees a structured list rather than a page of links. A theme page's list includes articles cross-filed in via `alsoIn`, exactly as the page does.

**The industry filter is deliberately not a page.** `?industry=` narrows the home page and theme pages, and it is read on the client so those pages stay static. That means a filtered view is never indexed, which is the point: theme × industry is 58 × 8 combinations, and generating a listing page for each would be textbook faceted-navigation clutter. The eight industry pages remain as real destinations for the single-facet browse. When a theme-and-industry combination is worth ranking for, write the article: `section` files it under the theme, `industries` under the sector, and it then appears on both pages and under both filters.

**Author pages** — `ProfilePage` wrapping a `Person` with the bio and photo, plus a standalone `ItemList` of that author's articles. It is a separate node rather than part of the ProfilePage, because an `ItemList` is not a `CreativeWork` and cannot be a `hasPart`.

**FAQ blocks** — `FAQPage`, only from the `<FAQ>` component, only from questions visible on the page.

## What you control while writing

Structured data is only as good as the text it wraps.

**`description` is the single highest-leverage field.** It is the meta description, the card dek, the JSON-LD `description`, and the sentence an answer engine is most likely to lift. Write it as a standalone answer to the article's question, not a teaser. "REACH obliges you to know, and to declare, what is inside the components you buy" works quoted out of context; "Everything you need to know about REACH" does not.

**Answer the title's question in the first paragraph.** Answer engines extract passages, not pages. A piece that withholds its answer until the conclusion gets skipped for one that does not.

**One H1, then meaningful H2s.** Headings become anchor ids automatically, and they are how a machine finds the passage that answers a question. "The five documents auditors ask for first" is a retrievable heading; "Some considerations" is not.

**FAQ answers must stand alone.** They are extracted and read in isolation. See [COMPONENTS.md](./COMPONENTS.md).

**Facts need dates and sources.** "Since January 2021" and "twice a year" survive being quoted. "Recently" and "often" do not, and they age badly.

**Name things exactly.** REACH, CSRD, ISO 45001, Article 33, the Candidate List. Exact entity names are what retrieval matches on. Spell out acronyms on first use anyway, for humans.

**Filing is a machine-readable claim.** `section` becomes `about`; `industries` becomes keywords. Filing an article in the wrong branch teaches an engine the wrong thing about it.

## Known gaps, as of this writing

Be honest about these rather than assuming the section is fully optimised.

1. **Nothing is indexable yet.** Both media layouts send `noindex, nofollow`, `robots.ts` disallows `/media`, `/en/media` and `/fr/media`, and no media URL is in the sitemap. That is deliberate pre-launch, and it means none of the above has any effect in search or answer engines until it is switched off. The flip is documented in [../README.md](../README.md).

2. **Illustrations are SVG.** Google's structured-data image requirements do not accept SVG, and several social and chat platforms will not render an SVG preview. Both `Article.image` and `og:image` currently point at one. Raster exports (1200×630 PNG or WebP) are needed before launch, either alongside the SVG or instead of it.

3. **The publisher has no logo.** `Article` rich results expect `publisher.logo` as an `ImageObject`. The Northstar `Organization` node has none.

4. **No Twitter card tags**, so link previews fall back to Open Graph, which mostly works but is not controlled.

5. **Heading anchors exist but nothing uses them.** There is no table of contents and no visible anchor links, so the ids are dead weight rather than navigation.

None of these are blocking for writing. Items 2 and 3 are blocking for rich results, and item 1 is blocking for everything.
