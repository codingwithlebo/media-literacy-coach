import type { ReactNode } from "react";

export const I = {
  home: <path d="M3 10.5 12 3l9 7.5M5 9v11h14V9" />,
  verify: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  learn: (
    <>
      <path d="M3 7h18v13H3z" />
      <path d="M3 7l9-4 9 4" />
    </>
  ),
  insights: <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />,
  profile: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </>
  ),
  settings: (
    <>
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 2.28 17.9l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09c.7 0 1.27-.4 1.51-1a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 6.7 2.28l.06.06c.46.46 1.12.68 1.82.33.6-.3 1.3-.3 1.9 0 .7.36 1.26.19 1.82-.33l.06-.06A2 2 0 1 1 15.9 2.28l-.06.06c-.46.46-.68 1.12-.33 1.82.3.6.3 1.3 0 1.9-.36.7-.19 1.26.33 1.82l.06.06A1.65 1.65 0 0 0 19.4 8H19a2 2 0 1 1 0 4h-.09c-.7 0-1.27.4-1.51 1-.3.6-.3 1.3 0 1.9.36.7.19 1.26.33 1.82z" />
    </>
  ),
  text: (
    <>
      <path d="M4 4h16v16H4z" />
      <path d="M8 9h8M8 13h8M8 17h5" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-5-5L5 21" />
    </>
  ),
  file: (
    <>
      <path d="M6 2h9l5 5v15H6z" />
      <path d="M15 2v5h5" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M6 11a6 6 0 0 0 12 0M12 17v4" />
    </>
  ),
  check: <path d="m5 12 5 5L20 6" />,
};

export function Ic({ p }: { p: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {p}
    </svg>
  );
}
