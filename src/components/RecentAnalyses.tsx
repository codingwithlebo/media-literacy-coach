import { useEffect, useState } from "react";
import { bandFor, labelFor } from "../data/heuristics";
import { I, Ic } from "./icons";

const API =
  (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env
    ?.VITE_API_URL ?? "";

type SavedAnalysis = {
  id: number;
  created_at: string;
  content: string;
  content_type: string;
  credibility_score: number;
  verdict: string;
  explanation: string;
};

function timeAgo(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

const KIND_LABELS: Record<string, string> = {
  article: "News Article",
  social_post: "Social Post",
  job_post: "Job Post",
  message: "Message",
};

export function RecentAnalyses() {
  const [items, setItems] = useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/analyses/recent?limit=3`)
      .then((res) => res.json())
      .then((data) => setItems(data.items ?? []))
      .catch((err) => console.error("Failed to load recent analyses:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="row-head">
        <h2 className="section-title">Recent Analyses</h2>
        <a className="link-quiet">View all</a>
      </div>
      <section className="recent">
        {loading && <p className="link-quiet">Loading…</p>}
        {!loading && items.length === 0 && (
          <p className="link-quiet">No checks yet — try verifying something above.</p>
        )}
        {items.map((item) => {
          const band = bandFor(item.credibility_score);
          return (
            <article key={item.id} className={`recent-card is-${band}`}>
              <div>
                <div className="eyebrow">{KIND_LABELS[item.content_type] ?? item.content_type}</div>
                <h4>{item.content.slice(0, 60)}{item.content.length > 60 ? "…" : ""}</h4>
                <div className="when">{timeAgo(item.created_at)}</div>
              </div>
              <div className="score">
                <div className="pct">{item.credibility_score}%</div>
                <div className="tag">{labelFor(band)}</div>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}

export function LearnBanner({ onClick }: { onClick?: () => void }) {
  return (
    <div className="learn-banner">
      <div className="cap"><Ic p={I.learn} /></div>
      <div className="txt">
        <h4>Continue learning and improve your media literacy skills.</h4>
        <p>Explore short lessons and real-world challenges.</p>
      </div>
      <button className="btn" onClick={onClick}>Go to Learning Hub</button>
    </div>
  );
}