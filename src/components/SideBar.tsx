import { I, Ic } from "./icons";

const NAV = [
  { key: "home", label: "Home", icon: I.home },
  { key: "verify", label: "Verify", icon: I.verify },
  { key: "learn", label: "Learn", icon: I.learn },
  { key: "insights", label: "Insights", icon: I.insights },
  { key: "profile", label: "Profile", icon: I.profile },
];

export default function Sidebar({ active = "home" }: { active?: string }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark" />
        <div className="brand-name">
          Verify.<br />Understand.<br />Share Wisely.
        </div>
      </div>

      <nav className="nav">
        {NAV.map((n) => (
          <a key={n.key} className={`nav-item ${active === n.key ? "active" : ""}`}>
            <Ic p={n.icon} />
            {n.label}
          </a>
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
  );
}