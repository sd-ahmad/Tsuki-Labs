// src/components/earth/Header.jsx
export default function Header() {
  return (
    <header className="w-full px-8 py-6 flex items-center justify-between sticky top-0 z-50 bg-gradient-to-b from-black/90 via-black/50 to-transparent font-mono backdrop-blur-md border-b border-zinc-800/60">
      <div className="flex items-center">
        <span className="text-xs md:text-sm font-bold tracking-widest uppercase text-zinc-200">
          NASA Space Apps 2026 // Planetary-to-Earth Analog Matcher
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs md:text-sm text-zinc-400">
        <a href="/selection" className="hover:text-white transition-colors">Selection</a>
        <span>/</span>
        <a href="/mars" className="hover:text-white transition-colors">Target</a>
        <span>/</span>
        <span className="text-zinc-100 font-bold underline underline-offset-4">Earth Analogs</span>
      </div>
    </header>
  );
}