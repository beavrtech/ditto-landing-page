import { NextResponse } from "next/server";
import {
  TAXONOMY,
  findIndustry,
  taxonomyLabel,
} from "@/features/media/data/taxonomy";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The Scope's subscription channel. Overridable, so a fork can point elsewhere. */
const CHANNEL = process.env.SLACK_SUBSCRIBE_CHANNEL_ID ?? "C0B96EGAV3R";

// Slack mrkdwn requires &, < and > to be escaped
function slackEscape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * The Scope letter sign-up.
 *
 * Slack is the whole subscriber list for now: there is nothing else storing
 * these, so a delivery failure loses the sign-up. That is why this route
 * reports the Slack outcome instead of always answering `ok` the way
 * `/api/lead` does — the reader is told to try again rather than thanked for
 * a subscription that never arrived.
 *
 * Categories and industry are echoed with their English labels: the channel
 * reads them, not the subscriber.
 */
export async function POST(req: Request) {
  let body: {
    email?: unknown;
    themes?: unknown;
    industry?: unknown;
    locale?: unknown;
    page?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();
  if (!EMAIL_RE.test(email) || email.length > 320) {
    return NextResponse.json({ ok: false, error: "email" }, { status: 400 });
  }

  // Unknown slugs are dropped rather than rejected: the taxonomy can change
  // under a page a reader has had open for a while.
  const themeSlugs = Array.isArray(body.themes) ? body.themes.map(String) : [];
  const themes = TAXONOMY.filter((node) => themeSlugs.includes(node.slug));

  const industrySlug = typeof body.industry === "string" ? body.industry : "";
  const industry = industrySlug ? findIndustry(industrySlug) : null;

  const locale = body.locale === "fr" ? "fr" : "en";
  const page = typeof body.page === "string" ? body.page.slice(0, 200) : undefined;

  const token = process.env.SLACKBOT_OAUTH_TOKEN;
  if (!token) {
    console.error(
      "[subscribe] SLACKBOT_OAUTH_TOKEN is not set: sign-up from %s was not delivered",
      email,
    );
    return NextResponse.json({ ok: false, error: "unconfigured" }, { status: 503 });
  }

  const lines = [
    ":envelope_with_arrow: *New subscription to The Scope letter*",
    `*Email:* ${slackEscape(email)}`,
    `*Categories:* ${
      themes.length
        ? themes.map((node) => slackEscape(taxonomyLabel(node, "en"))).join(", ")
        : "none selected"
    }`,
    `*Industry:* ${industry ? slackEscape(taxonomyLabel(industry, "en")) : "All industries"}`,
    `*Read in:* ${locale.toUpperCase()}${page ? ` — ${slackEscape(page)}` : ""}`,
  ];

  try {
    const res = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        channel: CHANNEL,
        text: lines.join("\n"),
        unfurl_links: false,
      }),
    });
    // chat.postMessage answers 200 with {ok:false, error} on failure, so the
    // status code alone says nothing.
    const result = (await res.json()) as { ok?: boolean; error?: string };
    if (!result.ok) {
      console.error("[subscribe] Slack rejected the message: %s", result.error);
      return NextResponse.json({ ok: false, error: "slack" }, { status: 502 });
    }
  } catch (error) {
    console.error("[subscribe] Slack call failed", error);
    return NextResponse.json({ ok: false, error: "slack" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
