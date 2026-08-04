import { RECENT } from "../data/samples";
import { I, Ic } from "./icons";

export function RecentAnalyses() {
  return (
    <>
      <div className="row-head">
        <h2 className="section-title">Recent Analyses</h2>
        <a className="link-quiet">View all</a>
      </div>
      <section className="recent">
        {RECENT.map((r) => (
          <article key={r.title} className={`recent-card is-${r.band}`}>
            <div>
              <div className="eyebrow">{r.kind}</div>
              <h4>{r.title}</h4>
              <div className="when">{r.when}</div>
            </div>
            <div className="score">
              <div className="pct">{r.pct}%</div>
              <div className="tag">{r.tag}</div>
            </div>
          </article>
        ))}
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