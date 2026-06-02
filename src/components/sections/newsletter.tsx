"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

export function Newsletter() {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // TODO: integrate with actual newsletter API
    setStatus("success");
    setEmail("");
  }

  return (
    <section className="py-20 lg:py-28 bg-purple">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white mb-6">
            <Mail className="h-6 w-6" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            {t("title")}
          </h2>
          <p className="text-lg text-white/80 mb-8">{t("subtitle")}</p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder={t("placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/40"
              required
            />
            <Button
              type="submit"
              size="lg"
              className="h-12 rounded-full bg-white text-purple hover:bg-white/90 font-semibold px-8 shrink-0"
            >
              {t("cta")}
            </Button>
          </form>

          {status === "success" && (
            <p className="mt-4 text-sm text-green-light">{t("success")}</p>
          )}
          {status === "error" && (
            <p className="mt-4 text-sm text-red-300">{t("error")}</p>
          )}
        </div>
      </div>
    </section>
  );
}
