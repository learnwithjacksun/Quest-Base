export default function WebhooksIllustration() {
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
        <pattern id="wh-dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="currentColor" opacity="0.1" />
        </pattern>
        <radialGradient id="wh-glow" cx="50%" cy="50%" r="50%">
          <stop stopColor="#17CF97" stopOpacity="0.3" />
          <stop offset="1" stopColor="#17CF97" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="240" height="160" fill="url(#wh-dots)" />

      {/* Source event node */}
      <ellipse cx="52" cy="80" rx="46" ry="40" fill="url(#wh-glow)" />
      <circle cx="52" cy="80" r="24" fill="#17CF97" opacity="0.12" />
      <circle cx="52" cy="80" r="24" stroke="#17CF97" strokeOpacity="0.8" strokeWidth="1.4" />
      <circle cx="52" cy="80" r="15" stroke="#17CF97" strokeOpacity="0.35" strokeDasharray="3 3" />
      {/* Lightning bolt */}
      <path d="M55 68 L46 82 H52 L49 92 L60 78 H53 Z" fill="#17CF97" opacity="0.9" />

      {/* Event label */}
      <rect x="24" y="116" width="76" height="14" rx="7" fill="#17CF97" opacity="0.12" />
      <text x="62" y="126" textAnchor="middle" fill="#17CF97" fontSize="8" fontFamily="ui-monospace, monospace" fontWeight="600">
        otp.verified
      </text>

      {/* Circuit paths */}
      <path d="M76 70 H 118 C 130 70, 130 42, 142 42 H 162" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.2" fill="none" />
      <path d="M76 90 H 118 C 130 90, 130 118, 142 118 H 162" stroke="#17CF97" strokeOpacity="0.7" strokeWidth="1.3" fill="none" />
      {/* Signal pulses */}
      <circle cx="108" cy="70" r="2.5" fill="currentColor" opacity="0.4" />
      <circle cx="126" cy="104" r="3" fill="#17CF97" opacity="0.9" />
      <circle cx="150" cy="118" r="2" fill="#17CF97" opacity="0.5" />

      {/* Endpoint: app A */}
      <rect x="162" y="24" width="58" height="36" rx="8" fill="currentColor" opacity="0.06" />
      <rect x="162.5" y="24.5" width="57" height="35" rx="7.5" stroke="currentColor" strokeOpacity="0.3" />
      <circle cx="176" cy="42" r="5" stroke="currentColor" strokeOpacity="0.4" />
      <rect x="187" y="34" width="24" height="5" rx="2" fill="currentColor" opacity="0.25" />
      <rect x="187" y="44" width="18" height="4" rx="1.5" fill="currentColor" opacity="0.15" />

      {/* Endpoint: app B (active) */}
      <rect x="162" y="100" width="58" height="36" rx="8" fill="#17CF97" opacity="0.1" />
      <rect x="162.5" y="100.5" width="57" height="35" rx="7.5" stroke="#17CF97" strokeOpacity="0.75" strokeWidth="1.2" />
      <circle cx="176" cy="118" r="5" fill="#17CF97" opacity="0.3" />
      <circle cx="176" cy="118" r="5" stroke="#17CF97" strokeOpacity="0.7" />
      <rect x="187" y="110" width="24" height="5" rx="2" fill="#17CF97" opacity="0.4" />
      <rect x="187" y="120" width="18" height="4" rx="1.5" fill="#17CF97" opacity="0.25" />
      {/* Delivery check */}
      <circle cx="220" cy="100" r="9" fill="#17CF97" />
      <path d="M216 100 L219 103 L224.5 96.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
