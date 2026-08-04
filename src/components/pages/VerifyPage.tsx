import AnalysisReport from "../AnalysisReport";
import type { Analysis } from "../../types/analysis";

interface Props {
  input: string;
  setInput: (v: string) => void;
  status: "idle" | "loading" | "done";
  result: Analysis | null;
  onVerify: () => void;
}

export default function VerifyPage({ input, setInput, status, result, onVerify }: Props) {
  return (
    <>
      <p className="greeting">Verify</p>
      <h1 className="headline">Check a claim, link or post</h1>
      <p className="subhead">
        Paste anything you&rsquo;re unsure about. You&rsquo;ll get a credibility read and more importantly,
        the reasons behind it.
      </p>

      <div className="verify-single">
        <textarea
          className="paste-box"
          style={{ minHeight: 140 }}
          placeholder="Paste a headline, message, link, or claim here…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="verify-actions">
          <button className="btn btn-primary" onClick={onVerify} disabled={status === "loading" || !input.trim()}>
            {status === "loading" ? "Verifying…" : "Verify this"}
          </button>
          {input && (
            <button className="btn" onClick={() => setInput("")}>Clear</button>
          )}
        </div>
      </div>

      <div className="row-head mt-48">
        <h2 className="section-title">Analysis Report</h2>
      </div>
      <AnalysisReport status={status} result={result} />
    </>
  );
}