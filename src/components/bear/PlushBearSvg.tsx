import type { BearTraits } from "@/lib/bear-types";

interface PlushBearSvgProps {
  traits: BearTraits;
  uid: string;
}

/* ─────────────────────────────────────────────
   Cable-knit texture on the sweater
───────────────────────────────────────────── */
function CableKnit({ color, variant }: { color: string; variant: number }) {
  const yStart = variant === 0 ? 90 : variant === 1 ? 94 : 92;
  const rows = Array.from({ length: 9 }, (_, i) => yStart + i * 9.5);
  return (
    <g opacity={0.18} stroke={color} strokeWidth="1.3" fill="none" strokeLinecap="round">
      {rows.map((y) => (
        <g key={y}>
          {/* main wave */}
          <path d={`M 84 ${y} C 94 ${y - 5} 104 ${y + 5} 114 ${y} C 124 ${y - 5} 134 ${y + 5} 124 ${y}`} />
          {/* subtle echo */}
          <path d={`M 86 ${y + 2.5} C 96 ${y - 2.5} 106 ${y + 7.5} 116 ${y + 2.5} C 122 ${y} 128 ${y + 4} 124 ${y + 2}`} opacity={0.4} strokeWidth="0.7" />
        </g>
      ))}
    </g>
  );
}

/* ─────────────────────────────────────────────
   Seam / stitch line suggestion
───────────────────────────────────────────── */
function SeamLine({ d, color }: { d: string; color: string }) {
  return (
    <path
      d={d}
      stroke={color}
      strokeWidth="1.1"
      strokeDasharray="3 3.5"
      fill="none"
      opacity={0.2}
      strokeLinecap="round"
    />
  );
}

