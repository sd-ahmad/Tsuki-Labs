import React from 'react';
import SpaceWallpaperInteractive from '../components/selection/SpaceWallpaperInteractive';
import MoonViewer from '../components/selection/MoonViewer';

export default function SelectionPage() {
  const handleMoonClick = () => {
    window.location.href = '/moon'; 
  };

  const handleMarsClick = () => {
    window.location.href = '/mars'; 
  };

  return (
    <div className="relative min-h-screen w-full text-white flex flex-col items-center justify-center p-6 overflow-hidden">
      
      <SpaceWallpaperInteractive />

      {/* Optional Central Title Header */}
      <div className="relative z-10 mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-[0.4em] text-gray-200">
          SELECT DESTINATION
        </h1>
        <p className="mt-2 text-sm text-gray-400 tracking-widest uppercase">
          Choose your planetary path
        </p>
      </div>

      {/* Main Container: Centered with a large gap to separate the planets */}
      <div className="relative z-10 w-full max-w-7xl flex flex-col md:flex-row items-center justify-center gap-24 px-8">
        
        {/* Left Side: Moon */}
        <div 
          onClick={handleMoonClick}
          className="group flex flex-col items-center cursor-pointer"
        >
          <div className="w-[520px] h-[520px] flex items-center justify-center">
            <div className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-110">
              <MoonViewer modelUrl="/models/moon_small.glb" />
            </div>
          </div>
          
          <h2 className="mt-8 text-2xl font-bold tracking-[0.35em] text-gray-300 transition-all duration-300 group-hover:text-white group-hover:tracking-[0.45em]">
            MOON
          </h2>
          <p className="mt-1 text-xs uppercase tracking-widest text-gray-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Launch Mission
          </p>
        </div>

        {/* Right Side: Mars */}
        <div 
          onClick={handleMarsClick}
          className="group flex flex-col items-center cursor-pointer"
        >
          <div className="w-[520px] h-[520px] flex items-center justify-center">
            <div className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-110">
              <MoonViewer modelUrl="/models/mars.glb" />
            </div>
          </div>
          
          <h2 className="mt-8 text-2xl font-bold tracking-[0.35em] text-gray-300 transition-all duration-300 group-hover:text-red-400 group-hover:tracking-[0.45em]">
            MARS
          </h2>
          <p className="mt-1 text-xs uppercase tracking-widest text-gray-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Launch Mission
          </p>
        </div>

      </div>

    </div>
  );
}