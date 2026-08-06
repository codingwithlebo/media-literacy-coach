import { useRef, useState } from "react";
import { I, Ic } from "./icons";
import { useLanguage } from "../context/LanguageContext";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onVerify: () => void;
  busy: boolean;
  onVoiceComplete?: (transcript: string) => void;
}

type SpeechRecognitionCtor = new () => any;

export default function IntakeGrid({
  value,
  onChange,
  onVerify,
  busy,
  onVoiceComplete,
}: Props) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const articleInputRef = useRef<HTMLInputElement | null>(null);
  const [ocrBusy, setOcrBusy] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [articleBusy, setArticleBusy] = useState(false);
  const [articleError, setArticleError] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  async function handleScreenshotFile(file: File) {
    setOcrError(null);
    setOcrBusy(true);
    try {
      const Tesseract = await import("tesseract.js");
      const { data } = await Tesseract.recognize(file, "eng");
      onChange(data.text.trim());
    } catch (err) {
      console.error("OCR failed:", err);
      setOcrError("Couldn't read text from that image. Try a clearer screenshot.");
    } finally {
      setOcrBusy(false);
    }
  }

  async function handleArticleFile(file: File) {
    setArticleError(null);
    setArticleBusy(true);
    try {
      const name = file.name.toLowerCase();

      if (name.endsWith(".txt")) {
        const text = await file.text();
        onChange(text.trim());
        return;
      }

      if (name.endsWith(".pdf")) {
        const pdfjsLib = await import("pdfjs-dist");
        const workerUrl = (
          await import("pdfjs-dist/build/pdf.worker.min.mjs?url")
        ).default;
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const content = await page.getTextContent();
          const pageText = content.items.map((item: any) => item.str).join(" ");
          fullText += pageText + "\n";
        }
        onChange(fullText.trim());
        return;
      }

      if (name.endsWith(".docx")) {
        const mammoth = await import("mammoth");
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        onChange(result.value.trim());
        return;
      }

      setArticleError("Unsupported file type. Use PDF, DOCX, or TXT.");
    } catch (err) {
      console.error("File read failed:", err);
      setArticleError("Couldn't read that file. Try a different one.");
    } finally {
      setArticleBusy(false);
    }
  }

  function toggleRecording() {
    setVoiceError(null);

    if (recording) {
      recognitionRef.current?.stop();
      setRecording(false);
      return;
    }

    const SpeechRecognition: SpeechRecognitionCtor | undefined =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError("Voice recording needs Chrome or Edge — not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = "";

    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interim += transcript;
        }
      }
      onChange((finalTranscript + interim).trim());
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setVoiceError("Couldn't hear you clearly — check your microphone permission and try again.");
      setRecording(false);
    };

    recognition.onend = () => {
      setRecording(false);
      const final = finalTranscript.trim();
      if (final && onVoiceComplete) {
        try {
          onVoiceComplete(final);
        } catch {}
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
  }

  return (
    <section className="intake">
      <div className="intake-card">
        <div className="intake-icon">
          <Ic p={I.text} />
        </div>
        <div>
          <h3>{t("intake_paste_title")}</h3>
          <p>{t("intake_paste_desc")}</p>
        </div>
        <textarea
          className="paste-box"
          placeholder="Paste here…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          className="btn btn-primary btn-block"
          onClick={onVerify}
          disabled={busy || !value.trim()}
        >
          {busy ? t("verify_button_loading") : t("verify_button")}
        </button>
      </div>

      <div className="intake-card">
        <div className="intake-icon">
          <Ic p={I.image} />
        </div>
        <div>
          <h3>{t("intake_screenshot_title")}</h3>
          <p>{t("intake_screenshot_desc")}</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleScreenshotFile(file);
            e.target.value = "";
          }}
        />
        <div
          className="dropzone"
          style={{ cursor: "pointer" }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) handleScreenshotFile(file);
          }}
        >
          {ocrBusy ? (
            t("intake_screenshot_reading")
          ) : (
            <>
              {t("intake_screenshot_drop")}
              <br />
              {t("intake_or_browse")}
            </>
          )}
        </div>
        {ocrError && (
          <span className="hint" style={{ color: "#f87171" }}>
            {ocrError}
          </span>
        )}
      </div>

      <div className="intake-card">
        <div className="intake-icon">
          <Ic p={I.file} />
        </div>
        <div>
          <h3>{t("intake_file_title")}</h3>
          <p>{t("intake_file_desc")}</p>
        </div>
        <input
          ref={articleInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleArticleFile(file);
            e.target.value = "";
          }}
        />
        <div
          className="dropzone"
          style={{ cursor: "pointer" }}
          onClick={() => articleInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) handleArticleFile(file);
          }}
        >
          {articleBusy ? (
            t("intake_file_reading")
          ) : (
            <>
              {t("intake_file_drop")}
              <br />
              {t("intake_or_browse")}
            </>
          )}
        </div>
        <span className="hint">{t("intake_file_types")}</span>
        {articleError && (
          <span className="hint" style={{ color: "#f87171" }}>
            {articleError}
          </span>
        )}
      </div>

      <div className="intake-card">
        <div className="intake-icon">
          <Ic p={I.mic} />
        </div>
        <div>
          <h3>{t("intake_voice_title")}</h3>
          <p>{t("intake_voice_desc")}</p>
        </div>
        <button className="btn btn-block" onClick={toggleRecording}>
          <Ic p={I.mic} /> {recording ? t("intake_voice_stop") : t("intake_voice_record")}
        </button>
        {voiceError && (
          <span className="hint" style={{ color: "#f87171" }}>
            {voiceError}
          </span>
        )}
      </div>
    </section>
  );
}