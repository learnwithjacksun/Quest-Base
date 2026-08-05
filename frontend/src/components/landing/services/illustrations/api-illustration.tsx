export default function ApiIllustration() {
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
        <pattern id="api-dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="currentColor" opacity="0.1" />
        </pattern>
      </defs>

      <rect x="0" y="0" width="240" height="160" fill="url(#api-dots)" />

      {/* Code editor window */}
      <rect x="20" y="12" width="200" height="136" rx="10" fill="currentColor" opacity="0.05" />
      <rect x="20.5" y="12.5" width="199" height="135" rx="9.5" stroke="currentColor" strokeOpacity="0.25" />

      {/* Title bar */}
      <circle cx="36" cy="26" r="3" fill="currentColor" opacity="0.25" />
      <circle cx="47" cy="26" r="3" fill="currentColor" opacity="0.18" />
      <circle cx="58" cy="26" r="3" fill="currentColor" opacity="0.12" />
      <rect x="150" y="20" width="58" height="13" rx="6.5" fill="#17CF97" opacity="0.12" />
      <text x="179" y="29.5" textAnchor="middle" fill="#17CF97" fontSize="8" fontFamily="ui-monospace, monospace" fontWeight="600">
        questbase.ts
      </text>
      <line x1="20" y1="38" x2="220" y2="38" stroke="currentColor" strokeOpacity="0.18" />

      {/* Code lines */}
      <g fontFamily="ui-monospace, monospace" fontSize="9.5">
        <text x="34" y="56" fill="currentColor" opacity="0.4">1</text>
        <text x="48" y="56" fill="#c084fc" opacity="0.9">const</text>
        <text x="80" y="56" fill="currentColor" opacity="0.8">qb =</text>
        <text x="106" y="56" fill="#17CF97">questbase</text>
        <text x="160" y="56" fill="currentColor" opacity="0.8">(key)</text>

        <text x="34" y="74" fill="currentColor" opacity="0.4">2</text>

        <text x="34" y="92" fill="currentColor" opacity="0.4">3</text>
        <text x="48" y="92" fill="#c084fc" opacity="0.9">await</text>
        <text x="80" y="92" fill="currentColor" opacity="0.8">qb.</text>
        <text x="97" y="92" fill="#17CF97">otp</text>
        <text x="115" y="92" fill="currentColor" opacity="0.8">.send(email)</text>

        <text x="34" y="110" fill="currentColor" opacity="0.4">4</text>
        <text x="48" y="110" fill="#c084fc" opacity="0.9">await</text>
        <text x="80" y="110" fill="currentColor" opacity="0.8">qb.</text>
        <text x="97" y="110" fill="#17CF97">waitlist</text>
        <text x="142" y="110" fill="currentColor" opacity="0.8">.add(user)</text>

        <text x="34" y="128" fill="currentColor" opacity="0.4">5</text>
        <text x="48" y="128" fill="#c084fc" opacity="0.9">await</text>
        <text x="80" y="128" fill="currentColor" opacity="0.8">qb.</text>
        <text x="97" y="128" fill="#17CF97">forms</text>
        <text x="126" y="128" fill="currentColor" opacity="0.8">.submit(data)</text>
      </g>

      {/* Status chip */}
      <rect x="152" y="132" width="56" height="12" rx="6" fill="#17CF97" opacity="0.14" />
      <circle cx="161" cy="138" r="2.5" fill="#17CF97" />
      <text x="168" y="141" fill="#17CF97" fontSize="7.5" fontFamily="ui-monospace, monospace" fontWeight="600">200 OK</text>
    </svg>
  );
}
