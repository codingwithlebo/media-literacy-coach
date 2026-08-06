import { useRef, useState } from "react";
import { I, Ic } from "./icons";
import VoiceModal from "./voiceModal";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onVerify: () => void;
  onVoice: (text: string) => void;
  busy: boolean;
}

export default function IntakeGrid({ value, onChange, onVerify, onVoice, busy }: Props) {
  const [voiceOpen, setVoiceOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const articleInputRef = useRef<HTMLInputElement | null>(null);
  const [ocrBusy, setOcrBusy] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [articleBusy, setArticleBusy] = useState(false);
  const [articleError, setArticleError] = useState<string | null>(null);

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
          {ocrBusy ? "Reading text…" : (<>Drop image here<br />or browse</>)}
        </div>
        {ocrError && <span className="hint" style={{ color: "#f87171" }}>{ocrError}</span>}
      </div>

      <div className="intake-card">
        <div className="intake-icon"><Ic p={I.file} /></div>
        <div><h3>Upload Article or File</h3><p>Upload a file in any format to analyze.</p></div>
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
          {articleBusy ? "Reading file…" : (<>Drop file here<br />or browse</>)}
        </div>
        <span className="hint">PDF, DOCX, TXT</span>
        {articleError && <span className="hint" style={{ color: "#f87171" }}>{articleError}</span>}
      </div>

      <div className="intake-card">
        <div className="intake-icon"><Ic p={I.mic} /></div>
        <div><h3>Record or Upload Voice</h3><p>Upload a voice note or record directly.</p></div>
        <button className="btn btn-block" onClick={() => setVoiceOpen(true)}><Ic p={I.mic} /> Record Audio</button>
        <span className="hint" style={{ textAlign: "center" }}>or upload file</span>
      </div>

      <VoiceModal open={voiceOpen} onClose={() => setVoiceOpen(false)} onTranscript={onVoice} />
    </section>
  );
}