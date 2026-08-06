import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { I, Ic } from "./icons";

export type View =
  | "home"
  | "verify"
  | "learn"
  | "insights"
  | "profile"
  | "settings";

const NAV: { key: View; label: string; icon: ReactNode }[] = [
  { key: "home", label: "Home", icon: I.home },
  { key: "verify", label: "Verify", icon: I.verify },
  { key: "learn", label: "Learn", icon: I.learn },
  { key: "insights", label: "Insights", icon: I.insights },
  { key: "profile", label: "Profile", icon: I.profile },
  { key: "settings", label: "Settings", icon: I.settings },
];

const THEME_KEY = "verify-theme";

export default function Sidebar({
  active,
  onNavigate,
}: {
  active: View;
  onNavigate: (v: View) => void;
}) {
  const [lightMode, setLightMode] = useState(
    () => localStorage.getItem(THEME_KEY) === "light",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("light-mode", lightMode);
    localStorage.setItem(THEME_KEY, lightMode ? "light" : "dark");
  }, [lightMode]);

  return (
    <aside className="sidebar">
      <button className="brand brand-btn" onClick={() => onNavigate("home")}>
        <div className="brand-mark" />
        <div className="brand-name">
          Verify.
          <br />
          Understand.
          <br />
          Share Wisely.
        </div>
      </button>
      <nav className="nav">
        {NAV.map((n) => (
          <button
            key={n.key}
            className={`nav-item ${active === n.key ? "active" : ""}`}
            onClick={() => onNavigate(n.key)}
          >
            <Ic p={n.icon} />
            {n.label}
          </button>
        ))}
      </nav>
      <div className="side-card">
        <h4>Think before you share.</h4>
        <p>Better questions lead to better information.</p>
      </div>
      <div className="side-foot">
        <div
          className="side-toggle"
          onClick={() => setLightMode((v) => !v)}
          style={{ cursor: "pointer" }}
        >
          <span>Dark Mode</span>
          <span className={`switch ${lightMode ? "switch-off" : ""}`} />
        </div>
      </div>
    </aside>
  );
}
