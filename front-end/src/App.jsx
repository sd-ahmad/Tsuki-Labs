import React, { useState } from 'react';
import Home from './pages/Home';
import SelectionPage from './pages/SelectionPage';

export default function App() {
  // Page states: 'home' | 'selection' | 'dashboard'
  const [currentView, setCurrentView] = useState('home');
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  if (currentView === 'home') {
    return <Home onStartExploring={() => setCurrentView('selection')} />;
  }

  if (currentView === 'selection') {
    return (
      <SelectionPage 
        onBack={() => setCurrentView('home')}
        onSelectTarget={(planet) => {
          setSelectedPlanet(planet);
          setCurrentView('dashboard');
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#05070d] text-white p-8">
      <button 
        onClick={() => setCurrentView('selection')}
        className="px-4 py-2 text-xs font-mono border border-slate-700 rounded-lg hover:bg-slate-800 mb-6 cursor-pointer"
      >
        ← CHANGE TARGET ({selectedPlanet?.toUpperCase()})
      </button>
      <h1 className="text-3xl font-bold">Loaded Target: {selectedPlanet}</h1>
      <p className="text-slate-400 mt-2">Ready to render the Leaflet map and analog telemetry next!</p>
    </div>
  );
}