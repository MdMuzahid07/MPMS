export const ProgressTrendChart = () => {
  return (
    <svg
      viewBox="0 0 820 250"
      className="h-52 w-full"
      role="img"
      aria-label="Sprint performance trend"
    >
      <defs>
        <linearGradient id="lineColor" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(125,128,255,0.65)" />
          <stop offset="100%" stopColor="rgba(176,177,255,1)" />
        </linearGradient>
      </defs>
      <path
        d="M 20 190 C 120 198, 160 168, 220 150 C 280 132, 340 138, 420 166 C 500 194, 560 110, 635 84 C 705 62, 760 78, 800 96"
        fill="none"
        stroke="url(#lineColor)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="220" cy="150" r="4" fill="rgba(182,185,255,1)" />
      <circle cx="420" cy="166" r="4" fill="rgba(182,185,255,1)" />
      <circle cx="700" cy="70" r="4" fill="rgba(182,185,255,1)" />
      <text x="20" y="235" className="fill-muted-foreground text-[11px]">
        Sprint 18
      </text>
      <text x="270" y="235" className="fill-muted-foreground text-[11px]">
        Sprint 19
      </text>
      <text x="520" y="235" className="fill-muted-foreground text-[11px]">
        Sprint 20
      </text>
      <text x="760" y="235" className="fill-muted-foreground text-[11px]">
        Sprint 21
      </text>
    </svg>
  );
};
