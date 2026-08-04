import type { Analysis, Band } from "../types/analysis";
import { I, Ic } from "./icons";

function color(band: Band) {
  return band === "high" ? "var(--sage)" : band === "med" ? "var(--gold)" : "var(--coral)";
}

export default function AnalysisReport({
  status,
  result,
}: {
  status: "idle" | "loading" | "done";
  result: Analysis | null;
}) {
  if (status === "loading")
    return (
      <div className="report">
        <div className="loading">
          <div className="spinner" />
          Checking sources, claims, and AI signals…
        </div>
      </div>
    );

  if (!result)
    return (
      <div className="report">
        <div className="empty-report">
          Paste something above and press <b>Verify this</b> to see a full breakdown here.
        </div>
      </div>
    );

  const pct = `${result.score}%`;
  const c = color(result.band);

  return (
    <div className="report">
      {/* Analyzed content */}
      <div className="panel">
        <h5>Analyzed Content</h5>
        <div className="thumb"><span className="thumb-tag">{result.type}</span></div>
        <div className="analyzed-title">{result.title}</div>
        <div className="meta-row"><div className="k">Source</div><div className="v">{result.source}</div></div>
        <div className="meta-row"><div className="k">Type</div><div className="v">{result.type}</div></div>
        <div className="meta-row"><div className="k">Analyzed</div><div className="v">Just now</div></div>
      </div>

      {/* Credibility */}
      <div className="panel">
        <h5>Credibility Assessment</h5>
        <div>
          <span className="big-score" style={{ color: c }}>{pct}</span>
          <span className="big-label">{result.label}</span>
        </div>
        <div className="bar"><i style={{ width: pct, background: c }} /></div>
        <p className="assess-note">
          This score reflects source clarity, sound reasoning, emotional tone and citation quality —
          not a simple true/false label.
        </p>

        <div className="evidence">
          <h6>Evidence Summary</h6>
          {result.evidence.map((e) => (
            <div className="ev-row" key={e.label}>
              <span className="ev-l"><Ic p={I.check} />{e.label}</span>
              <span className={`verdict-${e.verdict === "yes" ? "yes" : e.verdict === "no" ? "no" : "flag"}`}>
                {e.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Why */}
      <div className="panel">
        <h5>Why this assessment?</h5>
        <p className="why">{result.why}</p>
        {result.aiLikely && (
          <p className="why" style={{ marginTop: 12, color: "var(--gold)" }}>
            ⚠ Some passages read as though they may be AI-generated. Treat unusually smooth,
            source-free text with care.
          </p>
        )}
        <div className="sources">
          <h6 style={{ fontSize: 13, marginBottom: 12 }}>Reliable Sources</h6>
          {result.reliableSources.map((s) => (
            <a className="source-pill" key={s}>{s}</a>
          ))}
        </div>
      </div>

      {/* Journey */}
      <div className="panel">
        <h5>Verification Journey</h5>
        <div className="journey">
          {result.journey.map((j) => (
            <div className={`j-step ${j.warn ? "warn" : ""}`} key={j.title}>
              <span className="j-dot" />
              <div className="j-body"><div className="t">{j.title}</div><div className="s">{j.status}</div></div>
            </div>
          ))}
        </div>
        <div className="j-final">
          <span className="chk"><Ic p={I.check} /></span>
          <div>
            <div className="t">Final Assessment</div>
            <div className="v" style={{ color: c }}>{pct} {result.label}</div>
          </div>
        </div>
      </div>
    </div>
  );
}