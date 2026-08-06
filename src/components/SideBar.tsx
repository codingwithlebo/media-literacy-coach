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
        <svg className="brand-mark" viewBox="0 0 40 48" aria-hidden="true">
          <path
            d="M20 7c-3.7 0-6.8 3.1-6.8 6.8 0 1.4.4 2.8 1.2 3.9-1.3 1.1-2.2 2.8-2.2 4.7 0 3 .8 5.7 2.6 8 .4.5.8 1 1.2 1.5.7.8 1.6 1.2 2.6 1.2s1.9-.4 2.6-1.2c.4-.5.8-1 1.2-1.5 1.8-2.3 2.6-5 2.6-8 0-1.9-.9-3.6-2.2-4.7.8-1.1 1.2-2.5 1.2-3.9C26.8 10.1 23.7 7 20 7Zm-2.4 6.2c0-1.3 1-2.3 2.4-2.3s2.4 1 2.4 2.3c0 .6-.2 1.2-.6 1.7-.8-.4-1.8-.6-2.8-.6s-2 .2-2.8.6c-.4-.5-.6-1.1-.6-1.7Zm-4.1 8.8c.7-1 1.6-1.5 2.6-1.5.5 0 1.1.1 1.6.4-.2.5-.3 1-.3 1.6 0 1 .3 2 .8 2.8-.8.8-1.4 1.8-1.7 2.9-.7-1.1-1.1-2.4-1.1-3.8 0-.7.1-1.4.3-2.1Zm8.6 0c.2.7.3 1.4.3 2.1 0 1.4-.4 2.7-1.1 3.8-.3-1.1-.9-2.1-1.7-2.9.5-.8.8-1.8.8-2.8 0-.6-.1-1.1-.3-1.6.5-.3 1.1-.4 1.6-.4.9 0 1.9.5 2.6 1.5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="20" cy="16.1" r="1.6" fill="currentColor" />
          <circle cx="15.6" cy="18.9" r="1.1" fill="currentColor" />
          <circle cx="24.4" cy="18.9" r="1.1" fill="currentColor" />
          <circle cx="12.8" cy="24.5" r="1.1" fill="currentColor" />
          <circle cx="27.2" cy="24.5" r="1.1" fill="currentColor" />
          <circle cx="16.2" cy="29.9" r="1.1" fill="currentColor" />
          <circle cx="23.8" cy="29.9" r="1.1" fill="currentColor" />
        </svg>
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