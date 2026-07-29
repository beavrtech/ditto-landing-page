import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BlogListPage } from "../../../../components/BlogListPage";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("resourcesBlog.title"),
    description: t("resourcesBlog.description"),
    alternates: {
      canonical: locale === "fr" ? "https://www.trustditto.com/fr/ressources/blog" : "https://www.trustditto.com/en/resources/blog",
      languages: {
        "x-default": "https://www.trustditto.com/en/resources/blog",
        en: "https://www.trustditto.com/en/resources/blog",
        fr: "https://www.trustditto.com/fr/ressources/blog",
      },
    },
    openGraph: {
      title: t("resourcesBlog.title"),
      description: t("resourcesBlog.description"),
      images: [{ url: "https://www.trustditto.com/images/og-default.jpg" }],
    },
  };
}

export const revalidate = 3600;

export default async function ResourcesBlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <BlogListPage locale={locale} />;
}
