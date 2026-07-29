import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BlogListPage } from "../../../../../../components/BlogListPage";
import { blogListCanonical } from "../../../../../../lib/blog-listing";
import { getCategoryDisplayName } from "../../../../../../lib/blog-category-meta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  const name = await getCategoryDisplayName(category, locale);
  if (!name) return {};
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("resourcesBlog.categoryTitle", { name }),
    description: t("resourcesBlog.categoryDescription", { name }),
    alternates: {
      canonical: blogListCanonical(locale, { category }),
      languages: {
        "x-default": blogListCanonical("en", { category }),
        en: blogListCanonical("en", { category }),
        fr: blogListCanonical("fr", { category }),
      },
    },
  };
}

export const revalidate = 3600;

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  return <BlogListPage locale={locale} categorySlug={category} />;
}
