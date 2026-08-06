import { useEffect, useRef, useState } from "react";

// Reads the same backend base URL as the analyze hook.
const API =
  (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env
    ?.VITE_API_URL ?? "";

type Phase = "idle" | "recording" | "ready" | "working";

interface Props {
  open: boolean;
  onClose: () => void;
  onTranscript: (text: string) => void; // hand the text to the analyze flow
}

// The browser Speech Recognition API is prefixed and untyped.
function getRecognition(): any {
  const w = window as any;
  const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
  if (!SR) return null;
  const r = new SR();
  r.continuous = true;
  r.interimResults = true;
  r.lang = "en-US";
  return r;
}

export default function VoiceModal({ open, onClose, onTranscript }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const finalRef = useRef("");

  const speechSupported = typeof window !== "undefined" && Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  // Reset everything when the modal closes.
  useEffect(() => {
    if (!open) hardReset();
    return () => stopEverything();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function hardReset() {
    stopEverything();
    setPhase("idle");
    setSeconds(0);
    setTranscript("");
    setNote(null);
    finalRef.current = "";
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
  }

  function stopEverything() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    try { recognitionRef.current?.stop(); } catch {}
    try { mediaRef.current?.stop(); mediaRef.current?.stream.getTracks().forEach((t) => t.stop()); } catch {}
  }

  async function startRecording() {
    setNote(null);
    setTranscript("");
    finalRef.current = "";

    // 1) audio for playback (works in all modern browsers)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
      };
      mr.start();
      mediaRef.current = mr;
    } catch {
      setNote("We couldn't access your microphone. Check the browser's mic permission.");
      return;
    }

    // 2) live transcription (Chrome / Edge). Optional but nice.
    const rec = getRecognition();
    if (rec) {
      rec.onresult = (e: any) => {
        let interim = "";
        for (let k = e.resultIndex; k < e.results.length; k++) {
          const chunk = e.results[k][0].transcript;
          if (e.results[k].isFinal) finalRef.current += chunk + " ";
          else interim += chunk;
        }
        setTranscript((finalRef.current + interim).trim());
      };
      rec.onerror = () => {};
      recognitionRef.current = rec;
      try { rec.start(); } catch {}
    }

    setPhase("recording");
    setSeconds(0);
    timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
  }

  function stopRecording() {
    stopEverything();
    setPhase("ready");
    if (!speechSupported && !transcript) {
      setNote("Live transcription isn't supported in this browser. Type what was said below, or connect the backend to transcribe the audio automatically.");
    }
  }

  async function handleUpload(file: File) {
    setNote(null);
    setAudioUrl(URL.createObjectURL(file));
    setPhase("working");
    // Uploaded audio can't be transcribed in the browser — ask the backend.
    try {
      const form = new FormData();
      form.append("audio", file);
      const res = await fetch(`${API}/api/transcribe`, { method: "POST", body: form });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTranscript((data.text || "").trim());
      setPhase("ready");
    } catch {
      setPhase("ready");
      setNote("Couldn't reach the transcription service. Once the backend's /api/transcribe endpoint is live, uploaded audio will be transcribed here. For now you can type the content below.");
    }
  }

  function submit() {
    const text = transcript.trim();
    if (!text) { setNote("Nothing to analyze yet — record, upload, or type the content first."); return; }
    onTranscript(text);
    onClose();
  }

  if (!open) return null;
  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-head">
          <h3>Record or upload voice</h3>
          <button className="modal-x" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="voice-stage">
          <button
            className={`mic-btn ${phase === "recording" ? "is-rec" : ""}`}
            onClick={phase === "recording" ? stopRecording : startRecording}
            disabled={phase === "working"}
            aria-label={phase === "recording" ? "Stop recording" : "Start recording"}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              {phase === "recording"
                ? <rect x="7" y="7" width="10" height="10" rx="2" />
                : <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6 11a6 6 0 0 0 12 0M12 17v4" /></>}
            </svg>
          </button>
          <div className="voice-status">
            {phase === "recording" ? <span className="rec-dot" /> : null}
            {phase === "idle" && "Tap to start recording"}
            {phase === "recording" && `Recording… ${mmss}`}
            {phase === "ready" && "Recording ready — review below"}
            {phase === "working" && "Transcribing…"}
          </div>

          <label className="upload-link">
            or upload an audio file
            <input type="file" accept="audio/*" hidden onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
          </label>
        </div>

        {audioUrl && <audio className="voice-player" src={audioUrl} controls />}

        <textarea
          className="paste-box"
          style={{ minHeight: 96, marginTop: 4 }}
          placeholder="Transcript will appear here — you can edit it before analyzing."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
        />

        {note && <p className="voice-note">{note}</p>}

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={!transcript.trim()}>Analyze this</button>
        </div>
      </div>
    </div>
  );
}