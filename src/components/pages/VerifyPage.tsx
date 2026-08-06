import AnalysisReport from "../AnalysisReport";
import type { Analysis } from "../../types/analysis";
import { useLanguage } from "../../context/LanguageContext";

interface Props {
  input: string;
  setInput: (v: string) => void;
  status: "idle" | "loading" | "done";
  result: Analysis | null;
  onVerify: () => void;
}

export default function VerifyPage({ input, setInput, status, result, onVerify }: Props) {
  const { t } = useLanguage();

  return (
    <>
      <p className="greeting">{t("verify_greeting")}</p>
      <h1 className="headline">{t("verify_headline")}</h1>
      <p className="subhead">{t("verify_subhead")}</p>

      <div className="verify-single">
        <textarea
          className="paste-box"
          style={{ minHeight: 140 }}
          placeholder={t("verify_placeholder")}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="verify-actions">
          <button className="btn btn-primary" onClick={onVerify} disabled={status === "loading" || !input.trim()}>
            {status === "loading" ? t("verify_button_loading") : t("verify_button")}
          </button>
          {input && (
            <button className="btn" onClick={() => setInput("")}>{t("clear_button")}</button>
          )}
        </div>
      </div>

      <div className="row-head mt-48">
        <h2 className="section-title">{t("analysis_report")}</h2>
      </div>
      <AnalysisReport status={status} result={result} />
    </>
  );
}