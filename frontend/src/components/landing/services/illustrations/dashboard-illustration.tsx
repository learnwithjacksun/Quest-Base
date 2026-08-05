export default function DashboardIllustration() {
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
        <pattern id="dash-dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="currentColor" opacity="0.1" />
        </pattern>
        <linearGradient id="dash-area" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#17CF97" stopOpacity="0.35" />
          <stop offset="1" stopColor="#17CF97" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="240" height="160" fill="url(#dash-dots)" />

      {/* Panel */}
      <rect x="20" y="10" width="200" height="140" rx="10" fill="currentColor" opacity="0.05" />
      <rect x="20.5" y="10.5" width="199" height="139" rx="9.5" stroke="currentColor" strokeOpacity="0.25" />

      {/* Stat cards */}
      <g>
        <rect x="32" y="22" width="56" height="30" rx="6" fill="currentColor" opacity="0.06" />
        <rect x="32.5" y="22.5" width="55" height="29" rx="5.5" stroke="currentColor" strokeOpacity="0.2" />
        <rect x="39" y="28" width="26" height="4" rx="1.5" fill="currentColor" opacity="0.25" />
        <text x="39" y="46" fill="currentColor" opacity="0.75" fontSize="11" fontFamily="ui-monospace, monospace" fontWeight="700">4.2k</text>

        <rect x="94" y="22" width="56" height="30" rx="6" fill="#17CF97" opacity="0.1" />
        <rect x="94.5" y="22.5" width="55" height="29" rx="5.5" stroke="#17CF97" strokeOpacity="0.55" />
        <rect x="101" y="28" width="26" height="4" rx="1.5" fill="#17CF97" opacity="0.4" />
        <text x="101" y="46" fill="#17CF97" fontSize="11" fontFamily="ui-monospace, monospace" fontWeight="700">98.2%</text>

        <rect x="156" y="22" width="52" height="30" rx="6" fill="currentColor" opacity="0.06" />
        <rect x="156.5" y="22.5" width="51" height="29" rx="5.5" stroke="currentColor" strokeOpacity="0.2" />
        <rect x="163" y="28" width="22" height="4" rx="1.5" fill="currentColor" opacity="0.25" />
        <text x="163" y="46" fill="currentColor" opacity="0.75" fontSize="11" fontFamily="ui-monospace, monospace" fontWeight="700">312</text>
      </g>

      {/* Area chart */}
      <g>
        {/* Grid lines */}
        <line x1="32" y1="76" x2="208" y2="76" stroke="currentColor" strokeOpacity="0.1" />
        <line x1="32" y1="96" x2="208" y2="96" stroke="currentColor" strokeOpacity="0.1" />
        <line x1="32" y1="116" x2="208" y2="116" stroke="currentColor" strokeOpacity="0.1" />

        <path
          d="M32 118 C 52 112, 62 100, 80 102 C 98 104, 106 84, 124 82 C 142 80, 150 92, 166 84 C 182 76, 192 68, 208 64 V 136 H 32 Z"
          fill="url(#dash-area)"
        />
        <path
          d="M32 118 C 52 112, 62 100, 80 102 C 98 104, 106 84, 124 82 C 142 80, 150 92, 166 84 C 182 76, 192 68, 208 64"
          stroke="#17CF97"
          strokeWidth="1.6"
          strokeOpacity="0.9"
          fill="none"
          strokeLinecap="round"
        />
        {/* Highlight point */}
        <circle cx="166" cy="84" r="4" fill="#17CF97" opacity="0.25" />
        <circle cx="166" cy="84" r="2.5" fill="#17CF97" />
        {/* Tooltip */}
        <rect x="146" y="60" width="40" height="15" rx="4" fill="#17CF97" opacity="0.15" />
        <text x="166" y="70.5" textAnchor="middle" fill="#17CF97" fontSize="8" fontFamily="ui-monospace, monospace" fontWeight="700">+128</text>
      </g>

      {/* X-axis labels */}
      <g fill="currentColor" opacity="0.35" fontSize="7" fontFamily="system-ui">
        <text x="34" y="146">Mon</text>
        <text x="90" y="146">Wed</text>
        <text x="148" y="146">Fri</text>
        <text x="196" y="146">Sun</text>
      </g>
    </svg>
  );
}
