import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Slack mrkdwn requires &, < and > to be escaped
function slackEscape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Receives the email captured by the hero "Get Started" form and notifies
 * the Slack channel configured via SLACK_WEBHOOK_URL (Slack incoming
 * webhook). Skips silently when the webhook is not configured.
 */
export async function POST(req: Request) {
  let body: { email?: unknown; page?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();
  if (!EMAIL_RE.test(email) || email.length > 320) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const page =
    typeof body.page === "string" ? body.page.slice(0, 200) : undefined;

  const tasks: Promise<unknown>[] = [];

  // Trigger the automation webhook with the captured email.
  const automationUrl =
    process.env.AUTOMATION_WEBHOOK_URL ??
    "https://automation.trustditto.com/hooks/hk_fd5f908d654e4ff78d00d3c64e1ee049";
  tasks.push(
    fetch(automationUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => {}),
  );

  // Notify Slack (incoming webhook) when configured.
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (webhookUrl) {
    tasks.push(
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `:incoming_envelope: New lead from the website: *${slackEscape(email)}*${page ? ` (submitted on ${slackEscape(page)})` : ""}`,
        }),
      }).catch(() => {}),
    );
  }

  await Promise.allSettled(tasks);

  return NextResponse.json({ ok: true });
}
