// src/components/global/Header.jsx

import Navibar from "./navibar";

export default function Header() {
  return (
    <header className="w-full border-b border-zinc-800 bg-[#121317]/80 backdrop-blur-md px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3 font-mono">
        <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 animate-pulse" />
        <span className="text-sm font-bold tracking-widest uppercase text-zinc-300">
          NASA Space Apps 2026 // Project Wakusei
        </span>
      </div>
      <Navibar />
    </header>
  );
}