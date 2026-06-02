import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden bg-ivory">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-yellow-light px-3 py-1 w-fit">
              <Star className="h-3.5 w-3.5 fill-yellow text-yellow" />
              <span className="text-sm font-medium text-foreground/80">
                {t("trustpilot")}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
              {t("title")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              {t("subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/get-started"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-purple hover:bg-purple-dark text-white text-base px-8 h-12 rounded-full"
                )}
              >
                {t("cta")}
              </Link>
            </div>
          </div>

          {/* Hero image placeholder */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-purple-light via-white to-yellow-light border border-border flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <div className="mx-auto mb-3 h-16 w-16 rounded-xl bg-muted flex items-center justify-center">
                  <span className="text-2xl">🖼️</span>
                </div>
                <p className="text-sm">Hero image</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
