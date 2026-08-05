export default function OtpIllustration() {
  return (
    <svg
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full text-muted"
      aria-hidden="true"
    >
      {/* Phone body */}
      <rect x="48" y="24" width="72" height="132" rx="10" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      <rect x="74" y="32" width="20" height="4" rx="2" fill="currentColor" opacity="0.3" />

      {/* Channel pills */}
      <rect x="58" y="48" width="28" height="12" rx="6" fill="#17CF97" opacity="0.9" />
      <text x="72" y="57" textAnchor="middle" fill="#fff" fontSize="6" fontFamily="system-ui">Email</text>
      <rect x="90" y="48" width="24" height="12" rx="6" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <text x="102" y="57" textAnchor="middle" fill="currentColor" fontSize="6" fontFamily="system-ui" opacity="0.5">SMS</text>

      {/* OTP digit boxes */}
      <rect x="56" y="80" width="22" height="28" rx="4" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      <circle cx="67" cy="94" r="2.5" fill="currentColor" opacity="0.35" />
      <rect x="82" y="80" width="22" height="28" rx="4" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      <circle cx="93" cy="94" r="2.5" fill="currentColor" opacity="0.35" />
      <rect x="56" y="116" width="22" height="28" rx="4" stroke="#17CF97" strokeWidth="1.2" opacity="0.9" />
      <text x="67" y="135" textAnchor="middle" fill="#17CF97" fontSize="12" fontFamily="system-ui" fontWeight="600">4</text>
      <rect x="82" y="116" width="22" height="28" rx="4" stroke="#17CF97" strokeWidth="1.2" opacity="0.9" />
      <text x="93" y="135" textAnchor="middle" fill="#17CF97" fontSize="12" fontFamily="system-ui" fontWeight="600">7</text>

      {/* Config gear */}
      <circle cx="152" cy="88" r="22" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
      <circle cx="152" cy="88" r="8" stroke="#17CF97" strokeWidth="1.3" opacity="0.9" />
      <path
        d="M152 66 V72 M152 104 V110 M130 88 H136 M168 88 H174 M136 72 L140 76 M164 100 L168 104 M164 72 L168 76 M136 104 L140 100"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.45"
        strokeLinecap="round"
      />
    </svg>
  );
}
