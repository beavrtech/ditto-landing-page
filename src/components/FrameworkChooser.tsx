import { getTranslations } from "next-intl/server";
import { localizedHref } from "../lib/localized-paths";
import { FrameworkGrid, type FrameworkCard } from "./FrameworkTabs";

const FRAMEWORKS_INDEX = "/frameworks";

const FRAMEWORKS: { key: string; path: string }[] = [
  { key: "ecovadis", path: "/frameworks/ecovadis" },
  { key: "cdp", path: "/frameworks/cdp" },
  { key: "csrd", path: "/frameworks/csrd" },
  { key: "carbon", path: "/frameworks/carbon" },
  { key: "iso", path: "/frameworks/iso-14001" },
  { key: "iso50001", path: FRAMEWORKS_INDEX },
];

export async function FrameworkChooser({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "frameworkChooser" });

  const frameworks: FrameworkCard[] = FRAMEWORKS.map(({ key, path }) => ({
    key,
    name: t(`${key}.name`),
    urgency: t(`${key}.urgency`),
    href: localizedHref(path, locale),
  }));

  return <FrameworkGrid frameworks={frameworks} />;
}
