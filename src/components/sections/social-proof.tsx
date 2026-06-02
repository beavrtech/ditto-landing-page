import { useTranslations } from "next-intl";

const COMPANIES = [
  "Company 1",
  "Company 2",
  "Company 3",
  "Company 4",
  "Company 5",
  "Company 6",
  "Company 7",
  "Company 8",
  "Company 9",
];

export function SocialProof() {
  const t = useTranslations("socialProof");

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-muted-foreground mb-8">
          {t("title")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
          {COMPANIES.map((company) => (
            <div
              key={company}
              className="flex h-12 w-28 items-center justify-center rounded-lg bg-muted/50 text-xs text-muted-foreground hover:bg-purple-light transition-colors"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
