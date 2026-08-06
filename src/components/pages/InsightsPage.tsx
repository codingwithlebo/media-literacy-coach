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

type BreakdownBand = "high" | "med" | "low";

type BreakdownItem = {
  label: string;
  pct: number;
  band: BreakdownBand;
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
  const pct = (value: number) =>
    total > 0 ? Math.round((value / total) * 100) : 0;

  const STATS = [
    { k: "Items checked", v: String(total), note: "all time" },
    {
      k: "Avg. credibility",
      v: `${stats?.avg_score ?? 0}%`,
      note: "of reviewed items",
    },
    {
      k: "Flagged as fake",
      v: String(stats?.likely_fake ?? 0),
      note: "likely misleading",
    },
    {
      k: "Flagged as real",
      v: String(stats?.likely_real ?? 0),
      note: "likely credible",
    },
  ];

  const BREAKDOWN: BreakdownItem[] = [
    { label: "Reliable", pct: pct(stats?.likely_real ?? 0), band: "high" },
    { label: "Uncertain", pct: pct(stats?.uncertain ?? 0), band: "med" },
    { label: "Low credibility", pct: pct(stats?.likely_fake ?? 0), band: "low" },
  ];

  return (
    <div>
      <p className="greeting">Insights</p>
      <h1 className="headline">Your verification habits</h1>
      <p className="subhead">
        A clear view of what you’ve checked and how the signal is shaping up.
      </p>

      <section className="stat-grid mt-48">
        {STATS.map((stat) => (
          <div className="stat-card" key={stat.k}>
            <div className="stat-v">{stat.v}</div>
            <div className="stat-k">{stat.k}</div>
            <div className="stat-note">{stat.note}</div>
          </div>
        ))}
      </section>

      <div className="row-head mt-48">
        <h2 className="section-title">Credibility breakdown</h2>
      </div>
      <div className="panel">
        {total === 0 ? (
          <p className="link-quiet">
            No checks yet — verify something to see your breakdown here.
          </p>
        ) : (
          BREAKDOWN.map((item) => (
            <div className="break-row" key={item.label}>
              <span className="break-label">{item.label}</span>
              <div className="break-bar">
                <i
                  className={`is-${item.band}-bg`}
                  style={{ width: `${item.pct}%` }}
                />
              </div>
              <div className="card-body">
                <p>{item.pct}% of checked items</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
