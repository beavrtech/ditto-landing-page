import { redirect } from "next/navigation";

export default async function ResourcesEventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`https://app.livestorm.co/trustditto?lang=${locale}`);
}
