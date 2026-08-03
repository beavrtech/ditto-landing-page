/**
 * Client side of the Scope letter sign-up. Both forms — the home page box with
 * its preferences and the article rail's email-only one — post the same shape,
 * so the channel message reads the same whichever they came from.
 */
export async function subscribe(input: {
  email: string;
  themes?: string[];
  industry?: string;
  locale: "en" | "fr";
}): Promise<boolean> {
  try {
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...input,
        page: typeof window === "undefined" ? undefined : window.location.href,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
