import type { Challenge } from "../types/challenge";

/**
 * This is the content bank. For the hackathon demo, curate 10-15 real,
 * well-sourced examples per category rather than generating them live —
 * it's far more reliable in front of judges than a live AI call.
 */
export const challenges: Challenge[] = [
  {
    id: "phish-1",
    category: "Phishing email",
    content:
      'Subject: "URGENT: Your account will be suspended in 24 hours." Sender: security@secure-bank0nline.com. "Click here to verify your banking details immediately."',
    isFake: true,
    explanation:
      "The sender domain uses a zero instead of the letter O, a common lookalike trick. False urgency and a request for banking details are classic phishing signals.",
    redFlags: ["Suspicious sender domain", "False urgency", "Requests sensitive info"],
  },
  {
    id: "headline-1",
    category: "Fake headline",
    content:
      '"South African Reserve Bank raises interest rate by 0.25% to curb inflation, third increase this year."',
    isFake: false,
    explanation:
      "Specific, checkable figures, a named institution, and neutral tone are typical of real financial reporting.",
  },
  {
    id: "whatsapp-1",
    category: "WhatsApp forward",
    content:
      '"Forward this to 10 people or your WhatsApp will be deactivated tonight at midnight!"',
    isFake: true,
    explanation:
      "Chain-message threats with arbitrary deadlines and no verifiable source are a classic hoax pattern designed purely to spread.",
    redFlags: ["No verifiable source", "Arbitrary deadline", "Asks you to forward"],
  },
  {
    id: "image-1",
    category: "Manipulated image",
    content:
      'A photo shared with the caption "2 million people at the rally today!" — no date, location, or original source attached.',
    isFake: true,
    explanation:
      "Missing context, no source, and a suspiciously round number are common signs of a misleading image claim, even if the photo itself is real.",
    redFlags: ["No source or date", "Suspiciously round numbers", "Emotionally charged caption"],
  },
];
