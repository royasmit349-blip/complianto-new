/* One drawn family: 1.5–2px strokes, rounded caps/joins, no fills except
   --color-accent-wash. Every strokeable path carries data-draw so DrawSVG
   can reveal it. Colour comes from currentColor + tokens only. */

type ArtProps = { className?: string };

const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function CertificateCard({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 320 400" className={className} role="img" aria-label="Certificate of incorporation illustration">
      {/* sheet */}
      <rect x="42" y="18" width="236" height="352" rx="10" {...S} fill="var(--color-paper)" />
      <rect x="54" y="30" width="212" height="328" rx="6" {...S} opacity=".35" strokeWidth="1.2" />
      {/* heading rule */}
      <path d="M86 74 H186" {...S} strokeWidth="3" data-draw />
      {/* text rules */}
      <path d="M86 108 H234" {...S} strokeWidth="1.6" opacity=".55" data-draw />
      <path d="M86 132 H214" {...S} strokeWidth="1.6" opacity=".55" data-draw />
      <path d="M86 156 H226" {...S} strokeWidth="1.6" opacity=".55" data-draw />
      <path d="M86 180 H178" {...S} strokeWidth="1.6" opacity=".55" data-draw />
      {/* seal */}
      <circle cx="118" cy="292" r="30" stroke="var(--color-accent)" strokeWidth="2.5" fill="none" data-draw />
      <circle cx="118" cy="292" r="22" stroke="var(--color-accent)" strokeWidth="1.2" fill="none" strokeDasharray="3 6" opacity=".65" />
      <path d="M105 292 L114 301 L132 282" stroke="var(--color-accent)" strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round" data-draw />
      {/* signature */}
      <path d="M176 292 c8 -14, 16 12, 26 2 c8 -8, 14 8, 26 -2" {...S} strokeWidth="1.8" data-draw />
      <path d="M176 312 H236" {...S} strokeWidth="1.4" opacity=".5" data-draw />
      {/* corner marks */}
      <path d="M62 50 h10 M62 50 v10" stroke="var(--color-accent)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M258 338 h-10 M258 338 v-10" stroke="var(--color-accent)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function LedgerStack({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 320 400" className={className} role="img" aria-label="Ledger books illustration">
      <rect x="70" y="42" width="216" height="322" rx="8" {...S} fill="var(--color-elevated)" opacity=".5" />
      <rect x="56" y="30" width="216" height="322" rx="8" {...S} fill="var(--color-elevated)" opacity=".75" />
      <rect x="42" y="18" width="216" height="322" rx="8" {...S} fill="var(--color-paper)" />
      {/* column rules */}
      <path d="M150 18 V340" {...S} strokeWidth="1.3" opacity=".5" data-draw />
      <path d="M204 18 V340" {...S} strokeWidth="1.3" opacity=".5" data-draw />
      {/* heading */}
      <path d="M62 52 H120" {...S} strokeWidth="2.6" data-draw />
      {/* rows */}
      {[92, 128, 164, 200, 236, 272].map((y) => (
        <path key={y} d={`M62 ${y} H130`} {...S} strokeWidth="1.4" opacity=".5" data-draw />
      ))}
      {[92, 128, 164, 200, 236, 272].map((y) => (
        <path key={`n${y}`} d={`M162 ${y} H192`} {...S} strokeWidth="1.4" opacity=".5" data-draw />
      ))}
      {/* tick marks */}
      {[92, 128, 164, 200, 236, 272].map((y) => (
        <path
          key={`t${y}`}
          d={`M222 ${y - 4} l6 6 l12 -13`}
          stroke="var(--color-accent)"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          data-draw
        />
      ))}
      {/* total rule */}
      <path d="M62 308 H238" {...S} strokeWidth="2.2" data-draw />
      <rect x="158" y="296" width="84" height="26" rx="4" fill="var(--color-accent-wash)" stroke="none" />
    </svg>
  );
}