/* ─────────────────────────────────────────────
   Main bear SVG
───────────────────────────────────────────── */
export function PlushBearSvg({ traits, uid }: PlushBearSvgProps) {
  const { palette, earTilt, eyeSize, hasBadge, hasChain, knitVariant } = traits;
  const isGold   = palette.metallicTone === "gold";
  const isSilver = palette.metallicTone === "silver";
  const isMetal  = palette.material === "metallic";

  const G = (id: string) => `url(#${uid}-${id})`;

  return (
    <g>
      {/* ══════════════ GROUND SHADOW ══════════════ */}
      <ellipse cx="140" cy="302" rx="64" ry="8" fill="#000" opacity={0.07} />

      {/* ══════════════ LEFT LEG ══════════════ */}
      {/* shadow base */}
      <path
        d="M 84 266 C 72 266 66 274 66 283 C 66 296 78 305 100 305 C 122 305 128 296 126 284 C 124 272 116 266 104 266 Z"
        fill={palette.furShadow} opacity={0.75}
      />
      {/* main fill */}
      <path
        d="M 86 262 C 74 262 68 270 68 280 C 68 293 80 302 101 302 C 122 302 127 292 125 281 C 123 269 115 262 104 262 Z"
        fill={G("leg-l")}
      />
      {/* highlight top */}
      <ellipse cx="93" cy="269" rx="11" ry="7" fill="#fff" opacity={0.14} transform="rotate(-10 93 269)" />
      {/* paw */}
      <ellipse cx="99" cy="296" rx="19" ry="8" fill={palette.furShadow} opacity={0.45} />
      <ellipse cx="90" cy="298" rx="5"  ry="4" fill={palette.muzzle}    opacity={0.6} />
      <ellipse cx="99" cy="300" rx="5"  ry="4" fill={palette.muzzle}    opacity={0.6} />
      <ellipse cx="108" cy="298" rx="5" ry="4" fill={palette.muzzle}    opacity={0.6} />
      <ellipse cx="89"  cy="296" rx="2" ry="1.5" fill="#fff" opacity={0.32} />
      <ellipse cx="98"  cy="298" rx="2" ry="1.5" fill="#fff" opacity={0.32} />
      <ellipse cx="107" cy="296" rx="2" ry="1.5" fill="#fff" opacity={0.32} />

      {/* ══════════════ RIGHT LEG ══════════════ */}
      <path
        d="M 196 266 C 208 266 214 274 214 283 C 214 296 202 305 180 305 C 158 305 152 296 154 284 C 156 272 164 266 176 266 Z"
        fill={palette.furShadow} opacity={0.75}
      />
      <path
        d="M 194 262 C 206 262 212 270 212 280 C 212 293 200 302 179 302 C 158 302 153 292 155 281 C 157 269 165 262 176 262 Z"
        fill={G("leg-r")}
      />
      <ellipse cx="187" cy="269" rx="11" ry="7" fill="#fff" opacity={0.14} transform="rotate(10 187 269)" />
      <ellipse cx="181" cy="296" rx="19" ry="8" fill={palette.furShadow} opacity={0.45} />
      <ellipse cx="172" cy="298" rx="5" ry="4"  fill={palette.muzzle}    opacity={0.6} />
      <ellipse cx="181" cy="300" rx="5" ry="4"  fill={palette.muzzle}    opacity={0.6} />
      <ellipse cx="190" cy="298" rx="5" ry="4"  fill={palette.muzzle}    opacity={0.6} />
      <ellipse cx="171" cy="296" rx="2" ry="1.5" fill="#fff" opacity={0.32} />
      <ellipse cx="180" cy="298" rx="2" ry="1.5" fill="#fff" opacity={0.32} />
      <ellipse cx="189" cy="296" rx="2" ry="1.5" fill="#fff" opacity={0.32} />

      {/* ══════════════ LEFT ARM ══════════════ */}
      {/* shadow */}
      <path
        d="M 74 180 C 57 186 49 213 53 234 C 57 255 70 263 83 259 C 96 255 101 241 97 218 C 93 195 88 176 74 180 Z"
        fill={palette.furShadow} opacity={0.7}
      />
      {/* main — organic tapered shape */}
      <path
        d="M 76 177 C 59 183 51 210 55 231 C 59 252 72 260 85 256 C 98 252 103 238 99 215 C 95 192 90 173 76 177 Z"
        fill={G("arm-l")}
      />
      {/* rim light */}
      <path
        d="M 59 206 C 57 218 60 232 67 242"
        stroke="#fff" strokeWidth="6" fill="none" opacity={0.08} strokeLinecap="round"
      />
      {/* specular */}
      <ellipse cx="71" cy="200" rx="7" ry="20" fill="#fff" opacity={0.12} transform="rotate(-8 71 200)" />
      {/* paw */}
      <ellipse cx="78" cy="251" rx="15" ry="9" fill={palette.furShadow} opacity={0.5} />
      <ellipse cx="70" cy="254" rx="5.5" ry="3.5" fill={palette.muzzle} opacity={0.58} />
      <ellipse cx="79" cy="256" rx="5.5" ry="3.5" fill={palette.muzzle} opacity={0.58} />
      <ellipse cx="69" cy="252" rx="2"   ry="1.4"  fill="#fff" opacity={0.3} />
      <ellipse cx="78" cy="254" rx="2"   ry="1.4"  fill="#fff" opacity={0.3} />
      {/* seam */}
      <SeamLine d="M 76 186 C 72 210 74 234 78 250" color={palette.furShadow} />

      {/* ══════════════ RIGHT ARM ══════════════ */}
      <path
        d="M 206 180 C 223 186 231 213 227 234 C 223 255 210 263 197 259 C 184 255 179 241 183 218 C 187 195 192 176 206 180 Z"
        fill={palette.furShadow} opacity={0.7}
      />
      <path
        d="M 204 177 C 221 183 229 210 225 231 C 221 252 208 260 195 256 C 182 252 177 238 181 215 C 185 192 190 173 204 177 Z"
        fill={G("arm-r")}
      />
      <path
        d="M 221 206 C 223 218 220 232 213 242"
        stroke="#fff" strokeWidth="6" fill="none" opacity={0.08} strokeLinecap="round"
      />
      <ellipse cx="209" cy="200" rx="7" ry="20" fill="#fff" opacity={0.12} transform="rotate(8 209 200)" />
      <ellipse cx="202" cy="251" rx="15" ry="9"  fill={palette.furShadow} opacity={0.5} />
      <ellipse cx="201" cy="254" rx="5.5" ry="3.5" fill={palette.muzzle}  opacity={0.58} />
      <ellipse cx="210" cy="256" rx="5.5" ry="3.5" fill={palette.muzzle}  opacity={0.58} />
      <ellipse cx="200" cy="252" rx="2"   ry="1.4"  fill="#fff" opacity={0.3} />
      <ellipse cx="209" cy="254" rx="2"   ry="1.4"  fill="#fff" opacity={0.3} />
      <SeamLine d="M 204 186 C 208 210 206 234 202 250" color={palette.furShadow} />

      {/* ══════════════ BODY ══════════════ */}
      {/* depth shadow */}
      <path
        d="M 108 168 C 83 178 72 212 75 248 C 78 278 105 292 140 292 C 175 292 202 278 205 248 C 208 212 197 178 172 168 C 161 163 151 160 140 160 C 129 160 119 163 108 168 Z"
        fill={palette.furShadow} opacity={0.7}
      />
      {/* main body — organic pear path */}
      <path
        d="M 110 163 C 86 173 75 207 78 244 C 81 274 107 288 140 288 C 173 288 199 274 202 244 C 205 207 194 173 170 163 C 159 158 150 155 140 155 C 130 155 121 158 110 163 Z"
        fill={G("body")}
      />
      {/* side depth */}
      <path
        d="M 78 220 C 76 238 80 256 86 268"
        stroke={palette.furShadow} strokeWidth="18" fill="none" opacity={0.1} strokeLinecap="round"
      />
      <path
        d="M 202 220 C 204 238 200 256 194 268"
        stroke={palette.furShadow} strokeWidth="18" fill="none" opacity={0.1} strokeLinecap="round"
      />
      {/* belly diffuse */}
      <ellipse cx="133" cy="208" rx="48" ry="56" fill={G("belly")} opacity={0.32} />
      {/* specular dot top */}
      <ellipse cx="118" cy="178" rx="20" ry="13" fill="#fff" opacity={0.09} transform="rotate(-10 118 178)" />

      {/* ══════════════ SWEATER ══════════════ */}
      <path
        d="M 116 168 C 94 178 84 208 87 242 C 90 266 110 276 140 276 C 170 276 190 266 193 242 C 196 208 186 178 164 168 C 156 164 148 162 140 162 C 132 162 124 164 116 168 Z"
        fill={palette.sweater} opacity={0.96}
      />
      {/* sweater side shading */}
      <path
        d="M 90 190 C 86 210 88 236 93 254"
        stroke={palette.sweaterKnit} strokeWidth="12" fill="none" opacity={0.2} strokeLinecap="round"
      />
      <path
        d="M 190 190 C 194 210 192 236 187 254"
        stroke={palette.sweaterKnit} strokeWidth="12" fill="none" opacity={0.2} strokeLinecap="round"
      />
      {/* sweater highlight */}
      <ellipse cx="128" cy="200" rx="34" ry="42" fill="#fff" opacity={0.045} />
      <CableKnit color={palette.sweaterKnit} variant={knitVariant} />
      {/* sweater seam */}
      <SeamLine d="M 116 168 C 128 164 140 163 152 164 C 164 165 172 168 172 168" color={palette.sweaterKnit} />

      {/* ══════════════ COLLAR ══════════════ */}
      <path
        d="M 115 170 L 140 186 L 165 170 L 161 180 L 140 193 L 119 180 Z"
        fill={palette.collar} opacity={0.97}
      />
      <path d="M 119 180 L 140 193 L 161 180" stroke={palette.collarStripe} strokeWidth="1.2" fill="none" opacity={0.2} />
      <path d="M 115 170 L 140 186 L 165 170" stroke={palette.collarStripe} strokeWidth="1.8" fill="none" opacity={0.7} />
      {/* collar highlight */}
      <ellipse cx="140" cy="177" rx="16" ry="5" fill="#fff" opacity={0.18} />
      {/* button */}
      <circle cx="140" cy="195" r="4.5"  fill={palette.collarStripe} opacity={0.72} />
      <circle cx="140" cy="195" r="2.2"  fill="#fff" opacity={0.55} />
      <circle cx="139" cy="194" r="0.9"  fill="#fff" opacity={0.9} />

      {/* ══════════════ BADGE ══════════════ */}
      {hasBadge && (
        <g transform="translate(104 204)">
          <rect x="1" y="2" width="30" height="19" rx="4.5" fill="#000" opacity={0.2} />
          <rect x="0" y="0" width="30" height="19" rx="4.5" fill={palette.badgePrimary} />
          <rect x="0" y="0"    width="30" height="6"   rx="4.5" fill={palette.badgeSecondary} opacity={0.88} />
          <rect x="0" y="13"   width="30" height="6"   rx="4.5" fill={palette.badgeSecondary} opacity={0.88} />
          <rect x="3"  y="7" width="9"  height="4" rx="1.2" fill="#fff" opacity={0.35} />
          <rect x="15" y="7" width="9"  height="4" rx="1.2" fill="#fff" opacity={0.35} />
          {/* gloss */}
          <rect x="0" y="0" width="30" height="10" rx="4.5" fill="#fff" opacity={0.09} />
          <ellipse cx="15" cy="3" rx="11" ry="2.5" fill="#fff" opacity={0.14} />
        </g>
      )}

      {/* ══════════════ CHAIN ══════════════ */}
      {hasChain && (
        <g>
          {/* links */}
          {Array.from({ length: 8 }, (_, i) => {
            const t  = i / 7;
            const x  = 117 + (163 - 117) * t;
            const dy = Math.sin(Math.PI * t) * 8;
            const y  = 213 - dy;
            return (
              <ellipse
                key={i}
                cx={x} cy={y}
                rx="3.2" ry="2"
                fill="none"
                stroke={palette.chain}
                strokeWidth="1.7"
                opacity={0.88}
                transform={`rotate(${i * 23} ${x} ${y})`}
              />
            );
          })}
          {/* catenary curve */}
          <path
            d="M 117 213 C 124 222 133 218 140 215 C 147 212 156 222 163 213"
            stroke={palette.chain} strokeWidth="1.2" fill="none" opacity={0.35} strokeLinecap="round"
          />
          {/* end loops */}
          <circle cx="117" cy="213" r="4"   fill={palette.chain} opacity={0.86} />
          <circle cx="163" cy="213" r="4"   fill={palette.chain} opacity={0.86} />
          <circle cx="117" cy="212" r="1.8" fill="#fff" opacity={0.52} />
          <circle cx="163" cy="212" r="1.8" fill="#fff" opacity={0.52} />
          {/* pendant */}
          <circle cx="140" cy="216" r="6.5" fill={palette.chain} opacity={0.8} />
          <circle cx="140" cy="216" r="3.5" fill="#fff" opacity={0.32} />
          <circle cx="139" cy="215" r="1.4" fill="#fff" opacity={0.78} />
        </g>
      )}

      {/* ══════════════ HEAD ══════════════ */}
      {/* outer depth */}
      <path
        d="M 140 44 C 197 44 208 80 206 108 C 204 142 187 167 140 169 C 93 167 76 142 74 108 C 72 80 83 44 140 44 Z"
        fill={palette.furShadow} opacity={0.65}
      />
      {/* main head — slightly pear-shaped, wider at cheeks */}
      <path
        d="M 140 46 C 195 46 205 82 203 108 C 201 140 184 165 140 166 C 96 165 79 140 77 108 C 75 82 85 46 140 46 Z"
        fill={G("head")}
      />
      {/* edge vignette (rim shading) */}
      <path
        d="M 140 46 C 195 46 205 82 203 108 C 201 140 184 165 140 166 C 96 165 79 140 77 108 C 75 82 85 46 140 46 Z"
        fill="none" stroke={palette.furShadow} strokeWidth="14" opacity={0.16}
      />
      {/* top highlight */}
      <ellipse cx="120" cy="76" rx="32" ry="26" fill="#fff" opacity={0.14} transform="rotate(-10 120 76)" />
      {/* primary specular */}
      <ellipse cx="112" cy="68" rx="16" ry="13" fill="#fff" opacity={0.22} transform="rotate(-15 112 68)" />
      {/* micro specular */}
      <ellipse cx="106" cy="63" rx="6" ry="5"   fill="#fff" opacity={0.28} />
      {/* head seam — top center */}
      <SeamLine d="M 140 47 C 140 60 140 74 140 88" color={palette.furShadow} />

      {/* ══════════════ LEFT EAR ══════════════ */}
      <g transform={`rotate(${earTilt} 95 58)`}>
        {/* outer shadow */}
        <path
          d="M 93 28 C 116 28 127 42 125 58 C 123 74 110 84 94 83 C 78 82 67 70 69 56 C 71 42 70 28 93 28 Z"
          fill={palette.furShadow} opacity={0.72}
        />
        {/* main */}
        <path
          d="M 93 30 C 114 30 124 44 122 58 C 120 72 108 82 93 81 C 78 80 68 68 70 55 C 72 42 72 30 93 30 Z"
          fill={G("ear-l")}
        />
        {/* rim */}
        <path
          d="M 93 30 C 114 30 124 44 122 58 C 120 72 108 82 93 81 C 78 80 68 68 70 55 C 72 42 72 30 93 30 Z"
          fill="none" stroke={palette.furShadow} strokeWidth="8" opacity={0.14}
        />
        {/* inner ear */}
        <path
          d="M 93 42 C 106 42 114 49 113 58 C 112 67 104 74 93 73 C 82 72 75 66 76 57 C 77 48 80 42 93 42 Z"
          fill={palette.innerEar}
        />
        <ellipse cx="89" cy="51" rx="10" ry="7.5" fill="#fff" opacity={0.2} />
        <path
          d="M 93 50 C 100 50 106 54 105 58 C 104 62 99 66 93 65 C 87 64 83 60 84 56 C 85 52 88 50 93 50 Z"
          fill={palette.innerEar} opacity={0.55}
        />
        {/* ear highlight */}
        <ellipse cx="86" cy="46" rx="6" ry="4" fill="#fff" opacity={0.2} transform="rotate(-15 86 46)" />
        <SeamLine d="M 72 56 C 80 50 90 44 105 44" color={palette.furShadow} />
      </g>

      {/* ══════════════ RIGHT EAR ══════════════ */}
      <g transform={`rotate(${-earTilt} 185 58)`}>
        <path
          d="M 187 28 C 164 28 153 42 155 58 C 157 74 170 84 186 83 C 202 82 213 70 211 56 C 209 42 210 28 187 28 Z"
          fill={palette.furShadow} opacity={0.72}
        />
        <path
          d="M 187 30 C 166 30 156 44 158 58 C 160 72 172 82 187 81 C 202 80 212 68 210 55 C 208 42 208 30 187 30 Z"
          fill={G("ear-r")}
        />
        <path
          d="M 187 30 C 166 30 156 44 158 58 C 160 72 172 82 187 81 C 202 80 212 68 210 55 C 208 42 208 30 187 30 Z"
          fill="none" stroke={palette.furShadow} strokeWidth="8" opacity={0.14}
        />
        <path
          d="M 187 42 C 174 42 166 49 167 58 C 168 67 176 74 187 73 C 198 72 205 66 204 57 C 203 48 200 42 187 42 Z"
          fill={palette.innerEar}
        />
        <ellipse cx="183" cy="51" rx="10" ry="7.5" fill="#fff" opacity={0.2} />
        <path
          d="M 187 50 C 180 50 174 54 175 58 C 176 62 181 66 187 65 C 193 64 197 60 196 56 C 195 52 192 50 187 50 Z"
          fill={palette.innerEar} opacity={0.55}
        />
        <ellipse cx="180" cy="46" rx="6" ry="4" fill="#fff" opacity={0.2} transform="rotate(15 180 46)" />
        <SeamLine d="M 208 56 C 200 50 190 44 175 44" color={palette.furShadow} />
      </g>

      {/* ══════════════ MUZZLE ══════════════ */}
      {/* shadow base */}
      <ellipse cx="140" cy="121" rx="40" ry="33" fill={palette.furShadow} opacity={0.22} />
      {/* organic muzzle path — slightly bilobate */}
      <path
        d="M 140 93 C 164 93 178 103 178 119 C 178 137 162 151 140 151 C 118 151 102 137 102 119 C 102 103 116 93 140 93 Z"
        fill={G("muzzle")}
      />
      {/* muzzle center divide */}
      <line x1="140" y1="105" x2="140" y2="122" stroke={palette.furShadow} strokeWidth="1.2" opacity={0.15} strokeLinecap="round" />
      {/* muzzle highlight */}
      <ellipse cx="128" cy="110" rx="17" ry="11" fill="#fff" opacity={0.12} />
      <ellipse cx="122" cy="106" rx="7"  ry="4.5" fill="#fff" opacity={0.14} />

      {/* ══════════════ CHEEKS ══════════════ */}
      <ellipse cx="109" cy="120" rx="21" ry="13"
        fill={isMetal ? (isGold ? "#F5C070" : "#B8C8D8") : "#FFB2C0"}
        opacity={0.44}
        filter={`url(#${uid}-blush)`}
      />
      <ellipse cx="171" cy="120" rx="21" ry="13"
        fill={isMetal ? (isGold ? "#F5C070" : "#B8C8D8") : "#FFB2C0"}
        opacity={0.44}
        filter={`url(#${uid}-blush)`}
      />

      {/* ══════════════ EYES ══════════════ */}
      {/* socket depth */}
      <circle cx="117" cy="101" r={12.5 * eyeSize} fill={palette.furShadow} opacity={0.48} />
      <circle cx="163" cy="101" r={12.5 * eyeSize} fill={palette.furShadow} opacity={0.48} />
      <circle cx="117" cy="101" r={10.5 * eyeSize} fill={palette.furShadow} opacity={0.35} />
      <circle cx="163" cy="101" r={10.5 * eyeSize} fill={palette.furShadow} opacity={0.35} />
      {/* iris */}
      <circle cx="117" cy="100" r={9.5 * eyeSize} fill={G("eye")} />
      <circle cx="163" cy="100" r={9.5 * eyeSize} fill={G("eye")} />
      {/* tinted iris ring */}
      <circle cx="117" cy="100" r={7.8 * eyeSize}  fill={palette.fur} opacity={0.12} />
      <circle cx="163" cy="100" r={7.8 * eyeSize}  fill={palette.fur} opacity={0.12} />
      {/* pupil */}
      <circle cx="117" cy="100" r={5.5 * eyeSize} fill="#000" />
      <circle cx="163" cy="100" r={5.5 * eyeSize} fill="#000" />
      {/* catchlight primary — large oval */}
      <ellipse cx="121"   cy="95.5" rx="3.8" ry="4.2" fill="#fff" opacity={0.97} />
      <ellipse cx="167"   cy="95.5" rx="3.8" ry="4.2" fill="#fff" opacity={0.97} />
      {/* catchlight secondary */}
      <circle cx="113.5"  cy="105"  r="1.8"  fill="#fff" opacity={0.5} />
      <circle cx="159.5"  cy="105"  r="1.8"  fill="#fff" opacity={0.5} />
      {/* micro tertiary */}
      <circle cx="123" cy="97" r="1.3" fill="#fff" opacity={0.65} />
      <circle cx="169" cy="97" r="1.3" fill="#fff" opacity={0.65} />

      {/* ══════════════ NOSE ══════════════ */}
      {/* shadow */}
      <path d="M 131 121 Q 140 116 149 121 L 147 127 Q 140 132 133 127 Z" fill={palette.furShadow} opacity={0.3} />
      {/* main nose — heart-like organic path */}
      <path d="M 133 119 C 133 115 136 113 140 113 C 144 113 147 115 147 119 L 145 125 Q 140 130 135 125 Z" fill={palette.nose} />
      {/* nose highlight strip */}
      <path d="M 135 118 C 137 115 140 114 143 116" stroke="#fff" strokeWidth="2" fill="none" opacity={0.3} strokeLinecap="round" />
      {/* nostril details */}
      <circle cx="136.5" cy="122" r="1.8" fill={palette.furShadow} opacity={0.35} />
      <circle cx="143.5" cy="122" r="1.8" fill={palette.furShadow} opacity={0.35} />
      {/* philtrum */}
      <line x1="140" y1="127" x2="140" y2="133" stroke={palette.nose} strokeWidth="1.5" opacity={0.45} strokeLinecap="round" />
      {/* smile */}
      <path
        d="M 133 135 Q 140 142 147 135"
        stroke={palette.nose} strokeWidth="2.2" fill="none" strokeLinecap="round" opacity={0.62}
      />

      {/* ══════════════ METALLIC SHEEN (mythic) ══════════════ */}
      {isMetal && (
        <>
          {/* full-body chrome sweep */}
          <path
            d="M 110 163 C 86 173 75 207 78 244 C 81 274 107 288 140 288 C 173 288 199 274 202 244 C 205 207 194 173 170 163 C 159 158 150 155 140 155 C 130 155 121 158 110 163 Z"
            fill={isGold ? G("gold-body") : G("silver-body")}
            opacity={0.3} pointerEvents="none"
          />
          {/* head chrome sweep */}
          <path
            d="M 140 46 C 195 46 205 82 203 108 C 201 140 184 165 140 166 C 96 165 79 140 77 108 C 75 82 85 46 140 46 Z"
            fill={isGold ? G("gold-head") : G("silver-head")}
            opacity={0.24} pointerEvents="none"
          />
          {/* specular streak */}
          <ellipse cx="116" cy="76" rx="26" ry="11" fill="#fff"
            opacity={isGold ? 0.2 : 0.26} transform="rotate(-28 116 76)" pointerEvents="none"
          />
          {/* chromatic edge ring */}
          <path
            d="M 140 46 C 195 46 205 82 203 108 C 201 140 184 165 140 166 C 96 165 79 140 77 108 C 75 82 85 46 140 46 Z"
            fill="none"
            stroke={isGold ? "#ffe566" : "#c8d4e4"}
            strokeWidth="2.5" opacity={0.38} pointerEvents="none"
          />
        </>
      )}
    </g>
  );
}

