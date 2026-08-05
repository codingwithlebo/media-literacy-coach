import { useEffect, useState } from "react";

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
    { k: "Items checked", v: String(total), note: "all time" },
    { k: "Avg. credibility", v: `${stats?.avg_score ?? 0}%`, note: "of what you checked" },
    { k: "Flagged as fake", v: String(stats?.likely_fake ?? 0), note: "likely misleading" },
    { k: "Flagged as real", v: String(stats?.likely_real ?? 0), note: "likely credible" },
  ];

  const BREAKDOWN = [
    { label: "Reliable", pct: pct(stats?.likely_real ?? 0), band: "high" },
    { label: "Uncertain", pct: pct(stats?.uncertain ?? 0), band: "med" },
    { label: "Low credibility", pct: pct(stats?.likely_fake ?? 0), band: "low" },
  ];

  return (
    <>
      <p className="greeting">Insights</p>
      <h1 className="headline">Your verification habits</h1>
      <p className="subhead">
        A picture of what's been checked and how often the warning signs show up.
      </p>
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
        <h2 className="section-title">Credibility breakdown</h2>
      </div>
      <div className="panel">
        {total === 0 ? (
          <p className="link-quiet">No checks yet — verify something to see your breakdown here.</p>
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