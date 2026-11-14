// src/pages/Moon.jsx

import { useState } from "react";
import MoonMap from "../components/moon/MoonMap";
import CriteriaPanel from "../components/moon/CriteriaPanel";

export default function Moon() {
  const [selectedCoords, setSelectedCoords] = useState(null);

  return (
    <div className="min-h-screen w-full bg-[#18191e] text-zinc-100 p-6 flex flex-col justify-between">
      {/* Blank space for top breadcrumb text ("Home / Selection / Moon") */}
      <div className="h-8 w-full" />

      {/* Main layout matching wireframe */}
      <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left side: 2D Moon Map + live hover HUD below */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <MoonMap onSelectCoords={(coords) => setSelectedCoords(coords)} />

          {/* Blank spaces for Back and Next buttons */}
          <div className="grid grid-cols-2 gap-4 h-16">
            <div className="w-full h-full" />
            <div className="w-full h-full" />
          </div>
        </div>

        {/* Right side: Priority box + Selected Point Coordinates HUD */}
        <div className="lg:col-span-4 w-full h-full">
          <CriteriaPanel selectedCoords={selectedCoords} />
        </div>
      </div>

      {/* Blank space at the very bottom */}
      <div className="h-6 w-full" />
    </div>
  );
}