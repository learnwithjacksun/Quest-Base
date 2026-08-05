export default function ApiIllustration() {
  return (
    <svg
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full text-muted"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="api-hub-glow" cx="50%" cy="50%" r="50%">
          <stop stopColor="#17CF97" stopOpacity="0.3" />
          <stop offset="1" stopColor="#17CF97" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Connector lines */}
      <line x1="100" y1="90" x2="48" y2="48" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      <line x1="100" y1="90" x2="152" y2="48" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      <line x1="100" y1="90" x2="100" y2="148" stroke="#17CF97" strokeWidth="1.2" opacity="0.7" />

      {/* Endpoint nodes */}
      <rect x="20" y="28" width="56" height="28" rx="6" stroke="currentColor" strokeWidth="1.1" opacity="0.5" />
      <text x="48" y="46" textAnchor="middle" fill="currentColor" fontSize="9" fontFamily="system-ui" opacity="0.6">POST</text>

      <rect x="124" y="28" width="56" height="28" rx="6" stroke="currentColor" strokeWidth="1.1" opacity="0.5" />
      <text x="152" y="46" textAnchor="middle" fill="currentColor" fontSize="9" fontFamily="system-ui" opacity="0.6">GET</text>

      <rect x="72" y="140" width="56" height="28" rx="6" stroke="#17CF97" strokeWidth="1.2" opacity="0.9" />
      <text x="100" y="158" textAnchor="middle" fill="#17CF97" fontSize="9" fontFamily="system-ui" fontWeight="600">OTP</text>

      {/* Central hub */}
      <circle cx="100" cy="90" r="28" fill="url(#api-hub-glow)" />
      <circle cx="100" cy="90" r="20" stroke="#17CF97" strokeWidth="1.4" fill="none" opacity="0.9" />
      <circle cx="100" cy="90" r="8" fill="#17CF97" opacity="0.85" />
      <text x="100" y="94" textAnchor="middle" fill="#fff" fontSize="7" fontFamily="system-ui" fontWeight="600">API</text>
    </svg>
  );
}
