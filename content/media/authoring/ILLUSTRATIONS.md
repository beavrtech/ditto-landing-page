# Artwork

Two different things, with two different rule sets.

- **The hero image** — one per article, referenced by `illustration` in the frontmatter. It is a **photograph**, generated with the OpenAI image API and stored at `public/media/illustrations/<url>.webp`, same name as the article's `url`.
- **In-body figures** — optional, placed with `<ArticleImage>`. These are **flat SVG diagrams** in the Northstar palette. They explain something; a photograph cannot.

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

Every Northstar photograph is shot as if by the same photographer on the same afternoon. The reference is the Ditto team portraits in `public/media/authors/`: a Paris courtyard, pale stone, dense green, no artifice.

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

## In-body diagrams

`<ArticleImage>` figures stay flat SVG in the design system: white ground, navy ink, square corners, structure drawn with rules rather than shadows.

- **Palette, and nothing else**: navy `#130e30`, yellow `#ffe228`, blue `#3a93ff`, white `#ffffff`. Optionally the paper tint `#f9fbf2`.
- **Flat and geometric.** Rectangles, lines, grids, hard diagonals. No gradients, no drop shadows, no rounded corners, no 3D, no stock-illustration people.
- **It must earn its place.** A diagram shows a relationship the prose cannot: layers, a grid with one cell filled, unequal bars. If it only decorates, cut it.
- **No text inside the image.** It cannot be translated. Put the labelling in the `caption`.
- Include `role="img"`. The accessible name comes from the `alt` prop.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  <rect width="900" height="600" fill="#ffffff"/>
  <rect x="80" y="380" width="740" height="60" fill="#130e30"/>
  <rect x="80" y="300" width="560" height="60" fill="#ffe228"/>
  <path d="M80 520 L820 100" stroke="#130e30" stroke-width="4"/>
  <rect x="80" y="140" width="740" height="300" fill="none" stroke="#130e30" stroke-width="4"/>
</svg>
```
