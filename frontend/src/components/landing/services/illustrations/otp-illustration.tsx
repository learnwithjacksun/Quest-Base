export default function OtpIllustration() {
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
        <pattern id="otp-dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="currentColor" opacity="0.1" />
        </pattern>
        <radialGradient id="otp-glow" cx="50%" cy="45%" r="55%">
          <stop stopColor="#17CF97" stopOpacity="0.22" />
          <stop offset="1" stopColor="#17CF97" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="240" height="160" fill="url(#otp-dots)" />
      <ellipse cx="120" cy="80" rx="100" ry="66" fill="url(#otp-glow)" />

      {/* Phone */}
      <rect x="76" y="10" width="88" height="150" rx="14" fill="currentColor" opacity="0.05" />
      <rect x="76.5" y="10.5" width="87" height="149" rx="13.5" stroke="currentColor" strokeOpacity="0.3" />
      <rect x="106" y="18" width="28" height="5" rx="2.5" fill="currentColor" opacity="0.25" />

      {/* Message bubble with code */}
      <rect x="86" y="34" width="68" height="24" rx="7" fill="currentColor" opacity="0.08" />
      <rect x="86.5" y="34.5" width="67" height="23" rx="6.5" stroke="currentColor" strokeOpacity="0.2" />
      <rect x="93" y="41" width="26" height="5" rx="2" fill="currentColor" opacity="0.25" />
      <text x="147" y="50" textAnchor="end" fill="#17CF97" fontSize="9" fontFamily="ui-monospace, monospace" fontWeight="700">
        482913
      </text>

      {/* OTP boxes */}
      <g fontFamily="ui-monospace, monospace" fontSize="13" fontWeight="700">
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect
              x={87 + i * 23}
              y={70}
              width="19"
              height="26"
              rx="5"
              fill="#17CF97"
              opacity="0.1"
            />
            <rect
              x={87.5 + i * 23}
              y={70.5}
              width="18"
              height="25"
              rx="4.5"
              stroke="#17CF97"
              strokeOpacity="0.7"
            />
            <text x={96.5 + i * 23} y={88} textAnchor="middle" fill="#17CF97">
              {["4", "8", "2"][i]}
            </text>
          </g>
        ))}
        {/* Active box with caret */}
        <rect x="87.5" y="104.5" width="18" height="25" rx="4.5" stroke="#17CF97" strokeWidth="1.4" />
        <line x1="96.5" y1="111" x2="96.5" y2="123" stroke="#17CF97" strokeWidth="1.4" />
        <rect x="110.5" y="104.5" width="18" height="25" rx="4.5" stroke="currentColor" strokeOpacity="0.3" />
        <rect x="133.5" y="104.5" width="18" height="25" rx="4.5" stroke="currentColor" strokeOpacity="0.3" />
      </g>

      {/* Email channel chip */}
      <rect x="12" y="52" width="52" height="20" rx="10" fill="#17CF97" opacity="0.12" />
      <rect x="12.5" y="52.5" width="51" height="19" rx="9.5" stroke="#17CF97" strokeOpacity="0.5" />
      <text x="38" y="65.5" textAnchor="middle" fill="#17CF97" fontSize="9" fontFamily="system-ui" fontWeight="600">Email</text>
      <path d="M64 62 C 72 62, 72 62, 76 62" stroke="#17CF97" strokeOpacity="0.5" strokeDasharray="3 3" />

      {/* SMS channel chip */}
      <rect x="176" y="92" width="52" height="20" rx="10" fill="currentColor" opacity="0.07" />
      <rect x="176.5" y="92.5" width="51" height="19" rx="9.5" stroke="currentColor" strokeOpacity="0.3" />
      <text x="202" y="105.5" textAnchor="middle" fill="currentColor" opacity="0.6" fontSize="9" fontFamily="system-ui" fontWeight="600">SMS</text>
      <path d="M164 102 C 172 102, 172 102, 176 102" stroke="currentColor" strokeOpacity="0.3" strokeDasharray="3 3" />

      {/* Verified check */}
      <circle cx="164" cy="30" r="13" fill="#17CF97" opacity="0.15" />
      <circle cx="164" cy="30" r="13" stroke="#17CF97" strokeOpacity="0.7" />
      <path d="M158 30 L162 34 L170 26" stroke="#17CF97" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
