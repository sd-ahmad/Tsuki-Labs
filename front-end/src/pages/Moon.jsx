// src/pages/Moon.jsx

import { useState } from "react";
import MoonMap from "../components/moon/moonmap";

const mockLocations = [
  {
    id: "shackleton",
    name: "Shackleton Crater",
    coordinates: { x: 300, y: 350, lat: "89.9°S", lon: "0.0°E" },
  },
  {
    id: "mare-tranquillitatis",
    name: "Mare Tranquillitatis",
    coordinates: { x: 600, y: 220, lat: "8.5°N", lon: "31.4°E" },
  },
  {
    id: "aristarchus",
    name: "Aristarchus Plateau",
    coordinates: { x: 450, y: 150, lat: "23.7°N", lon: "47.4°W" },
  },
];

export default function Moon() {
  const [selectedLocationId, setSelectedLocationId] = useState(null);

  return (
    <main className="min-h-screen bg-gray-950 p-8 text-white">
      <MoonMap
        locations={mockLocations}
        selectedLocationId={selectedLocationId}
        onSelectLocation={setSelectedLocationId}
      />
    </main>
  );
}