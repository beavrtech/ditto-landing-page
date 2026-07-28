# Filing an article: section, alsoIn, industries

Three independent axes. Getting them right matters beyond tidiness: they drive breadcrumbs, listing pages, related articles and structured data.

The vocabulary lives in `src/features/media/data/taxonomy.ts`. Slugs there are the only valid values, and the build rejects anything else.

## `section` — where the article lives

One path, two or three levels deep:

- **Level 1** is the pillar: `qhse` (the management system and the shop floor), `rse` (the performance you have to prove to the outside world), `supply-chain` (suppliers and the products upstream).
- **Level 2** is the theme: `notations-et-evaluations`, `climat-et-carbone`, `achats-responsables`, …
- **Level 3** is the named framework, regulation or practice: `ecovadis`, `csrd`, `reach`, `iso-45001`, `facteur-humain`, … **Every theme has level-3 topics**, so reach for one whenever the article really is about that one thing.

An article about EcoVadis scoring is `[rse, notations-et-evaluations, ecovadis]`. An article about getting started with ISO 45001 is `[qhse, normes-et-systemes-de-management, iso-45001]`. Stop at level 2 when the piece spans several topics under that theme rather than sitting in one.

`section` decides:

- the **breadcrumb** on the article page,
- the **kicker** on every card, everywhere the article appears,
- the **primary `about`** in structured data.

So it must be the single best answer to "what is this article about". If two answers feel equally right, that usually means the article is trying to be two articles.

## `alsoIn` — where else it is worth reading

An article often lives in one pillar but is genuinely useful to readers of another. `alsoIn` lists up to three secondary placements:

```yaml
section: [supply-chain, reglementations-produit-et-chaine, reach]
alsoIn:
  - [qhse, environnement-et-excellence-operationnelle]
  - [supply-chain, tracabilite-donnees-et-risques]
```

Rules and behavior:

- Each entry is a path of **one to three** slugs. A bare `- [rse]` files the piece under the whole CSR pillar, which is a legitimate and common statement. A different theme inside the article's own pillar is allowed too, as the REACH example above does.
- A placement reaches **its own page and its parents, never its children**. `- [rse]` puts the article on `/en/media/theme/rse` but not on `/en/media/theme/rse/climat-et-carbone`. This is the same rule `section` follows.
- Cross-filing changes **listing only**. The URL, breadcrumb, card kicker and primary `about` all stay those of `section`. Because cards always show the canonical path, a cross-filed piece displays its home section wherever else it appears and reads as a cross-reference without needing a badge.
- Secondary placements join `keywords` in structured data but never `about`.
- The build rejects more than three entries, duplicates, unknown paths, and any entry on the primary's own branch (redundant, since prefix matching already covers it).

Use it when a reader of the other pillar would genuinely want the piece. Not to widen reach. An article that seems to need four placements is usually two articles, and "relevant to everything" is filed nowhere.

## `industries` — who it is for

A flat, multi-select list of industry slugs. It shows at the top of the article, drives the eight `/en/media/industry/<slug>` pages, and drives the `?industry=` filter that narrows the home page and any theme page in place.

- **Omit the field, or leave it empty, to mean every industry.** That is the honest value for a piece that applies regardless of sector, and the header then reads "All industries".
- An empty list contributes **no** industry keywords to structured data. An article that is not about a particular industry should not claim all eight.
- Do not list an industry because the article mentions it once. List it because someone in that industry is who you wrote it for.

## Adding to the vocabulary

Edit `TAXONOMY` or `INDUSTRIES` in `src/features/media/data/taxonomy.ts`. Each node needs an ASCII slug and `en`/`fr` labels; the three pillars also carry a `blurb`, shown under the heading on their listing page. A new node creates its listing page automatically.

French-specific schemes keep their French name in English too (MASE, ICPE, RFAR, QVT), because there is no English equivalent to translate to. Everything else gets a real English label.

Every node has a page from the day it exists, so a topic nobody has written about yet shows an empty state rather than 404ing. That keeps internal links and breadcrumbs honest, and it means an unused node is visible rather than hidden: delete the ones that stay empty.

Two cautions. A new slug mints a new public URL, so it is a routing decision, not just a label. And removing a node breaks every article that references it, which the build will tell you about immediately.
