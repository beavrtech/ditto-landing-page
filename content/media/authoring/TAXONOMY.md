# Filing an article: section, alsoIn, industries

Three independent axes. Getting them right matters beyond tidiness: they drive breadcrumbs, listing pages, related articles and structured data.

The vocabulary lives in `src/features/media/data/taxonomy.ts`. Slugs there are the only valid values, and the build rejects anything else.

## `section` — where the article lives

One path, two or three levels deep:

- **Level 1** is the pillar: `qhse`, `rse`, `supply-chain`.
- **Level 2** is the theme: `sst`, `carbone`, `normes-et-regulations`, …
- **Level 3** is a named framework or regulation: `reach`, `csrd`, `ecovadis`, … It exists only under the "normes et régulations" branches, and only when the article really is about that one framework.

An article about EcoVadis scoring is `[rse, normes-et-regulations, ecovadis]`. An article about getting started with ISO 45001 is `[qhse, sst]` — ISO 45001 has no level-3 node, and inventing one to file a single article is the wrong instinct. Add nodes when a theme has articles, not in anticipation.

`section` decides:

- the **breadcrumb** on the article page,
- the **kicker** on every card, everywhere the article appears,
- the **primary `about`** in structured data.

So it must be the single best answer to "what is this article about". If two answers feel equally right, that usually means the article is trying to be two articles.

## `alsoIn` — where else it is worth reading

An article often lives in one pillar but is genuinely useful to readers of another. `alsoIn` lists up to three secondary placements:

```yaml
section: [supply-chain, normes-et-regulations, reach]
alsoIn:
  - [rse, normes-et-regulations]
  - [qhse, environnement]
```

Rules and behavior:

- Each entry is a path of **one to three** slugs. A bare `- [rse]` files the piece under the whole CSR pillar, which is a legitimate and common statement.
- A placement reaches **its own page and its parents, never its children**. `- [rse]` puts the article on `/en/media/theme/rse` but not on `/en/media/theme/rse/carbone`. This is the same rule `section` follows.
- Cross-filing changes **listing only**. The URL, breadcrumb, card kicker and primary `about` all stay those of `section`. Because cards always show the canonical path, a cross-filed piece displays its home section wherever else it appears and reads as a cross-reference without needing a badge.
- Secondary placements join `keywords` in structured data but never `about`.
- The build rejects more than three entries, duplicates, unknown paths, and any entry on the primary's own branch (redundant, since prefix matching already covers it).

Use it when a reader of the other pillar would genuinely want the piece. Not to widen reach. An article that seems to need four placements is usually two articles, and "relevant to everything" is filed nowhere.

## `industries` — who it is for

A flat, multi-select list of industry slugs, shown at the top of the article and driving `/en/media/industry/<slug>` pages.

- **Omit the field, or leave it empty, to mean every industry.** That is the honest value for a piece that applies regardless of sector, and the header then reads "All industries".
- An empty list contributes **no** industry keywords to structured data. An article that is not about a particular industry should not claim all eight.
- Do not list an industry because the article mentions it once. List it because someone in that industry is who you wrote it for.

## Adding to the vocabulary

Edit `TAXONOMY` or `INDUSTRIES` in `src/features/media/data/taxonomy.ts`. Each node needs an ASCII slug and `en`/`fr` labels. A new node creates its listing page automatically.

Two cautions. A new slug mints a new public URL, so it is a routing decision, not just a label. And removing a node breaks every article that references it, which the build will tell you about immediately.

Nodes marked `suggested: true` were proposed rather than specified by the team. Delete the marker once confirmed, or delete the node.
