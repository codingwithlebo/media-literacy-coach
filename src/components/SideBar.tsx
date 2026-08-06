import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { I, Ic } from "./icons";
import { useLanguage } from "../context/LanguageContext";

export type View =
  | "home"
  | "verify"
  | "learn"
  | "insights"
  | "profile"
  | "settings";

const THEME_KEY = "verify-theme";

export default function Sidebar({
  active,
  onNavigate,
}: {
  active: View;
  onNavigate: (v: View) => void;
}) {
  const { t } = useLanguage();
  const [lightMode, setLightMode] = useState(
    () => localStorage.getItem(THEME_KEY) === "light",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("light-mode", lightMode);
    localStorage.setItem(THEME_KEY, lightMode ? "light" : "dark");
  }, [lightMode]);

  const NAV: { key: View; label: string; icon: ReactNode }[] = [
    { key: "home", label: t("nav_home"), icon: I.home },
    { key: "verify", label: t("nav_verify"), icon: I.verify },
    { key: "learn", label: t("nav_learn"), icon: I.learn },
    { key: "insights", label: t("nav_insights"), icon: I.insights },
    { key: "profile", label: t("nav_profile"), icon: I.profile },
    { key: "settings", label: t("nav_settings"), icon: I.settings },
  ];

  return (
    <aside className="sidebar">
      <button className="brand brand-btn" onClick={() => onNavigate("home")}>
        <div className="brand-mark" />
        <div className="brand-name">
          {t("tagline1")}
          <br />
          {t("tagline2")}
          <br />
          {t("tagline3")}
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
          <span>{t("dark_mode")}</span>
          <span className={`switch ${lightMode ? "switch-off" : ""}`} />
        </div>
      </div>
    </aside>
  );
}