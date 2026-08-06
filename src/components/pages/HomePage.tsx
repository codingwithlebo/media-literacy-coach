import IntakeGrid from "../IntakeGrid";
import { RecentAnalyses, LearnBanner } from "../RecentAnalyses";
import AnalysisReport from "../AnalysisReport";
import type { Analysis } from "../../types/analysis";
import { useLanguage } from "../../context/LanguageContext";

function getGreetingKey(): "greeting_morning" | "greeting_afternoon" | "greeting_evening" {
  const hour = new Date().getHours();
  if (hour < 12) return "greeting_morning";
  if (hour < 18) return "greeting_afternoon";
  return "greeting_evening";
}

interface Props {
  input: string;
  setInput: (v: string) => void;
  status: "idle" | "loading" | "done";
  result: Analysis | null;
  onVerify: () => void;
  onVoice: (text: string) => void;
  onLearn: () => void;
  onVoiceComplete?: (transcript: string) => void;
}

export default function HomePage({ input, setInput, status, result, onVerify, onVoice, onLearn }: Props) {
  return (
    <>
      <p className="greeting">Good afternoon,</p>
      <h1 className="headline">What would you like to verify today?</h1>
      <p className="subhead">
        Paste a link, upload a file, or record audio. We&rsquo;ll help you understand the truth behind it.
      </p>

      <IntakeGrid
        value={input}
        onChange={setInput}
        onVerify={onVerify}
        onVoice={onVoice}
        busy={status === "loading"}
      />

      <RecentAnalyses />
      <LearnBanner onClick={onLearn} />

      <div className="row-head mt-48">
        <h2 className="section-title">{t("analysis_report")}</h2>
      </div>
      <AnalysisReport status={status} result={result} />
    </>
  );
}