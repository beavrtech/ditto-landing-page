/**
 * Migrate Webflow CDN image URLs embedded inside HTML body fields to Supabase Storage.
 *
 * Usage: SUPABASE_SERVICE_ROLE_KEY=... NEXT_PUBLIC_SUPABASE_URL=... npx tsx scripts/migrate-body-images.ts
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const BUCKET = "cms-images";
const CDN_REGEX = /https:\/\/cdn\.prod\.website-files\.com\/[^\s"')]+/g;

const TABLES_COLUMNS: { table: string; columns: string[] }[] = [
  { table: "blog_posts", columns: ["body_en", "body_fr"] },
  { table: "collection_items", columns: ["body_en", "body_fr"] },
  { table: "news", columns: ["body_en", "body_fr"] },
  { table: "guides", columns: ["body_en", "body_fr"] },
  { table: "events", columns: ["body_en", "body_fr"] },
  { table: "company_updates", columns: ["body_en", "body_fr"] },
  { table: "customer_stories", columns: [
    "challenge_summary_en", "challenge_summary_fr",
    "impact_summary_en", "impact_summary_fr",
    "presentation_en", "presentation_fr",
    "challenges_en", "challenges_fr",
    "contexte_rse_en", "contexte_rse_fr",
    "solution_en", "solution_fr",
    "impact_en", "impact_fr",
    "ending_en", "ending_fr",
  ]},
];

// Cache: Webflow URL -> Supabase URL (avoid re-uploading the same image)
const urlCache = new Map<string, string>();

function getExtFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const filename = pathname.split("/").pop() || "";
    const ext = filename.split(".").pop()?.toLowerCase().split("?")[0];
    if (ext && ["png", "jpg", "jpeg", "gif", "svg", "webp", "avif"].includes(ext)) return ext;
  } catch {}
  return "png";
}

function getContentType(ext: string): string {
  const map: Record<string, string> = {
    png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg",
    gif: "image/gif", svg: "image/svg+xml", webp: "image/webp", avif: "image/avif",
  };
  return map[ext] || "application/octet-stream";
}

async function migrateUrl(webflowUrl: string): Promise<string> {
  if (urlCache.has(webflowUrl)) return urlCache.get(webflowUrl)!;

  const ext = getExtFromUrl(webflowUrl);
  // Use a hash of the URL as filename to keep it unique and short
  const hash = Buffer.from(webflowUrl).toString("base64url").slice(0, 32);
  const storagePath = `body-images/${hash}.${ext}`;
  const newUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`;

  // Check if already uploaded
  const { data: existing } = await supabase.storage.from(BUCKET).list("body-images", { search: `${hash}.${ext}` });
  if (existing && existing.some((f) => f.name === `${hash}.${ext}`)) {
    urlCache.set(webflowUrl, newUrl);
    return newUrl;
  }

  // Download and upload
  const res = await fetch(webflowUrl);
  if (!res.ok) {
    console.error(`  DOWNLOAD FAILED (${res.status}): ${webflowUrl.slice(0, 80)}`);
    urlCache.set(webflowUrl, webflowUrl); // keep original on failure
    return webflowUrl;
  }
  const buf = Buffer.from(await res.arrayBuffer());

  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, buf, {
    contentType: getContentType(ext),
    upsert: true,
  });
  if (error) {
    console.error(`  UPLOAD FAILED: ${error.message}`);
    urlCache.set(webflowUrl, webflowUrl);
    return webflowUrl;
  }

  urlCache.set(webflowUrl, newUrl);
  return newUrl;
}

async function replaceUrlsInHtml(html: string): Promise<{ result: string; count: number }> {
  const matches = html.match(CDN_REGEX);
  if (!matches) return { result: html, count: 0 };

  const unique = [...new Set(matches)];
  let result = html;
  let count = 0;

  for (const url of unique) {
    const newUrl = await migrateUrl(url);
    if (newUrl !== url) {
      result = result.split(url).join(newUrl);
      count++;
    }
  }
  return { result, count };
}

async function main() {
  console.log("=== Body Image Migration: Webflow CDN -> Supabase Storage ===\n");

  let totalMigrated = 0;

  for (const { table, columns } of TABLES_COLUMNS) {
    console.log(`\n--- ${table} ---`);

    const selectCols = ["id", "slug", ...columns].join(", ");
    const { data: rows, error } = await supabase.from(table).select(selectCols);

    if (error) {
      console.error(`  ERROR fetching ${table}: ${error.message}`);
      continue;
    }
    if (!rows || rows.length === 0) {
      console.log("  No rows");
      continue;
    }

    for (const row of rows) {
      const updates: Record<string, string> = {};

      for (const col of columns) {
        const html = row[col];
        if (!html || !html.includes("cdn.prod.website-files.com")) continue;

        const { result, count } = await replaceUrlsInHtml(html);
        if (count > 0) {
          updates[col] = result;
          console.log(`  ${row.slug || row.id} / ${col}: ${count} URLs migrated`);
          totalMigrated += count;
        }
      }

      if (Object.keys(updates).length > 0) {
        const { error: updateErr } = await supabase.from(table).update(updates).eq("id", row.id);
        if (updateErr) {
          console.error(`  UPDATE FAILED ${row.slug}: ${updateErr.message}`);
        }
      }
    }
  }

  console.log(`\n=== Done. ${totalMigrated} URLs migrated, ${urlCache.size} unique images. ===`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
