---
name: editorial-calendar-article
description: >
  Use this skill whenever the user asks to write an article from the editorial
  calendar, turn a calendar entry into drafts, or produce "the article for
  <topic>" from the planning board. Triggers include "write the next article
  from the editorial calendar", "draft this calendar entry", "take this row from
  the plan and write it up", "write the EcoVadis-for-electronics piece we
  planned", or pointing at a line in content/media/plans/*.md or the Notion
  editorial calendar. This skill fans a single calendar topic out into TWO
  deliverables — one Ditto blog article and one The Scope article — each written
  to its own surface's contract, because the blog and The Scope are opposite
  registers that answer different questions. It does not carry the two
  surfaces' contracts itself: it routes the topic, splits the angle, and hands
  each branch to the authoritative skill (ditto-blog-optimisation for the blog,
  scope-article for The Scope). Do not write either piece from memory — load the
  branch skills, whose formats are validated downstream.
---

# Writing an article from the editorial calendar

One topic on the editorial calendar, two surfaces. This skill takes a calendar
entry and produces **two separate `.md` deliverables in parallel** — a **Ditto
blog** article and a **The Scope** article — each obeying its own surface's
rules. The two surfaces are not two styles of the same piece: they answer
different questions for different readers, and mixing their registers is the
main failure mode this skill exists to prevent.

## Read this first: the surfaces are opposites

