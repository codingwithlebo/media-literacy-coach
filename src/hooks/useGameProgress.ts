import { useEffect, useState } from "react";
import type { UserProgress, ChallengeResult } from "../types/challenge";

const STORAGE_KEY = "media-literacy-coach-progress";

const initialProgress: UserProgress = {
  score: 0,
  streak: 0,
  bestStreak: 0,
  results: [],
};

function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserProgress) : initialProgress;
  } catch {
    return initialProgress;
  }
}

export function useGameProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const recordAnswer = (challengeId: string, correct: boolean) => {
    setProgress((current) => {
      const nextStreak = correct ? current.streak + 1 : 0;
      const result: ChallengeResult = {
        challengeId,
        correct,
        answeredAt: new Date().toISOString(),
      };
      return {
        score: current.score + (correct ? 10 : 0),
        streak: nextStreak,
        bestStreak: Math.max(current.bestStreak, nextStreak),
        results: [...current.results, result],
      };
    });
  };

  const accuracy =
    progress.results.length > 0
      ? Math.round(
          (progress.results.filter((r) => r.correct).length / progress.results.length) * 100,
        )
      : 0;

  const reset = () => setProgress(initialProgress);

  return { progress, recordAnswer, accuracy, reset };
}
