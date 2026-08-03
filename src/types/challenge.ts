export type Category =
  | "Phishing email"
  | "Fake headline"
  | "Manipulated image"
  | "WhatsApp forward";

export interface Challenge {
  id: string;
  category: Category;
  /** The content shown to the user — text for now, could hold an image URL later. */
  content: string;
  isFake: boolean;
  /** Shown after answering, explains the actual tells to look for. */
  explanation: string;
  /** Optional multiple-choice red flags the user can pick before seeing the explanation. */
  redFlags?: string[];
}

export interface ChallengeResult {
  challengeId: string;
  correct: boolean;
  answeredAt: string;
}

export interface UserProgress {
  score: number;
  streak: number;
  bestStreak: number;
  results: ChallengeResult[];
}
