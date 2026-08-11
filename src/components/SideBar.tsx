import { useState, type ReactNode } from "react";
import { I, Ic } from "./icons";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

export type View = "home" | "verify" | "learn" | "insights" | "profile";

export default function Sidebar({
  active,
  onNavigate,
}: {
  active: View;
  onNavigate: (v: View) => void;
}) {
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const NAV: { key: View; label: string; icon: ReactNode }[] = [
    { key: "home", label: t("nav_home"), icon: I.home },
    { key: "verify", label: t("nav_verify"), icon: I.verify },
    { key: "learn", label: t("nav_learn"), icon: I.learn },
    { key: "insights", label: t("nav_insights"), icon: I.insights },
    { key: "profile", label: t("nav_profile"), icon: I.profile },
  ];

  function go(v: View) {
    onNavigate(v);
    setOpen(false);
  }

  return (
    <>
      <header className="topbar">
        <button className="tb-brand" onClick={() => go("home")}
          style={{ background: "none", border: "none", cursor: "pointer" }}>
          <div className="brand-mark" />
          <span className="tb-name">Verify.</span>
        </button>
        <button className="burger" onClick={() => setOpen(true)} aria-label="Open menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </header>

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <button className="drawer-close" onClick={() => setOpen(false)} aria-label="Close menu">×</button>
        <button className="brand brand-btn" onClick={() => go("home")}>
          <div className="brand-mark" />
          <div className="brand-name">
            {t("tagline1")}<br />{t("tagline2")}<br />{t("tagline3")}
          </div>
        </button>
        <nav className="nav">
          {NAV.map((n) => (
            <button
              key={n.key}
              className={`nav-item ${active === n.key ? "active" : ""}`}
              onClick={() => go(n.key)}
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
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            style={{ cursor: "pointer" }}
          >
            <span>{t("dark_mode")}</span>
            <span className={`switch ${theme === "light" ? "switch-off" : ""}`} />
          </div>
        </div>
      </aside>
      {open && <div className="nav-backdrop" onClick={() => setOpen(false)} />}
    </>
  );
}