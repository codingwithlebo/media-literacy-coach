import type { Band } from "../types/analysis";

export interface RecentItem {
  kind: string;
  title: string;
  when: string;
  pct: number;
  band: Band;
  tag: string;
}

// Placeholder cards for the dashboard. Swap for real history from the
// backend (or localStorage) once analyses are being saved.
export const RECENT: RecentItem[] = [
  { kind: "News Article", title: "New study reveals coffee can prevent cancer", when: "Analyzed 2 hours ago", pct: 72, band: "high", tag: "Moderately Reliable" },
  { kind: "Voice Note", title: "Health advice about herbal mixture", when: "Analyzed 1 day ago", pct: 45, band: "med", tag: "Low Credibility" },
  { kind: "Instagram Post", title: "Viral image claiming new AI tool", when: "Analyzed 2 days ago", pct: 38, band: "low", tag: "Low Credibility" },
];