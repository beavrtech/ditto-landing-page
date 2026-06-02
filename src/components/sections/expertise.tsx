import { useTranslations } from "next-intl";
import { Lightbulb, UserCheck, GraduationCap, Handshake, Shield } from "lucide-react";

const ITEMS = [
  { key: "methodology" as const, icon: Lightbulb },
  { key: "coach" as const, icon: UserCheck },
  { key: "ecovadisPartner" as const, icon: GraduationCap },
  { key: "efrag" as const, icon: Handshake },
  { key: "compliance" as const, icon: Shield },
];

export function Expertise() {
  const t = useTranslations("expertise");

  return (
    <section className="py-20 lg:py-28 bg-ivory">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ITEMS.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="rounded-2xl border border-border bg-white p-6 hover:shadow-md transition-shadow"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-purple-light text-purple mb-4">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                {t(`${key}.title`)}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(`${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
