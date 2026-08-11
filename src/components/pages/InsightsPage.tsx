import { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

const API =
  (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env
    ?.VITE_API_URL ?? "";

type Stats = {
  total: number;
  likely_fake: number;
  likely_real: number;
  uncertain: number;
  avg_score: number;
};

export default function InsightsPage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch(`${API}/analyses/stats`)
      .then((res) => res.json())
      .then(setStats)
      .catch((err) => console.error("Failed to load stats:", err));
  }, []);

  const total = stats?.total ?? 0;
  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

  const STATS = [
    { k: t("stat_items_checked"), v: String(total), note: t("stat_all_time") },
    { k: t("stat_avg_credibility"), v: `${stats?.avg_score ?? 0}%`, note: t("stat_of_checked") },
    { k: t("stat_flagged_fake"), v: String(stats?.likely_fake ?? 0), note: t("stat_likely_misleading") },
    { k: t("stat_flagged_real"), v: String(stats?.likely_real ?? 0), note: t("stat_likely_credible") },
  ];

  const BREAKDOWN = [
    { label: t("breakdown_reliable"), pct: pct(stats?.likely_real ?? 0), band: "high" },
    { label: t("breakdown_uncertain"), pct: pct(stats?.uncertain ?? 0), band: "med" },
    { label: t("breakdown_low"), pct: pct(stats?.likely_fake ?? 0), band: "low" },
  ];

  return (
    <>
      <p className="greeting">{t("insights_greeting")}</p>
      <h1 className="headline">{t("insights_headline")}</h1>
      <p className="subhead">{t("insights_subhead")}</p>

      <section className="stat-grid mt-48">
        {STATS.map((s) => (
          <div className="stat-card" key={s.k}>
            <div className="stat-v">{s.v}</div>
            <div className="stat-k">{s.k}</div>
            <div className="stat-note">{s.note}</div>
          </div>
        ))}
      </section>

      <div className="row-head mt-48">
        <h2 className="section-title">{t("credibility_breakdown")}</h2>
      </div>
      <div className="panel">
        {total === 0 ? (
          <p className="link-quiet">{t("no_checks_yet")}</p>
        ) : (
          BREAKDOWN.map((b) => (
            <div className="break-row" key={b.label}>
              <span className="break-label">{b.label}</span>
              <div className="break-bar">
                <i className={`is-${b.band}-bg`} style={{ width: `${b.pct}%` }} />
              </div>
              <span className="break-pct">{b.pct}%</span>
            </div>
          ))
        )}
      </div>
    </>
  );
}