// src/components/earth/ComparisonTable.jsx
export default function ComparisonTable({ comparisonRows, sourceLabel }) {
  return (
    <div className="w-full rounded-2xl border-2 border-zinc-700/80 bg-[#121317] p-6 shadow-2xl font-mono text-zinc-200 overflow-hidden flex flex-col">
      <h2 className="text-base font-bold text-white mb-4">Comparison Table (Priority Criteria First)</h2>
      
      <div className="max-h-[440px] overflow-auto border border-zinc-800 rounded-xl">
        <table className="w-full border-collapse text-xs md:text-sm">
          <thead>
            <tr className="bg-[#18191f] text-zinc-400 border-b border-zinc-800 sticky top-0 z-10">
              <th className="text-left p-3 font-semibold">Metric</th>
              <th className="text-left p-3 font-semibold">Category</th>
              <th className="text-left p-3 font-semibold">{sourceLabel || "Source"}</th>
              <th className="text-left p-3 font-semibold">Earth #1</th>
              <th className="text-left p-3 font-semibold">Earth #2</th>
              <th className="text-left p-3 font-semibold">Earth #3</th>
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((r, i) => (
              <tr
                key={i}
                className={`border-b border-zinc-800/80 transition-colors ${
                  r.is_priority ? "bg-amber-500/10 font-semibold" : "hover:bg-zinc-800/40"
                }`}
              >
                <td className="p-3 flex items-center gap-2">
                  <span>{r.label}</span>
                  {r.is_priority && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold">
                      PRIORITY
                    </span>
                  )}
                </td>
                <td className="p-3 text-zinc-400">{r.category}</td>
                <td className="p-3">{r.source?.display || "N/A"}</td>
                {r.candidates.map((c, idx) => (
                  <td key={idx} className="p-3">{c.display}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}