import { useState } from "react";
import Sidebar, { type View } from "./components/SideBar";
import HomePage from "./components/pages/HomePage";
import VerifyPage from "./components/pages/VerifyPage";
import LearnPage from "./components/pages/LearnPage";
import InsightsPage from "./components/pages/InsightsPage";
import ProfilePage from "./components/pages/ProfilePage";
import SettingsPage from "./components/pages/SettingsPage";
import { useAnalyze } from "./hooks/useAnalyze";
import "./index.css";

export default function App() {
  const [view, setView] = useState<View>("home");
  const [input, setInput] = useState("");
  const { status, result, analyze } = useAnalyze();

  async function handleVoiceComplete(transcript: string) {
    setInput(transcript);
    const analysis = await analyze(transcript);
    if (analysis && "speechSynthesis" in window) {
      const spoken = `This looks ${analysis.label}. ${analysis.why}`;
      const utterance = new SpeechSynthesisUtterance(spoken);
      utterance.rate = 1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  }

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
            onVoiceComplete={handleVoiceComplete}
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
        {view === "settings" && <SettingsPage />}
      </main>
    </div>
  );
}
