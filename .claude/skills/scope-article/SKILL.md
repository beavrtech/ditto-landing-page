---
name: scope-article
description: >
  Use this skill whenever the user wants to write, draft, translate, restructure
  or review an article for The Scope, the Ditto media at trustditto.com/en/media.
  Triggers include "write an article about EcoVadis for The Scope", "draft a
  The Scope piece on the EUDR", "add an article to the media", "translate this
  article into French for The Scope", "review this draft against our tone of
  voice", or any request to add or edit files under content/media/. It carries
  The Scope's editorial contract (tone of voice, anti-AI-slop rules), the exact
  file format and frontmatter contract, the available MDX components, the
  taxonomy filing rules, and the SEO/AEO requirements. Do not write an article for The Scope
  article from memory or by copying an existing one without loading this skill:
  the frontmatter is validated at build time and a violation fails the build.
---

# Writing an article for The Scope

The Scope is Ditto's magazine for the people who own QHSE, CSR and supply-chain
compliance. It is file-based MDX, bilingual, and validated at build time.

## Read these first, every time

Do not skip these because a request looks small. They are the contract, and they
change.

1. `content/media/EDITORIAL-LINE.md` — **what The Scope publishes and why**: the promise,
   the beat, the refusals list, the reference-versus-feature split (which sets the length
   and who signs the piece), and the test for The Scope versus the Ditto blog. Read it
   first: it decides whether the article should exist before the tone of voice decides how
   it reads.
2. `content/media/TONE-OF-VOICE.md` — **the editorial contract**: audience, voice,
   non-negotiables (no invented statistics, no fabricated sources, no
   greenwashing, no guaranteed outcomes), the banned-word and banned-pattern
   lists, mechanics (no em dashes, US English in EN), bilingual rules, and the
   structured-data entity conventions.
3. `content/media/authoring/FILE-FORMAT.md` — the exact frontmatter contract and
   the locale-marker body format.
4. `content/media/authoring/TAXONOMY.md` — how to choose `section`, `tags`,
   `alsoIn` and `industries`. The tree is two levels deep and the named
   frameworks are tags, which is recent: do not copy the filing of an article
   you remember.
5. `content/media/authoring/COMPONENTS.md` — the MDX components available and the
   rules for each, particularly `<FAQ>`.
6. `content/media/authoring/SEO-AEO.md` — what the code emits and what the writer
   controls.
7. `content/media/authoring/ILLUSTRATIONS.md` — the house photography style and
   the generator. Read it before making any artwork; the hero image is a
   generated photograph, not the flat SVG the older articles carry.
8. `content/media/authoring/AUTHOR-STYLES.md` — the per-author byline registers:
   each author's journalistic role, rhythm, signature moves and off-limits. A
   thin layer applied on top of the tone of voice, which always wins on
   conflict.

Read an existing article, for example
`content/media/articles/reach-2026-checklist.mdx`, to see the shape in practice.

## Workflow

1. **Establish the facts before writing.** Ask the user for the source material,
   figures and dates if they are not supplied. Never invent a statistic, a date,
   a study, a source or a URL to fill a gap: write `[STAT: verify]` and say so.
   This outranks every other instruction here.

2. **Confirm the author, then write in their register.** `author` must be an
   existing slug in `content/media/authors/`. Authors are real people who become
   `Person` entities in structured data, so never invent one. A reference piece
   is signed by the section editor of its theme: the table lives in
   `content/media/EDITORIAL-LINE.md` ("The section editors"). A feature is signed
   by whoever's judgment it is; if the user has not said who, propose the byline
   whose role in AUTHOR-STYLES.md matches the shape and ask rather than
   guessing. Once the byline is set, apply that author's block from
   AUTHOR-STYLES.md throughout the draft, in both languages.

3. **Pick the `url`** — lowercase, hyphenated, English, stable, and equal to the
   filename. It is permanent once published.

4. **File it**: `section` (exactly 2 taxonomy slugs, `[pillar, theme]`), `tags`
   (up to 5 named frameworks or practices, e.g. `reach`, `bilan-carbone`),
   optional `alsoIn` (up to 3 placements of 1 or 2 slugs), and `industries`
   (omit or leave empty for all). The tree is two levels deep: anything that
   feels like a third level is a tag. Validate every slug against
   `src/features/media/data/taxonomy.ts` rather than assuming.

