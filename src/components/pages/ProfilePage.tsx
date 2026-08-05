import { useState } from "react";

const DEFAULT_PREFS = [
  { key: "plain_language", label: "Show plain-language explanations", on: true },
  { key: "flag_ai", label: "Flag possible AI-generated content", on: true },
  { key: "warn_low_credibility", label: "Warn before sharing low-credibility items", on: true },
  { key: "weekly_challenge_email", label: "Email me a weekly literacy challenge", on: false },
];

const STORAGE_KEY = "verify-preferences";

function loadPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const saved: Record<string, boolean> = JSON.parse(raw);
    return DEFAULT_PREFS.map((p) => ({
      ...p,
      on: saved[p.key] ?? p.on,
    }));
  } catch {
    return DEFAULT_PREFS;
  }
}

export default function ProfilePage() {
  const [prefs, setPrefs] = useState(loadPrefs);

  function toggle(key: string) {
    setPrefs((current) => {
      const updated = current.map((p) => (p.key === key ? { ...p, on: !p.on } : p));
      const toSave = Object.fromEntries(updated.map((p) => [p.key, p.on]));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      return updated;
    });
  }

  return (
    <>
      <p className="greeting">Profile</p>
      <h1 className="headline">Your account</h1>
      <p className="subhead">Manage how Verify works for you. Changes are saved automatically.</p>

      <div className="profile-card mt-48">
        <div className="avatar">V</div>
        <div>
          <div className="profile-name">Verify User</div>
          <div className="profile-sub">Media literacy learner · joined 2026</div>
        </div>
        <button className="btn" style={{ marginLeft: "auto" }}>Edit</button>
      </div>

      <div className="row-head mt-48">
        <h2 className="section-title">Preferences</h2>
      </div>
      <div className="panel">
        {prefs.map((p) => (
          <label className="pref-row" key={p.key} onClick={() => toggle(p.key)} style={{ cursor: "pointer" }}>
            <span>{p.label}</span>
            <span className={`switch ${p.on ? "" : "switch-off"}`} />
          </label>
        ))}
      </div>
    </>
  );
}