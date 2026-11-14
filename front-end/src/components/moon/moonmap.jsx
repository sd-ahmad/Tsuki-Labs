// src/components/moon/MoonMap.jsx

import { useRef, useState } from "react";
import moonMapImage from "../../assets/moonmap.jpg";

export default function MoonMap() {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [cursorCoords, setCursorCoords] = useState(null);

  const svgRef = useRef(null);
  const dragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });

  const MIN_ZOOM = 1;
  const MAX_ZOOM = 8;
  const VIEWBOX_WIDTH = 8192;
  const VIEWBOX_HEIGHT = 4096;

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
      const rawLon = (mapX / VIEWBOX_WIDTH) * 360 - 180;
      const rawLat = 90 - (mapY / VIEWBOX_HEIGHT) * 180;

      const formattedLon = `${Math.abs(rawLon).toFixed(2)}° ${rawLon >= 0 ? "East" : "West"}`;
      const formattedLat = `${Math.abs(rawLat).toFixed(2)}° ${rawLat >= 0 ? "North" : "South"}`;

      setCursorCoords({ lat: formattedLat, lon: formattedLon });
    } else {
      setCursorCoords(null);
    }

    if (!dragging.current) return;

    const dxScreen = e.clientX - lastPosition.current.x;
    const dyScreen = e.clientY - lastPosition.current.y;

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

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Map Box Container */}
      <div className="w-full aspect-[2/1] rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-black relative select-none">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          className="w-full h-full block cursor-crosshair touch-none active:cursor-grabbing object-cover"
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          onPointerCancel={handlePointerUp}
        >
          <g transform={`translate(${offset.x} ${offset.y}) scale(${zoom})`}>
            {/* Imported 8192x4096 JPG Lunar Map */}
            <image
              href={moonMapImage}
              x="0"
              y="0"
              width={VIEWBOX_WIDTH}
              height={VIEWBOX_HEIGHT}
              preserveAspectRatio="none"
            />
          </g>
        </svg>
      </div>

      {/* HUD Telemetry Bar positioned completely outside and beneath the map box */}
      <div className="w-full flex justify-center">
        <div className="flex items-center gap-4 rounded-xl bg-[#141519] border border-slate-700 px-6 py-2.5 font-mono text-xs text-slate-200 shadow-xl">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          <span className="text-blue-300 font-semibold">
            Latitude: {cursorCoords ? cursorCoords.lat : "---"}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-300 font-semibold">
            Longitude: {cursorCoords ? cursorCoords.lon : "---"}
          </span>
        </div>
      </div>
    </div>
  );
}