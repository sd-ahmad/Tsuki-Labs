// src/pages/Moon.jsx

import MoonMap from "../components/moon/moonmap";

export default function Moon() {
  return (
    <div className="min-h-screen w-full bg-[#1b1c20] text-slate-200 p-6 flex flex-col justify-between">
      {/* Blank space for top breadcrumb text ("Home / Selection / Moon") */}
      <div className="h-8 w-full" />

      {/* Main layout matching wireframe */}
      <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left side: 2D Moon Map + HUD Telemetry Box below the map card */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <MoonMap />

          {/* Blank spaces for Back and Next buttons */}
          <div className="grid grid-cols-2 gap-4 h-14">
            <div className="w-full h-full" />
            <div className="w-full h-full" />
          </div>
        </div>

        {/* Right side: Blank space for Criterias box (~35% width) */}
        <div className="lg:col-span-4 w-full h-full" />
      </div>

      {/* Blank space at the very bottom */}
      <div className="h-6 w-full" />
    </div>
  );
}