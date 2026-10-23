/** Hand-drawn late-2000s style system icons. */
export type IconName =
  | "folder"
  | "folder-open"
  | "computer"
  | "drive"
  | "recycle"
  | "recycle-full"
  | "text"
  | "doc"
  | "notepad"
  | "settings"
  | "music"
  | "games"
  | "user"
  | "archive"
  | "app"
  | "picture"
  | "search"
  | "power"
  | "restart";

export function Ico({ name, size = 32 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" className="os-ico">
      <defs>
        <linearGradient id={`g-fold-${name}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe9a8" />
          <stop offset="45%" stopColor="#f6cf63" />
          <stop offset="100%" stopColor="#d99f21" />
        </linearGradient>
        <linearGradient id={`g-steel-${name}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4f9ff" />
          <stop offset="50%" stopColor="#c3d5e6" />
          <stop offset="100%" stopColor="#8aa2b8" />
        </linearGradient>
        <linearGradient id={`g-glass-${name}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bfe6ff" />
          <stop offset="55%" stopColor="#5aa9df" />
          <stop offset="100%" stopColor="#1e628f" />
        </linearGradient>
        <linearGradient id={`g-paper-${name}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#dfe6ee" />
        </linearGradient>
      </defs>
      {render(name)}
    </svg>
  );

  function render(n: IconName) {
    const fold = `url(#g-fold-${name})`;
    const steel = `url(#g-steel-${name})`;
    const glass = `url(#g-glass-${name})`;
    const paper = `url(#g-paper-${name})`;
    switch (n) {
      case "folder":
      case "folder-open":
        return (
          <g>
            <path d="M4 12h14l4 4h22v24H4z" fill="#b98420" />
            <path d="M4 14h15l4 4h21v22H4z" fill={fold} stroke="#9c6f16" strokeWidth="0.8" />
            <path d="M5 21h38l-3 17H8z" fill="#ffffff" opacity="0.18" />
          </g>
        );
      case "archive":
        return (
          <g>
            <rect x="6" y="14" width="36" height="8" fill={steel} stroke="#6d829a" />
            <rect x="9" y="22" width="30" height="18" fill="#cdb98f" stroke="#9c8a63" />
            <rect x="19" y="26" width="10" height="4" fill="#8b7a55" />
          </g>
        );
      case "computer":
        return (
          <g>
            <rect x="6" y="9" width="36" height="24" rx="2" fill={steel} stroke="#5d7185" />
            <rect x="9" y="12" width="30" height="17" fill={glass} />
            <path d="M9 12h30v6H9z" fill="#ffffff" opacity="0.25" />
            <rect x="17" y="33" width="14" height="5" fill="#9fb2c4" />
            <rect x="11" y="38" width="26" height="4" rx="1.5" fill={steel} stroke="#5d7185" />
          </g>
        );
      case "drive":
        return (
          <g>
            <rect x="7" y="16" width="34" height="18" rx="2" fill={steel} stroke="#5d7185" />
            <rect x="10" y="20" width="18" height="3" fill="#8fa5b8" />
            <circle cx="35" cy="28" r="2" fill="#5ad07a" />
          </g>
        );
      case "recycle":
      case "recycle-full":
        return (
          <g>
            <path d="M13 14h22l-3 28H16z" fill="#cfe3f2" stroke="#7d97ab" opacity="0.92" />
            {n === "recycle-full" && <path d="M15 20h18l-1 6H16z" fill="#e8eef3" />}
            <ellipse cx="24" cy="14" rx="11" ry="3.5" fill={steel} stroke="#7d97ab" />
            <path d="M24 20l4 6h-8z" fill="#3f9a4f" opacity="0.8" />
          </g>
        );
      case "text":
      case "doc":
        return (
          <g>
            <path d="M12 6h18l8 8v28H12z" fill={paper} stroke="#93a3b3" />
            <path d="M30 6l8 8h-8z" fill="#c8d4df" stroke="#93a3b3" />
            <g stroke="#8595a5" strokeWidth="1.4">
              <path d="M17 20h14M17 25h14M17 30h10" />
            </g>
          </g>
        );
      case "notepad":
        return (
          <g>
            <path d="M11 6h20l7 7v29H11z" fill={paper} stroke="#93a3b3" />
            <path d="M11 6h20v7h7" fill="none" stroke="#93a3b3" />
            <g stroke="#6fa3d0" strokeWidth="1.2">
              <path d="M16 19h17M16 24h17M16 29h17M16 34h11" />
            </g>
            <path d="M14 6v36" stroke="#d05a5a" strokeWidth="1" />
          </g>
        );
      case "settings":
        return (
          <g>
            <path
              d="M24 8l3 4 5-1 1 5 4 3-2 5 2 5-4 3-1 5-5-1-3 4-3-4-5 1-1-5-4-3 2-5-2-5 4-3 1-5 5 1z"
              fill={steel}
              stroke="#5d7185"
            />
            <circle cx="24" cy="24" r="6" fill={glass} stroke="#2c6a95" />
          </g>
        );
      case "music":
        return (
          <g>
            <circle cx="24" cy="24" r="17" fill={glass} stroke="#1d5b86" />
            <circle cx="24" cy="24" r="5" fill="#e9f4fb" />
            <path d="M20 30V16l10-2v14" fill="none" stroke="#f3fbff" strokeWidth="2" />
          </g>
        );
      case "games":
        return (
          <g>
            <rect x="5" y="17" width="38" height="16" rx="7" fill={steel} stroke="#5d7185" />
            <rect x="12" y="23" width="9" height="3" fill="#41586b" />
            <rect x="15" y="20" width="3" height="9" fill="#41586b" />
            <circle cx="31" cy="23" r="2.4" fill="#c0392b" />
            <circle cx="36" cy="27" r="2.4" fill="#2e86c1" />
          </g>
        );
      case "user":
        return (
          <g>
            <circle cx="24" cy="18" r="8" fill="#e7d1b8" stroke="#a98d6e" />
            <path d="M8 42c2-10 8-14 16-14s14 4 16 14z" fill={glass} stroke="#1d5b86" />
          </g>
        );
      case "picture":
        return (
          <g>
            <rect x="6" y="11" width="36" height="26" fill="#fff" stroke="#93a3b3" />
            <rect x="9" y="14" width="30" height="20" fill="#7fc0e6" />
            <path d="M9 34l9-10 6 6 5-4 10 8z" fill="#3c7f4f" />
            <circle cx="16" cy="19" r="2.5" fill="#ffe9a8" />
          </g>
        );
      case "search":
        return (
          <g>
            <circle cx="21" cy="21" r="10" fill="none" stroke="#4a6274" strokeWidth="3" />
            <path d="M28 28l10 10" stroke="#4a6274" strokeWidth="4" strokeLinecap="round" />
          </g>
        );
      case "power":
        return (
          <g>
            <circle cx="24" cy="24" r="15" fill={steel} stroke="#5d7185" />
            <path d="M24 13v12" stroke="#2b3d4d" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M16 20a11 11 0 1016 0" fill="none" stroke="#2b3d4d" strokeWidth="3.5" />
          </g>
        );
      case "restart":
        return (
          <g>
            <circle cx="24" cy="24" r="15" fill={steel} stroke="#5d7185" />
            <path d="M33 24a9 9 0 11-3-6.7" fill="none" stroke="#2b3d4d" strokeWidth="3.5" />
            <path d="M32 11v7h-7" fill="none" stroke="#2b3d4d" strokeWidth="3.5" />
          </g>
        );
      case "app":
      default:
        return (
          <g>
            <rect x="8" y="8" width="32" height="32" rx="3" fill={glass} stroke="#1d5b86" />
            <path d="M8 10h32v10H8z" fill="#ffffff" opacity="0.22" />
          </g>
        );
    }
  }
}
