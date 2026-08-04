const STATS = [
  { k: "Items checked", v: "24", note: "this month" },
  { k: "Avg. credibility", v: "58%", note: "of what you checked" },
  { k: "Red flags caught", v: "11", note: "emotional / unsourced" },
  { k: "Challenges passed", v: "4/5", note: "learning streak" },
];

const BREAKDOWN = [
  { label: "Reliable", pct: 33, band: "high" },
  { label: "Moderately reliable", pct: 42, band: "med" },
  { label: "Low credibility", pct: 25, band: "low" },
];

export default function InsightsPage() {
  return (
    <>
      <p className="greeting">Insights</p>
      <h1 className="headline">Your verification habits</h1>
      <p className="subhead">
        A picture of what you&rsquo;ve been checking and how often the warning signs show up. Real numbers
        appear here once the backend starts saving your analyses.
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
        {BREAKDOWN.map((b) => (
          <div className="break-row" key={b.label}>
            <span className="break-label">{b.label}</span>
            <div className="break-bar">
              <i className={`is-${b.band}-bg`} style={{ width: `${b.pct}%` }} />
            </div>
            <span className="break-pct">{b.pct}%</span>
          </div>
        ))}
      </div>
    </>
  );
}