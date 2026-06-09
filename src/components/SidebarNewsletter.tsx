"use client";

import { useState, useCallback } from "react";

export function SidebarNewsletter({ locale }: { locale: string }) {
  const isFr = locale === "fr";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const portalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID_CONTACT;
      const formId = process.env.NEXT_PUBLIC_HUBSPOT_FORM_ID;
      const res = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fields: [{ name: "email", value: email }],
            context: { pageUri: window.location.href, pageName: document.title },
          }),
        }
      );
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }, [email]);

  if (status === "success") {
    return (
      <div className="post_sidebar_cta_wrapper">
        <div className="post_sidebar_cta">
          <p className="heading-size-1x375rem">
            {isFr ? "Merci pour votre inscription !" : "Thank you for subscribing!"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="post_sidebar_cta_wrapper">
      <div className="post_sidebar_cta">
        <p className="heading-size-1x375rem">
          {isFr
            ? "Conseils pratiques IA & RSE — outils, études et modèles, dans votre boîte mail"
            : "Practical AI & CSR insights—tools, studies, and templates, in your inbox"}
        </p>
        <div className="spacer-1x5rem" />
        <div className="post_sidebar_newsletter">
          <form className="newsletter_form_wrapper" onSubmit={handleSubmit}>
            <div className="newsletter_input_wrapper">
              <input
                type="email"
                className="newsletter_input flex-grow is--small"
                placeholder="name@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="button is--small"
                disabled={status === "loading"}
              >
                {status === "loading"
                  ? "..."
                  : isFr ? "S'inscrire" : "Subscribe"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
