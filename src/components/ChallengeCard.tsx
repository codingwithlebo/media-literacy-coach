import { useState } from "react";
import type { Challenge } from "../types/challenge";

type ChallengeCardProps = {
  challenge: Challenge;
  onAnswer: (correct: boolean) => void;
};

export function ChallengeCard({ challenge, onAnswer }: ChallengeCardProps) {
  const [answered, setAnswered] = useState(false);
  const [choseFake, setChoseFake] = useState<boolean | null>(null);

  const handleChoice = (fake: boolean) => {
    if (answered) return;
    setChoseFake(fake);
    setAnswered(true);
    onAnswer(fake === challenge.isFake);
  };

  const correct = choseFake === challenge.isFake;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <p className="mb-2 text-xs font-medium text-brand">{challenge.category}</p>
      <p className="mb-4 text-sm leading-relaxed text-slate-200">{challenge.content}</p>

      {!answered && (
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleChoice(false)}
            className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm font-medium text-slate-200"
          >
            Real
          </button>
          <button
            onClick={() => handleChoice(true)}
            className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm font-medium text-slate-200"
          >
            Fake
          </button>
        </div>
      )}

      {answered && (
        <div
          className={`rounded-xl p-4 ${correct ? "bg-correct-soft" : "bg-incorrect-soft"}`}
        >
          <p className={`mb-1 text-sm font-semibold ${correct ? "text-correct" : "text-incorrect"}`}>
            {correct ? "Correct" : "Not quite"} — this was {challenge.isFake ? "fake" : "real"}.
          </p>
          <p className="text-sm text-slate-300">{challenge.explanation}</p>
          {challenge.redFlags && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {challenge.redFlags.map((flag) => (
                <li
                  key={flag}
                  className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300"
                >
                  {flag}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
