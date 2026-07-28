---
name: northstar-article
description: >
  Use this skill whenever the user wants to write, draft, translate, restructure
  or review an article for Northstar, the Ditto media at trustditto.com/media.
  Triggers include "write an article about EcoVadis for Northstar", "draft a
  Northstar piece on the EUDR", "add an article to the media", "translate this
  article into French for Northstar", "review this draft against our tone of
  voice", or any request to add or edit files under content/media/. It carries
  Northstar's editorial contract (tone of voice, anti-AI-slop rules), the exact
  file format and frontmatter contract, the available MDX components, the
  taxonomy filing rules, and the SEO/AEO requirements. Do not write a Northstar
  article from memory or by copying an existing one without loading this skill:
  the frontmatter is validated at build time and a violation fails the build.
---

# Writing a Northstar article

Northstar is Ditto's magazine for the people who own QHSE, CSR and supply-chain
compliance. It is file-based MDX, bilingual, and validated at build time.

## Read these first, every time

Do not skip these because a request looks small. They are the contract, and they
change.

1. `content/media/TONE-OF-VOICE.md` — **the editorial contract**: audience, voice,
   non-negotiables (no invented statistics, no fabricated sources, no
   greenwashing, no guaranteed outcomes), the banned-word and banned-pattern
   lists, mechanics (no em dashes, US English in EN), bilingual rules, and the
   structured-data entity conventions.
2. `content/media/authoring/FILE-FORMAT.md` — the exact frontmatter contract and
   the locale-marker body format.
3. `content/media/authoring/TAXONOMY.md` — how to choose `section`, `alsoIn` and
   `industries`.
4. `content/media/authoring/COMPONENTS.md` — the MDX components available and the
   rules for each, particularly `<FAQ>`.
5. `content/media/authoring/SEO-AEO.md` — what the code emits and what the writer
   controls.
6. `content/media/authoring/ILLUSTRATIONS.md` — only when creating the artwork.

Read an existing article, for example
`content/media/articles/reach-2026-checklist.mdx`, to see the shape in practice.

## Workflow

1. **Establish the facts before writing.** Ask the user for the source material,
   figures and dates if they are not supplied. Never invent a statistic, a date,
   a study, a source or a URL to fill a gap: write `[STAT: verify]` and say so.
   This outranks every other instruction here.

2. **Confirm the author.** `author` must be an existing slug in
   `content/media/authors/`. Authors are real people who become `Person` entities
   in structured data, so never invent one. If the user has not said who is
   writing, ask rather than guessing.

3. **Pick the `url`** — lowercase, hyphenated, English, stable, and equal to the
   filename. It is permanent once published.

4. **File it**: `section` (2 or 3 taxonomy slugs), optional `alsoIn` (up to 3),
   `industries` (omit or leave empty for all). Validate the slugs against
   `src/features/media/data/taxonomy.ts` rather than assuming.

5. **Write English and French.** French is a true editorial translation, not a
   literal one, and both languages carry the same facts and figures. Remember
   `<KeyTakeaways title="À retenir">` in the French body.

6. **Create the illustration** at `public/media/illustrations/<url>.svg` following
   ILLUSTRATIONS.md, and write the `alt` in each language.

7. **Self-check against the checklist** at the end of TONE-OF-VOICE.md, honestly.
   The anti-slop rules are the point of that file, not decoration: no banned
   words, no "it's not X, it's Y", no throat-clearing, no unexplained
   significance, no em dashes.

8. **Verify it renders.** Run the dev server (`npm run dev`, port 3456) and load
   both `/media/<url>` and `/fr/media/<url>`. A frontmatter violation shows as a
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
- Northstar articles rarely mention Ditto. When they do, they offer the
  non-product fallback. There is no CTA block: this is a magazine, not a funnel.
- Target roughly 1,200 to 2,200 words. Shorter is fine if the topic is genuinely
  small; padding is not.
