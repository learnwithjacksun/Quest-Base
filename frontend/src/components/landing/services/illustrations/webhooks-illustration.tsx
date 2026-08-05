export default function WebhooksIllustration() {
  return (
    <svg
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full text-muted"
      aria-hidden="true"
    >
      {/* Event payload source */}
      <rect x="24" y="56" width="72" height="68" rx="8" stroke="#17CF97" strokeWidth="1.3" opacity="0.85" />
      <rect x="36" y="70" width="48" height="6" rx="2" fill="#17CF97" opacity="0.5" />
      <rect x="36" y="84" width="36" height="5" rx="1.5" fill="currentColor" opacity="0.3" />
      <rect x="36" y="96" width="42" height="5" rx="1.5" fill="currentColor" opacity="0.25" />
      <rect x="36" y="108" width="28" height="5" rx="1.5" fill="currentColor" opacity="0.2" />

      {/* Curved connectors */}
      <path
        d="M96 78 C120 70, 128 48, 148 44"
        stroke="currentColor"
        strokeWidth="1.1"
        opacity="0.4"
        fill="none"
      />
      <path
        d="M96 110 C120 118, 128 140, 148 144"
        stroke="#17CF97"
        strokeWidth="1.2"
        opacity="0.75"
        fill="none"
      />
      <path d="M142 40 L150 44 L142 48" stroke="currentColor" strokeWidth="1.1" opacity="0.4" fill="none" />
      <path d="M142 140 L150 144 L142 148" stroke="#17CF97" strokeWidth="1.2" opacity="0.75" fill="none" />

      {/* Downstream app boxes */}
      <rect x="152" y="28" width="36" height="32" rx="6" stroke="currentColor" strokeWidth="1.1" opacity="0.45" />
      <circle cx="170" cy="44" r="6" stroke="currentColor" strokeWidth="1" opacity="0.4" />

      <rect x="152" y="128" width="36" height="32" rx="6" stroke="#17CF97" strokeWidth="1.2" opacity="0.85" />
      <circle cx="170" cy="144" r="6" stroke="#17CF97" strokeWidth="1.1" fill="#17CF97" fillOpacity="0.2" />
    </svg>
  );
}
