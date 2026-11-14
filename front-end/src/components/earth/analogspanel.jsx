// src/components/earth/AnalogsPanel.jsx
export default function AnalogsPanel({ sourceLabel, priorityCategory, candidates, onSelectCard }) {
  return (
    <div className="flex flex-col h-full w-full rounded-2xl border-2 border-zinc-700/80 bg-[#121317] p-6 shadow-2xl text-zinc-200 font-mono relative overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
        <span className="text-sm font-bold text-white truncate max-w-[60%]">{sourceLabel || "Candidate Summary"}</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-cyan-400 border border-zinc-700 truncate">
          Mode: {priorityCategory || "All Conditions"}
        </span>
      </div>

      <div className="flex flex-col gap-3.5 flex-1 justify-between">
        {candidates.map((c, i) => (
          <div
            key={i}
            onClick={() => onSelectCard && onSelectCard(c)}
            className="bg-[#18191f] border border-zinc-800 hover:border-cyan-400 rounded-xl p-4 transition-all cursor-pointer flex flex-col gap-2 shadow-md group"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold text-white group-hover:text-cyan-400 transition-colors">
                #{c.rank} {c.location_name}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold border bg-cyan-500/20 text-cyan-400 border-cyan-500/40">
                {c.similarity_pct}% match
              </span>
            </div>
            <div className="text-xs text-zinc-400">
              Lat: {c.earth_latitude.toFixed(3)}, Lon: {c.earth_longitude.toFixed(3)}
            </div>
            <div className="text-[11px] text-zinc-500 truncate bg-black/40 px-2 py-1 rounded font-mono">
              Geology: {c.earth_geology_desc || "N/A"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}