export function GrowthChart({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 320 360" className={className} role="img" aria-label="Growth chart illustration">
      {/* grid hints */}
      <path d="M60 120 H280" stroke="currentColor" strokeWidth="1" opacity=".15" strokeDasharray="2 6" fill="none" />
      <path d="M60 190 H280" stroke="currentColor" strokeWidth="1" opacity=".15" strokeDasharray="2 6" fill="none" />
      <path d="M60 250 H280" stroke="currentColor" strokeWidth="1" opacity=".15" strokeDasharray="2 6" fill="none" />
      {/* axis */}
      <path d="M60 40 V310 H288" {...S} data-draw />
      {/* rising step line */}
      <path
        d="M60 286 L112 286 L112 236 L162 236 L162 176 L212 176 L212 108 L264 108"
        stroke="var(--color-accent)"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        data-draw
      />
      {/* nodes */}
      {[
        [112, 236],
        [162, 176],
        [212, 108],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="5.5" fill="var(--color-paper)" stroke="var(--color-accent)" strokeWidth="2.4" />
      ))}
      {/* arrowhead */}
      <path d="M252 94 L266 108 L252 122" stroke="var(--color-accent)" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" data-draw />
      {/* baseline flag */}
      <path d="M84 286 v14" {...S} strokeWidth="1.4" opacity=".5" />
    </svg>
  );
}

export function SealStamp({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 140 140" className={className} role="img" aria-label="Compliance seal stamp">
      <circle cx="70" cy="70" r="56" stroke="var(--color-accent)" strokeWidth="4" fill="none" strokeLinecap="round" data-draw />
      <circle cx="70" cy="70" r="44" stroke="var(--color-accent)" strokeWidth="1.6" fill="none" strokeDasharray="4 8" opacity=".7" />
      <path
        d="M46 71 L63 88 L96 50"
        stroke="var(--color-accent)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        data-draw
      />
    </svg>
  );
}

export function CalendarGrid({ className }: ArtProps) {
  const cols = [60, 100, 140, 180, 220, 260];
  const rows = [112, 148, 184, 220];
  return (
    <svg viewBox="0 0 320 292" className={className} role="img" aria-label="Compliance calendar illustration">
      <rect x="20" y="28" width="280" height="244" rx="10" fill="var(--color-ink)" stroke="var(--color-line-dark)" strokeWidth="2" />
      <path d="M20 76 H300" stroke="var(--color-line-dark)" strokeWidth="2" fill="none" data-draw />
      <path d="M84 14 V42" stroke="var(--color-accent-soft)" strokeWidth="3" strokeLinecap="round" fill="none" data-draw />
      <path d="M236 14 V42" stroke="var(--color-accent-soft)" strokeWidth="3" strokeLinecap="round" fill="none" data-draw />
      <path d="M40 52 H110" stroke="var(--color-paper)" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".85" data-draw />
      {cols.slice(1, -1).map((x) => (
        <path key={x} d={`M${x} 76 V272`} stroke="var(--color-line-dark)" strokeWidth="1" opacity=".7" fill="none" />
      ))}
      {rows.map((y) => (
        <path key={y} d={`M20 ${y} H300`} stroke="var(--color-line-dark)" strokeWidth="1" opacity=".7" fill="none" />
      ))}
      {/* highlighted due-date cells */}
      <rect x="104" y="116" width="32" height="28" rx="5" fill="var(--color-accent)" opacity=".28" />
      <rect x="184" y="152" width="32" height="28" rx="5" fill="var(--color-accent)" opacity=".28" />
      <rect x="144" y="224" width="32" height="28" rx="5" fill="var(--color-accent)" opacity=".28" />
      {/* checked-off day */}
      <path d="M62 194 l7 7 l13 -14" stroke="var(--color-success-soft)" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" data-draw />
      <path d="M110 130 l0.01 0" stroke="var(--color-accent-soft)" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M190 166 l0.01 0" stroke="var(--color-accent-soft)" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M150 238 l0.01 0" stroke="var(--color-accent-soft)" strokeWidth="5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function ShieldCheckDraw({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 132" className={className} role="img" aria-label="Request received">
      <path
        d="M60 10 L104 27 V62 c0 28 -18.5 46 -44 58 C34.5 108 16 90 16 62 V27 Z"
        fill="var(--color-accent-wash)"
        stroke="var(--color-accent)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        data-draw
      />
      <path d="M40 64 L55 79 L82 47" stroke="var(--color-accent-strong)" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" data-draw />
    </svg>
  );
}

export function QuoteMark({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 64 48" className={className} aria-hidden="true">
      <path d="M26 8 C14 14, 8 24, 8 40 M26 8 C26 8, 28 22, 18 28 C12 32, 8 36, 8 40" stroke="var(--color-accent)" strokeWidth="2.4" fill="none" strokeLinecap="round" data-draw />
      <path d="M56 8 C44 14, 38 24, 38 40 M56 8 C56 8, 58 22, 48 28 C42 32, 38 36, 38 40" stroke="var(--color-accent)" strokeWidth="2.4" fill="none" strokeLinecap="round" data-draw />
    </svg>
  );
}
