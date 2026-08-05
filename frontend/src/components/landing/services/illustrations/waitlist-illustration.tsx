export default function WaitlistIllustration() {
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
        <pattern id="wl-dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="currentColor" opacity="0.1" />
        </pattern>
        <linearGradient id="wl-bar" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#17CF97" />
          <stop offset="1" stopColor="#17CF97" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="240" height="160" fill="url(#wl-dots)" />

      {/* Progress header */}
      <text x="24" y="22" fill="currentColor" opacity="0.5" fontSize="9" fontFamily="system-ui">Waitlist</text>
      <text x="216" y="22" textAnchor="end" fill="#17CF97" fontSize="9" fontFamily="ui-monospace, monospace" fontWeight="700">1,284 joined</text>
      <rect x="24" y="28" width="192" height="6" rx="3" fill="currentColor" opacity="0.1" />
      <rect x="24" y="28" width="128" height="6" rx="3" fill="url(#wl-bar)" />

      {/* Queue rows */}
      {[
        { y: 46, num: "#0141", w: 52, faded: true },
        { y: 78, num: "#0142", w: 66, faded: true },
      ].map((row) => (
        <g key={row.num} opacity="0.55">
          <rect x="24" y={row.y} width="192" height="26" rx="7" fill="currentColor" opacity="0.06" />
          <rect x="24.5" y={row.y + 0.5} width="191" height="25" rx="6.5" stroke="currentColor" strokeOpacity="0.2" />
          <circle cx="42" cy={row.y + 13} r="7" fill="currentColor" opacity="0.15" />
          <circle cx="42.5" cy={row.y + 13} r="7" stroke="currentColor" strokeOpacity="0.25" />
          <rect x="56" y={row.y + 9} width={row.w} height="7" rx="2" fill="currentColor" opacity="0.22" />
          <text x="208" y={row.y + 17} textAnchor="end" fill="currentColor" opacity="0.45" fontSize="9" fontFamily="ui-monospace, monospace">
            {row.num}
          </text>
        </g>
      ))}

      {/* Highlighted new signup */}
      <g>
        <rect x="24" y="110" width="192" height="30" rx="8" fill="#17CF97" opacity="0.1" />
        <rect x="24.5" y="110.5" width="191" height="29" rx="7.5" stroke="#17CF97" strokeOpacity="0.7" strokeWidth="1.2" />
        <circle cx="43" cy="125" r="8" fill="#17CF97" opacity="0.25" />
        <circle cx="43" cy="125" r="8" stroke="#17CF97" strokeOpacity="0.7" />
        <text x="43" y="128.5" textAnchor="middle" fill="#17CF97" fontSize="8" fontFamily="system-ui" fontWeight="700">AB</text>
        <rect x="58" y="121" width="74" height="8" rx="2" fill="#17CF97" opacity="0.35" />
        <text x="208" y="129.5" textAnchor="end" fill="#17CF97" fontSize="9" fontFamily="ui-monospace, monospace" fontWeight="700">#0143</text>
      </g>

      {/* +1 chip */}
      <rect x="182" y="98" width="34" height="18" rx="9" fill="#17CF97" />
      <text x="199" y="110.5" textAnchor="middle" fill="#fff" fontSize="10" fontFamily="system-ui" fontWeight="700">+1</text>
    </svg>
  );
}
