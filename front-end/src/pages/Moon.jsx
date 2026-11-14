// src/pages/Moon.jsx

import { useState } from "react";
import MoonMap from "../components/moon/MoonMap";
import CriteriaPanel from "../components/moon/CriteriaPanel";
import Buttons from "../components/moon/buttons";
import Header from "../components/global/header";

export default function Moon() {
  const [selectedCoords, setSelectedCoords] = useState(null);

  const handleBack = () => {
    window.location.href = "/selection"; 
  };

  const handleForward = () => {
    window.location.href = "/earth";
  };

  return (
    <div className="min-h-screen w-full bg-[#18191e] text-zinc-100 flex flex-col justify-between selection:bg-zinc-700 selection:text-white">
      {/* Global Header with Navibar */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1700px] mx-auto p-8 flex flex-col justify-center">
        {/* Grid Layout: Map & Controls (Vertically centered against priority panel) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          {/* Left Column: 2D Moon Map, Buttons in-between, and Lat/Long HUD at the bottom */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <MoonMap onSelectCoords={(coords) => setSelectedCoords(coords)} />
            <Buttons onBack={handleBack} onForward={handleForward} />
          </div>

          {/* Right Column: Priority Criteria Panel & Target Coordinates HUD */}
          <div className="lg:col-span-4 w-full h-full">
            <CriteriaPanel selectedCoords={selectedCoords} />
          </div>
        </div>
      </main>
    </div>
  );
}