import { useEffect, useRef, useState } from "react";

// Backend URL from Vercel environment variables.
const API =
  (import.meta as unknown as {
    env?: { VITE_API_URL?: string };
  }).env?.VITE_API_URL ?? "";

type Phase = "idle" | "recording" | "ready" | "working";

interface Props {
  open: boolean;
  onClose: () => void;
  onTranscript: (text: string) => void;
}

// Browser speech-recognition helper
function getRecognition(): any {
  const w = window as any;
  const SpeechRecognition =
    w.SpeechRecognition || w.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return null;
  }

  const recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  return recognition;
}

export default function VoiceModal({
  open,
  onClose,
  onTranscript,
}: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const blobRef = useRef<Blob | null>(null);
  const timerRef = useRef<number | null>(null);
  const finalRef = useRef("");

  const speechSupported =
    typeof window !== "undefined" &&
    Boolean(
      (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition
    );

  useEffect(() => {
    if (!open) {
      hardReset();
    }

    return () => {
      stopEverything();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function hardReset() {
    stopEverything();

    setPhase("idle");
    setSeconds(0);
    setTranscript("");
    setNote(null);

    finalRef.current = "";
    blobRef.current = null;

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    setAudioUrl(null);
  }

  function stopEverything() {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    try {
      recognitionRef.current?.stop();
    } catch {}

    try {
      if (mediaRef.current) {
        mediaRef.current.stop();

        mediaRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
    } catch {}
  }

  async function startRecording() {
    setNote(null);
    setTranscript("");
    finalRef.current = "";
    blobRef.current = null;

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      const recorder = new MediaRecorder(stream);

      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        blobRef.current = blob;

        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }

        setAudioUrl(URL.createObjectURL(blob));
      };

      recorder.start();

      mediaRef.current = recorder;
    } catch (error) {
      console.error(
        "Microphone access failed:",
        error
      );

      setNote(
        "We couldn't access your microphone. Check your browser's microphone permission. Recording requires HTTPS or localhost."
      );

      return;
    }

    const recognition = getRecognition();

    if (recognition) {
      recognition.onresult = (event: any) => {
        let interim = "";

        for (
          let index = event.resultIndex;
          index < event.results.length;
          index++
        ) {
          const text =
            event.results[index][0].transcript;

          if (event.results[index].isFinal) {
            finalRef.current += text + " ";
          } else {
            interim += text;
          }
        }

        setTranscript(
          `${finalRef.current}${interim}`.trim()
        );
      };

      recognition.onerror = (event: any) => {
        console.warn(
          "Speech recognition error:",
          event?.error
        );
      };

      recognitionRef.current = recognition;

      try {
        recognition.start();
      } catch {}
    }

    setPhase("recording");
    setSeconds(0);

    timerRef.current = window.setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);
  }

  function stopRecording() {
    stopEverything();

    setPhase("ready");

    if (!speechSupported && !finalRef.current) {
      setNote(
        'This browser cannot transcribe live. Press "Analyze this" to send the audio to the backend, or type what was said below.'
      );
    }
  }

  /*
   * Send audio to the FastAPI backend.
   *
   * Backend route:
   * POST /transcribe
   *
   * Backend expects:
   * UploadFile file
   *
   * Therefore the FormData field must be called "file".
   */
  async function transcribeBlob(
    blob: Blob
  ): Promise<string> {
    const baseUrl = API.replace(/\/$/, "");

    if (!baseUrl) {
      throw new Error(
        "VITE_API_URL is not configured."
      );
    }

    const form = new FormData();

    form.append(
      "file",
      blob,
      "audio.webm"
    );

    const endpoint = `${baseUrl}/transcribe`;

    console.log(
      "Sending audio to:",
      endpoint
    );

    console.log(
      "Audio information:",
      {
        type: blob.type,
        size: blob.size,
      }
    );

    const response = await fetch(endpoint, {
      method: "POST",
      body: form,
    });

    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        "Transcription request failed:",
        response.status,
        errorText
      );

      throw new Error(
        `Transcription failed with status ${response.status}`
      );
    }

    const data = await response.json();

    console.log(
      "Transcription response:",
      data
    );

    return (
      data.text || ""
    ).trim();
  }

  async function handleUpload(file: File) {
    setNote(null);

    console.log(
      "Selected audio file:",
      {
        name: file.name,
        type: file.type,
        size: file.size,
      }
    );

    blobRef.current = file;

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    setAudioUrl(
      URL.createObjectURL(file)
    );

    setPhase("working");

    try {
      const text =
        await transcribeBlob(file);

      setTranscript(text);
      setPhase("ready");

      if (!text) {
        setNote(
          "The audio uploaded successfully, but no speech was detected. You can type the content below."
        );
      }
    } catch (error) {
      console.error(
        "Audio upload/transcription error:",
        error
      );

      setPhase("ready");

      setNote(
        "Couldn't reach the transcription service. You can type the content below and analyze it manually."
      );
    }
  }

  async function submit() {
    const text =
      transcript.trim();

    // If there is already a transcript,
    // send it directly to the analysis flow.
    if (text) {
      onTranscript(text);
      onClose();
      return;
    }

    // If there is audio but no transcript,
    // send the audio to the backend.
    if (blobRef.current) {
      setPhase("working");
      setNote(null);

      try {
        const result =
          await transcribeBlob(
            blobRef.current
          );

        if (result) {
          setTranscript(result);
          onTranscript(result);
          onClose();
          return;
        }

        setPhase("ready");

        setNote(
          "No speech was detected in the audio. You can type the content below and press Analyze."
        );
      } catch (error) {
        console.error(
          "Audio transcription error:",
          error
        );

        setPhase("ready");

        setNote(
          "Couldn't transcribe the audio. Check that the backend is running, then try again. You can also type the content manually."
        );
      }

      return;
    }

    setNote(
      "Nothing to analyze yet — record, upload, or type the content first."
    );
  }

  if (!open) {
    return null;
  }

  const mmss =
    `${String(
      Math.floor(seconds / 60)
    ).padStart(2, "0")}:${String(
      seconds % 60
    ).padStart(2, "0")}`;

  const canSubmit =
    phase !== "working" &&
    (transcript.trim().length > 0 ||
      blobRef.current !== null);

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
    >
      <div
        className="modal"
        onClick={(event) =>
          event.stopPropagation()
        }
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-head">
          <h3>
            Record or upload voice
          </h3>

          <button
            className="modal-x"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="voice-stage">
          <button
            className={`mic-btn ${
              phase === "recording"
                ? "is-rec"
                : ""
            }`}
            onClick={
              phase === "recording"
                ? stopRecording
                : startRecording
            }
            disabled={
              phase === "working"
            }
            aria-label={
              phase === "recording"
                ? "Stop recording"
                : "Start recording"
            }
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {phase ===
              "recording" ? (
                <rect
                  x="7"
                  y="7"
                  width="10"
                  height="10"
                  rx="2"
                />
              ) : (
                <>
                  <rect
                    x="9"
                    y="3"
                    width="6"
                    height="11"
                    rx="3"
                  />

                  <path d="M6 11a6 6 0 0 0 12 0M12 17v4" />
                </>
              )}
            </svg>
          </button>

          <div className="voice-status">
            {phase ===
              "recording" && (
              <span className="rec-dot" />
            )}

            {phase === "idle" &&
              "Tap to start recording"}

            {phase === "recording" &&
              `Recording… ${mmss}`}

            {phase === "ready" &&
              "Ready — review or edit below"}

            {phase === "working" &&
              "Transcribing…"}
          </div>

          <label className="upload-link">
            or upload an audio file

            <input
              type="file"
              accept="audio/*,.mp3,.wav,.m4a,.webm,.ogg,.aac,.flac,.mp4"
              hidden
              onChange={(event) => {
                const file =
                  event.target.files?.[0];

                if (file) {
                  handleUpload(file);
                }

                // Allows the same file
                // to be selected again.
                event.target.value = "";
              }}
            />
          </label>
        </div>

        {audioUrl && (
          <audio
            className="voice-player"
            src={audioUrl}
            controls
          />
        )}

        <textarea
          className="paste-box"
          style={{
            minHeight: 96,
            marginTop: 4,
          }}
          placeholder="Transcript appears here — you can edit it before analyzing, or just type the content."
          value={transcript}
          onChange={(event) =>
            setTranscript(
              event.target.value
            )
          }
        />

        {note && (
          <p className="voice-note">
            {note}
          </p>
        )}

        <div className="modal-actions">
          <button
            className="btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="btn btn-primary"
            onClick={submit}
            disabled={!canSubmit}
          >
            {phase === "working"
              ? "Working…"
              : "Analyze this"}
          </button>
        </div>
      </div>
    </div>
  );
}
