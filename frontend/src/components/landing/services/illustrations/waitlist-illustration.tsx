export default function WaitlistIllustration() {
  return (
    <svg
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full text-muted"
      aria-hidden="true"
    >
      {/* Queue rows */}
      {[
        { y: 36, num: "#142", opacity: 0.35 },
        { y: 72, num: "#143", opacity: 0.55 },
        { y: 108, num: "#144", opacity: 0.9, accent: true },
      ].map((row) => (
        <g key={row.num} opacity={row.opacity}>
          <rect
            x="28"
            y={row.y}
            width="144"
            height="28"
            rx="6"
            stroke={row.accent ? "#17CF97" : "currentColor"}
            strokeWidth="1.2"
          />
          <circle
            cx="48"
            cy={row.y + 14}
            r="8"
            stroke={row.accent ? "#17CF97" : "currentColor"}
            strokeWidth="1.1"
            fill={row.accent ? "#17CF97" : "none"}
            fillOpacity={row.accent ? 0.2 : 0}
          />
          <text
            x="66"
            y={row.y + 18}
            fill={row.accent ? "#17CF97" : "currentColor"}
            fontSize="10"
            fontFamily="system-ui"
            fontWeight="500"
          >
            {row.num}
          </text>
          <rect
            x="118"
            y={row.y + 10}
            width="40"
            height="8"
            rx="2"
            fill="currentColor"
            opacity="0.25"
          />
        </g>
      ))}

      {/* Add signup indicator */}
      <circle cx="100" cy="158" r="12" stroke="#17CF97" strokeWidth="1.3" strokeDasharray="3 2" opacity="0.85" />
      <path d="M100 152 V164 M94 158 H106" stroke="#17CF97" strokeWidth="1.4" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}
