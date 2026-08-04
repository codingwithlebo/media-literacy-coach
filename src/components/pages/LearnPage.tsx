import { useState } from "react";
import confetti from "canvas-confetti";
import { LESSONS, CHALLENGES } from "../../data/challenges";

export default function LearnPage() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [seen, setSeen] = useState(0);
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [openLesson, setOpenLesson] = useState<string | null>(null);
  const [popKey, setPopKey] = useState(0);

  const c = CHALLENGES[i];
  const answered = picked !== null;
  const isRight = picked === c.answer;
  const done = seen >= CHALLENGES.length && answered;

  function choose(idx: number) {
    if (answered) return;
    setPicked(idx);
    setSeen((s) => s + 1);
    if (idx === c.answer) {
      setCorrect((n) => n + 1);
      setCoins((n) => n + 10);
      setStreak((s) => {
        const next = s + 1;
        setBestStreak((best) => Math.max(best, next));
        return next;
      });
      setPopKey((k) => k + 1);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      setStreak(0);
    }
  }
  function next() {
    setPicked(null);
    setI((n) => (n + 1) % CHALLENGES.length);
  }
  function restart() {
    setI(0); setPicked(null); setCorrect(0); setSeen(0); setCoins(0); setStreak(0); setBestStreak(0);
  }
  function toggleLesson(title: string) {
    setOpenLesson((current) => (current === title ? null : title));
  }

  return (
    <>
      <p className="greeting">Learning Hub</p>
      <h1 className="headline">Get better at spotting the tricks</h1>
      <p className="subhead">
        Short lessons plus real-world challenges. The goal isn&rsquo;t to memorize which stories are
        &ldquo;fake&rdquo; — it&rsquo;s to build the habit of asking the right questions.
      </p>

      <div className="row-head mt-48" style={{ gap: 16, flexWrap: "wrap" }}>
        <h2 className="section-title">Daily challenge</h2>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span className="link-quiet">{correct} / {seen} correct</span>
          <span key={`coins-${popKey}`} className="link-quiet stat-pop">🪙 {coins} AI coins</span>
          <span key={`streak-${popKey}`} className="link-quiet stat-pop">🔥 {streak} streak (best {bestStreak})</span>
        </div>
      </div>
      <div className="challenge">
        <div className="challenge-head">
          <span className="eyebrow">{c.kind}</span>
          <span className="challenge-count">Question {i + 1} of {CHALLENGES.length}</span>
        </div>
        <p className="challenge-prompt">{c.prompt}</p>
        <div className="options">
          {c.options.map((opt: string, idx: number) => {
            const state = !answered
              ? ""
              : idx === c.answer
              ? "opt-correct"
              : idx === picked
              ? "opt-wrong"
              : "opt-dim";
            return (
              <button key={opt} className={`option ${state}`} onClick={() => choose(idx)} disabled={answered}>
                {opt}
              </button>
            );
          })}
        </div>
        {answered && (
          <div className={`explain ${isRight ? "explain-good" : "explain-bad"}`}>
            <strong>
              {isRight ? `Nice — that's the read. +10 AI coins` : "Worth a closer look."}
            </strong>
            <p>{c.explain}</p>
            {!done && <button className="btn btn-primary" onClick={next}>Next challenge</button>}
            {done && (
              <div className="challenge-done">
                You finished the set — {correct} of {CHALLENGES.length} on the first try, {coins} AI coins earned, best streak {bestStreak}.
                <button className="btn" onClick={restart} style={{ marginLeft: 10 }}>Start over</button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="row-head mt-48">
        <h2 className="section-title">Short lessons</h2>
      </div>
      <section className="lessons">
        {LESSONS.map((l: typeof LESSONS[number]) => {
          const isOpen = openLesson === l.title;
          return (
            <article key={l.title} className="lesson-card">
              <span className="lesson-tag">{l.tag}</span>
              <h4>{l.title}</h4>
              <p>{l.blurb}</p>
              {isOpen && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                  <p style={{ fontSize: 13, opacity: 0.85 }}>
                    Next time you come across something in the "{l.tag}" category, pause and ask yourself:
                    would this still hold up if you checked the source, the date, and who benefits from you
                    believing it? That one habit catches most misleading content before it spreads further.
                  </p>
                </div>
              )}
              <div className="lesson-foot">
                <span>{l.minutes} min</span>
                <span className="lesson-start" style={{ cursor: "pointer" }} onClick={() => toggleLesson(l.title)}>
                  {isOpen ? "Got it ✓" : "Start →"}
                </span>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}