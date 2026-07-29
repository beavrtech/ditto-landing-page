"use client";

import { useState } from "react";
import { t } from "../dictionary";
import { MistralLogo, OpenAiLogo, ClaudeLogo } from "./AiLogos";
import type { MediaLocale } from "../data/taxonomy";

/**
 * Each assistant takes a prefilled prompt on the `q` query parameter.
 * If one of them changes its deep-link format, only this list needs editing.
 */
const ASSISTANTS = [
  { name: "Le Chat", base: "https://chat.mistral.ai/chat", Logo: MistralLogo },
  { name: "ChatGPT", base: "https://chatgpt.com/", Logo: OpenAiLogo },
  { name: "Claude", base: "https://claude.ai/new", Logo: ClaudeLogo },
];

export function ArticleActions({
  locale,
  url,
  title,
}: {
  locale: MediaLocale;
  url: string;
  title: string;
}) {
  const copy = t(locale);
  const [copied, setCopied] = useState(false);

  const prompt =
    locale === "fr"
      ? `Résume cet article : "${title}" (${url})`
      : `Summarize this article: "${title}" (${url})`;

  const share = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context or denied permission): leave the
      // label untouched rather than claiming a copy that did not happen.
    }
  };

  return (
    <div className="ns-actions">
      <div className="ns-action-group">
        <button type="button" className="ns-action" onClick={share} aria-live="polite">
          {copied ? copy.linkCopied : copy.share}
        </button>
      </div>
      <div className="ns-action-group">
        <span className="ns-action-label">{copy.summarizeWithAi}</span>
        {ASSISTANTS.map(({ name, base, Logo }) => (
          <a
            key={name}
            className="ns-action"
            href={`${base}?q=${encodeURIComponent(prompt)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Logo />
            {name}
          </a>
        ))}
      </div>
    </div>
  );
}
