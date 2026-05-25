export default function OnyxLogo({
  className = "h-16",
}: {
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 450 140"
      className={className}
      fill="none"
    >
      {/* Gemstone Icon Group
        Uses your CSS variable --primary (#4F46E5) and standard SVG opacities
        to create the 3D faceted shading effect automatically.
      */}
      <g transform="translate(15, 20)">
        {/* Top Center Highlight */}
        <polygon
          points="50,0 28,40 72,40"
          fill="var(--primary)"
          opacity="0.4"
        />
        {/* Top Left */}
        <polygon
          points="50,0 6.7,25 28,40"
          fill="var(--primary)"
          opacity="0.5"
        />
        {/* Top Right */}
        <polygon
          points="50,0 93.3,25 72,40"
          fill="var(--primary)"
          opacity="0.6"
        />

        {/* Left Side */}
        <polygon
          points="6.7,25 6.7,75 28,40"
          fill="var(--primary)"
          opacity="0.7"
        />
        {/* Right Side */}
        <polygon
          points="93.3,25 93.3,75 72,40"
          fill="var(--primary)"
          opacity="0.9"
        />

        {/* Center Triangle */}
        <polygon
          points="28,40 72,40 50,78"
          fill="var(--primary)"
          opacity="0.8"
        />

        {/* Inner Left-Bottom */}
        <polygon
          points="6.7,75 28,40 50,78"
          fill="var(--primary)"
          opacity="0.85"
        />
        {/* Inner Right-Bottom */}
        <polygon
          points="93.3,75 72,40 50,78"
          fill="var(--primary)"
          opacity="0.95"
        />

        {/* Bottom Left */}
        <polygon
          points="6.7,75 50,100 50,78"
          fill="var(--primary)"
          opacity="1.0"
        />
        {/* Bottom Right */}
        <polygon
          points="93.3,75 50,100 50,78"
          fill="var(--primary)"
          opacity="0.75"
        />
      </g>

      {/* Typography */}

      {/* Main Title
        Uses `fill-foreground` so it's #111827 in Light Mode and #F9FAFB in Dark Mode
      */}
      <text
        x="135"
        y="85"
        className="fill-foreground"
        fontFamily="var(--font-heading), ui-sans-serif, system-ui, sans-serif"
        fontSize="76"
        fontWeight="800"
        letterSpacing="2"
      >
        ONYX
      </text>

      {/* Subtitle
        Uses `fill-muted-foreground` so it's #6B7280 in Light Mode and #9CA3AF in Dark Mode
      */}
      <text
        x="139"
        y="118"
        className="fill-muted-foreground"
        fontFamily="var(--font-sans), ui-sans-serif, system-ui, sans-serif"
        fontSize="24"
        fontWeight="400"
        letterSpacing="1.2"
      >
        Project Management
      </text>
    </svg>
  );
}
