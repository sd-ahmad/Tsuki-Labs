// src/components/mars/Buttons.jsx

export default function Buttons({ onBack = () => {}, onForward = () => {} }) {
  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-lg mx-auto">
      <button
        onClick={onBack}
        className="w-full rounded-xl px-4 py-3 text-sm font-bold tracking-wide transition-all duration-300 ease-out border-2 border-amber-800/60 bg-[#201714] text-amber-200 hover:bg-amber-500/20 hover:border-orange-500 hover:text-white hover:scale-[1.02] flex items-center justify-center font-mono cursor-pointer shadow-lg"
      >
        ← Moon View
      </button>
      <button
        onClick={onForward}
        className="w-full rounded-xl px-4 py-3 text-sm font-bold tracking-wide transition-all duration-300 ease-out border-2 border-orange-400 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white hover:scale-[1.02] flex items-center justify-center font-mono cursor-pointer shadow-lg shadow-orange-600/30"
      >
        View Earth Locations →
      </button>
    </div>
  );
}