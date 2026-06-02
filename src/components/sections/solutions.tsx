import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Database, MessageSquare, Brain, Users, ArrowRight } from "lucide-react";

const SOLUTIONS = [
  {
    key: "management" as const,
    icon: Database,
    href: "/solutions/management-system",
  },
  {
    key: "questionnaire" as const,
    icon: MessageSquare,
    href: "/solutions/questionnaire-automation",
  },
  {
    key: "ai" as const,
    icon: Brain,
    href: "/solutions/ai-intelligence",
  },
  {
    key: "supplier" as const,
    icon: Users,
    href: "/solutions/supplier-engagement",
  },
];

export function Solutions() {
  const t = useTranslations("solutions");

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {SOLUTIONS.map(({ key, icon: Icon, href }) => (
            <div
              key={key}
              className="group rounded-2xl border border-border bg-ivory p-8 hover:shadow-lg hover:border-purple/20 transition-all duration-300"
            >
              {/* Illustration placeholder */}
              <div className="aspect-[16/9] rounded-xl bg-gradient-to-br from-purple-light/50 to-yellow-light/50 mb-6 flex items-center justify-center border border-border/50">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Icon className="h-10 w-10 text-purple/50" />
                  <span className="text-xs">Illustration</span>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-3">
                {t(`${key}.title`)}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t(`${key}.description`)}
              </p>
              <Link
                href={href}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-purple hover:text-purple-dark transition-colors group-hover:gap-2.5"
              >
                {t(`${key}.cta`)}
                <ArrowRight className="h-4 w-4 transition-all" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
