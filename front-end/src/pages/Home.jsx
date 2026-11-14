import React from 'react';
import SpaceWallpaperInteractive from '../components/selection/SpaceWallpaperInteractive';

export default function HomePage() {
  const handleExplore = () => {
    window.location.href = '/selection'; 
  };

  return (
    <div className="relative min-h-screen w-full text-white flex items-center justify-center px-8 md:px-16 lg:px-24 py-12 overflow-hidden">
      
      {/* Interactive Background */}
      <SpaceWallpaperInteractive />
      <div className="absolute inset-0 bg-black/50 pointer-events-none z-0"></div>

      {/* Main Two-Column Grid Container */}
      <div className="relative z-10 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* LEFT COLUMN: Text & Button (Takes up 7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          
          {/* Top Tag */}
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-cyan-400">
              ✦ 2026 NASA SPACE APPS CHALLENGE
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Identify Earth Locations That Analog Permanent Moon Base Locations and Mars
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-gray-300 max-w-xl mb-10 leading-relaxed font-light">
            Selecting future landing sites depends on topography, geology, and environment. Using open Earth, Moon, and Mars data from NASA and other agencies, we identify and characterize new terrestrial analogs—from deserts and volcanic terrains to caves—sharing conditions with the lunar and Martian surface.
          </p>

          {/* Start Exploring Button */}
          <div className="flex flex-wrap items-center gap-4 w-full">
            <button 
              onClick={handleExplore}
              className="flex items-center gap-3 px-7 py-4 rounded-full font-semibold text-black bg-white hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-lg"
            >
              Start Exploring
              <span className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs">
                ↗
              </span>
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: 5 Team Bubbles Cluster (Takes up 5 cols) */}
        <div className="lg:col-span-5 relative w-full h-[450px] flex items-center justify-center">
          
          {/* Background ambient glow behind bubbles */}
          <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Bubble 1: Center/Main */}
          <div className="absolute w-36 h-36 rounded-full border-2 border-cyan-400/60 overflow-hidden shadow-[0_0_25px_rgba(6,182,212,0.4)] transform -translate-x-6 -translate-y-8 transition-transform duration-500 hover:scale-110 hover:z-20 cursor-pointer">
            <img 
              src="ngr" 
              alt="Team Member 1" 
              className="w-full h-full object-cover filter saturate-50 contrast-125 hover:saturate-100 transition-all"
            />
          </div>

          {/* Bubble 2: Top Right */}
          <div className="absolute w-28 h-28 rounded-full border-2 border-purple-400/60 overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.4)] transform translate-x-28 -translate-y-24 transition-transform duration-500 hover:scale-110 hover:z-20 cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80" 
              alt="Team Member 2" 
              className="w-full h-full object-cover filter saturate-50 contrast-125 hover:saturate-100 transition-all"
            />
          </div>

          {/* Bubble 3: Bottom Left */}
          <div className="absolute w-32 h-32 rounded-full border-2 border-pink-500/60 overflow-hidden shadow-[0_0_20px_rgba(236,72,153,0.4)] transform -translate-x-32 translate-y-20 transition-transform duration-500 hover:scale-110 hover:z-20 cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80" 
              alt="Team Member 3" 
              className="w-full h-full object-cover filter saturate-50 contrast-125 hover:saturate-100 transition-all"
            />
          </div>

          {/* Bubble 4: Bottom Right */}
          <div className="absolute w-28 h-28 rounded-full border-2 border-blue-400/60 overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.4)] transform translate-x-24 translate-y-28 transition-transform duration-500 hover:scale-110 hover:z-20 cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80" 
              alt="Team Member 4" 
              className="w-full h-full object-cover filter saturate-50 contrast-125 hover:saturate-100 transition-all"
            />
          </div>

          {/* Bubble 5: Top Left (Smaller accent bubble or NASA badge style) */}
          <div className="absolute w-20 h-20 rounded-full border-2 border-emerald-400/60 overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.4)] transform -translate-x-36 -translate-y-32 transition-transform duration-500 hover:scale-110 hover:z-20 cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80" 
              alt="Team Member 5" 
              className="w-full h-full object-cover filter saturate-50 contrast-125 hover:saturate-100 transition-all"
            />
          </div>

        </div>

      </div>

    </div>
  );
}