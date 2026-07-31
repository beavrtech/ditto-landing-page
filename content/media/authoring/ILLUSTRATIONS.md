# Artwork

Three different things, with three different rule sets.

- **The hero image** — one per article, referenced by `illustration` in the frontmatter. It is a **photograph**, generated with the OpenAI image API and stored at `public/media/illustrations/<url>.webp`, same name as the article's `url`.
- **In-body figures** — **optional**, at most one or two per article, placed with `<ArticleImage>`. These are **flat SVG charts and diagrams** in the The Scope palette; charts ship one file per language. They explain something a photograph cannot, and most articles do without.
- **Author portraits** — one per author, at `public/media/authors/<slug>.webp`. Always a photograph of the real person. Never an invented face.

## The hero photograph

### Generating it

```bash
npm run illustration -- <url-slug> "<scene>"
```

The house style is baked into [`scripts/generate-illustration.mjs`](../../../scripts/generate-illustration.mjs), so the only thing to write is the **scene**: one or two sentences naming what is in the frame. The thing photographed, not the article's topic. Do not restate lighting, lens or color; the script prepends all of that, and repeating it fights the prompt.

```bash
npm run illustration -- reach-2026-checklist \
  "Rows of unlabeled glass containers on a laboratory shelf, seen at eye level."
```

Add `--dry` to print the composed prompt without calling the API, which is the cheap way to iterate on a scene. The file is written at 1536×1024; an existing file is never overwritten without `--force`.

### The style

Every The Scope photograph is shot as if by the same photographer on the same afternoon. The reference is the Ditto team portraits in `public/media/authors/`: a Paris courtyard, pale stone, dense green, no artifice.

- **Natural daylight only.** Overcast, open shade, or late-afternoon sun that has lost its hardness. No flash, no studio lighting, no colored light.
- **Shallow depth of field.** Subject sharp, background dissolved into soft bokeh, as from a 50–85 mm lens at f/2.
- **Muted, true-to-life color.** Slightly desaturated, gentle contrast. No HDR, no teal-and-orange grade, no vignette, no visible filter.
- **A real European workplace with real wear.** Scuffed floors, used tools, paper that has been handled. Not a rendering, not a showroom, not an American open-plan office.
- **Candid and unstaged**, in the register of a photographer who spent a working day in the room.
- **One clear subject**, generous negative space, camera at human eye level.

### People

People belong in these photographs. What does not belong is the behaviour of stock photography.

Show someone **absorbed in what they are doing** and unaware of the camera: reading, walking a line, handling a part, talking to someone out of frame. Not looking down the lens, not performing an emotion, not demonstrating a concept. The two reference portraits meet the camera because they are portraits; an article photograph is reportage, and the register is different.

The one hard limit is likeness. Nobody in the frame may resemble a recognizable real person, and a generated person is never captioned, credited or described as a real individual — not a named source, not a customer, not an employee. The `alt` says what is depicted; it never claims who.

### What is never in the frame

These are in the prompt, but the model does not always obey. Check the result against them.

- **No text.** No signage, labels, screens, packaging copy, numbers. Image models garble lettering, it cannot be translated, and it is unreadable at card size.
- **No logos or brand marks**, real or invented, and nothing identifiable as a specific real company, product or person.
- **No conceptual props, and no stock-photo behaviour.** No handshakes, lightbulbs, scales of justice, chess pieces, globes, green leaves standing in for sustainability; no high-fives, no smiling at a laptop, no gesturing at a chart. These are the visual equivalent of the banned words in [TONE-OF-VOICE.md](../TONE-OF-VOICE.md), and they fail for the same reason.
- **Nothing that implies an outcome** the article does not support: no certificate being awarded, no checkmark, no trophy.

### Framing

1536×1024 (3:2). The article header crops it to 2:1 and the cards render it at 3:2, so keep the subject in the middle horizontal band and away from the top and bottom edges.

### Writing the scene

Photograph the **circumstances** of the subject, not the subject itself. An article about an audit is not a picture of an audit; it is the room the audit happens in, twenty minutes before anyone arrives.

These three are the scenes that produced the photographs currently on the site.

| Article | Weak scene | The scene used |
|---|---|---|
| Reading an EcoVadis scorecard | "A person analyzing sustainability data" | "Two colleagues seated at the end of a meeting-room table, seen from the side, one leaning over a printed document with the pages angled away from the camera, the other listening, window light from the left" |
| Getting started with ISO 45001 | "Workplace safety concept" | "A factory floor walkway seen at eye level, painted floor markings underfoot, a worker in a high-visibility vest walking away from the camera, machinery soft in the background" |
| A REACH deadline checklist | "Chemical compliance illustration" | "A worker at a goods-in bench in an electronics stockroom, seen from the side, sorting small components into plain anti-static trays, shelving racks soft behind them" |

The weak column is not weak because it lacks people. It is weak because it names the topic instead of the frame, which leaves the model to invent the picture, and what it invents is stock photography.

### Alt text

`alt` lives in each language block and describes the **photograph**, not the article:

```yaml
en:
  alt: "Rows of unlabeled glass containers on a laboratory shelf"
fr:
  alt: "Des rangées de flacons en verre sans étiquette sur une étagère de laboratoire"
```

If the image is purely decorative, omit `alt`. An empty value is treated as decorative on purpose, so a screen reader skips it rather than announcing a filename.

### Disclosure

