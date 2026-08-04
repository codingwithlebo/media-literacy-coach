import type { ReactNode } from "react";

export const I = {
  home: <path d="M3 10.5 12 3l9 7.5M5 9v11h14V9" />,
  verify: (<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>),
  learn: (<><path d="M3 7h18v13H3z" /><path d="M3 7l9-4 9 4" /></>),
  insights: <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />,
  profile: (<><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" /></>),
  text: (<><path d="M4 4h16v16H4z" /><path d="M8 9h8M8 13h8M8 17h5" /></>),
  image: (<><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-5-5L5 21" /></>),
  file: (<><path d="M6 2h9l5 5v15H6z" /><path d="M15 2v5h5" /></>),
  mic: (<><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6 11a6 6 0 0 0 12 0M12 17v4" /></>),
  check: <path d="m5 12 5 5L20 6" />,
};

export function Ic({ p }: { p: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round">
      {p}
    </svg>
  );
}