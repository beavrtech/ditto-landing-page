# Filing an article: section, tags, alsoIn, industries

Four independent axes. Getting them right matters beyond tidiness: they drive breadcrumbs, listing pages, related articles and structured data.

The vocabulary lives in `src/features/media/data/taxonomy.ts`. Slugs there are the only valid values, and the build rejects anything else.

## `section` — where the article lives

One path, **exactly two levels deep**. The hierarchy stops there.

- **Level 1** is the pillar: `qhse` (the management system and the shop floor), `rse` (the performance you have to prove to the outside world), `supply-chain` (suppliers and the products upstream).
- **Level 2** is the theme: `notations-et-evaluations`, `climat-et-carbone`, `achats-responsables`, …

An article about EcoVadis scoring is `[rse, notations-et-evaluations]`. An article about getting started with ISO 45001 is `[qhse, normes-et-systemes-de-management]`. The named thing itself, EcoVadis, ISO 45001, is a **tag**, not a third level.

`section` decides:

- the **breadcrumb** on the article page,
- the **kicker** on every card, everywhere the article appears,
- part of the **primary `about`** in structured data.

So it must be the single best answer to "where does this belong". If two answers feel equally right, that usually means the article is trying to be two articles.

## `tags` — what it is about

A flat list of the named frameworks, regulations and practices the piece covers: `reach`, `csrd`, `ecovadis`, `iso-45001`, `bilan-carbone`, `scopes`, `ppwr`, …

```yaml
section: [supply-chain, reglementations-produit-et-supply-chain]
tags: [reach]
```

Tags are **global, not owned by a theme**. That is the whole point of them: a REACH piece filed under supply chain and a REACH piece filed under QHSE land on the same `/media/tag/reach` page, which a three-level hierarchy could never do. Rules:

- **Up to five**, and fewer is better. Tag what the article is genuinely about, not everything it mentions in passing.
- Each tag gets its own page at `/en/media/tag/<slug>` and `/fr/media/tag/<slug>`, listing every article that carries it.
- Tags join the **primary `about`** in structured data alongside the section, because the framework is usually the strongest statement of what a piece is about.
- They render as links in two places, both before the reading: in the article head, under the industries line and above the headline, and on the article's card in every listing, under the dek.
- Omit the field entirely if no named thing applies. That is rare but legitimate.

## `alsoIn` — where else it is worth reading

An article often lives in one pillar but is genuinely useful to readers of another. `alsoIn` lists up to three secondary placements:

```yaml
section: [supply-chain, reglementations-produit-et-supply-chain]
alsoIn:
  - [qhse, environnement-et-excellence-operationnelle]
  - [supply-chain, tracabilite-donnees-et-risques]
tags: [reach]
```

Rules and behavior:

- Each entry is a path of **one or two** slugs, matching the depth of the tree. A bare `- [rse]` files the piece under the whole CSR pillar, which is a legitimate and common statement.
- A placement reaches **its own page and its parents, never its children**. `- [rse]` puts the article on `/en/media/theme/rse` but not on `/en/media/theme/rse/climat-et-carbone`. This is the same rule `section` follows.
- Cross-filing changes **listing only**. The URL, breadcrumb, card kicker and primary `about` all stay those of `section`.
- Secondary placements join `keywords` in structured data but never `about`.
- The build rejects more than three entries, duplicates, unknown paths, and any entry on the primary's own branch (redundant, since prefix matching already covers it).

Use it when a reader of the other pillar would genuinely want the piece, not to widen reach. An article that seems to need four placements is usually two articles, and "relevant to everything" is filed nowhere.

## `industries` — who it is for

A flat, multi-select list of industry slugs. It shows at the top of the article, drives the eight `/en/media/industry/<slug>` pages, and drives the `?industry=` filter that narrows the home page and any theme page in place.

- **Omit the field, or leave it empty, to mean every industry.** That is the honest value for a piece that applies regardless of sector, and the header then reads "All industries".
- An empty list contributes **no** industry keywords to structured data. An article that is not about a particular industry should not claim all eight.
- Do not list an industry because the article mentions it once. List it because someone in that industry is who you wrote it for.

## Adding to the vocabulary

Edit `TAXONOMY`, `TAGS` or `INDUSTRIES` in `src/features/media/data/taxonomy.ts`. Each entry needs an ASCII slug and `en`/`fr` labels; the three pillars also carry a `blurb`, shown under the heading on their listing page. A new entry creates its listing page automatically.

**Do not add a third level to `TAXONOMY`.** The tree is two deep by design, and the validator rejects a `section` of any other length. Something that feels like a third level is a tag.

French-specific schemes keep their French name in English too (MASE, ICPE, RFAR, QVT), because there is no English equivalent to translate to. Everything else gets a real English label.

Every theme and every tag has a page from the day it exists, so a topic nobody has written about yet shows an empty state rather than 404ing. That keeps internal links and breadcrumbs honest, and it means an unused entry is visible rather than hidden: delete the ones that stay empty.

Two cautions. A new slug mints a new public URL, so it is a routing decision, not just a label. And removing an entry breaks every article that references it, which the build will tell you about immediately.
