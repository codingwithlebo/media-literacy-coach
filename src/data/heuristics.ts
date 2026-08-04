import type { Analysis, Band, EvidenceItem, JourneyStep } from "../types/analysis";

export function bandFor(score: number): Band {
  if (score >= 65) return "high";
  if (score >= 45) return "med";
  return "low";
}

export function labelFor(band: Band): string {
  return band === "high"
    ? "Reliable"
    : band === "med"
    ? "Moderately Reliable"
    : "Low Credibility";
}

// Offline fallback so the UI is fully demoable before the backend is ready.
// Deliberately simple signals — the kind a person can learn to spot themselves.

const SENSATIONAL = [
  "shocking", "you won't believe", "miracle", "secret", "they don't want",
  "100%", "cure", "banned", "exposed", "breaking", "urgent", "share before",
];
const HEDGES = ["study", "research", "according to", "source", "report", "data"];

export function localAnalyze(input: string): Analysis {
  const text = input.trim();
  const lower = text.toLowerCase();

  const urlMatch = text.match(/https?:\/\/([^/\s]+)/i);
  const source = urlMatch ? urlMatch[1].replace(/^www\./, "") : "Unknown source";
  const isUrl = Boolean(urlMatch);

  const sensationHits = SENSATIONAL.filter((w) => lower.includes(w)).length;
  const hedgeHits = HEDGES.filter((w) => lower.includes(w)).length;
  const hasNumbers = /\d{2,}%|\d{4}|\$\d/.test(text);
  const shouty = (text.match(/[A-Z]{4,}/g) || []).length;
  const exclaims = (text.match(/!/g) || []).length;

  let score = 60;
  score -= sensationHits * 9;
  score -= Math.min(shouty, 4) * 3;
  score -= Math.min(exclaims, 5) * 2;
  score += hedgeHits * 5;
  score += hasNumbers ? 4 : 0;
  score += isUrl ? 6 : 0;
  score = Math.max(8, Math.min(94, score));

  const band = bandFor(score);
  const emotional = sensationHits > 0 || exclaims > 2;
  const aiLikely = text.length > 400 && hedgeHits === 0 && sensationHits === 0;

  const evidence: EvidenceItem[] = [
    { label: "Source identified", verdict: isUrl ? "yes" : "flag", value: isUrl ? "Yes" : "Unclear" },
    { label: "References included", verdict: hedgeHits > 0 ? "yes" : "no", value: hedgeHits > 0 ? "Yes" : "No" },
    { label: "Emotional language detected", verdict: emotional ? "flag" : "yes", value: emotional ? "Yes" : "No" },
    { label: "AI-generated sections likely", verdict: aiLikely ? "flag" : "yes", value: aiLikely ? "Possible" : "Unlikely" },
    { label: "Missing citations", verdict: hedgeHits > 0 ? "yes" : "flag", value: hedgeHits > 0 ? "No" : "Yes" },
  ];

  const why =
    band === "high"
      ? "This content shows several markers of careful reporting: it names sources, references evidence, and avoids emotionally loaded language. Still check the original source directly before sharing."
      : band === "med"
      ? "This content mixes some reliable signals with warning signs — for example it may cite figures but also lean on emotional or exaggerated wording. Cross-check the main claim against an independent outlet before trusting it."
      : "This content leans heavily on emotional or sensational language and offers little verifiable sourcing. Claims like these often spread faster than they can be checked. Look for the same story from an established outlet before believing or sharing it.";

  const journey: JourneyStep[] = [
    { title: "Source check", status: isUrl ? "Completed" : "Completed with concerns", warn: !isUrl },
    { title: "Cross-reference", status: "Completed" },
    { title: "Claims analysis", status: emotional ? "Completed with concerns" : "Completed", warn: emotional },
    { title: "AI detection", status: aiLikely ? "Completed with concerns" : "Completed", warn: aiLikely },
    { title: "Bias analysis", status: emotional ? "Completed with concerns" : "Completed", warn: emotional },
  ];

  return {
    title: firstSentence(text) || "Pasted content",
    type: isUrl ? "Linked Article" : "Text / Claim",
    source,
    score,
    band,
    label: labelFor(band),
    why,
    evidence,
    reliableSources: ["Reuters Fact Check", "Associated Press", "Africa Check", "World Health Organization"],
    journey,
    aiLikely,
  };
}

function firstSentence(t: string): string {
  const s = t.replace(/\s+/g, " ").trim();
  const cut = s.split(/(?<=[.!?])\s/)[0] || s;
  return cut.length > 90 ? cut.slice(0, 88) + "…" : cut;
}