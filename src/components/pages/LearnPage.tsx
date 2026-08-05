import { useState } from "react";
import confetti from "canvas-confetti";
import { LESSONS, CHALLENGES } from "../../data/challenges";

const STORAGE_KEY = "verify-learn-progress";

type Progress = {
  correct: number;
  seen: number;
  coins: number;
  streak: number;
  bestStreak: number;
  currentIndex: number;
};

const DEFAULT_PROGRESS: Progress = {
  correct: 0,
  seen: 0,
  coins: 0,
  streak: 0,
  bestStreak: 0,
  currentIndex: 0,
};

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

function saveProgress(p: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export default function LearnPage() {
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const [picked, setPicked] = useState<number | null>(null);
  const [openLesson, setOpenLesson] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerKey, setBannerKey] = useState(0);

  const { correct, seen, coins, streak, bestStreak, currentIndex: i } = progress;
  const c = CHALLENGES[i];
  const answered = picked !== null;
  const isRight = picked === c.answer;
  const done = seen >= CHALLENGES.length && answered;

  function updateProgress(patch: Partial<Progress>) {
    setProgress((current) => {
      const next = { ...current, ...patch };
      saveProgress(next);
      return next;
    });
  }

  function choose(idx: number) {
    if (answered) return;
    setPicked(idx);

    if (idx === c.answer) {
      const nextStreak = streak + 1;
      updateProgress({
        correct: correct + 1,
        seen: seen + 1,
        coins: coins + 10,
        streak: nextStreak,
        bestStreak: Math.max(bestStreak, nextStreak),
      });

      setBannerKey((k) => k + 1);
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 2200);

      confetti({ particleCount: 100, spread: 80, origin: { y: 0.3 } });
    } else {
      updateProgress({ seen: seen + 1, streak: 0 });
    }
  }

  function next() {
    setPicked(null);
    updateProgress({ currentIndex: (i + 1) % CHALLENGES.length });
  }

  function restart() {
    setPicked(null);
    setProgress(DEFAULT_PROGRESS);
    saveProgress(DEFAULT_PROGRESS);
  }

  function toggleLesson(title: string) {
    setOpenLesson((current) => (current === title ? null : title));
  }

  return (
    <>
      {showBanner && (
        <div className="coin-banner-wrap" key={bannerKey}>
          <div className="coin-banner">
            Correct! 🎉 <span className="coins-highlight">+10 AI COINS</span>
          </div>
        </div>
      )}

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
          <span className="link-quiet">🪙 {coins} AI coins</span>
          <span className="link-quiet">🔥 {streak} streak (best {bestStreak})</span>
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