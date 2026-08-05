import { useState } from "react";
import type { Analysis } from "../types/analysis";
import { bandFor, labelFor, localAnalyze } from "../data/heuristics";

const API =
  (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env
    ?.VITE_API_URL ?? "";

type Status = "idle" | "loading" | "done";

export function useAnalyze() {
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<Analysis | null>(null);

  async function analyze(content: string): Promise<Analysis | null> {
    if (!content.trim()) return null;
    setStatus("loading");
    setResult(null);
    let finalResult: Analysis;
    try {
      const res = await fetch(`${API}/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, content_type: "article" }),
      });
      if (!res.ok) throw new Error("api");
      const data = await res.json();
      const band = bandFor(data.credibility_score);

      finalResult = {
        title: content.slice(0, 80),
        type: "Claim",
        source: "Unknown source",
        score: data.credibility_score,
        band,
        label: labelFor(band),
        why: `${data.summary}\n\n${data.explanation}`,
        evidence: (data.evidence ?? []).map(
         (item: {
           title: string;
           status: string;
           description: string;
         }) => ({
           label: item.title,
           verdict:
          item.status === "good"
            ? "yes"
            : item.status === "bad"
            ? "no"
            : "flag",
           value: item.description,
          })
        ),
        reliableSources: data.suggested_sources ?? [],
        journey: (data.red_flags ?? []).map((f: { label: string; description: string }) => ({
          title: f.label,
          status: f.description,
          warn: true,
        })),
        aiLikely: false,
      };
    } catch (err) {
      console.error("analyze failed:", err);
      finalResult = localAnalyze(content);
    }
    setResult(finalResult);
    setStatus("done");
    return finalResult;
  }

  return { status, result, analyze };
}