export default function SpamIllustration() {
  return (
    <svg
      viewBox="0 0 240 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full text-muted"
      aria-hidden="true"
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <pattern id="spam-dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="currentColor" opacity="0.1" />
        </pattern>
        <radialGradient id="spam-glow" cx="50%" cy="50%" r="50%">
          <stop stopColor="#17CF97" stopOpacity="0.25" />
          <stop offset="1" stopColor="#17CF97" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="240" height="160" fill="url(#spam-dots)" />

      {/* Incoming mail (top) */}
      <g opacity="0.75">
        <rect x="34" y="12" width="76" height="24" rx="7" fill="currentColor" opacity="0.06" />
        <rect x="34.5" y="12.5" width="75" height="23" rx="6.5" stroke="currentColor" strokeOpacity="0.25" />
        <circle cx="48" cy="24" r="6" fill="#17CF97" opacity="0.25" />
        <path d="M45 24 L47 26 L51 21.5" stroke="#17CF97" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="60" y="18" width="40" height="5" rx="2" fill="currentColor" opacity="0.25" />
        <rect x="60" y="27" width="28" height="4" rx="1.5" fill="currentColor" opacity="0.15" />
      </g>

      <g opacity="0.75">
        <rect x="130" y="12" width="76" height="24" rx="7" fill="currentColor" opacity="0.06" />
        <rect x="130.5" y="12.5" width="75" height="23" rx="6.5" stroke="currentColor" strokeOpacity="0.25" />
        <circle cx="144" cy="24" r="6" stroke="#ef4444" strokeOpacity="0.7" />
        <path d="M141.5 21.5 L146.5 26.5 M146.5 21.5 L141.5 26.5" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
        <rect x="156" y="18" width="40" height="5" rx="2" fill="currentColor" opacity="0.25" />
        <rect x="156" y="27" width="28" height="4" rx="1.5" fill="currentColor" opacity="0.15" />
      </g>

      {/* Funnel lines into shield */}
      <path d="M72 40 C 72 58, 106 56, 114 68" stroke="#17CF97" strokeOpacity="0.5" strokeDasharray="4 4" fill="none" />
      <path d="M168 40 C 168 58, 134 56, 126 68" stroke="#ef4444" strokeOpacity="0.4" strokeDasharray="4 4" fill="none" />
      {/* Blocked marker on spam path */}
      <circle cx="152" cy="52" r="8" fill="#ef4444" opacity="0.12" />
      <circle cx="152" cy="52" r="8" stroke="#ef4444" strokeOpacity="0.5" />
      <line x1="146.5" y1="46.5" x2="157.5" y2="57.5" stroke="#ef4444" strokeOpacity="0.7" strokeWidth="1.3" />

      {/* Shield */}
      <ellipse cx="120" cy="102" rx="66" ry="46" fill="url(#spam-glow)" />
      <path
        d="M120 66 L152 78 V102 C152 122 120 136 120 136 C120 136 88 122 88 102 V78 Z"
        fill="#17CF97"
        fillOpacity="0.12"
      />
      <path
        d="M120 66 L152 78 V102 C152 122 120 136 120 136 C120 136 88 122 88 102 V78 Z"
        stroke="#17CF97"
        strokeWidth="1.5"
        strokeOpacity="0.85"
        strokeLinejoin="round"
      />
      <path d="M106 102 L115 111 L134 90" stroke="#17CF97" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Verified output */}
      <path d="M120 136 L120 148" stroke="#17CF97" strokeOpacity="0.5" strokeDasharray="3 3" />
      <rect x="86" y="148" width="68" height="12" rx="6" fill="#17CF97" opacity="0.14" />
      <text x="120" y="157" textAnchor="middle" fill="#17CF97" fontSize="8" fontFamily="system-ui" fontWeight="600">verified only</text>
    </svg>
  );
}
