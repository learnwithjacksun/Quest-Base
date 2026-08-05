export default function SpamIllustration() {
  return (
    <svg
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full text-muted"
      aria-hidden="true"
    >
      {/* Inbox panel */}
      <rect x="24" y="28" width="152" height="124" rx="8" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />

      {/* Valid row */}
      <rect x="36" y="44" width="128" height="28" rx="4" stroke="#17CF97" strokeWidth="1.1" opacity="0.7" />
      <circle cx="52" cy="58" r="6" stroke="#17CF97" strokeWidth="1.1" />
      <path d="M49 58 L51 60 L56 55" stroke="#17CF97" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="68" y="52" width="56" height="6" rx="2" fill="currentColor" opacity="0.3" />
      <rect x="68" y="62" width="36" height="4" rx="1" fill="currentColor" opacity="0.2" />

      {/* Spam row — crossed out */}
      <rect x="36" y="84" width="128" height="28" rx="4" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <circle cx="52" cy="98" r="6" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      <path d="M49 95 L55 101 M55 95 L49 101" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      <rect x="68" y="92" width="56" height="6" rx="2" fill="currentColor" opacity="0.2" />
      <rect x="68" y="102" width="36" height="4" rx="1" fill="currentColor" opacity="0.15" />
      <line x1="40" y1="98" x2="156" y2="98" stroke="#ef4444" strokeWidth="1" opacity="0.5" />

      {/* Shield badge */}
      <path
        d="M100 122 L116 128 V140 C116 148 100 154 100 154 C100 154 84 148 84 140 V128 Z"
        stroke="#17CF97"
        strokeWidth="1.3"
        fill="#17CF97"
        fillOpacity="0.12"
      />
      <path d="M94 138 L98 142 L108 132" stroke="#17CF97" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
