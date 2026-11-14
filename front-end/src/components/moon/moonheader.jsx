// src/components/moon/Header.jsx

import moonMapImage from "../../assets/moonmap.jpg";

export default function Header() {
  return (
    <header 
      className="w-full px-8 py-7 flex items-center justify-between sticky top-0 z-50 relative overflow-hidden"
      style={{
        backgroundImage: `url(${moonMapImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 35%',
      }}
    >
      {/* Semi-transparent overlay with a smooth bottom fade gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black/95 backdrop-blur-[0.5px]" />

      {/* Left Title Content */}
      <div className="flex items-center font-mono relative z-10">
        <span className="text-sm font-bold tracking-widest uppercase text-zinc-200 drop-shadow-md">
          NASA Space Apps 2026 // Project Wakusei Base
        </span>
      </div>

      {/* Navigation Breadcrumb (Showing Moon) */}
      <div className="relative z-10 flex items-center gap-2 font-mono text-sm text-zinc-400">
        <a href="/" className="hover:text-zinc-200 transition-colors">Home</a>
        <span>/</span>
        <a href="/selection" className="hover:text-zinc-200 transition-colors">Selection</a>
        <span>/</span>
        <span className="text-zinc-100 font-bold underline underline-offset-4">Moon</span>
      </div>
    </header>
  );
}