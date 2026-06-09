import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Navbar } from "../../../components/NavbarServer";
import { Footer } from "../../../components/FooterServer";
import { DEVLINK_SCOPE_CLASS } from "../../../../webflow/devlinkScope";

const CSR_AGENTS = [
  { icon: "/images/proprietary-methodology.svg", key: "pestel", status: "Active", hasLink: true },
  { icon: "/images/dedicated-coach.svg", key: "csrStrategy", status: "Active", hasLink: false },
  { icon: "/images/expertise.svg", key: "environmental", status: "Active", hasLink: false },
  { icon: "/images/Icon-10.png", key: "ecovadisWorkplan", status: "ACTIVE", hasLink: false },
  { icon: "/images/growth.svg", key: "cdpWorkplan", status: "ACTIVE", hasLink: false },
];

const COMPLIANCE_AGENTS = [
  { icon: "/images/Icon-10.png", key: "autoFill", status: "ACTIVE", hasLink: false },
  { icon: "/images/sales.svg", key: "isoWorkplan", status: "Active", hasLink: false },
  { icon: "/images/friend-of-efrag.svg", key: "complianceWatch", status: "Active", hasLink: false },
];

const PRODUCTIVITY_AGENTS = [
  { icon: "/images/compliance-watch.svg", key: "translator", status: "Active", hasLink: false },
  { icon: "/images/ecovadis-training-partner.svg", key: "presentation", status: "comingSoon", hasLink: false },
  { icon: "/images/product-and-engineering.svg", key: "spreadsheet", status: "comingSoon", hasLink: false },
];

export const revalidate = 3600;

export default async function AiAgentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();
  const prefix = `/${locale}`;

  const renderAgentCard = (agent: { icon: string; key: string; status: string; hasLink: boolean }) => (
    <div key={agent.key} className="agents_card">
      <div className="agents_card_top">
        <div className="agents_card_icon"><Image src={agent.icon} alt="" width={40} height={40} /></div>
        <p className={`tag${agent.status === "comingSoon" ? " is--orange" : ""}`}>
          {agent.status === "comingSoon" ? t("aiAgents.comingSoon") : t("aiAgents.active")}
        </p>
      </div>
      <div className="spacer-3rem" />
      <div className="agents_card_header">
        <h3 className="heading-size-1x375rem">{t(`aiAgents.agents.${agent.key}.title`)}</h3>
      </div>
      <div className="spacer-0x75rem" />
      <p className="text-size-1rem text-color-neutral">{t(`aiAgents.agents.${agent.key}.description`)}</p>
      <div className="spacer-auto" />
      <div className="spacer-2rem" />
      {agent.hasLink ? (
        <a href={`${prefix}/ai-agents/pestel-analysis`} className="button is--green w-inline-block">
          <p>{t("aiAgents.tryNow")}</p>
        </a>
      ) : (
        <div className="button">
          <p>{agent.status === "comingSoon" ? t("aiAgents.joinWaitlist") : t("aiAgents.requestAccess")}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar />

        {/* Single generic_section with all agent categories */}
        <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
          <section className="generic_section">
            <div className="padding-global">
              <div data-wf--padding--space="small-3rem" className="spacer-component" />
              <div className="container-64rem">
                <div className="header">
                  <h1 className="heading-size-4rem">{t("aiAgents.hero.title")}</h1>
                </div>
              </div>
              <div className="spacer-3x5rem" />
              <div className="container-84rem">
                <div className="agents_ui_nav">
                  <div className="agents_ui_list">
                    <a href="#CSR-Strategy" className="blogui_link">{t("aiAgents.tabs.csr")}</a>
                    <a href="#Workplan-for-CSR-Frameworks" className="blogui_link">{t("aiAgents.tabs.compliance")}</a>
                    <a href="#Productivity" className="blogui_link">{t("aiAgents.tabs.productivity")}</a>
                  </div>
                </div>

                {/* CSR compliance */}
                <div id="CSR-Strategy" className="agents_category">
                  <div className="spacer-4rem" />
                  <h3 className="heading-size-3rem">{t("aiAgents.categories.csr")}</h3>
                  <div className="spacer-2rem" />
                  <div className="agents_component">
                    {CSR_AGENTS.map(renderAgentCard)}
                  </div>
                </div>

                {/* General compliance */}
                <div id="Workplan-for-CSR-Frameworks" className="agents_category">
                  <div className="spacer-5rem" />
                  <h3 className="heading-size-3rem">{t("aiAgents.categories.compliance")}</h3>
                  <div className="spacer-2rem" />
                  <div className="agents_component">
                    {COMPLIANCE_AGENTS.map(renderAgentCard)}
                  </div>
                </div>

                {/* Productivity */}
                <div id="Productivity" className="agents_category">
                  <div className="spacer-5rem" />
                  <h3 className="heading-size-3rem">{t("aiAgents.categories.productivity")}</h3>
                  <div className="spacer-2rem" />
                  <div className="agents_component">
                    {PRODUCTIVITY_AGENTS.map(renderAgentCard)}
                  </div>
                </div>
              </div>
              <div data-wf--padding--space="small-3rem" className="spacer-component" />
            </div>
            <div className="layer-4">
              <div data-wf--background--color="primary" className="background" />
            </div>
          </section>
        </div>

        <Footer />
      </main>
    </div>
  );
}
