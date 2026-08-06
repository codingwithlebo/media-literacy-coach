import { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

const DEFAULT_PREFS = [
  { key: "plain_language", labelKey: "pref_plain_language" as const, on: true },
  { key: "flag_ai", labelKey: "pref_flag_ai" as const, on: true },
  { key: "warn_low_credibility", labelKey: "pref_warn_low_credibility" as const, on: true },
  { key: "weekly_challenge_email", labelKey: "pref_weekly_email" as const, on: false },
];

const PREFS_KEY = "verify-preferences";
const APP_SETTINGS_KEY = "app-settings";

type AnalysisDetail = "concise" | "balanced" | "detailed";

function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    const saved: Record<string, boolean> = JSON.parse(raw);
    return DEFAULT_PREFS.map((p) => ({ ...p, on: saved[p.key] ?? p.on }));
  } catch {
    return DEFAULT_PREFS;
  }
}

function loadAppSettings() {
  try {
    const raw = localStorage.getItem(APP_SETTINGS_KEY);
    const saved = raw ? JSON.parse(raw) : {};
    return {
      notifications: saved.notifications ?? true,
      shareUsage: saved.shareUsage ?? false,
      analysisDetail: (saved.analysisDetail ?? "balanced") as AnalysisDetail,
    };
  } catch {
    return { notifications: true, shareUsage: false, analysisDetail: "balanced" as AnalysisDetail };
  }
}

export default function ProfilePage() {
  const { t, lang, setLang } = useLanguage() as any;
  const { theme, setTheme } = useTheme();
  const [prefs, setPrefs] = useState(loadPrefs);
  const [appSettings, setAppSettings] = useState(loadAppSettings);

  useEffect(() => {
    localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(appSettings));
  }, [appSettings]);

  function togglePref(key: string) {
    setPrefs((current) => {
      const updated = current.map((p) => (p.key === key ? { ...p, on: !p.on } : p));
      localStorage.setItem(PREFS_KEY, JSON.stringify(Object.fromEntries(updated.map((p) => [p.key, p.on]))));
      return updated;
    });
  }

  function toggleAppBool(key: "notifications" | "shareUsage") {
    setAppSettings((s) => ({ ...s, [key]: !s[key] }));
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
          <label className="pref-row" key={p.key} onClick={() => togglePref(p.key)} style={{ cursor: "pointer" }}>
            <span>{t(p.labelKey)}</span>
            <span className={`switch ${p.on ? "" : "switch-off"}`} />
          </label>
        ))}
      </div>

      <div className="row-head mt-48">
        <h2 className="section-title">Appearance</h2>
      </div>
      <div className="panel">
        <label className="pref-row" onClick={() => setTheme(theme === "light" ? "dark" : "light")} style={{ cursor: "pointer" }}>
          <span>{t("dark_mode")}</span>
          <span className={`switch ${theme === "light" ? "switch-off" : ""}`} />
        </label>
      </div>

      <div className="row-head mt-48">
        <h2 className="section-title">Notifications &amp; Privacy</h2>
      </div>
      <div className="panel">
        <label className="pref-row" style={{ cursor: "pointer" }} onClick={() => toggleAppBool("notifications")}>
          <span>Enable notifications</span>
          <span className={`switch ${appSettings.notifications ? "" : "switch-off"}`} />
        </label>
        <label className="pref-row" style={{ cursor: "pointer" }} onClick={() => toggleAppBool("shareUsage")}>
          <span>Share anonymous usage data</span>
          <span className={`switch ${appSettings.shareUsage ? "" : "switch-off"}`} />
        </label>
      </div>

      <div className="row-head mt-48">
        <h2 className="section-title">Language</h2>
      </div>
      <div className="panel">
        <label className="pref-row">
          <span>Interface language</span>
          <div className="seg" role="tablist" aria-label="Language">
            {([["en", "English"], ["es", "Español"], ["fr", "Français"]] as [string, string][]).map(([code, label]) => (
              <button
                key={code}
                className={"seg-btn " + (lang === code ? "active" : "")}
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
              >
                {label}
              </button>
            ))}
          </div>
        </label>
      </div>
    </>
  );
}