import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

const DEFAULT_PREFS = [
  { key: "plain_language", labelKey: "pref_plain_language" as const, on: true },
  { key: "flag_ai", labelKey: "pref_flag_ai" as const, on: true },
  { key: "warn_low_credibility", labelKey: "pref_warn_low_credibility" as const, on: true },
  { key: "weekly_challenge_email", labelKey: "pref_weekly_email" as const, on: false },
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
  const { t } = useLanguage();
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
      <p className="greeting">{t("profile_greeting")}</p>
      <h1 className="headline">{t("profile_headline")}</h1>
      <p className="subhead">{t("profile_subhead")}</p>

      <div className="profile-card mt-48">
        <div className="avatar">V</div>
        <div>
          <div className="profile-name">{t("profile_user")}</div>
          <div className="profile-sub">{t("profile_role")} · {t("profile_joined")} 2026</div>
        </div>
        <button className="btn" style={{ marginLeft: "auto" }}>{t("edit_button")}</button>
      </div>

      <div className="row-head mt-48">
        <h2 className="section-title">{t("preferences_title")}</h2>
      </div>
      <div className="panel">
        {prefs.map((p) => (
          <label className="pref-row" key={p.key} onClick={() => toggle(p.key)} style={{ cursor: "pointer" }}>
            <span>{t(p.labelKey)}</span>
            <span className={`switch ${p.on ? "" : "switch-off"}`} />
          </label>
        ))}
      </div>
    </>
  );
}