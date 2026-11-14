import React from 'react';
import { useNavigate } from 'react-router-dom';
import StartButton from '../components/home/start';
import SpaceWallpaper from '../components/home/SpaceWallpaper'; // Make sure this path is correct

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full text-white flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* Live animated space background */}
      <SpaceWallpaper />

      {/* Clean minimal foreground content */}
      <div className="relative z-10 flex flex-col items-center">
        <StartButton 
          text="Start Mission" 
          onClick={() => navigate('/selection')} 
        />
      </div>

    </div>
  );
}