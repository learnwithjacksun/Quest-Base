export default function DashboardIllustration() {
  return (
    <svg
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full text-muted"
      aria-hidden="true"
    >
      {/* Chart bars */}
      <rect x="28" y="100" width="14" height="40" rx="2" fill="currentColor" opacity="0.25" />
      <rect x="48" y="78" width="14" height="62" rx="2" fill="currentColor" opacity="0.35" />
      <rect x="68" y="56" width="14" height="84" rx="2" fill="#17CF97" opacity="0.75" />
      <rect x="88" y="68" width="14" height="72" rx="2" fill="currentColor" opacity="0.4" />
      <rect x="108" y="44" width="14" height="96" rx="2" fill="#17CF97" opacity="0.9" />

      {/* Baseline */}
      <line x1="24" y1="142" x2="130" y2="142" stroke="currentColor" strokeWidth="1" opacity="0.3" />

      {/* Activity list */}
      <rect x="136" y="36" width="48" height="10" rx="2" fill="currentColor" opacity="0.2" />
      <rect x="136" y="54" width="40" height="8" rx="2" fill="currentColor" opacity="0.15" />
      <rect x="136" y="70" width="44" height="8" rx="2" fill="currentColor" opacity="0.12" />
      <rect x="136" y="86" width="36" height="8" rx="2" fill="currentColor" opacity="0.1" />
      <rect x="136" y="102" width="42" height="8" rx="2" fill="currentColor" opacity="0.08" />

      {/* Accent indicator */}
      <circle cx="148" cy="128" r="4" fill="#17CF97" opacity="0.9" />
      <rect x="158" y="124" width="26" height="8" rx="2" fill="#17CF97" opacity="0.4" />
    </svg>
  );
}
