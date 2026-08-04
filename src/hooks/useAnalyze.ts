import { useState } from "react";
import type { Analysis } from "../types/analysis";
import { bandFor, labelFor, localAnalyze } from "../data/heuristics";

// Point this at your FastAPI backend. In dev, set VITE_API_URL in a
// .env file (e.g. VITE_API_URL=http://localhost:8000), or configure a
// Vite proxy so "/api" forwards to the backend.
const API =
  (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env
    ?.VITE_API_URL ?? "";

type Status = "idle" | "loading" | "done";

export function useAnalyze() {
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<Analysis | null>(null);

  async function analyze(content: string) {
    if (!content.trim()) return;
    setStatus("loading");
    setResult(null);
    try {
      const res = await fetch(`${API}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("api");
      const data = await res.json();
      // Backend may omit band/label — derive them here so the UI is safe.
      const band = data.band ?? bandFor(data.score);
      setResult({ ...data, band, label: data.label ?? labelFor(band) });
    } catch {
      setResult(localAnalyze(content)); // graceful offline fallback
    }
    setStatus("done");
  }

  return { status, result, analyze };
}