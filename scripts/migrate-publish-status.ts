/**
 * Migration script: Pull isDraft/isArchived from Webflow and update Supabase
 * Usage: npx tsx scripts/migrate-publish-status.ts
 */

import { createClient } from "@supabase/supabase-js";

const WEBFLOW_TOKEN = process.env.WEBFLOW_API_TOKEN!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const COLLECTIONS: Record<string, { id: string; table: string }> = {
  blogs: { id: "68371e5064d6cf3d197ba4b6", table: "blog_posts" },
  news: { id: "68371f104474c3bfd57e0bd8", table: "news" },
  guides: { id: "68404311c509431bc159a9c4", table: "guides" },
  events: { id: "68492a24f79fbc809400e6f1", table: "events" },
  companyUpdates: { id: "68492c5fd6bf38f8e0db7813", table: "company_updates" },
  customerStories: { id: "6835cfc538240dce48169939", table: "customer_stories" },
  testimonials: { id: "684951a44deb11e534497543", table: "testimonials" },
  ecovadis: { id: "691d633f087b03cd866e5250", table: "collection_items" },
  cdp: { id: "6920441902fb071ad2b1b899", table: "collection_items" },
  iso14001: { id: "69204455f1e45627754698e4", table: "collection_items" },
  vsme: { id: "69204496b171fc1060187287", table: "collection_items" },
  csrd: { id: "692044ad10d2e9c0cd6ae93a", table: "collection_items" },
  sbti: { id: "692044d102fb071ad2b2038d", table: "collection_items" },
  positiveCompany: { id: "692044ea521005e1cbbafebb", table: "collection_items" },
};

async function fetchAllItems(collectionId: string): Promise<any[]> {
  const items: any[] = [];
  let offset = 0;
  while (true) {
    const res = await fetch(
      `https://api.webflow.com/v2/collections/${collectionId}/items?limit=100&offset=${offset}`,
      { headers: { Authorization: `Bearer ${WEBFLOW_TOKEN}`, accept: "application/json" } }
    );
    if (!res.ok) break;
    const data = await res.json();
    items.push(...(data.items || []));
    if (!data.items || data.items.length < 100) break;
    offset += 100;
  }
  return items;
}

async function main() {
  console.log("=== Migrating publish/archive status ===\n");

  for (const [name, { id, table }] of Object.entries(COLLECTIONS)) {
    console.log(`Processing ${name} → ${table}...`);
    const items = await fetchAllItems(id);

    let drafts = 0;
    let archived = 0;

    for (const item of items) {
      const slug = item.fieldData?.slug;
      if (!slug) continue;

      const isDraft = item.isDraft === true;
      const isArchived = item.isArchived === true;

      if (isDraft) drafts++;
      if (isArchived) archived++;

      // For collection_items, match by slug (could match multiple frameworks)
      const { error } = await supabase
        .from(table)
        .update({
          published: !isDraft,
          archived: isArchived,
        })
        .eq("slug", slug);

      if (error) {
        console.error(`  Error updating ${slug}:`, error.message);
      }
    }

    console.log(`  ${items.length} items — ${drafts} drafts, ${archived} archived`);
  }

  console.log("\n=== Done! ===");
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