5. **Write the French first, in full.** French is the source text: most of the
   readership and most of the authors work in it, and the regulatory vocabulary
   is French before it is anything else. Finish it before translating, structure,
   edit and self-check included. Translating a draft you have not settled means
   editing the same sentence twice in two languages.

6. **Then translate it into English**, working from the finished French with this
   instruction:

   > Translate the following text into English for a professional journalistic
   > audience. Do not translate word-for-word, prioritize natural, idiomatic
   > English that a native English-speaking journalist would actually write.

   Translate the body, the `title`, the `description` and the illustration `alt`.
   Both languages carry the same facts and figures. The English is **US English**
   (organize, behavior, color, truck rather than lorry), takes the default
   `<KeyTakeaways>` title, and spells out French-specific terms on first use: AOP
   becomes "PDO (Protected Designation of Origin, AOP in French)", and the same
   for any acronym a reader outside France would not carry. The full bilingual
   rules are in [TONE-OF-VOICE.md](../../../content/media/TONE-OF-VOICE.md) §6.

7. **Generate the hero photograph.** Every new article gets one, in the house
   style, at `public/media/illustrations/<url>.webp`:

   ```bash
   npm run illustration -- <url> "<one or two sentences naming what is in the frame>"
   ```

   Write only the scene; the style, the lens and the prohibitions are in the
   script. Photograph the circumstances of the subject, not the subject: the
   room the audit happens in, not the audit. People are welcome, absorbed in
   their work and unaware of the camera, never posing. Then **look at the
   result** before accepting it — the model does not reliably obey "no text",
   and legible lettering is disqualifying. Regenerate with `--force` if it did
   not. Point
   `illustration` at the `.webp` and write the `alt` in each language,
   describing the photograph rather than the article. ILLUSTRATIONS.md has the
   full contract and worked examples.

8. **Have a cold reader critique each language, separately.** Once the draft is
   settled in both languages, spawn one fresh subagent per locale — an agent
   that has not seen the draft being written. Give each only the article file,
   its locale, and the editorial contract (EDITORIAL-LINE.md, TONE-OF-VOICE.md,
   AUTHOR-STYLES.md), and ask it to critique that one language: does every
   sentence mean something, is any fact stated twice, does anything violate the
   tone of voice or the author's register. Run the French and English critiques
   independently — a translation can be faithful to a sentence that does not
   parse. Then implement the findings yourself, with judgment: fix what is
   right, drop what is not. Do not skip this step because the draft feels
   finished; the flaws it catches are precisely the ones the drafting session
   cannot see.

9. **Self-check against the checklist** at the end of TONE-OF-VOICE.md, honestly.
   The anti-slop rules are the point of that file, not decoration: no banned
   words, no "it's not X, it's Y", no throat-clearing, no unexplained
   significance, no em dashes.

10. **Verify it renders.** Run the dev server (`npm run dev`, port 3456) and load
   both `/en/media/<url>` and `/fr/media/<url>`. A frontmatter violation shows as a
   500 with the exact reason. Do not report an article as done without this.

## Things that are true and easy to get wrong

- One file per article holds **both** languages, separated by
  `<!-- locale:en -->` and `<!-- locale:fr -->`. It is not a folder with two files.
- `url` must equal the filename, or the build fails.
- Read time is computed from the body. Never author it.
- `description` is the standfirst, the meta description, the card dek and the
  JSON-LD description at once, so it must read standalone.
- `<FAQ>` emits structured data. Only real questions, answers self-contained and
  in plain text, never marketing copy, and never a question whose answer is not
  on the page.
- The Scope articles rarely mention Ditto. When they do, they offer the
  non-product fallback. Never write a CTA into the body: the article page adds a
  newsletter card in its side rail, and that is the only ask an article makes.
- The page builds a table of contents from your `##` headings, so headings are
  navigation as well as structure. Write them as statements a reader could scan.
- Length follows the format set in EDITORIAL-LINE.md: roughly 600 to 1,200 words
  for a **reference** piece, 1,200 to 2,200 for a **feature**. Decide which one
  the piece is before writing. Padding a reference piece up to feature length is
  the most reliable slop tell there is.
