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
  onLearn: () => void;
  onVoiceComplete?: (transcript: string) => void;
}

export default function HomePage({ input, setInput, status, result, onVerify, onLearn, onVoiceComplete }: Props) {
  const { t } = useLanguage();

  return (
    <>
      <p className="greeting">{t(getGreetingKey())},</p>
      <h1 className="headline">{t("home_headline")}</h1>
      <p className="subhead">{t("home_subhead")}</p>

      <IntakeGrid value={input} onChange={setInput} onVerify={onVerify} busy={status === "loading"} onVoiceComplete={onVoiceComplete} />

      <RecentAnalyses />
      <LearnBanner onClick={onLearn} />

      <div className="row-head mt-48">
        <h2 className="section-title">{t("analysis_report")}</h2>
      </div>
      <AnalysisReport status={status} result={result} />
    </>
  );
}