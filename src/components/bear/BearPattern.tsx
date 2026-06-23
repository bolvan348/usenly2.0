interface BearPatternProps {
  id: string;
  pattern: "bears" | "cars" | "dots";
  color: string;
}

/** Tiny bear silhouette for tile pattern */
function MiniBear() {
  return (
    <g transform="scale(0.9)" fill="currentColor">
      <circle cx="12" cy="10" r="7" />
      <circle cx="7" cy="5" r="3" />
      <circle cx="17" cy="5" r="3" />
      <ellipse cx="12" cy="20" rx="8" ry="7" />
    </g>
  );
}

/** Tiny car silhouette for tile pattern */
function MiniCar() {
  return (
    <g transform="scale(0.85)" fill="currentColor">
      <rect x="2" y="14" width="20" height="6" rx="2" />
      <path d="M4 14 L8 8 L16 8 L20 14 Z" />
      <circle cx="7" cy="20" r="2.5" />
      <circle cx="17" cy="20" r="2.5" />
    </g>
  );
}

export function BearPatternDefs({ id, pattern, color }: BearPatternProps) {
  return (
    <>
      <pattern
        id={`${id}-bears`}
        width="28"
        height="28"
        patternUnits="userSpaceOnUse"
      >
        <g color={color} opacity={0.35}>
          <MiniBear />
        </g>
        <g color={color} opacity={0.35} transform="translate(14 14)">
          <MiniBear />
        </g>
      </pattern>
      <pattern
        id={`${id}-cars`}
        width="32"
        height="32"
        patternUnits="userSpaceOnUse"
      >
        <g color={color} opacity={0.32}>
          <MiniCar />
        </g>
        <g color={color} opacity={0.32} transform="translate(16 16)">
          <MiniCar />
        </g>
      </pattern>
      <pattern
        id={`${id}-dots`}
        width="16"
        height="16"
        patternUnits="userSpaceOnUse"
      >
        <circle cx="4" cy="4" r="2" fill={color} opacity={0.25} />
        <circle cx="12" cy="12" r="2" fill={color} opacity={0.2} />
      </pattern>
    </>
  );
}

export function getPatternUrl(
  id: string,
  pattern: "bears" | "cars" | "dots"
) {
  return `url(#${id}-${pattern})`;
}
