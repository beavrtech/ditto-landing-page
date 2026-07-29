/**
 * Generate an article's hero photograph with the OpenAI image API.
 *
 *   npm run illustration -- <url-slug> "<scene>"
 *   node --env-file=.env.local scripts/generate-illustration.mjs <url-slug> "<scene>"
 *
 * <url-slug> is the article's `url`, so the file lands at the path the
 * frontmatter already expects: public/media/illustrations/<url-slug>.webp
 *
 * <scene> is one or two sentences naming what is in the frame — the thing
 * photographed, not the article's topic. The house style below is prepended, so
 * do not restate lighting, lens or palette in the scene.
 *
 *   node --env-file=.env.local scripts/generate-illustration.mjs reach-2026-checklist \
 *     "Rows of unlabeled glass containers on a laboratory shelf, seen at eye level."
 *
 * Flags:
 *   --dry            compose and print the prompt, call nothing, spend nothing
 *   --force          overwrite an existing file (refused by default)
 *   --quality=low    low | medium | high (default high)
 *   --model=<id>     default gpt-image-2
 *
 * Requires OPENAI_API_KEY in the env. The style contract this encodes is
 * content/media/authoring/ILLUSTRATIONS.md — change both together.
 */
import { writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "media", "illustrations");
const ENDPOINT = "https://api.openai.com/v1/images/generations";

// 3:2, the ratio the cards use. The article header crops it to 2:1, which is
// why the rules below push the subject into the middle band.
const SIZE = "1536x1024";

/**
 * The house style, derived from the Ditto team portraits: natural light, a fast
 * lens, muted color, a real European room. Every article photograph is shot as
 * if by the same photographer on the same afternoon.
 */
const STYLE = [
  "A documentary editorial photograph for a compliance magazine.",
  "Natural daylight only, overcast or open shade or late-afternoon sun that has lost its hardness. No flash, no studio lighting, no colored light.",
  "Shallow depth of field: the subject sharp, the background dissolved into soft bokeh, as from a 50-85mm lens at f/2.",
  "Muted, true-to-life color, slightly desaturated, gentle contrast. No HDR, no teal-and-orange grade, no vignette, no visible filter.",
  "A real European workplace with real wear: scuffed floors, used tools, paper that has been handled.",
  "Candid and unstaged, in the register of a photographer who spent a working day in the room.",
  "One clear subject, generous negative space, camera at human eye level.",
].join(" ");

/**
 * Failure modes worth naming explicitly. People are welcome; stock-photograph
 * behaviour is not. The text rule is practical: models garble lettering, it
 * cannot be translated, and it is unreadable at card size.
 */
const RULES = [
  "Absolute requirements:",
  "Any people are absorbed in what they are doing and unaware of the camera. No posing, no eye contact with the lens, no acted enthusiasm, no handshakes, no group high-fives, no smiling at a laptop, no gesturing at a chart.",
  "Nobody who resembles a recognizable real person, public figure or celebrity.",
  "No text, lettering, numbers, signage, labels, screens or packaging copy anywhere in the frame.",
  "No logos or brand marks, real or invented.",
  "Nothing identifiable as a specific real company, product or person.",
  "No conceptual props: no handshakes, lightbulbs, scales of justice, chess pieces, globes, or green leaves standing in for sustainability.",
  "Nothing that implies an outcome: no certificates being awarded, no checkmarks, no trophies.",
  "Keep the subject in the middle horizontal band; the top and bottom of the frame will be cropped away.",
].join(" ");

function parseArgs(argv) {
  const flags = {};
  const positional = [];
  for (const arg of argv) {
    if (!arg.startsWith("--")) {
      positional.push(arg);
      continue;
    }
    const [key, value] = arg.slice(2).split("=");
    flags[key] = value ?? true;
  }
  return { flags, positional };
}

const { flags, positional } = parseArgs(process.argv.slice(2));
const [slug, scene] = positional;

if (!slug || !scene) {
  console.error(
    'Usage: node --env-file=.env.local scripts/generate-illustration.mjs <url-slug> "<scene>" [--dry] [--force]'
  );
  process.exit(1);
}
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error(`Slug "${slug}" must be lowercase and hyphenated, and equal to the article's url.`);
  process.exit(1);
}

const quality = flags.quality ?? "high";
const model = flags.model ?? "gpt-image-2";
const prompt = `${STYLE}\n\nThe photograph shows: ${scene}\n\n${RULES}`;
const outPath = path.join(OUT_DIR, `${slug}.webp`);

if (flags.dry) {
  console.log(prompt);
  console.log(`\n(dry run — would write ${path.relative(ROOT, outPath)} at ${SIZE}, quality ${quality})`);
  process.exit(0);
}

const exists = await access(outPath).then(
  () => true,
  () => false
);
if (exists && !flags.force) {
  console.error(`${path.relative(ROOT, outPath)} already exists. Pass --force to replace it.`);
  process.exit(1);
}

const key = process.env.OPENAI_API_KEY;
if (!key) {
  console.error("Missing OPENAI_API_KEY. Run with: node --env-file=.env.local scripts/generate-illustration.mjs …");
  process.exit(1);
}

const response = await fetch(ENDPOINT, {
  method: "POST",
  headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    model,
    prompt,
    size: SIZE,
    quality,
    output_format: "webp",
    output_compression: 82,
    n: 1,
  }),
});

if (!response.ok) {
  const body = await response.text();
  // A refusal is usually the scene, not the style: rephrase what is in the
  // frame rather than retrying the same words.
  console.error(`OpenAI returned ${response.status}:\n${body}`);
  process.exit(1);
}

const { data } = await response.json();
const b64 = data?.[0]?.b64_json;
if (!b64) {
  console.error("No image in the response.");
  process.exit(1);
}

const bytes = Buffer.from(b64, "base64");
await writeFile(outPath, bytes);
console.log(`Wrote ${path.relative(ROOT, outPath)} (${(bytes.length / 1024).toFixed(0)} KB, ${SIZE})`);
console.log(`Set in the frontmatter: illustration: /media/illustrations/${slug}.webp`);
console.log("Now write the `alt` in each language block: describe the photograph, not the article.");