Before writing anything, read `content/media/EDITORIAL-LINE.md` §6 ("Where a
piece goes"). It is the routing law. The short version, because it decides
everything downstream:

| | **Ditto blog** | **The Scope** |
|---|---|---|
| Whose voice | Ditto speaking **as Ditto** about its product | An **independent** media property |
| Question it answers | "How does Ditto help me with X?" (the SEO query) | "What do I actually do about X?" (the peer-over-lunch question) |
| Promotion | Frankly promotional: features, CTAs, demo links | None. No CTA in the body, ever. Rarely mentions Ditto |
| Bar on a claim | Needs an **owner** — the business's own figures are usable as given | Needs a **source** — an unsourced number does not run |
| Scope of topics | Ditto's product and the frameworks it sells against | The whole compliance job, **including what Ditto doesn't sell** (ISO, REACH, EUDR, MASE…) |
| Governing skill | `ditto-blog-optimisation` | `scope-article` |

The consequence for a fan-out: the **same topic becomes two different pieces
with two different angles**, so they never cannibalize each other. "Carbon
footprint" is, on the blog, "run your carbon footprint faster with Ditto"; on
The Scope, "how to run the carbon-footprint project for a transport company,
sourced." Split the angle on purpose — §6 rule 4 is the whole
anti-cannibalization policy.

## Workflow

### 1. Get the calendar entry

The "editorial calendar" is wherever the topic was planned:

- **The Scope's calendar** is the plan files in `content/media/plans/`
  (`the-scope-first-200-articles.md`, `carbon-2026.md`). Each entry already
  carries title, format (Reference/Feature), author, date, `section` path,
  industries, the angles to cover and the sources to work from.
- **The blog's calendar** is the Notion base referenced in the
  `ditto-blog-optimisation` skill (published + upcoming articles with FR/EN
  URLs). Read it with WebFetch if the user points at it.

If the user pasted a brief or a row, use that. Pull out: the topic, the target
framework/collection, the intended reader, any figures and their sources, and —
for The Scope — the `section` path, format and byline the plan already assigns.
**Never invent a statistic, date, study, source or URL to fill a gap** — this
rule holds on both surfaces (`EDITORIAL-LINE.md` §6, last paragraph).

### 2. Route before you fan out

Apply `EDITORIAL-LINE.md` §6, first match wins, to decide which surfaces the
topic actually supports:

- About Ditto (funding, product, hires, awards, customers), or advice that only
  works if you own the product → **blog only**.
- A framework outside Ditto's five (EcoVadis, CSRD, CDP, carbon, VSME) — ISO
  45001, REACH, EUDR, duty of vigilance, workplace safety → **The Scope only**
  (the blog has nothing to sell against it).
- In the overlap zone (one of the five frameworks, practitioner or timing
  angle) → **both**, split by the shape of the question.

Default to the two-surface fan-out the user asked for, **but say so plainly when
a topic genuinely fits only one surface** — forcing a promotional blog piece
about REACH, or a source-free Scope piece, breaks the surface it is forced onto.
When in doubt on a borderline entry, ask the user rather than guessing.

### 3. Fan out — one focused branch per surface

Run the two branches **independently**, ideally as one subagent per surface, so
the promotional register and the restrained register never bleed into each
other. Give each branch only its own angle, its own sources, and its own skill.

- **Blog branch → produces `<url>-blog.md`.**
  1. Write the French draft in the blog register: Ditto speaking as Ditto,
     product-forward, promotional, structured for the SEO cocon of its
     collection. A claim needs an owner, not a public citation.
  2. Then **load the `ditto-blog-optimisation` skill** and run it over the
     draft: the `<keytakeaways>` summary block, internal meshing (maillage) with
     verified collection URLs, guide + demo CTAs, `/frameworks` `/features`
     `/industry` site links, the `<faq>` block and the recap `blog-table`, then
     the idiomatic US-English translation. Validate the FR with the user before
     translating, exactly as that skill requires. Deliver the FR and EN files it
     produces.
  3. **Cold-read the draft against `content/media/WRITING-CRAFT.md`** before
     handing it over, in both languages. The `ditto-blog-optimisation` skill
     lives outside this repo and does not carry these craft rules, so the blog
     gets its coherence-and-clarity and anti-slop pass here: no hollow
     assertions, no object drift, flagged figure reuse (§A), the sentence-level
     fixes (§B), the banned-word and banned-pattern list and the Openers rule
     (§C — these are universal, not Scope-specific, so a promotional opener
     still cannot use the "most people think, but actually" straw-man shape),
     and the reviewer protocol (minimum effective edit, preserve the writer's
     voice, name-quote-fix rather than rewrite). Fix what is right, keep the
     blog's promotional register.

- **The Scope branch → produces the article `.mdx`.**
  1. **Load the `scope-article` skill** and follow it end to end. It is the
     authoritative contract: read the editorial-line, tone-of-voice, file-format,
     taxonomy, components, SEO-AEO, illustrations and author-styles docs it names
     before writing; French first then US-English translation, both languages in
     **one `.mdx` file** with locale markers; real byline; generated hero
     photograph; the cold-reader critique per locale; and the render check.
  2. Do not write it from memory or by copying an existing article — the
     frontmatter is validated at build time and a violation fails the build.

Both branches keep the shared law: no invented figures, no guaranteed
scores/medals/audit outcomes, no fabricated sources or URLs, no unverified claim
about a named third party, accurate regulatory statements, no em dashes, US
English in EN, acronyms spelled out (`EDITORIAL-LINE.md` §6). Both branches also
keep the **cross-surface craft rules** in `content/media/WRITING-CRAFT.md`:
logical coherence (no hollow assertions, no object drift, flag reused figures),
the sentence-level fixes, the anti-slop vocabulary and patterns (banned words,
banned rhetorical patterns, the Openers rule — §C), and the reviewer protocol.
Those rules are about logic, clarity and not reading as machine-written, not
register, so they hold on the promotional blog exactly as they do on the
restrained Scope. In particular: the blog draft's opening sentence is subject
to the same Openers rule as a Scope article — no "it's not X, it's Y" binary
contrast, no invented-consensus straw man, no throat-clearing. Open on
something concrete instead. That same "it's not X, it's Y" binary-contrast
shape (WRITING-CRAFT.md §C2, "Binary contrast" and "Negative listing") is not
confined to the opener — it creeps into headings and body sentences just as
easily, so watch for it there too while drafting, not only when the cold read
catches it.

### 4. Reconvene and deliver

Before handing back, check the two drafts against each other: they must answer
**different questions**, not restate the same content in two tones. If they
overlap, re-angle per §6 rule 4. Then deliver the two deliverables separately
and clearly labelled, and state which surface each is for and what the next
publishing step is (blog → `supabase-cms-ditto`; The Scope → merge to `main`).

## When corrections come back

Whenever the user makes a manual correction to a draft, or gives feedback on how
an article should read, treat it as a possible **general rule**, not a one-off
edit. Apply the fix, then ask the user whether to fold the correction into the
right standing instruction so it holds for every future article: the
`ditto-blog-optimisation` or `scope-article` skill, the editorial docs under
`content/media/`, or `AGENTS.md`. This is also written into `AGENTS.md` so it
applies to any article work, not only through this skill.

## Things that are easy to get wrong

- **The blog is allowed to sell; The Scope is not.** Applying The Scope's
  restraint to the blog costs the blog the only thing it is for, and applying
  the blog's promotion to The Scope destroys the independence that makes its
  framework coverage worth reading.
- **Two `.md` deliverables, one per surface** — not one article dual-published.
  The Scope's file is a single bilingual `.mdx`; the blog is delivered as FR then
  EN markdown for the CMS. That is the fan-out.
- **A source is not the same as an owner.** On The Scope every external number
  needs a citation; on the blog the business's own figures are the business's to
  state. Do not import one surface's evidence bar into the other.
- **Not every topic is a fan-out.** Route first. Say when a topic belongs to
  only one surface.