These are generated images, not photojournalism. Never present one as documentation of a real event, place or person, and never caption it as though it were. The `alt` describes what is depicted; it does not claim the depiction happened.

## Author portraits

512×512 webp at `public/media/authors/<slug>.webp`, referenced by `avatar` in the author file. Shot outdoors: the person head-and-shoulders and looking at the camera, dense green foliage and a pale stone building behind them, dissolved into soft bokeh. Natural daylight, muted true-to-life colour, camera at eye level. Same afternoon, same photographer as everything else on the site.

A portrait is always the real person. When someone's usable photograph was taken somewhere else — a white studio wall, a coloured backdrop, black and white — it gets **edited** into the house background with the OpenAI image API (`images/edits`, `input_fidelity: high`), which keeps the face, hair, glasses, expression and clothing and changes the setting and the grade around them. That is the only generation allowed here.

Never generate a portrait from a name and a description. An image model given "Tristan Salaün, account manager" returns a stranger, and publishing that stranger under a real colleague's byline misrepresents them. No photograph, no avatar: leave the file missing and get one taken.

**Invited authors are the exception to the house edit.** A "By invitation" contributor's portrait is used exactly as they supplied it, no background swap, no regrade. The picture is theirs the way the opinion is, and restyling it would dress an outside voice in house clothes.

## In-body figures

**Optional. Never mandatory.** The hero photograph is the only artwork every article owes; a figure inside the body is something a piece earns, not something it is missing. Most articles ship with none, and that is a normal outcome rather than a gap to fill.

When one is useful, do one or two. Never more, and never one per section.

A figure is useful when it shows a relationship the prose cannot hold: unequal quantities, a shape over time, layers, a grid with one cell filled. It is not useful when it restates a sentence, illustrates a topic, or exists because the article looked plain. The test before drawing anything: *can the reader get this faster from the picture than from the sentence?* If no, cut it and keep the sentence. A well-written paragraph beats a chart of the same fact every time, and an article with no figures has failed nothing.

Common rules for everything placed with `<ArticleImage>`:

- **Palette, and nothing else**: navy `#130e30`, yellow `#ffe228`, blue `#3a93ff`, white `#ffffff`. Optionally the paper tint `#f9fbf2`.
- **Flat and geometric.** Rectangles, lines, grids, hard diagonals. No gradients, no drop shadows, no rounded corners, no 3D, no stock-illustration people.
- **Every figure is sourced.** The non-negotiables in [TONE-OF-VOICE.md](../TONE-OF-VOICE.md) apply to pixels as much as prose: never chart a number you could not print.
- Include `role="img"` on the SVG. The accessible name comes from the `alt` prop.
- `<ArticleImage>` serves `.svg` files unoptimized, so plain static SVG is all that is needed.

### Data charts, the house style

Charts carry their own text, in the register of The Economist. The reference implementations are `public/media/illustrations/cheese-footprint-stages.*.svg` and `cheese-milk-per-kilogram.*.svg`.

- **One file per language.** Text cannot be machine-translated inside an image, so a chart ships as `<name>.en.svg` and `<name>.fr.svg`, and each locale body references its own file. The two files carry the same data and geometry; only the words differ.
- **Anatomy, top to bottom**: a yellow tag block (64×12) at the top left; a short bold title that makes a claim ("Mostly milk"), not a label; a muted subtitle naming the unit and scope; the chart; a muted source line at the bottom.
- **Bars over slices.** Horizontal bars, category labels above each bar, bold value labels at the bar end. A full-length bar takes its value label inside the bar, in white, right-aligned, so nothing sits at the crop-prone right edge. Prefer one bar per category to a stacked bar: a 4% sliver is invisible inside a stack and obvious as its own bar.
- **Navy is the ink, yellow is the story.** All bars navy; the one bar the argument turns on may be yellow. No third color unless it encodes something.
- **A narrow centered panel on the paper tint.** A chart is not a full-bleed image. The ground is the paper tint `#f9fbf2`, no border, and the figure is set in a 480px column centered in the text measure, which is what `chart` on `<ArticleImage>` does.
- **Geometry that stays readable**: author the SVG at a 480-wide viewBox so it renders 1:1 at its displayed width and the type comes out at the size you drew it. Never author wide and let CSS shrink it: a 17px label inside a 900px canvas displayed at 480px renders at 9px. The working canvas is 480×316, with title 20, subtitle 13, category and value labels 13, source 11, bars 20px tall, a 16px left margin, and the longest bar running to x=464. Font stack `'Helvetica Neue', Arial, sans-serif`; anything fancier will not load inside an `<img>`.
- **Captions stay short.** The chart carries its own title and source, so the `caption` adds one sentence of reading guidance at most, and the `alt` describes the chart for someone who cannot see it.

### Diagrams without data

A structural diagram (layers, flows, a grid) that needs no numbers follows the same palette and flatness, and stays wordless where it can, with the labelling in the `caption`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  <rect width="900" height="600" fill="#ffffff"/>
  <rect x="80" y="380" width="740" height="60" fill="#130e30"/>
  <rect x="80" y="300" width="560" height="60" fill="#ffe228"/>
  <path d="M80 520 L820 100" stroke="#130e30" stroke-width="4"/>
  <rect x="80" y="140" width="740" height="300" fill="none" stroke="#130e30" stroke-width="4"/>
</svg>
```

If a wordless diagram would force the caption to decode colors and positions, treat it as a chart instead and label it per locale.
