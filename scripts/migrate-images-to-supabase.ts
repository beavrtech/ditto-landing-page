/**
 * Migration script: Download images from Webflow CDN and upload to Supabase Storage
 *
 * Usage: npx tsx scripts/migrate-images-to-supabase.ts
 *
 * This script is idempotent — re-running it will skip images already hosted on Supabase.
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars");
  process.exit(1);
}
const BUCKET_NAME = "cms-images";
const CDN_MARKER = "cdn.prod.website-files.com";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Tables and their image URL columns to migrate
const TABLE_COLUMNS: Record<string, string[]> = {
  authors: ["picture_url"],
  testimonials: ["logo_url", "profile_picture_url"],
  company_logos: ["logo_url"],
  customer_stories: [
    "business_logo_url",
    "banner_url",
    "quote_author_picture_url",
  ],
  blog_posts: ["banner_url"],
  news: ["banner_url"],
  guides: ["banner_url"],
  events: ["banner_url"],
  company_updates: ["banner_url"],
  collection_items: ["banner_url"],
};

function getExtensionFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const lastSegment = pathname.split("/").pop() || "";
    const ext = lastSegment.split(".").pop()?.toLowerCase();
    if (ext && ["png", "jpg", "jpeg", "gif", "svg", "webp", "avif"].includes(ext)) {
      return ext;
    }
  } catch {
    // ignore
  }
  return "png"; // fallback
}

function getContentType(ext: string): string {
  const map: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
    webp: "image/webp",
    avif: "image/avif",
  };
  return map[ext] || "application/octet-stream";
}

function buildStoragePath(
  table: string,
  slug: string,
  column: string,
  ext: string
): string {
  return `${table}/${slug}/${column}.${ext}`;
}

function buildPublicUrl(storagePath: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${storagePath}`;
}

async function ensureBucket(): Promise<void> {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) {
    throw new Error(`Failed to list buckets: ${error.message}`);
  }

  const exists = buckets?.some((b) => b.name === BUCKET_NAME);
  if (!exists) {
    const { error: createError } = await supabase.storage.createBucket(
      BUCKET_NAME,
      { public: true }
    );
    if (createError) {
      throw new Error(`Failed to create bucket: ${createError.message}`);
    }
    console.log(`Created bucket "${BUCKET_NAME}"`);
  } else {
    console.log(`Bucket "${BUCKET_NAME}" already exists`);
  }
}

async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} downloading ${url}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function uploadToStorage(
  storagePath: string,
  data: Buffer,
  contentType: string
): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, data, {
      contentType,
      upsert: true,
    });
  if (error) {
    throw new Error(`Upload failed for ${storagePath}: ${error.message}`);
  }
}

async function processTable(
  table: string,
  columns: string[]
): Promise<void> {
  console.log(`\n--- Processing table: ${table} ---`);

  // Fetch all rows; select id, slug, and all image columns
  const selectColumns = ["id", "slug", ...columns].join(", ");
  const { data: rows, error } = await supabase
    .from(table)
    .select(selectColumns);

  if (error) {
    console.error(`  ERROR fetching rows from ${table}: ${error.message}`);
    return;
  }

  if (!rows || rows.length === 0) {
    console.log(`  No rows found in ${table}`);
    return;
  }

  console.log(`  Found ${rows.length} rows`);

  for (const row of rows) {
    const slug: string = row.slug || row.id;

    for (const column of columns) {
      const currentUrl: string | null = row[column];

      // Skip null/empty values
      if (!currentUrl) {
        continue;
      }

      // Skip already-migrated URLs (not from Webflow CDN)
      if (!currentUrl.includes(CDN_MARKER)) {
        continue;
      }

      const ext = getExtensionFromUrl(currentUrl);
      const storagePath = buildStoragePath(table, slug, column, ext);
      const newPublicUrl = buildPublicUrl(storagePath);

      try {
        // Check if file already exists in storage (idempotent)
        const { data: existingFile } = await supabase.storage
          .from(BUCKET_NAME)
          .list(`${table}/${slug}`, {
            search: `${column}.${ext}`,
          });

        const alreadyUploaded =
          existingFile && existingFile.some((f) => f.name === `${column}.${ext}`);

        if (!alreadyUploaded) {
          // Download from Webflow CDN
          const imageData = await downloadImage(currentUrl);

          // Upload to Supabase Storage
          await uploadToStorage(
            storagePath,
            imageData,
            getContentType(ext)
          );
          console.log(`  UPLOADED ${table}/${slug}/${column}.${ext}`);
        } else {
          console.log(`  SKIPPED  ${table}/${slug}/${column}.${ext} (already uploaded)`);
        }

        // Update the database row with the new URL
        const { error: updateError } = await supabase
          .from(table)
          .update({ [column]: newPublicUrl })
          .eq("id", row.id);

        if (updateError) {
          console.error(
            `  ERROR updating ${table}.${column} for slug=${slug}: ${updateError.message}`
          );
        } else {
          console.log(`  UPDATED  ${table} row slug=${slug} column=${column}`);
        }
      } catch (err: any) {
        console.error(
          `  ERROR processing ${table}/${slug}/${column}: ${err.message}`
        );
        // Continue to next image
      }
    }
  }
}

async function main(): Promise<void> {
  console.log("=== Image Migration: Webflow CDN -> Supabase Storage ===\n");

  // Step 1: Ensure bucket exists
  await ensureBucket();

  // Step 2: Process each table
  for (const [table, columns] of Object.entries(TABLE_COLUMNS)) {
    await processTable(table, columns);
  }

  console.log("\n=== Migration complete ===");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
