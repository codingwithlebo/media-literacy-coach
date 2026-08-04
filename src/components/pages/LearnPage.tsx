import { useState } from "react";
import { LESSONS, CHALLENGES } from "../../data/challenges";

export default function LearnPage() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [seen, setSeen] = useState(0);

  const c = CHALLENGES[i];
  const answered = picked !== null;
  const isRight = picked === c.answer;
  const done = seen >= CHALLENGES.length && answered;

  function choose(idx: number) {
    if (answered) return;
    setPicked(idx);
    setSeen((s) => s + 1);
    if (idx === c.answer) setCorrect((n) => n + 1);
  }
  function next() {
    setPicked(null);
    setI((n) => (n + 1) % CHALLENGES.length);
  }
  function restart() {
    setI(0); setPicked(null); setCorrect(0); setSeen(0);
  }

  return (
    <>
      <p className="greeting">Learning Hub</p>
      <h1 className="headline">Get better at spotting the tricks</h1>
      <p className="subhead">
        Short lessons plus real-world challenges. The goal isn&rsquo;t to memorize which stories are
        &ldquo;fake&rdquo; — it&rsquo;s to build the habit of asking the right questions.
      </p>

      {/* Challenge */}
      <div className="row-head mt-48">
        <h2 className="section-title">Daily challenge</h2>
        <span className="link-quiet">{correct} / {seen} correct</span>
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
            <strong>{isRight ? "Nice — that's the read." : "Worth a closer look."}</strong>
            <p>{c.explain}</p>
            {!done && <button className="btn btn-primary" onClick={next}>Next challenge</button>}
            {done && (
              <div className="challenge-done">
                You finished the set — {correct} of {CHALLENGES.length} on the first try.
                <button className="btn" onClick={restart} style={{ marginLeft: 10 }}>Start over</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lessons */}
      <div className="row-head mt-48">
        <h2 className="section-title">Short lessons</h2>
      </div>
      <section className="lessons">
        {LESSONS.map((l: typeof LESSONS[number]) => (
          <article key={l.title} className="lesson-card">
            <span className="lesson-tag">{l.tag}</span>
            <h4>{l.title}</h4>
            <p>{l.blurb}</p>
            <div className="lesson-foot">
              <span>{l.minutes} min</span>
              <span className="lesson-start">Start →</span>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}