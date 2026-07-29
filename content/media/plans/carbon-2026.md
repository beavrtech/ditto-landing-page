# Carbon series — publishing plan

Twelve articles repurposed from Ditto's carbon content, filed under `rse > climat-et-carbone`.
Dates run weekly on Thursdays from 2026-04-30 to 2026-07-23, with a two-week gap before the
closing feature.

**Bylines.** The method track, the feature and the software piece are signed by
`alexis-de-taillac`. The other industry pieces carry sector-credible authors from the real
roster: `pierre-masse` (industrial, construction), `tristan-salaun` (transport, aerospace,
electronics), `ugo-le-borgne` (retail, cosmetics).

Governed by [EDITORIAL-LINE.md](../EDITORIAL-LINE.md). Every slug below is validated against
`src/features/media/data/taxonomy.ts`.

**Source material.** The Ditto blog post `company-carbon-footprint-step-by-step`
(2025-12-17, 1,660 words) plus the 19 `carbon` collection items. The blog post is the only
substantive carbon article on the blog; the collection covers the generic territory. This
series takes the angles neither surface has: how to run the project, and carbon by industry.

**No collision.** Nothing here answers a question the collection already answers. The
collection owns "what is a carbon footprint" and "how do I calculate one". This series owns
"how do I run this as a project" and "what does this mean for my industry".

---

## Schedule

| # | Date | url | Format | Track |
|---|---|---|---|---|
| 1 | 2026-04-30 | `carbon-footprint-project-plan` | Reference | Method |
| 2 | 2026-05-07 | `carbon-data-collection-departments` | Reference | Method |
| 3 | 2026-05-14 | `physical-vs-monetary-carbon-method` | Reference | Method |
| 4 | 2026-05-21 | `carbon-footprint-industrial-manufacturer` | Reference | Industry |
| 5 | 2026-05-28 | `carbon-footprint-transport-logistics` | Reference | Industry |
| 6 | 2026-06-04 | `carbon-footprint-software-company` | Reference | Industry |
| 7 | 2026-06-11 | `carbon-footprint-electronics-scope-3` | Reference | Industry |
| 8 | 2026-06-18 | `carbon-footprint-construction` | Reference | Industry |
| 9 | 2026-06-25 | `carbon-footprint-retail-distribution` | Reference | Industry |
| 10 | 2026-07-02 | `carbon-footprint-cosmetics` | Reference | Industry |
| 11 | 2026-07-16 | `carbon-footprint-aerospace-defense` | Reference | Industry |
| 12 | 2026-07-23 | `carbon-footprint-without-action-plan` | **Feature** | Position |

The three method pieces run first because the industry pieces refer back to them. The
feature closes the series and is the only one whose byline is load-bearing.

---

## 1. `carbon-footprint-project-plan` — 2026-04-30

**EN.** How to run a first carbon footprint as a project, not a spreadsheet
**FR.** Piloter son premier bilan carbone comme un projet, pas comme un tableur

> A first carbon footprint fails on sequencing, not on math. How to frame the scope, appoint
> contributors and phase the work over a realistic timeline.

```yaml
section: [rse, climat-et-carbone, bilan-carbone]
alsoIn:
  - [rse, reporting-et-cadres]
industries: []
```

Organizational scope before anything else: which entities, which countries, consistent with
the legal structure. Then the three scopes. Then the people: one named contact per
department (accounting, HR, purchasing, fleet), a kickoff that explains the stakes, and a
timeline the contributors have actually agreed to. The three routes to getting it done
(in-house trained expert, consultancy, software) presented neutrally, with the trade-off
stated rather than a recommendation.

---

## 2. `carbon-data-collection-departments` — 2026-05-07

**EN.** Getting carbon data out of accounting, HR and purchasing
**FR.** Obtenir ses données carbone auprès de la compta, des RH et des achats

> Data collection is the longest phase of a carbon footprint. Which department holds which
> data, what to ask for, and when to send an extract request instead of a questionnaire.

```yaml
section: [rse, climat-et-carbone, bilan-carbone]
alsoIn:
  - [supply-chain, tracabilite-donnees-et-risques, collecte]
industries: []
```

Source by source: energy from invoices (kWh, m³), commuting from a short questionnaire,
purchases from an accounting export by expense category, fleet from the fleet manager.
Purchases are the hard one and the piece should say so plainly. Multi-site consolidation.
What to do when a department has the data but not in a usable shape.

---

## 3. `physical-vs-monetary-carbon-method` — 2026-05-14

**EN.** Physical or monetary method: choose per emission source, not per company
**FR.** Méthode physique ou monétaire : choisir par poste d'émission, pas par entreprise

> The physical method is more accurate, the monetary method is available. Most robust
> footprints use both. Here is how to decide source by source.

