# Article file format

One article is one file: `content/media/articles/<url>.mdx`. It holds both languages. This document is the precise contract; [TONE-OF-VOICE.md](../TONE-OF-VOICE.md) is what to write, this is how to file it.

The loader is `src/features/media/lib/articles.ts`. Everything below is enforced there, and a violation fails the build naming the file and the reason. There is no "publishes anyway with a warning" path, deliberately.

## Skeleton

```mdx
---
url: reach-2026-checklist
author: alexis-de-taillac
illustration: /media/illustrations/reach-2026-checklist.svg
date: "2026-07-15"
updated: "2026-08-02"
section: [supply-chain, reglementations-produit-et-chaine, reach]
alsoIn:
  - [qhse, environnement-et-excellence-operationnelle]
industries: [electronique, cosmetiques-beaute]
draft: false

en:
  title: "REACH in 2026: the checklist electronics manufacturers actually need"
  description: "REACH obliges you to know, and to declare, what is inside the components you buy."
  alt: "Flat geometric illustration of stacked layers crossed by a diagonal rule"
fr:
  title: "REACH en 2026 : la checklist dont les fabricants d'électronique ont vraiment besoin"
  description: "REACH vous oblige à savoir, et à déclarer, ce que contiennent les composants que vous achetez."
  alt: "Illustration géométrique de couches empilées traversées par une diagonale"
---

<!-- locale:en -->

English body.

<!-- locale:fr -->

Corps en français.
```

## Shared fields

Anything true of the article regardless of language sits at the top level. It cannot diverge between languages, which is the point.

| Field | Required | Rules |
|---|---|---|
| `url` | yes | Lowercase, hyphenated, ASCII. **Must equal the filename** without `.mdx`, so an article can never have two addresses. Serves `/en/media/<url>` and `/fr/media/<url>`. Changing it breaks inbound links; don't, after publication. |
| `author` | yes | A slug from `content/media/authors/`. The author file must exist first. |
| `illustration` | yes | Path under `/public`, e.g. `/media/illustrations/<url>.svg`. See [ILLUSTRATIONS.md](./ILLUSTRATIONS.md). |
| `date` | yes | `"YYYY-MM-DD"`, quoted. The true first-publication date. Drives ordering everywhere and `datePublished`. |
| `updated` | no | `"YYYY-MM-DD"`. Set it when the substance changed, never for a typo. Drives `dateModified` and the "Updated on" line. |
| `section` | yes | Two or three taxonomy slugs, `[level1, level2]` or `[level1, level2, level3]`. Every theme has level-3 topics. The canonical home: breadcrumb, card kicker, primary `about`. |
| `alsoIn` | no | Up to three secondary placements, each one to three slugs. Listing only. See [TAXONOMY.md](./TAXONOMY.md). |
| `industries` | no | Slugs from `INDUSTRIES`. Omit or leave empty to mean **all industries**. |
| `draft` | no | `true` hides the article in production builds. It still renders in `npm run dev`. |

## Per-language fields

| Field | Required | Rules |
|---|---|---|
| `<locale>.title` | yes | The H1 and the `<title>`. A statement, not clickbait. Long is fine, it sets in serif. |
| `<locale>.description` | yes | The standfirst, the meta description, the card dek and the JSON-LD `description`. It must read standalone, because it is used out of context. Aim under ~155 characters. |
| `<locale>.alt` | no | Alt text for the illustration, in that language. Omit for a decorative image; an empty value is treated as decorative, not as missing. |

Both `en:` and `fr:` blocks are required. There is no fallback to the other language: a half-translated article fails the build rather than shipping an English page under a French URL.

## The two bodies

Each body is introduced by a locale marker on its own line:

```mdx
<!-- locale:en -->
```

The marker is an HTML comment specifically because **MDX rejects HTML comments** as a syntax error. That means a marker can never appear inside real article content, so the split is unambiguous. Inside a body, use `{/* … */}` if you need a comment.

Both markers are required, in either order, and neither body may be empty. Everything between a marker and the next one (or end of file) is that language's body.

## What is derived, not authored

- **Read time** is computed per language from the body word count at 200 words per minute. Do not put it in the frontmatter.
- **Heading anchors** are generated from headings by `rehype-slug`.
- **Related articles** come from taxonomy overlap.
- **Breadcrumbs** come from `section`.

## Validation errors you may hit

| Message | Cause |
|---|---|
| `url "x" must match the filename "y.mdx"` | Renamed the file or the field but not both. |
| `unknown section "a/b"` | The path does not exist in `src/features/media/data/taxonomy.ts`. |
| `alsoIn section "x" is already covered by section "y"` | A secondary placement on the primary's own branch. Redundant: prefix matching already covers it. |
| `unknown author "x" (see content/media/authors/)` | No author file with that slug. |
| `date "x" must be YYYY-MM-DD` | Unquoted or reformatted date. Quote it. |
| `missing "fr:" block with a title and a description` | One language's frontmatter block is absent. |
| `missing or empty "<!-- locale:fr -->" body` | One language's body is absent or empty. |

## Checks before opening a PR

```bash
npm run dev          # port 3456
```

Then load `/en/media/<url>` and `/fr/media/<url>`. A frontmatter problem shows as a 500 with the exact message, not a silent fallback.
