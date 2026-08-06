import { useState, type ReactNode } from "react";
import { I, Ic } from "./icons";

export type View = "home" | "verify" | "learn" | "insights" | "profile";

const NAV: { key: View; label: string; icon: ReactNode }[] = [
  { key: "home", label: "Home", icon: I.home },
  { key: "verify", label: "Verify", icon: I.verify },
  { key: "learn", label: "Learn", icon: I.learn },
  { key: "insights", label: "Insights", icon: I.insights },
  { key: "profile", label: "Profile", icon: I.profile },
];

export default function Sidebar({
  active,
  onNavigate,
}: {
  active: View;
  onNavigate: (v: View) => void;
}) {
  const [open, setOpen] = useState(false);

  function go(v: View) {
    onNavigate(v);
    setOpen(false); // close the drawer after choosing on mobile
  }

  return (
    <>
      {/* Mobile top bar (hidden on desktop via CSS) */}
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

      {/* Sidebar / drawer */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <button className="drawer-close" onClick={() => setOpen(false)} aria-label="Close menu">×</button>

        <button className="brand brand-btn" onClick={() => go("home")}>
          <div className="brand-mark" />
          <div className="brand-name">
            Verify.<br />Understand.<br />Share Wisely.
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
          <div className="side-toggle"><span>Dark Mode</span><span className="switch" /></div>
          <div className="side-toggle"><span>Settings</span></div>
        </div>
      </aside>

      {open && <div className="nav-backdrop" onClick={() => setOpen(false)} />}
    </>
  );
}