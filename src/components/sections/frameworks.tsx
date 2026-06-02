import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FileText, Award, Leaf, BarChart3 } from "lucide-react";

const FRAMEWORKS = [
  { key: "csrd" as const, icon: FileText, color: "bg-purple-light text-purple" },
  { key: "ecovadis" as const, icon: Award, color: "bg-yellow-light text-yellow" },
  { key: "iso" as const, icon: Leaf, color: "bg-green-light text-green" },
  { key: "cdp" as const, icon: BarChart3, color: "bg-purple-light text-purple" },
];

export function Frameworks() {
  const t = useTranslations("frameworks");

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

        <div className="grid sm:grid-cols-2 gap-6">
          {FRAMEWORKS.map(({ key, icon: Icon, color }) => (
            <div
              key={key}
              className="group rounded-2xl border border-border bg-white p-8 hover:shadow-lg hover:border-purple/20 transition-all duration-300"
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${color} mb-5`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {t(`${key}.title`)}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t(`${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
