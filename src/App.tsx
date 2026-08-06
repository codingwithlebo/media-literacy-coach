import { useState } from "react";
import Sidebar, { type View } from "./components/SideBar";
import HomePage from "./components/pages/HomePage";
import VerifyPage from "./components/pages/VerifyPage";
import LearnPage from "./components/pages/LearnPage";
import InsightsPage from "./components/pages/InsightsPage";
import ProfilePage from "./components/pages/ProfilePage";
import { useAnalyze } from "./hooks/useAnalyze";
import "./index.css";

export default function App() {
  const [view, setView] = useState<View>("home");
  const [input, setInput] = useState("");
  const { status, result, analyze } = useAnalyze();

  return (
    <div className="app">
      <Sidebar active={view} onNavigate={setView} />

      <main className="main">
        {view === "home" && (
          <HomePage
            input={input}
            setInput={setInput}
            status={status}
            result={result}
            onVerify={() => analyze(input)}
            onVoice={(t) => { setInput(t); analyze(t); }}
            onLearn={() => setView("learn")}
          />
        )}

        {view === "verify" && (
          <VerifyPage
            input={input}
            setInput={setInput}
            status={status}
            result={result}
            onVerify={() => analyze(input)}
          />
        )}

        {view === "learn" && <LearnPage />}
        {view === "insights" && <InsightsPage />}
        {view === "profile" && <ProfilePage />}
      </main>
    </div>
  );
}