```yaml
section: [rse, climat-et-carbone, bilan-carbone]
alsoIn:
  - [supply-chain, tracabilite-donnees-et-risques]
industries: []
```

Physical data times an emission factor versus spend times a monetary factor. Where each one
is defensible and where it is not. The recognized databases (Base Carbone from ADEME,
Ecoinvent, Agribalyse) and what each covers. Why a monetary line on purchases is honest for
a first assessment and a problem by the third.

---

## 4. `carbon-footprint-industrial-manufacturer` — 2026-05-21

**EN.** Carbon footprint for an industrial manufacturer: energy and raw materials first
**FR.** Bilan carbone d'un industriel : l'énergie et les matières premières d'abord

> Industrial sites concentrate emissions in energy use and raw materials. How to frame the
> scope by site, collect the data, and find the levers that actually move the total.

```yaml
section: [rse, climat-et-carbone, bilan-carbone]
alsoIn:
  - [qhse, environnement-et-excellence-operationnelle, energie]
industries: [industrie-equipements]
```

Site-level scoping and why consolidating too early hides the levers. Process energy,
refrigerants and on-site combustion in Scope 1 and 2. Raw materials as the largest Scope 3
line. Carbon intensity per unit produced rather than per euro of revenue.

---

## 5. `carbon-footprint-transport-logistics` — 2026-05-28

**EN.** Carbon footprint for transport and logistics: when Scope 1 is most of your total
**FR.** Bilan carbone en transport et logistique : quand le scope 1 fait l'essentiel du total

> For a logistics company, fleet fuel sits in Scope 1 and often dominates the total. How to
> scope, measure and reduce it without waiting on supplier data.

```yaml
section: [rse, climat-et-carbone, bilan-carbone]
alsoIn:
  - [qhse, environnement-et-excellence-operationnelle, energie]
industries: [transport-logistique]
```

The unusual position of having your largest emissions inside your own boundary, which makes
measurement easier and reduction harder. Fuel cards and telematics as the data source.
Owned versus subcontracted fleet and which scope each lands in. Warehouse energy.
Load factor and empty running as the levers.

---

## 6. `carbon-footprint-software-company` — 2026-06-04

**EN.** Carbon footprint for a software company: travel, commuting and cloud
**FR.** Bilan carbone d'un éditeur de logiciels : déplacements, trajets domicile-travail et cloud

> A software company's carbon footprint is almost entirely Scope 3: business travel,
> commuting and cloud services. Where to look, and what data you can actually get.

```yaml
section: [rse, climat-et-carbone, scopes]
industries: [technologie-logiciels]
```

Why the usual industrial framing does not fit, and what replaces it. Travel from the booking
tool. Commuting from a questionnaire, including remote work. Purchased services, which are
usually monetary. Cloud, where provider reporting is uneven and the honest answer is a
range. Equipment and its replacement cycle.

---

## 7. `carbon-footprint-electronics-scope-3` — 2026-06-11

**EN.** Scope 3 for electronics manufacturers: getting component data from suppliers
**FR.** Scope 3 en électronique : obtenir les données composants de ses fournisseurs

> Purchased components are the largest line in an electronics manufacturer's Scope 3. How to
> get usable emissions data from suppliers who do not have it yet.

```yaml
section: [rse, climat-et-carbone, scopes]
alsoIn:
  - [supply-chain, engagement-et-evaluation-fournisseurs, campagnes]
industries: [electronique]
```

Category 1 (purchased goods) as the dominant line. Starting from a monetary estimate to find
which suppliers are worth a real request. What to ask a supplier for, in what format, and
what to do with the ones who cannot answer. Running this as a campaign rather than as
individual emails.

---

## 8. `carbon-footprint-construction` — 2026-06-18

**EN.** Carbon footprint for a construction company: the emissions are in the materials
**FR.** Bilan carbone d'une entreprise du BTP : les émissions sont dans les matériaux

> For a construction company, concrete, steel and insulation outweigh everything on site.
> How to scope by project, source material data, and act at specification stage.

```yaml
section: [rse, climat-et-carbone, bilan-carbone]
alsoIn:
  - [supply-chain, achats-responsables, politique-achats]
industries: [construction]
```

Project-level versus company-level scoping. Embodied carbon in materials against site plant
and vehicles. Where material emission factors come from. Why the real lever sits at
specification and design, before procurement, and what that means for a QHSE manager who
joins the project late.

---

## 9. `carbon-footprint-retail-distribution` — 2026-06-25

**EN.** Carbon footprint for a retailer: purchased goods and freight are the whole picture
**FR.** Bilan carbone d'un distributeur : les achats et le transport font tout le bilan

> A retailer's emissions sit almost entirely in goods bought for resale and in moving them.
> How to scope thousands of product lines without stalling on data.

