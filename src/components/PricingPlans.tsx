import { getPricingContent, type ComparisonCell } from "../lib/pricing-plans";
import { localizedHref } from "../lib/localized-paths";

const CHECK_SVG =
  '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 9.5L7 13L14.5 5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const ARROW_SVG =
  '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 9h11M10 4.5L14.5 9 10 13.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function Cell({ value }: { value: ComparisonCell }) {
  if (value === true) {
    return (
      <span
        className="pricing-compare_check"
        aria-label="Included"
        dangerouslySetInnerHTML={{ __html: CHECK_SVG }}
      />
    );
  }
  if (value === false) {
    return <span className="pricing-compare_dash" aria-hidden="true">—</span>;
  }
  return <span className="pricing-compare_value">{value}</span>;
}

/**
 * Vanta-style pricing body: hero, four plan cards (Guided highlighted),
 * a grouped feature-comparison table, and an FAQ. Server-rendered; the FAQ
 * uses native <details>/<summary> so it needs no client JS.
 */
export function PricingPlans({ locale }: { locale: string }) {
  const c = getPricingContent(locale);

  return (
    <>
      {/* Hero */}
      <section className="pricing-hero">
        <div className="padding-global">
          <div className="container-80rem">
            <div className="pricing-hero_inner">
              <h1 className="heading-size-3rem">{c.hero.title}</h1>
              <p className="pricing-hero_subtitle text-size-1x375rem">{c.hero.subtitle}</p>
              <a href={localizedHref(c.hero.ctaHref, locale)} className="pricing-hero_cta">
                <span>{c.hero.cta}</span>
                <span
                  className="pricing-hero_cta-icon"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: ARROW_SVG }}
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Plan cards */}
      <section className="pricing-plans_section">
        <div className="padding-global">
          <div className="container-80rem">
            <div className="pricing-plans_grid">
              {c.plans.map((plan) => (
                <div
                  key={plan.key}
                  className={`pricing-plan${plan.featured ? " is-featured" : ""}`}
                >
                  {plan.featured ? (
                    <span className="pricing-plan_badge">
                      {locale === "fr" ? "Le plus populaire" : "Most popular"}
                    </span>
                  ) : null}
                  <div className="pricing-plan_head">
                    <h3 className="pricing-plan_name">{plan.name}</h3>
                    <span className="pricing-plan_scope">{plan.scope}</span>
                  </div>
                  <p className="pricing-plan_tagline">{plan.tagline}</p>
                  <p className="pricing-plan_desc">{plan.description}</p>
                  <ul className="pricing-plan_features">
                    {plan.highlights.map((h, i) => (
                      <li key={i} className="pricing-plan_feature">
                        <span
                          className="pricing-plan_feature-icon"
                          aria-hidden="true"
                          dangerouslySetInnerHTML={{ __html: CHECK_SVG }}
                        />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="pricing-compare_section">
        <div className="padding-global">
          <div className="container-80rem">
            <h2 className="pricing-compare_heading heading-size-2rem">{c.comparison.heading}</h2>
            <div className="pricing-compare_scroll">
              <table className="pricing-compare_table">
                <thead>
                  <tr>
                    <th className="pricing-compare_corner" scope="col">
                      <span className="visually-hidden">
                        {locale === "fr" ? "Fonctionnalité" : "Feature"}
                      </span>
                    </th>
                    {c.comparison.columns.map((col, i) => (
                      <th key={col} scope="col" className={i === 1 ? "is-featured" : undefined}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                {c.comparison.groups.map((group) => (
                  <tbody key={group.title}>
                    <tr className="pricing-compare_grouprow">
                      <th scope="colgroup" colSpan={5} className="pricing-compare_grouptitle">
                        {group.title}
                      </th>
                    </tr>
                    {group.rows.map((row) => (
                      <tr key={row.label}>
                        <th scope="row" className="pricing-compare_rowlabel">
                          {row.label}
                        </th>
                        {row.cells.map((cell, i) => (
                          <td key={i} className={i === 1 ? "is-featured" : undefined}>
                            <Cell value={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                ))}
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pricing-faq_section">
        <div className="padding-global">
          <div className="container-55rem">
            <h2 className="pricing-faq_heading heading-size-2rem">{c.faq.heading}</h2>
            <div className="pricing-faq_list">
              {c.faq.items.map((item, i) => (
                <details key={i} className="pricing-faq_item">
                  <summary className="pricing-faq_question">
                    <span>{item.q}</span>
                    <span className="pricing-faq_icon" aria-hidden="true">+</span>
                  </summary>
                  <p className="pricing-faq_answer">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
