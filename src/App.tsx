import { useState } from "react";
import Sidebar from "./components/SideBar";
import IntakeGrid from "./components/IntakeGrid";
import { RecentAnalyses, LearnBanner } from "./components/RecentAnalyses";
import AnalysisReport from "./components/AnalysisReport";
import { useAnalyze } from "./hooks/useAnalyze";


export default function App() {
  const [input, setInput] = useState("");
  const { status, result, analyze } = useAnalyze();

  return (
    <div className="app">
      <Sidebar active="home" />

      <main className="main">
        <p className="greeting">Good afternoon,</p>
        <h1 className="headline">What would you like to verify today?</h1>
        <p className="subhead">
          Paste a link, upload a file, or record audio. We&rsquo;ll help you understand the truth behind it.
        </p>

        <IntakeGrid
          value={input}
          onChange={setInput}
          onVerify={() => analyze(input)}
          busy={status === "loading"}
        />

        <RecentAnalyses />
        <LearnBanner />

        <div className="row-head mt-48">
          <h2 className="section-title">Analysis Report</h2>
        </div>
        <AnalysisReport status={status} result={result} />
      </main>
    </div>
  );
}