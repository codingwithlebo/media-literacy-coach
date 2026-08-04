const PREFS = [
  { label: "Show plain-language explanations", on: true },
  { label: "Flag possible AI-generated content", on: true },
  { label: "Warn before sharing low-credibility items", on: true },
  { label: "Email me a weekly literacy challenge", on: false },
];

export default function ProfilePage() {
  return (
    <>
      <p className="greeting">Profile</p>
      <h1 className="headline">Your account</h1>
      <p className="subhead">Manage how Verify works for you. These controls are UI-only for now.</p>

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
        {PREFS.map((p) => (
          <label className="pref-row" key={p.label}>
            <span>{p.label}</span>
            <span className={`switch ${p.on ? "" : "switch-off"}`} />
          </label>
        ))}
      </div>
    </>
  );
}