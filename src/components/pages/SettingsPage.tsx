import { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

type AnalysisDetail = "concise" | "balanced" | "detailed";

type Settings = {
  theme: "light" | "dark";
  notifications: boolean;
  language: string;
  shareUsage: boolean;
  analysisDetail: AnalysisDetail;
};

const KEY = "app-settings";

const defaults: Settings = {
  theme: "dark",
  notifications: true,
  language: "en",
  shareUsage: false,
  analysisDetail: "balanced",
};

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    const saved = raw ? JSON.parse(raw) : {};
    const THEME_KEY = "verify-theme";
    const storedTheme =
      (saved.theme as string) ||
      localStorage.getItem(THEME_KEY) ||
      defaults.theme;
    const theme = storedTheme === "light" ? "light" : "dark";
    return { ...defaults, ...saved, theme } as Settings;
  } catch {
    return defaults;
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const { lang, setLang } = useLanguage();

  const THEME_KEY = "verify-theme";

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    try {
      document.documentElement.classList.toggle(
        "light-mode",
        settings.theme === "light",
      );
      localStorage.setItem(THEME_KEY, settings.theme);
    } catch {}
  }, [settings.theme]);

  function update<K extends keyof Settings>(k: K, v: Settings[K]) {
    setSettings((s) => ({ ...s, [k]: v }));
  }

  function reset() {
    setSettings(defaults);
  }

  function toggleBool<K extends keyof Settings>(k: K) {
    if (typeof settings[k] === "boolean") {
      update(k, !(settings[k] as any) as Settings[K]);
    }
  }

  return (
    <>
      <p className="greeting">Settings</p>
      <h1 className="headline">Application preferences</h1>
      <p className="subhead">
        Control how Verify behaves and what information we collect.
      </p>

      <div className="row-head mt-48">
        <h2 className="section-title">Appearance</h2>
      </div>
      <div className="panel">
        <label className="pref-row">
          <span>Theme</span>
          <div className="seg" role="tablist" aria-label="Theme">
            {(["light", "dark"] as Settings["theme"][]).map((t) => (
              <button
                key={t}
                className={"seg-btn " + (settings.theme === t ? "active" : "")}
                onClick={() => update("theme", t)}
                aria-pressed={settings.theme === t}
              >
                {t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </label>
      </div>

      <div className="row-head mt-48">
        <h2 className="section-title">Notifications & Privacy</h2>
      </div>
      <div className="panel">
        <label
          className="pref-row"
          style={{ cursor: "pointer" }}
          onClick={() => toggleBool("notifications")}
        >
          <span>Enable notifications</span>
          <span
            className={`switch ${settings.notifications ? "" : "switch-off"}`}
          />
        </label>

        <label
          className="pref-row"
          style={{ cursor: "pointer" }}
          onClick={() => toggleBool("shareUsage")}
        >
          <span>Share anonymous usage data</span>
          <span
            className={`switch ${settings.shareUsage ? "" : "switch-off"}`}
          />
        </label>
      </div>

      <div className="row-head mt-48">
        <h2 className="section-title">Analysis</h2>
      </div>
      <div className="panel">
        <label className="pref-row">
          <span>Detail level</span>
          <div className="seg" role="tablist" aria-label="Detail level">
            {(["concise", "balanced", "detailed"] as AnalysisDetail[]).map(
              (d) => (
                <button
                  key={d}
                  className={
                    "seg-btn " + (settings.analysisDetail === d ? "active" : "")
                  }
                  onClick={() => update("analysisDetail", d)}
                  aria-pressed={settings.analysisDetail === d}
                >
                  {d[0].toUpperCase() + d.slice(1)}
                </button>
              ),
            )}
          </div>
        </label>
      </div>

      <div className="row-head mt-48">
        <h2 className="section-title">Language</h2>
      </div>
      <div className="panel">
        <label className="pref-row">
          <span>Interface language</span>
          <div className="seg" role="tablist" aria-label="Language">
            {(
              [
                ["en", "English"],
                ["es", "Español"],
                ["fr", "Français"],
              ] as [string, string][]
            ).map(([code, label]) => (
              <button
                key={code}
                className={"seg-btn " + (lang === code ? "active" : "")}
                onClick={() => {
                  setLang(code as "en" | "es" | "fr");
                  update("language", code);
                }}
                aria-pressed={lang === code}
              >
                {label}
              </button>
            ))}
          </div>
        </label>
      </div>

      <div style={{ marginTop: 20 }}>
        <button
          className="btn"
          onClick={() => localStorage.setItem(KEY, JSON.stringify(settings))}
        >
          Save
        </button>
        <button className="btn ghost" onClick={reset} style={{ marginLeft: 8 }}>
          Reset Defaults
        </button>
      </div>
    </>
  );
}