```yaml
section: [rse, climat-et-carbone, scopes]
alsoIn:
  - [supply-chain, engagement-et-evaluation-fournisseurs]
industries: [distribution]
```

Segmenting the assortment so a monetary estimate carries the tail and physical data covers
the categories that matter. Upstream and downstream freight and which one is yours. Store
and warehouse energy, which feels large and rarely is. Deciding which suppliers to ask
first.

---

## 10. `carbon-footprint-cosmetics` — 2026-07-02

**EN.** Carbon footprint for a cosmetics manufacturer: ingredients, packaging and the LCA question
**FR.** Bilan carbone d'un fabricant de cosmétiques : ingrédients, emballages et la question de l'ACV

> Ingredients and packaging dominate a cosmetics carbon footprint, and buyers increasingly
> ask at product level. When a company footprint is enough and when you need an LCA.

```yaml
section: [rse, climat-et-carbone, bilan-carbone]
alsoIn:
  - [supply-chain, reglementations-produit-et-chaine, ppwr]
industries: [cosmetiques-beaute]
```

Agricultural and synthetic ingredients and where their factors come from. Packaging as the
line buyers ask about. The distinction between a company carbon footprint and a product life
cycle assessment, which are different exercises with different costs. How packaging
regulation and carbon reduction pull in the same direction here.

---

## 11. `carbon-footprint-aerospace-defense` — 2026-07-16

**EN.** Carbon footprint in aerospace and defense: measuring across a multi-tier supply chain
**FR.** Bilan carbone en aéronautique et défense : mesurer sur une chaîne à plusieurs rangs

> Aerospace suppliers are asked for carbon data by primes who are themselves being asked.
> How to measure across several tiers when you only have visibility on the first.

```yaml
section: [rse, climat-et-carbone, scopes]
alsoIn:
  - [supply-chain, tracabilite-donnees-et-risques, cartographie-des-risques]
industries: [aerospatiale-defense]
```

Being both the asker and the asked. Long product lifecycles and what that does to the use
phase. Materials with high embodied carbon. Confidentiality constraints on supplier data and
what can be shared. Mapping which tiers carry the emissions before trying to collect from
all of them.

---

## 12. `carbon-footprint-without-action-plan` — 2026-07-23 — **Feature**

**EN.** A carbon footprint without an action plan is a diagnosis without a treatment
**FR.** Un bilan carbone sans plan d'action, c'est un diagnostic sans traitement

> Most first assessments end at the report. What separates the companies that reduce
> emissions from the ones that measure them again next year.

```yaml
section: [rse, climat-et-carbone, decarbonation]
alsoIn:
  - [rse, strategie-gouvernance-et-acces-marche, politiques]
industries: []
```

The one piece in the series that takes a position, and the reason the other eleven are worth
reading. Why the report is treated as the deliverable when it is the input. What a real
transition plan contains: targets with dates, owners, budget, and a measurement cadence.
Where SBTi helps and where it adds process without adding reduction. Closes on what to do
next, not on the metaphor in the title.

Note the title uses the one antithesis the tone of voice permits, which is the fixed brand
line's shape. Do not add a second one anywhere in the body.

---

## Before writing: facts to resolve

None of these can ship from the source as written.

| # | Claim in source | Action |
|---|---|---|
| 1 | "Since 2023, French regulations require large organizations to include Scope 3" | BEGES rules have moved. Get the current decree, thresholds and actual penalty, or cut the claim. |
| 2 | "Allow 2 to 3 months minimum for data collection" | No source. Attribute honestly to Ditto's own observation, or cut. |
| 3 | "Costs can reach several tens of thousands of euros" (consultancy) | Needs a real, sourced range or it goes. |
| 4 | "Over 100,000 emission factors" | Vendor claim about a tool. Cut. |
| 5 | The "Carbo" SaaS platform, named twice as a recommendation | Remove entirely. Northstar does not recommend vendors. Replace with the neutral three-options framing. |
| 6 | Trailing "Prepare your EcoVadis assessment" call to action | Remove. No article carries a CTA in its body. |

Also confirm before the industry pieces: the emission-profile claims per industry are
currently reasoning from the source's one line about service versus industrial companies.
Each industry piece needs at least one real, attributable anchor for its "where the
emissions sit" claim, or the claim is stated as our observation rather than as fact.

## Production notes

- Twelve unique hero photographs, one per article, per
  [authoring/ILLUSTRATIONS.md](../authoring/ILLUSTRATIONS.md). Shoot the circumstances, not
  the subject: a depot at shift change, a materials yard, a shared office at 8am.
- Twelve French bodies as true editorial translations, each read by a human as French.
- Articles 4 to 11 share a structure by design. Vary the openings and the section headings
  deliberately, or the series reads as a template.
