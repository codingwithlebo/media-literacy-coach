import { useRef, useState } from "react";
import { challenges } from "./data/challenges";
import { ChallengeCard } from "./components/ChallengeCard";
import { useGameProgress } from "./hooks/useGameProgress";

function levelFor(accuracy: number): string {
  if (accuracy >= 90) return "Gold";
  if (accuracy >= 70) return "Silver";
  if (accuracy >= 40) return "Bronze";
  return "Beginner";
}

export default function App() {
  const [index, setIndex] = useState(0);
  const { progress, recordAnswer, accuracy, reset } = useGameProgress();
  const cardTopRef = useRef<HTMLDivElement | null>(null);

  const done = index >= challenges.length;
  const current = challenges[index];

  const handleAnswer = (correct: boolean) => {
    recordAnswer(current.id, correct);
  };

  const handleNext = () => {
    setIndex((i) => i + 1);
    cardTopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleRestart = () => {
    reset();
    setIndex(0);
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <div ref={cardTopRef} />
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Media literacy coach</h1>
        <p className="mt-1 text-sm text-slate-400">
          Spot the fake — daily practice for a sharper eye on misinformation.
        </p>
      </header>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-slate-900/70 p-3 text-center">
          <p className="text-lg font-semibold text-white">{progress.score}</p>
          <p className="text-xs text-slate-400">Score</p>
        </div>
        <div className="rounded-xl bg-slate-900/70 p-3 text-center">
          <p className="text-lg font-semibold text-white">{progress.streak}</p>
          <p className="text-xs text-slate-400">Streak</p>
        </div>
        <div className="rounded-xl bg-slate-900/70 p-3 text-center">
          <p className="text-lg font-semibold text-white">{levelFor(accuracy)}</p>
          <p className="text-xs text-slate-400">Media literacy score</p>
        </div>
      </div>

      {!done && (
        <>
          <p className="mb-3 text-xs text-slate-500">
            Challenge {index + 1} of {challenges.length}
          </p>
          <ChallengeCard key={current.id} challenge={current} onAnswer={handleAnswer} />
          <button
            onClick={handleNext}
            className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-200"
          >
            Next challenge
          </button>
        </>
      )}

      {done && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center">
          <p className="text-lg font-semibold text-white">
            You're a {levelFor(accuracy)} level spotter
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {accuracy}% accuracy across {progress.results.length} challenges.
          </p>
          <button
            onClick={handleRestart}
            className="mt-4 rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm font-medium text-slate-200"
          >
            Play again
          </button>
        </div>
      )}
    </div>
  );
}
