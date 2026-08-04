import IntakeGrid from "../IntakeGrid";
import { RecentAnalyses, LearnBanner } from "../RecentAnalyses";
import AnalysisReport from "../AnalysisReport";
import type { Analysis } from "../../types/analysis";

interface Props {
  input: string;
  setInput: (v: string) => void;
  status: "idle" | "loading" | "done";
  result: Analysis | null;
  onVerify: () => void;
  onLearn: () => void;
  onVoiceComplete?: (transcript: string) => void;
}

export default function HomePage({ input, setInput, status, result, onVerify, onLearn, onVoiceComplete }: Props) {
  return (
    <>
      <p className="greeting">Good afternoon,</p>
      <h1 className="headline">What would you like to verify today?</h1>
      <p className="subhead">
        Paste a link, upload a file or record audio. We&rsquo;ll help you understand the truth behind it.
      </p>

      <IntakeGrid value={input} onChange={setInput} onVerify={onVerify} busy={status === "loading"} onVoiceComplete={onVoiceComplete} />

      <RecentAnalyses />
      <LearnBanner onClick={onLearn} />

      <div className="row-head mt-48">
        <h2 className="section-title">Analysis Report</h2>
      </div>
      <AnalysisReport status={status} result={result} />
    </>
  );
}