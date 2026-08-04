import { I, Ic } from "./icons";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onVerify: () => void;
  busy: boolean;
}

export default function IntakeGrid({ value, onChange, onVerify, busy }: Props) {
  return (
    <section className="intake">
      <div className="intake-card">
        <div className="intake-icon"><Ic p={I.text} /></div>
        <div>
          <h3>Paste Text or Link</h3>
          <p>Paste a news article, social media post, or any link.</p>
        </div>
        <textarea
          className="paste-box"
          placeholder="Paste here…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button className="btn btn-primary btn-block" onClick={onVerify} disabled={busy || !value.trim()}>
          {busy ? "Verifying…" : "Verify this"}
        </button>
      </div>

      <div className="intake-card">
        <div className="intake-icon"><Ic p={I.image} /></div>
        <div><h3>Upload Screenshot</h3><p>Upload an image or screenshot to analyze.</p></div>
        <div className="dropzone">Drop image here<br />or browse</div>
      </div>

      <div className="intake-card">
        <div className="intake-icon"><Ic p={I.file} /></div>
        <div><h3>Upload Article or File</h3><p>Upload a file in any format to analyze.</p></div>
        <div className="dropzone">Drop file here<br />or browse</div>
        <span className="hint">PDF, DOCX, TXT</span>
      </div>

      <div className="intake-card">
        <div className="intake-icon"><Ic p={I.mic} /></div>
        <div><h3>Record or Upload Voice</h3><p>Upload a voice note or record directly.</p></div>
        <button className="btn btn-block"><Ic p={I.mic} /> Record Audio</button>
        <span className="hint" style={{ textAlign: "center" }}>or upload file</span>
      </div>
    </section>
  );
}