import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const ARTICLES = [
  {
    slug: "what-is-esg",
    titleEn: "What is ESG? A Complete Guide for 2025",
    titleFr: "Qu'est-ce que l'ESG ? Guide complet 2025",
    category: "Guide",
  },
  {
    slug: "csr-scope-explained",
    titleEn: "CSR Scope Explained: What Your Company Needs to Know",
    titleFr: "Le périmètre RSE expliqué : ce que votre entreprise doit savoir",
    category: "Blog",
  },
  {
    slug: "corporate-responsibility-trends",
    titleEn: "Corporate Responsibility Trends Shaping 2025",
    titleFr: "Les tendances de la responsabilité d'entreprise en 2025",
    category: "Insights",
  },
];

export function BlogPreview() {
  const t = useTranslations("blog");

  return (
    <section className="py-20 lg:py-28 bg-ivory">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">
              {t("title")}
            </h2>
            <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
          </div>
          <Link
            href="/resources/blog"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-full border-purple text-purple hover:bg-purple-light w-fit"
            )}
          >
            {t("viewAll")}
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {ARTICLES.map((article) => (
            <article
              key={article.slug}
              className="group rounded-2xl border border-border bg-white overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Thumbnail placeholder */}
              <div className="aspect-[16/9] bg-gradient-to-br from-purple-light/30 to-yellow-light/30 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="mx-auto mb-1 h-10 w-10 rounded-lg bg-muted/80 flex items-center justify-center">
                    <span className="text-lg">📄</span>
                  </div>
                  <span className="text-xs">Thumbnail</span>
                </div>
              </div>

              <div className="p-6">
                <span className="inline-block mb-2 text-xs font-medium text-purple bg-purple-light rounded-full px-2.5 py-0.5">
                  {article.category}
                </span>
                <h3 className="text-base font-semibold text-foreground leading-snug group-hover:text-purple transition-colors">
                  {article.titleEn}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
