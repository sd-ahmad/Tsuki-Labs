// src/components/earth/EarthControls.jsx
export default function EarthControls({
  preset, setPreset,
  body, setBody,
  lon, setLon,
  lat, setLat,
  categories, category, setCategory,
  onRunQuery, error
}) {
  return (
    <div className="w-full rounded-2xl border-2 border-zinc-700/80 bg-[#121317] p-6 shadow-2xl font-mono text-zinc-200">
      <h1 className="text-lg font-bold text-white mb-4">Backend Analog Matcher Control Panel</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
        <div>
          <label className="block text-xs text-zinc-400 mb-1.5">Preset Site</label>
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-zinc-700 bg-[#0e1422] text-white text-sm focus:outline-none focus:border-cyan-400"
          >
            <option value="">-- Custom Coordinates --</option>
            <option value="mars,77.58,18.38">Mars: Jezero Crater</option>
            <option value="mars,137.8,-5.4">Mars: Gale Crater</option>
            <option value="mars,-133.8,18.65">Mars: Olympus Mons</option>
            <option value="mars,-59.2,-13.9">Mars: Valles Marineris</option>
            <option value="mars,-179.5,89.5">Mars: North Polar Cap</option>
            <option value="moon,23.47,0.67">Moon: Mare Tranquillitatis</option>
            <option value="moon,0.0,-89.5">Moon: Shackleton Crater</option>
            <option value="moon,-11.22,-43.30">Moon: Tycho Crater</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1.5">Body</label>
          <select
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-zinc-700 bg-[#0e1422] text-white text-sm focus:outline-none focus:border-cyan-400"
          >
            <option value="mars">Mars</option>
            <option value="moon">Moon</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1.5">Longitude (°)</label>
          <input
            type="number"
            step="0.01"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-zinc-700 bg-[#0e1422] text-white text-sm focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1.5">Latitude (°)</label>
          <input
            type="number"
            step="0.01"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-zinc-700 bg-[#0e1422] text-white text-sm focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1.5">Priority Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-zinc-700 bg-[#0e1422] text-white text-sm focus:outline-none focus:border-cyan-400"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <button
            onClick={onRunQuery}
            className="w-full py-2.5 px-4 rounded-xl font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-colors cursor-pointer text-sm shadow-lg shadow-cyan-500/20"
          >
            Find Earth Analogs
          </button>
        </div>
      </div>

      {error && <div className="text-rose-400 text-xs mt-3">{error}</div>}
    </div>
  );
}