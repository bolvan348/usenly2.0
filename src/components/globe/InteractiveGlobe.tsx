"use client";

import { useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────────
   Simplified continent polygons  [longitude°, latitude°]
   Approximate but visually recognisable outlines.
───────────────────────────────────────────────────────────────── */
const CONTINENTS: Array<{ name: string; pts: [number, number][] }> = [
  {
    name: "northAmerica",
    pts: [
      [-168,72],[-163,60],[-155,58],[-150,61],[-140,57],[-130,54],
      [-124,48],[-124,46],[-124,38],[-117,32],[-105,20],[-92,16],
      [-84,10],[-80,8],[-80,12],[-80,25],[-81,31],[-77,35],[-76,37],
      [-74,41],[-70,42],[-67,45],[-61,46],[-53,47],[-64,44],[-66,44],
      [-70,42],[-77,44],[-83,42],[-87,42],[-87,46],[-83,46],[-82,44],
      [-80,50],[-78,55],[-80,60],[-88,60],[-95,60],[-105,60],
      [-115,58],[-125,57],[-130,56],[-140,60],[-140,68],[-135,70],
      [-120,70],[-100,72],[-80,73],[-70,73],[-60,75],[-45,80],
      [-30,82],[-18,80],[-18,74],[-25,72],[-40,72],[-50,70],
      [-55,72],[-60,73],[-80,75],[-100,77],[-120,76],[-140,72],
      [-155,72],[-168,72],
    ],
  },
  {
    name: "southAmerica",
    pts: [
      [-80,12],[-75,8],[-62,11],[-50,5],[-37,-4],[-35,-8],[-35,-12],
      [-40,-20],[-48,-28],[-52,-33],[-58,-38],[-65,-55],[-68,-55],
      [-70,-50],[-74,-42],[-73,-38],[-70,-28],[-70,-20],[-75,-8],
      [-78,-2],[-80,2],[-80,12],
    ],
  },
  {
    name: "europe",
    pts: [
      [-10,36],[5,36],[15,38],[28,36],[36,41],[30,47],[26,50],
      [20,54],[16,57],[10,58],[5,60],[0,60],[-5,58],[-8,52],
      [-10,44],[-10,36],
    ],
  },
  {
    name: "africa",
    pts: [
      [-18,15],[0,15],[10,37],[35,37],[40,30],[45,15],[50,10],
      [42,0],[40,-10],[35,-25],[27,-35],[20,-35],[15,-30],
      [5,-5],[0,5],[-18,15],
    ],
  },
  {
    name: "asia",
    pts: [
      [30,40],[50,28],[58,22],[65,-5],[80,-8],[100,-5],[105,5],
      [110,0],[120,-5],[130,5],[140,0],[150,5],[145,40],[140,48],
      [145,43],[140,55],[130,65],[100,70],[80,80],[55,70],[40,56],
      [28,50],[25,42],[30,40],
    ],
  },
  {
    name: "australia",
    pts: [
      [114,-22],[117,-35],[130,-38],[142,-38],[150,-35],[154,-28],
      [148,-18],[136,-12],[130,-12],[122,-18],[114,-22],
    ],
  },
  {
    name: "greenland",
    pts: [
      [-48,84],[-18,83],[-18,74],[-30,72],[-42,72],[-54,70],[-55,72],[-48,84],
    ],
  },
  {
    name: "newZealand",
    pts: [[172,-34],[174,-41],[172,-46],[168,-46],[168,-40],[170,-34],[172,-34]],
  },
  {
    name: "japan",
    pts: [[130,32],[131,35],[135,36],[140,38],[141,42],[139,44],[136,43],[131,32]],
  },
  {
    name: "uk",
    pts: [[-5,50],[2,52],[2,56],[-2,59],[-5,58],[-5,50]],
  },
  {
    name: "madagascar",
    pts: [[44,-13],[50,-15],[50,-25],[44,-26],[43,-18],[44,-13]],
  },
  {
    name: "indonesia",
    pts: [[95,6],[106,0],[115,-8],[125,-8],[132,-2],[140,-2],[141,1],[132,2],[120,0],[108,5],[95,6]],
  },
];

/* City / location dots */
const LOCATIONS: Array<{ lon: number; lat: number; label: string }> = [
  { lon: -74,    lat: 40.7,  label: "New York" },
  { lon: -0.1,   lat: 51.5,  label: "London" },
  { lon: 2.3,    lat: 48.9,  label: "Paris" },
  { lon: 37.6,   lat: 55.8,  label: "Moscow" },
  { lon: 139.7,  lat: 35.7,  label: "Tokyo" },
  { lon: 116.4,  lat: 39.9,  label: "Beijing" },
  { lon: 72.9,   lat: 19.1,  label: "Mumbai" },
  { lon: 31.2,   lat: 30.1,  label: "Cairo" },
  { lon: 18.4,   lat: -34,   label: "Cape Town" },
  { lon: -43.2,  lat: -23,   label: "Rio" },
  { lon: -99.1,  lat: 19.4,  label: "Mexico City" },
  { lon: 151.2,  lat: -33.9, label: "Sydney" },
  { lon: -87.6,  lat: 41.8,  label: "Chicago" },
  { lon: -118.2, lat: 34,    label: "Los Angeles" },
  { lon: 77.2,   lat: 28.6,  label: "Delhi" },
  { lon: 103.8,  lat: 1.4,   label: "Singapore" },
  { lon: 28.0,   lat: -26.2, label: "Johannesburg" },
  { lon: -58.4,  lat: -34.6, label: "Buenos Aires" },
];

/* ─────────────────────────────────────────────────────────────────
   3-D projection helpers
───────────────────────────────────────────────────────────────── */
interface Pt3 { x: number; y: number; z: number }

function toSphere(lonDeg: number, latDeg: number): [number, number, number] {
  const lon = (lonDeg * Math.PI) / 180;
  const lat = (latDeg * Math.PI) / 180;
  return [
    Math.cos(lat) * Math.sin(lon),
    Math.sin(lat),
    Math.cos(lat) * Math.cos(lon),
  ];
}

function rotate(
  x: number, y: number, z: number,
  rotX: number, rotY: number
): Pt3 {
  // rotate around Y (horizontal spin)
  const x1 =  x * Math.cos(rotY) + z * Math.sin(rotY);
  const z1 = -x * Math.sin(rotY) + z * Math.cos(rotY);
  // rotate around X (tilt)
  const y2 =  y * Math.cos(rotX) - z1 * Math.sin(rotX);
  const z2 =  y * Math.sin(rotX) + z1 * Math.cos(rotX);
  return { x: x1, y: y2, z: z2 };
}

function project(
  lonDeg: number, latDeg: number,
  cx: number, cy: number, R: number,
  rotX: number, rotY: number
): Pt3 {
  const [sx, sy, sz] = toSphere(lonDeg, latDeg);
  const p = rotate(sx, sy, sz, rotX, rotY);
  return { x: cx + p.x * R, y: cy - p.y * R, z: p.z };
}

/* ─────────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────────── */
interface GlobeProps { size?: number }

export function InteractiveGlobe({ size = 500 }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotRef    = useRef({ x: 0.28, y: -0.6 });
  const velRef    = useRef({ x: 0, y: 0 });
  const dragRef   = useRef({ active: false, lastX: 0, lastY: 0 });
  const rafRef    = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W   = canvas.width  / dpr;
    const H   = canvas.height / dpr;
    const cx  = W / 2;
    const cy  = H / 2;
    const R   = Math.min(W, H) * 0.43;

    ctx.clearRect(0, 0, canvas.width / dpr * dpr, canvas.height / dpr * dpr);

    const rx = rotRef.current.x;
    const ry = rotRef.current.y;

    /* ── 1. Atmosphere outer glow ── */
    const atmo = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.25);
    atmo.addColorStop(0,   "rgba(160,170,190,0.09)");
    atmo.addColorStop(0.6, "rgba(130,145,170,0.04)");
    atmo.addColorStop(1,   "rgba(100,120,150,0)");
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.25, 0, Math.PI * 2);
    ctx.fillStyle = atmo;
    ctx.fill();

    /* ── 2. Ocean (sphere body) ── */
    const ocean = ctx.createRadialGradient(
      cx - R * 0.26, cy - R * 0.28, R * 0.04,
      cx, cy, R
    );
    ocean.addColorStop(0,    "#3e4452");
    ocean.addColorStop(0.42, "#272b34");
    ocean.addColorStop(0.78, "#1a1c22");
    ocean.addColorStop(1,    "#0f1014");
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = ocean;
    ctx.fill();

    /* ── 3. Latitude / longitude grid (very subtle) ── */
    ctx.save();
    ctx.lineWidth = 0.5;
    const SEG = 100;

    // latitude lines (every 30°)
    for (let latD = -60; latD <= 60; latD += 30) {
      if (latD === 0) continue; // equator handled separately
      ctx.beginPath();
      let first = true;
      for (let j = 0; j <= SEG; j++) {
        const p = project(j * (360 / SEG) - 180, latD, cx, cy, R, rx, ry);
        if (p.z < 0) { first = true; continue; }
        const a = Math.max(0, p.z) * 0.22;
        ctx.strokeStyle = `rgba(180,188,210,${a})`;
        if (first) { ctx.beginPath(); ctx.moveTo(p.x, p.y); first = false; }
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }
    // longitude lines (every 30°)
    for (let lonD = -180; lonD < 180; lonD += 30) {
      ctx.beginPath();
      let first = true;
      for (let j = 0; j <= SEG; j++) {
        const p = project(lonD, j * (180 / SEG) - 90, cx, cy, R, rx, ry);
        if (p.z < 0) { first = true; continue; }
        const a = Math.max(0, p.z) * 0.22;
        ctx.strokeStyle = `rgba(180,188,210,${a})`;
        if (first) { ctx.beginPath(); ctx.moveTo(p.x, p.y); first = false; }
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }
    ctx.restore();

    /* ── 4. Equator (slightly brighter) ── */
    ctx.save();
    ctx.lineWidth = 1.0;
    let first = true;
    for (let j = 0; j <= SEG * 2; j++) {
      const p = project(j * (360 / (SEG * 2)) - 180, 0, cx, cy, R, rx, ry);
      if (p.z < 0) { first = true; continue; }
      const a = Math.max(0, p.z) * 0.4;
      ctx.strokeStyle = `rgba(200,210,230,${a})`;
      if (first) { ctx.beginPath(); ctx.moveTo(p.x, p.y); first = false; }
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    ctx.restore();

    /* ── 5. Continents ── */
    for (const cont of CONTINENTS) {
      // Check if ANY point is on the front face
      let hasFront = false;
      for (const [lon, lat] of cont.pts) {
        const p = project(lon, lat, cx, cy, R, rx, ry);
        if (p.z > 0) { hasFront = true; break; }
      }
      if (!hasFront) continue;

      // Build path — skip segments that cross the limb
      ctx.beginPath();
      let penDown = false;
      let prevZ   = 0;

      for (let i = 0; i < cont.pts.length; i++) {
        const [lon, lat] = cont.pts[i];
        const p = project(lon, lat, cx, cy, R, rx, ry);

        if (p.z <= 0.02) {
          penDown = false;
          prevZ   = p.z;
          continue;
        }

        // Detect wrap (large gap between consecutive longitudes → skip)
        const prevLon = cont.pts[(i - 1 + cont.pts.length) % cont.pts.length][0];
        const lonGap  = Math.abs(lon - prevLon);
        if (lonGap > 90 || (prevZ <= 0 && p.z > 0)) {
          penDown = false;
        }

        if (!penDown) { ctx.moveTo(p.x, p.y); penDown = true; }
        else ctx.lineTo(p.x, p.y);

        prevZ = p.z;
      }
      ctx.closePath();

      // Gradient fill based on average position
      const midP = project(
        cont.pts[Math.floor(cont.pts.length / 2)][0],
        cont.pts[Math.floor(cont.pts.length / 2)][1],
        cx, cy, R, rx, ry
      );
      const brightness = Math.max(0, midP.z);
      const l1 = Math.round(52 + brightness * 12);
      const l2 = Math.round(38 + brightness * 8);
      const cg = ctx.createRadialGradient(midP.x, midP.y, 0, midP.x, midP.y, R * 0.6);
      cg.addColorStop(0,   `hsl(220,8%,${l1}%)`);
      cg.addColorStop(1,   `hsl(220,6%,${l2}%)`);
      ctx.fillStyle = cg;
      ctx.fill();

      // Continent border
      ctx.strokeStyle = `rgba(160,170,190,${brightness * 0.5})`;
      ctx.lineWidth   = 0.7;
      ctx.stroke();
    }

    /* ── 6. Location dots ── */
    for (const loc of LOCATIONS) {
      const p = project(loc.lon, loc.lat, cx, cy, R, rx, ry);
      if (p.z < 0.08) continue;
      const alpha = Math.min(1, (p.z - 0.08) * 2.8);
      const rDot  = 2 + p.z * 2;

      // outer glow
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rDot * 3.5);
      glow.addColorStop(0, `rgba(200,215,255,${alpha * 0.7})`);
      glow.addColorStop(1, "rgba(160,185,230,0)");
      ctx.beginPath();
      ctx.arc(p.x, p.y, rDot * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // core dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, rDot * 0.55, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(230,238,255,${alpha * 0.95})`;
      ctx.fill();
    }

    /* ── 7. Rim light (atmospheric edge) ── */
    const rim = ctx.createRadialGradient(cx, cy, R * 0.74, cx, cy, R);
    rim.addColorStop(0,   "rgba(100,120,170,0)");
    rim.addColorStop(0.72,"rgba(100,120,170,0)");
    rim.addColorStop(1,   "rgba(120,150,210,0.28)");
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = rim;
    ctx.fill();

    /* ── 8. Specular highlight (top-left) ── */
    const spec = ctx.createRadialGradient(
      cx - R * 0.36, cy - R * 0.36, 0,
      cx - R * 0.36, cy - R * 0.36, R * 0.55
    );
    spec.addColorStop(0,   "rgba(255,255,255,0.16)");
    spec.addColorStop(0.45,"rgba(255,255,255,0.05)");
    spec.addColorStop(1,   "rgba(255,255,255,0)");
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = spec;
    ctx.fill();

    /* ── 9. Bottom shadow ── */
    const bot = ctx.createRadialGradient(
      cx + R * 0.22, cy + R * 0.32, 0,
      cx + R * 0.22, cy + R * 0.32, R * 0.72
    );
    bot.addColorStop(0,  "rgba(0,0,0,0.28)");
    bot.addColorStop(1,  "rgba(0,0,0,0)");
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = bot;
    ctx.fill();
  }, []);

  /* ── Animation loop ── */
  useEffect(() => {
    let alive = true;
    const loop = () => {
      if (!alive) return;
      if (!dragRef.current.active) {
        rotRef.current.y += 0.0025;
        rotRef.current.x += velRef.current.x * 0.8;
        rotRef.current.y += velRef.current.y * 0.8;
        velRef.current.x *= 0.9;
        velRef.current.y *= 0.9;
        rotRef.current.x = Math.max(-1.1, Math.min(1.1, rotRef.current.x));
      }
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { alive = false; cancelAnimationFrame(rafRef.current); };
  }, [draw]);

  /* ── Canvas sizing ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = size * dpr;
    canvas.height = size * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
    draw();
  }, [size, draw]);

  /* ── Pointer events ── */
  const onDown = (e: React.PointerEvent) => {
    dragRef.current = { active: true, lastX: e.clientX, lastY: e.clientY };
    velRef.current  = { x: 0, y: 0 };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.lastX;
    const dy = e.clientY - dragRef.current.lastY;
    rotRef.current.x  += dy * 0.007;
    rotRef.current.y  += dx * 0.007;
    rotRef.current.x   = Math.max(-1.1, Math.min(1.1, rotRef.current.x));
    velRef.current.x   = dy * 0.007;
    velRef.current.y   = dx * 0.007;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;
  };
  const onUp = () => { dragRef.current.active = false; };

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size, cursor: "grab" }}
      className="touch-none select-none"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
    />
  );
}
