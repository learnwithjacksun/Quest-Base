export default function Form2MailIllustration() {
  return (
    <svg
      viewBox="0 0 560 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full text-muted"
      aria-hidden="true"
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <pattern id="f2m-dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="currentColor" opacity="0.1" />
        </pattern>
        <radialGradient id="f2m-glow" cx="50%" cy="50%" r="50%">
          <stop stopColor="#17CF97" stopOpacity="0.28" />
          <stop offset="1" stopColor="#17CF97" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="f2m-btn" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#17CF97" />
          <stop offset="1" stopColor="#0FA97A" />
        </linearGradient>
        <linearGradient id="f2m-flow" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#17CF97" stopOpacity="0.15" />
          <stop offset="0.5" stopColor="#17CF97" stopOpacity="0.9" />
          <stop offset="1" stopColor="#17CF97" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="560" height="160" fill="url(#f2m-dots)" />

      {/* Browser window with form */}
      <g>
        <rect x="28" y="14" width="180" height="140" rx="10" fill="currentColor" opacity="0.05" />
        <rect x="28.5" y="14.5" width="179" height="139" rx="9.5" stroke="currentColor" strokeOpacity="0.25" />
        {/* Browser chrome */}
        <circle cx="44" cy="28" r="3" fill="currentColor" opacity="0.25" />
        <circle cx="55" cy="28" r="3" fill="currentColor" opacity="0.18" />
        <circle cx="66" cy="28" r="3" fill="currentColor" opacity="0.12" />
        <line x1="28" y1="40" x2="208" y2="40" stroke="currentColor" strokeOpacity="0.18" />
        {/* Form fields */}
        <rect x="44" y="52" width="52" height="7" rx="2" fill="currentColor" opacity="0.3" />
        <rect x="44" y="65" width="148" height="20" rx="5" fill="currentColor" opacity="0.07" />
        <rect x="44.5" y="65.5" width="147" height="19" rx="4.5" stroke="currentColor" strokeOpacity="0.25" />
        <rect x="52" y="72" width="60" height="6" rx="2" fill="currentColor" opacity="0.2" />
        <rect x="44" y="93" width="148" height="20" rx="5" fill="currentColor" opacity="0.07" />
        <rect x="44.5" y="93.5" width="147" height="19" rx="4.5" stroke="currentColor" strokeOpacity="0.25" />
        <rect x="52" y="100" width="80" height="6" rx="2" fill="currentColor" opacity="0.2" />
        {/* Submit button */}
        <rect x="44" y="122" width="70" height="20" rx="5" fill="url(#f2m-btn)" />
        <rect x="56" y="129" width="46" height="6" rx="2" fill="#fff" opacity="0.85" />
      </g>

      {/* Flow path */}
      <path
        d="M212 84 C 260 84, 268 52, 316 52 C 344 52, 348 84, 376 84"
        stroke="url(#f2m-flow)"
        strokeWidth="1.5"
        strokeDasharray="6 5"
        fill="none"
      />
      {/* Packets travelling */}
      <circle cx="262" cy="66" r="3.5" fill="#17CF97" opacity="0.9" />
      <circle cx="316" cy="52" r="2.5" fill="#17CF97" opacity="0.55" />
      <circle cx="354" cy="70" r="2" fill="#17CF97" opacity="0.35" />
      {/* POST chip on the wire */}
      <rect x="286" y="20" width="60" height="18" rx="9" fill="#17CF97" opacity="0.12" />
      <rect x="286.5" y="20.5" width="59" height="17" rx="8.5" stroke="#17CF97" strokeOpacity="0.5" />
      <text x="316" y="32.5" textAnchor="middle" fill="#17CF97" fontSize="9" fontFamily="ui-monospace, monospace" fontWeight="600">
        POST /form
      </text>

      {/* Envelope with glow */}
      <ellipse cx="452" cy="88" rx="82" ry="58" fill="url(#f2m-glow)" />
      <g>
        <rect x="396" y="52" width="112" height="76" rx="10" fill="#17CF97" opacity="0.08" />
        <rect x="396.5" y="52.5" width="111" height="75" rx="9.5" stroke="#17CF97" strokeOpacity="0.75" strokeWidth="1.4" />
        <path d="M400 58 L452 96 L504 58" stroke="#17CF97" strokeWidth="1.4" strokeOpacity="0.75" fill="none" strokeLinejoin="round" />
        <path d="M406 122 L436 98" stroke="#17CF97" strokeWidth="1.1" strokeOpacity="0.4" />
        <path d="M498 122 L468 98" stroke="#17CF97" strokeWidth="1.1" strokeOpacity="0.4" />
      </g>
      {/* Notification badge */}
      <circle cx="506" cy="54" r="11" fill="#17CF97" />
      <text x="506" y="58" textAnchor="middle" fill="#fff" fontSize="11" fontFamily="system-ui" fontWeight="700">1</text>
    </svg>
  );
}
