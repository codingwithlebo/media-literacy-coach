// The shape the UI renders. Your backend's /api/analyze response should
// match this (minus `band`/`label`, which the frontend derives).

export type Band = "high" | "med" | "low";

export interface EvidenceItem {
  label: string;
  verdict: "yes" | "no" | "flag";
  value: string;
}

export interface JourneyStep {
  title: string;
  status: string;
  warn?: boolean;
}

export interface Analysis {
  title: string;
  type: string; // "News Article" | "Social Post" | "Claim" | "Voice Note"
  source: string; // domain, or "Unknown source"
  score: number; // 0–100
  band: Band; // derived on the client
  label: string; // derived on the client
  why: string; // plain-language explanation
  evidence: EvidenceItem[];
  reliableSources: string[];
  journey: JourneyStep[];
  aiLikely: boolean;
}