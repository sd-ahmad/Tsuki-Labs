import React from 'react';
import SpaceWallpaperInteractive from '../components/SpaceWallpaperInteractive';

export default function SelectionPage() {
  return (
    <div className="relative min-h-screen w-full text-white flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* Interactive background wallpaper */}
      <SpaceWallpaperInteractive />

      {/* Foreground container (add your selection cards, grid, or buttons here) */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center justify-center">
        {/* Text removed. Place your interactive mission components or cards here. */}
      </div>

    </div>
  );
}