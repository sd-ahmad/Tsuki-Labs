import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, ArrowRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#05070d] text-white flex flex-col items-center justify-center p-6">
      <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm mb-4">
        <Rocket className="w-5 h-5" />
        <span>NASA SPACE APPS 2026 // TSUKI LABS</span>
      </div>

      <h1 className="text-4xl md:text-6xl font-bold text-center max-w-3xl mb-6">
        Planetary Analog Explorer
      </h1>

      <p className="text-slate-400 text-center max-w-xl mb-8">
        Discover Earth environments that mirror the Moon and Mars using open NASA satellite data.
      </p>

      {/* Start Button navigating to Selection Page */}
      <button
        onClick={() => navigate('/selection')}
        className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-bold text-lg shadow-lg shadow-cyan-500/25 transition-all duration-200 cursor-pointer"
      >
        <span>Start Mission</span>
        <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
      </button>
    </div>
  );
}