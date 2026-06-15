import { getTranslations } from "next-intl/server";
import { localizedHref } from "../lib/localized-paths";
import { FrameworkTabs, type FrameworkTab } from "./FrameworkTabs";

// `path` is the routing target. Frameworks without a dedicated page yet fall
// back to the /frameworks index until their page ships.
const FRAMEWORKS_INDEX = "/frameworks";

const TABS: { key: string; frameworks: { key: string; path: string }[] }[] = [
  {
    key: "sustainability",
    frameworks: [
      { key: "ecovadis", path: "/frameworks/ecovadis" },
      { key: "cdp", path: "/frameworks/cdp" },
      { key: "csrd", path: "/frameworks/csrd" },
      { key: "carbon", path: FRAMEWORKS_INDEX },
    ],
  },
  {
    key: "quality",
    frameworks: [
      { key: "iso", path: "/frameworks/iso-14001" },
      { key: "iso50001", path: FRAMEWORKS_INDEX },
    ],
  },
];

/**
 * Hero launchpad: a two-tab (Sustainability / Quality) chooser that routes
 * visitors straight into the product-specific framework pages.
 */
export async function FrameworkChooser({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "frameworkChooser" });

  const tabs: FrameworkTab[] = TABS.map((tab) => ({
    key: tab.key,
    label: t(`tabs.${tab.key}`),
    frameworks: tab.frameworks.map(({ key, path }) => ({
      key,
      name: t(`${key}.name`),
      urgency: t(`${key}.urgency`),
      cta: t(`${key}.cta`),
      href: localizedHref(path, locale),
    })),
  }));

  return <FrameworkTabs tabs={tabs} />;
}
