# Illustrations

Every article carries exactly one illustration, referenced by `illustration` in the frontmatter and stored at `public/media/illustrations/<url>.svg` — same name as the article's `url`, so the pairing is obvious.

## The visual rules

Northstar's design system is white ground, navy ink, square corners, structure drawn with rules rather than shadows. Illustrations follow the same logic.

- **Palette, and nothing else**: navy `#130e30`, yellow `#ffe228`, blue `#3a93ff`, white `#ffffff`. Optionally the paper tint `#f9fbf2`.
- **Flat and geometric.** Rectangles, lines, grids, hard diagonals. No gradients, no drop shadows, no rounded corners, no 3D, no stock-illustration people.
- **Abstract, not literal.** The illustration signals the shape of the idea (layers, a grid with one cell filled, unequal bars), it does not depict the subject. Nobody needs a picture of a chemical.
- **No text inside the image.** It cannot be translated, and it is unreadable at card size.
- **`viewBox="0 0 900 600"`** (3:2). It renders at 2:1 in the article header and 3:2 on cards, so keep the meaningful content away from the top and bottom edges.
- Include `role="img"`. The accessible name comes from the frontmatter `alt`, per language.

## Alt text

`alt` lives in each language block and describes the **image**, not the article:

```yaml
en:
  alt: "Flat geometric illustration of stacked layers crossed by a diagonal rule"
fr:
  alt: "Illustration géométrique de couches empilées traversées par une diagonale"
```

If the illustration is purely decorative, omit `alt`. An empty value is treated as decorative on purpose, so a screen reader skips it rather than announcing a filename.

## Before launch: raster versions

SVG is what the site renders, but it is **not** valid for structured-data images and several platforms will not render an SVG link preview. A raster export (1200×630, PNG or WebP) will be needed for `og:image` and `Article.image`. Until that is set up, this is a known gap, recorded in [SEO-AEO.md](./SEO-AEO.md).

## Example

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  <rect width="900" height="600" fill="#ffffff"/>
  <rect x="80" y="380" width="740" height="60" fill="#130e30"/>
  <rect x="80" y="300" width="560" height="60" fill="#ffe228"/>
  <path d="M80 520 L820 100" stroke="#130e30" stroke-width="4"/>
  <rect x="80" y="140" width="740" height="300" fill="none" stroke="#130e30" stroke-width="4"/>
</svg>
```
