import React from 'react';
import { useNavigate } from 'react-router-dom';
import StartButton from '../components/home/start';
import spaceBg from '../assets/space-bg.jpg';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div 
      className="relative min-h-screen w-full text-white flex flex-col items-center justify-center p-6 overflow-hidden bg-cover bg-center bg-fixed"
      style={{ 
        backgroundImage: `linear-gradient(rgba(3, 7, 18, 0.2), rgba(3, 7, 18, 0.2)), url(${spaceBg})` 
      }}
    >
      <div className="relative z-10 flex flex-col items-center">
        <StartButton 
          text="Start Mission" 
          onClick={() => navigate('/selection')} 
        />
      </div>
    </div>
  );
}