export default function Form2MailIllustration() {
  return (
    <svg
      viewBox="0 0 320 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full text-muted"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="f2m-glow" x1="220" y1="60" x2="300" y2="140" gradientUnits="userSpaceOnUse">
          <stop stopColor="#17CF97" stopOpacity="0.35" />
          <stop offset="1" stopColor="#17CF97" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Form panel */}
      <rect x="24" y="28" width="140" height="124" rx="8" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      <rect x="40" y="48" width="72" height="8" rx="2" fill="currentColor" opacity="0.35" />
      <rect x="40" y="68" width="108" height="18" rx="4" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <rect x="40" y="98" width="108" height="18" rx="4" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <rect x="40" y="128" width="64" height="14" rx="3" fill="#17CF97" opacity="0.85" />

      {/* Dashed flow arrow */}
      <path
        d="M176 90 H210"
        stroke="#17CF97"
        strokeWidth="1.2"
        strokeDasharray="4 3"
        opacity="0.8"
      />
      <path d="M206 84 L216 90 L206 96" stroke="#17CF97" strokeWidth="1.2" fill="none" opacity="0.8" />

      {/* Envelope glow */}
      <ellipse cx="260" cy="100" rx="48" ry="36" fill="url(#f2m-glow)" />

      {/* Envelope */}
      <rect x="228" y="72" width="64" height="44" rx="4" stroke="#17CF97" strokeWidth="1.4" opacity="0.9" />
      <path d="M228 76 L260 98 L292 76" stroke="#17CF97" strokeWidth="1.4" opacity="0.9" />
      <path d="M236 108 L252 96" stroke="#17CF97" strokeWidth="1" opacity="0.5" />
      <path d="M284 108 L268 96" stroke="#17CF97" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}