/* ─────────────────────────────────────────────
   Defs (filters + gradients), placed inside <defs>
───────────────────────────────────────────── */
export function PlushBearDefs({
  uid, seed: _seed, palette,
}: {
  uid: string;
  seed: string;
  palette: {
    fur: string; furShadow: string; furHighlight: string;
    muzzle: string; material: string; metallicTone?: string;
  };
}) {
  const isGold  = palette.metallicTone === "gold";

  return (
    <>
      {/* ── Blush / cheek glow ── */}
      <filter id={`${uid}-blush`} x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="7.5" />
      </filter>

      {/* ── Drop shadow ── */}
      <filter id={`${uid}-shadow`}>
        <feDropShadow dx="0" dy="18" stdDeviation="20" floodOpacity={0.11} />
      </filter>

      {/* ── Head ── top-left lit radial */}
      <radialGradient id={`${uid}-head`} cx="33%" cy="30%" r="70%" fx="28%" fy="24%">
        <stop offset="0%"   stopColor={palette.furHighlight} />
        <stop offset="46%"  stopColor={palette.fur} />
        <stop offset="100%" stopColor={palette.furShadow} />
      </radialGradient>

      {/* ── Ears ── */}
      <radialGradient id={`${uid}-ear-l`} cx="36%" cy="34%" r="66%">
        <stop offset="0%"   stopColor={palette.furHighlight} />
        <stop offset="52%"  stopColor={palette.fur} />
        <stop offset="100%" stopColor={palette.furShadow} />
      </radialGradient>
      <radialGradient id={`${uid}-ear-r`} cx="36%" cy="34%" r="66%">
        <stop offset="0%"   stopColor={palette.furHighlight} />
        <stop offset="52%"  stopColor={palette.fur} />
        <stop offset="100%" stopColor={palette.furShadow} />
      </radialGradient>

      {/* ── Body ── */}
      <radialGradient id={`${uid}-body`} cx="30%" cy="26%" r="76%" fx="26%" fy="22%">
        <stop offset="0%"   stopColor={palette.furHighlight} />
        <stop offset="44%"  stopColor={palette.fur} />
        <stop offset="100%" stopColor={palette.furShadow} />
      </radialGradient>

      {/* ── Belly highlight ── */}
      <radialGradient id={`${uid}-belly`} cx="44%" cy="40%" r="58%">
        <stop offset="0%"   stopColor="#fff" stopOpacity="1" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </radialGradient>

      {/* ── Arm left ── horizontal gradient (light on left) */}
      <linearGradient id={`${uid}-arm-l`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor={palette.furHighlight} />
        <stop offset="48%"  stopColor={palette.fur} />
        <stop offset="100%" stopColor={palette.furShadow} />
      </linearGradient>

      {/* ── Arm right ── mirrored */}
      <linearGradient id={`${uid}-arm-r`} x1="100%" y1="0%" x2="0%" y2="0%">
        <stop offset="0%"   stopColor={palette.furHighlight} />
        <stop offset="48%"  stopColor={palette.fur} />
        <stop offset="100%" stopColor={palette.furShadow} />
      </linearGradient>

      {/* ── Legs ── */}
      <radialGradient id={`${uid}-leg-l`} cx="36%" cy="30%" r="68%">
        <stop offset="0%"   stopColor={palette.furHighlight} />
        <stop offset="52%"  stopColor={palette.fur} />
        <stop offset="100%" stopColor={palette.furShadow} />
      </radialGradient>
      <radialGradient id={`${uid}-leg-r`} cx="36%" cy="30%" r="68%">
        <stop offset="0%"   stopColor={palette.furHighlight} />
        <stop offset="52%"  stopColor={palette.fur} />
        <stop offset="100%" stopColor={palette.furShadow} />
      </radialGradient>

      {/* ── Muzzle ── */}
      <radialGradient id={`${uid}-muzzle`} cx="36%" cy="32%" r="70%">
        <stop offset="0%"   stopColor="#fff" stopOpacity="0.45" />
        <stop offset="30%"  stopColor={palette.muzzle} stopOpacity="1" />
        <stop offset="100%" stopColor={palette.muzzle} stopOpacity="0.88" />
      </radialGradient>

      {/* ── Eye ── */}
      <radialGradient id={`${uid}-eye`} cx="36%" cy="33%" r="68%">
        <stop offset="0%"   stopColor="#2c2c40" />
        <stop offset="100%" stopColor="#050508" />
      </radialGradient>

      {/* ── Metallic overlays ── */}
      {isGold ? (
        <>
          <radialGradient id={`${uid}-gold-body`} cx="28%" cy="18%" r="82%">
            <stop offset="0%"   stopColor="#fffde7" stopOpacity="1" />
            <stop offset="40%"  stopColor="#ffd54f" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#e65100" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${uid}-gold-head`} cx="26%" cy="22%" r="78%">
            <stop offset="0%"   stopColor="#fffde7" stopOpacity="1" />
            <stop offset="50%"  stopColor="#ffe082" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#f57f17" stopOpacity="0" />
          </radialGradient>
        </>
      ) : (
        <>
          <radialGradient id={`${uid}-silver-body`} cx="26%" cy="20%" r="82%">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.92" />
            <stop offset="44%"  stopColor="#cfd8dc" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#546e7a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${uid}-silver-head`} cx="28%" cy="24%" r="76%">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.88" />
            <stop offset="50%"  stopColor="#eceff1" stopOpacity="0.48" />
            <stop offset="100%" stopColor="#78909c" stopOpacity="0" />
          </radialGradient>
        </>
      )}
    </>
  );
}
