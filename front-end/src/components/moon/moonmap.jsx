// src/components/moon/MoonMap.jsx

import { useRef, useState } from "react";

// Exploration sites mapped to 4K Equirectangular coordinates (4000x2000)
const LUNAR_SITES = [
  {
    id: "shackleton",
    name: "Shackleton Crater (South Pole)",
    coords: { x: 2000, y: 1880 },
    lat: "89.9° S",
    lon: "0.0° E",
  },
  {
    id: "mare-tranquillitatis",
    name: "Mare Tranquillitatis (Apollo 11)",
    coords: { x: 2750, y: 920 },
    lat: "8.5° N",
    lon: "31.4° E",
  },
  {
    id: "oceanus-procellarum",
    name: "Oceanus Procellarum",
    coords: { x: 900, y: 850 },
    lat: "18.4° N",
    lon: "57.4° W",
  },
  {
    id: "mare-imbrium",
    name: "Mare Imbrium",
    coords: { x: 1700, y: 620 },
    lat: "32.8° N",
    lon: "15.6° W",
  },
  {
    id: "aristarchus",
    name: "Aristarchus Plateau",
    coords: { x: 1200, y: 550 },
    lat: "23.7° N",
    lon: "47.4° W",
  },
];

export default function MoonMap({
  selectedLocationId = null,
  onSelectLocation = () => {},
}) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hoveredSiteId, setHoveredSiteId] = useState(null);
  const [cursorCoords, setCursorCoords] = useState(null);

  const svgRef = useRef(null);
  const dragging = useRef(false);
  const hasDragged = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });

  const MIN_ZOOM = 1;
  const MAX_ZOOM = 6;
  const VIEWBOX_WIDTH = 4000;
  const VIEWBOX_HEIGHT = 2000;

  const clampOffset = (x, y, currentZoom) => {
    const maxPanX = 0;
    const minPanX = VIEWBOX_WIDTH - VIEWBOX_WIDTH * currentZoom;
    const maxPanY = 0;
    const minPanY = VIEWBOX_HEIGHT - VIEWBOX_HEIGHT * currentZoom;

    return {
      x: Math.min(maxPanX, Math.max(minPanX, x)),
      y: Math.min(maxPanY, Math.max(minPanY, y)),
    };
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * VIEWBOX_WIDTH;
    const mouseY = ((e.clientY - rect.top) / rect.height) * VIEWBOX_HEIGHT;

    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom * zoomFactor));

    if (nextZoom === zoom) return;

    const scaleRatio = nextZoom / zoom;
    const nextX = mouseX - (mouseX - offset.x) * scaleRatio;
    const nextY = mouseY - (mouseY - offset.y) * scaleRatio;

    setZoom(nextZoom);
    setOffset(clampOffset(nextX, nextY, nextZoom));
  };

  const handlePointerDown = (e) => {
    dragging.current = true;
    hasDragged.current = false;
    lastPosition.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();

    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    
    const svgX = (clientX / rect.width) * VIEWBOX_WIDTH;
    const svgY = (clientY / rect.height) * VIEWBOX_HEIGHT;

    const mapX = (svgX - offset.x) / zoom;
    const mapY = (svgY - offset.y) / zoom;

    if (mapX >= 0 && mapX <= VIEWBOX_WIDTH && mapY >= 0 && mapY <= VIEWBOX_HEIGHT) {
      const rawLon = ((mapX / VIEWBOX_WIDTH) * 360) - 180;
      const rawLat = 90 - (mapY / VIEWBOX_HEIGHT) * 180;

      const formattedLon = `${Math.abs(rawLon).toFixed(2)}° ${rawLon >= 0 ? "E" : "W"}`;
      const formattedLat = `${Math.abs(rawLat).toFixed(2)}° ${rawLat >= 0 ? "N" : "S"}`;
      
      setCursorCoords({ lat: formattedLat, lon: formattedLon, screenX: clientX, screenY: clientY });
    } else {
      setCursorCoords(null);
    }

    if (!dragging.current) return;

    const dxScreen = e.clientX - lastPosition.current.x;
    const dyScreen = e.clientY - lastPosition.current.y;

    if (Math.abs(dxScreen) > 2 || Math.abs(dyScreen) > 2) {
      hasDragged.current = true;
    }

    const dxSvg = (dxScreen / rect.width) * VIEWBOX_WIDTH;
    const dySvg = (dyScreen / rect.height) * VIEWBOX_HEIGHT;

    setOffset((prev) => clampOffset(prev.x + dxSvg, prev.y + dySvg, zoom));
    lastPosition.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    dragging.current = false;
  };

  const handlePointerLeave = () => {
    dragging.current = false;
    setCursorCoords(null);
  };

  const handleReset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl select-none">
      {/* HUD Controls */}
      <div className="absolute right-5 top-5 z-20 flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono shadow">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>4K LRO EQUIRECTANGULAR MAPPING</span>
        </div>
        <button
          onClick={() => {
            const nextZoom = Math.min(MAX_ZOOM, zoom + 0.5);
            setZoom(nextZoom);
            setOffset((prev) => clampOffset(prev.x, prev.y, nextZoom));
          }}
          className="rounded-lg bg-slate-800 px-3.5 py-2 text-sm font-bold text-white border border-slate-600 hover:bg-slate-700 transition"
        >
          +
        </button>
        <button
          onClick={() => {
            const nextZoom = Math.max(MIN_ZOOM, zoom - 0.5);
            setZoom(nextZoom);
            setOffset((prev) => clampOffset(prev.x, prev.y, nextZoom));
          }}
          className="rounded-lg bg-slate-800 px-3.5 py-2 text-sm font-bold text-white border border-slate-600 hover:bg-slate-700 transition"
        >
          −
        </button>
        <button
          onClick={handleReset}
          className="rounded-lg bg-slate-800 px-3.5 py-2 text-xs font-semibold text-white border border-slate-600 hover:bg-slate-700 transition"
        >
          Reset View
        </button>
      </div>

      {/* Interactive 4K SVG Map Viewport */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        className="h-[600px] w-full cursor-crosshair touch-none active:cursor-grabbing bg-[#18181b]"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerUp}
      >
        <g transform={`translate(${offset.x} ${offset.y}) scale(${zoom})`}>
          {/* Base Lunar Highlands (Clean Light Gray Surface) */}
          <rect
            x="0"
            y="0"
            width={VIEWBOX_WIDTH}
            height={VIEWBOX_HEIGHT}
            fill="#d4d4d8"
          />

          {/* Crisp Dark Basaltic Maria (Lunar Seas) */}
          <g fill="#3f3f46">
            {/* Oceanus Procellarum */}
            <path d="M 800,700 Q 1100,450 1450,750 T 1500,1350 Q 1300,1650 950,1500 T 800,700 Z" />
            {/* Mare Imbrium */}
            <path d="M 1500,450 Q 1950,300 2250,750 T 1850,1150 Q 1500,1050 1500,450 Z" />
            {/* Mare Serenitatis & Tranquillitatis */}
            <path d="M 2350,550 Q 2850,450 3150,850 T 3000,1400 Q 2450,1450 2350,1050 Z" />
            {/* Mare Nubium */}
            <path d="M 1600,1350 Q 1950,1250 2150,1600 T 1750,1850 Q 1550,1750 1600,1350 Z" />
            {/* Mare Crisium */}
            <path d="M 3200,700 Q 3450,650 3550,800 T 3450,950 Q 3200,950 3200,700 Z" />
          </g>

          {/* Equirectangular Grid Lines */}
          {[500, 1000, 1500].map((y) => (
            <line
              key={`lat-${y}`}
              x1="0"
              y1={y}
              x2={VIEWBOX_WIDTH}
              y2={y}
              stroke="#a1a1aa"
              strokeWidth="3"
              strokeOpacity="0.4"
              strokeDasharray="30 30"
            />
          ))}
          {[1000, 2000, 3000].map((x) => (
            <line
              key={`lon-${x}`}
              x1={x}
              y1="0"
              x2={x}
              y2={VIEWBOX_HEIGHT}
              stroke="#a1a1aa"
              strokeWidth="3"
              strokeOpacity="0.4"
              strokeDasharray="30 30"
            />
          ))}

          {/* Landing / Exploration Sites */}
          {LUNAR_SITES.map((site) => {
            const isSelected = selectedLocationId === site.id;
            const isHovered = hoveredSiteId === site.id;
            const markerScale = 1 / Math.sqrt(zoom);

            return (
              <g
                key={site.id}
                transform={`translate(${site.coords.x}, ${site.coords.y}) scale(${markerScale})`}
                onMouseEnter={() => setHoveredSiteId(site.id)}
                onMouseLeave={() => setHoveredSiteId(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!hasDragged.current) {
                    onSelectLocation(site.id);
                  }
                }}
                className="cursor-pointer"
              >
                {isSelected && (
                  <circle r="70" fill="none" stroke="#3b82f6" strokeWidth="5" opacity="0.7" className="animate-ping" />
                )}
                <circle
                  r={isSelected ? 50 : 35}
                  fill={isSelected ? "rgba(37, 99, 235, 0.5)" : "rgba(24, 24, 27, 0.85)"}
                  stroke={isSelected ? "#60a5fa" : isHovered ? "#ffffff" : "#d4d4d8"}
                  strokeWidth={isSelected ? "6" : "3"}
                />
                <circle r="12" fill={isSelected ? "#60a5fa" : "#ffffff"} stroke="#09090b" strokeWidth="4" />

                <g transform="translate(0, -65)">
                  <rect
                    x="-180"
                    y="-38"
                    width="360"
                    height="44"
                    rx="6"
                    fill="#09090b"
                    fillOpacity="0.95"
                    stroke={isSelected ? "#3b82f6" : "rgba(255, 255, 255, 0.3)"}
                    strokeWidth="2"
                  />
                  <text textAnchor="middle" y="-16" fill="#60a5fa" fontSize="14" fontFamily="monospace" fontWeight="bold">
                    {site.lat} | {site.lon}
                  </text>
                  <text textAnchor="middle" y="4" fill="#ffffff" fontSize="15" fontWeight="600">
                    {site.name}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating Cursor Coordinate Tooltip */}
      {cursorCoords && (
        <div
          className="pointer-events-none absolute z-30 rounded-lg bg-slate-900/95 border border-blue-500/50 px-3 py-1.5 font-mono text-xs text-white shadow-xl backdrop-blur-md transform -translate-x-1/2 -translate-y-12 transition-all duration-75"
          style={{ left: cursorCoords.screenX, top: cursorCoords.screenY }}
        >
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            <span className="text-blue-300 font-semibold">LAT: {cursorCoords.lat}</span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-300 font-semibold">LON: {cursorCoords.lon}</span>
          </div>
        </div>
      )}

      {/* Bottom Telemetry Bar */}
      <div className="absolute bottom-4 left-4 flex items-center gap-4 rounded-xl bg-slate-900/90 px-4 py-2 text-xs font-mono text-slate-300 border border-slate-700 shadow-lg">
        <span>ZOOM: {Math.round(zoom * 100)}%</span>
        <span className="text-slate-600">|</span>
        <span>PROJECTION: EQUIRECTANGULAR (4000x2000)</span>
        <span className="text-slate-600">|</span>
        <span className="text-blue-400">Hover to track live coordinates</span>
      </div>
    </div>
  );
}