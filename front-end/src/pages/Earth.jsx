// src/pages/Earth.jsx
import { useState, useEffect } from "react";
import Header from "../components/earth/earthheader";
import EarthControls from "../components/earth/EarthControls";
import EarthMap from "../components/earth/earthmap";
import AnalogsPanel from "../components/earth/AnalogsPanel";
import AnalyticsCharts from "../components/earth/analyticscharts";
import ComparisonTable from "../components/earth/comparisontable";

const STATIC_STARS = [
  { top: "5%", left: "4%", size: "w-1 h-1", opacity: "opacity-70", delay: "0s" },
  { top: "12%", left: "25%", size: "w-1.5 h-1.5", opacity: "opacity-40", delay: "0.5s" },
  { top: "22%", left: "65%", size: "w-1 h-1", opacity: "opacity-65", delay: "0.8s" },
  { top: "35%", left: "18%", size: "w-0.5 h-0.5", opacity: "opacity-50", delay: "1.9s" },
  { top: "45%", left: "85%", size: "w-1 h-1", opacity: "opacity-55", delay: "2.2s" },
  { top: "58%", left: "29%", size: "w-0.5 h-0.5", opacity: "opacity-50", delay: "1.8s" },
  { top: "71%", left: "49%", size: "w-0.5 h-0.5", opacity: "opacity-55", delay: "2.3s" },
  { top: "84%", left: "98%", size: "w-1 h-1", opacity: "opacity-65", delay: "0.5s" }
];

const FALLING_STARS = [
  { left: "10%", height: "h-[110px]", duration: "12s", delay: "0s" },
  { left: "45%", height: "h-[120px]", duration: "10s", delay: "3s" },
  { left: "80%", height: "h-[115px]", duration: "14s", delay: "1.5s" }
];

const API_BASE = "https://tsuki-labs.onrender.com";

function readSavedAnalog() {
  try {
    const raw = sessionStorage.getItem("analogResult");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function Earth() {
  const [initialSaved] = useState(() => readSavedAnalog());

  const [preset, setPreset] = useState(() => (initialSaved ? "" : "mars,77.58,18.38"));
  const [body, setBody] = useState(() => initialSaved?.source?.body || sessionStorage.getItem("lastBody") || "mars");
  const [lon, setLon] = useState(() =>
    initialSaved?.source?.longitude != null ? String(initialSaved.source.longitude) : "77.58"
  );
  const [lat, setLat] = useState(() =>
    initialSaved?.source?.latitude != null ? String(initialSaved.source.latitude) : "18.38"
  );
  const [categories, setCategories] = useState(["All Conditions"]);
  const [category, setCategory] = useState(() => initialSaved?.priority_category || "All Conditions");

  const [queryData, setQueryData] = useState(() =>
    initialSaved || {
      source: { label: "Target Site" },
      priority_category: "All Conditions",
      candidates: [],
      charts: null,
      comparison_table: [],
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load categories when body changes
  useEffect(() => {
    let active = true;
    async function loadCategories() {
      try {
        const res = await fetch(`${API_BASE}/api/categories?body=${encodeURIComponent(body)}`);
        const data = await res.json();
        if (!active) return;
        const list = Array.from(new Set(["All Conditions", ...(data.categories || [])]));
        setCategories(list);
        if (!list.includes(category)) {
          setCategory("All Conditions");
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    }
    loadCategories();
    return () => {
      active = false;
    };
  }, [body]);

  // Handle preset change
  useEffect(() => {
    if (!preset) return;
    const [b, lo, la] = preset.split(",");
    setBody(b);
    setLon(lo);
    setLat(la);
  }, [preset]);

  // Run Query to API
  const runQuery = async () => {
    setError("");
    setLoading(true);
    const priority_category = !category || category === "All Conditions" ? null : category;

    try {
      const res = await fetch(`${API_BASE}/api/find-analogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          longitude: Number(lon),
          latitude: Number(lat),
          astronomical_body: body,
          priority_category,
          top_k: 3,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "API error");
      setQueryData(data);
      sessionStorage.setItem("analogResult", JSON.stringify(data));
      sessionStorage.setItem("lastBody", body);
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Only auto-fetch default preset if user did not come from Mars/Moon selection
  useEffect(() => {
    if (!initialSaved) {
      runQuery();
    }
  }, []);

  const backTarget = body === "moon" ? "moon" : "mars";

  return (
    <div className="min-h-screen w-full bg-black text-zinc-100 flex flex-col justify-between selection:bg-cyan-600 selection:text-white relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-gradient-to-b from-cyan-600/10 via-blue-600/5 to-transparent rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Background Stars & Falling Stars Animation Layer */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {STATIC_STARS.map((star, idx) => (
          <div
            key={`star-${idx}`}
            className={`absolute bg-zinc-200 rounded-full animate-pulse ${star.size} ${star.opacity}`}
            style={{ top: star.top, left: star.left, animationDelay: star.delay }}
          />
        ))}

        {FALLING_STARS.map((meteor, idx) => (
          <div
            key={`meteor-${idx}`}
            className={`absolute -top-16 w-[1.5px] bg-gradient-to-b from-transparent via-cyan-300 to-transparent opacity-0 rotate-[35deg] ${meteor.height}`}
            style={{
              left: meteor.left,
              animation: `shootingStar ${meteor.duration} ease-in-out infinite ${meteor.delay}`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes shootingStar {
          0% { transform: translateY(0) translateX(0) rotate(35deg); opacity: 0; }
          10% { opacity: 0.85; }
          85% { opacity: 0.85; }
          98% { transform: translateY(1200px) translateX(-700px) rotate(35deg); opacity: 0; }
          100% { transform: translateY(1200px) translateX(-700px) rotate(35deg); opacity: 0; }
        }
      `}</style>

      <div className="relative z-10">
        <Header />
      </div>

      <main className="flex-1 w-full max-w-[1700px] mx-auto p-8 flex flex-col gap-6 justify-center relative z-10">
        {/* Controls Card */}
        <EarthControls
          preset={preset} setPreset={setPreset}
          body={body} setBody={setBody}
          lon={lon} setLon={setLon}
          lat={lat} setLat={setLat}
          categories={categories} category={category} setCategory={setCategory}
          onRunQuery={runQuery} loading={loading} error={error}
        />

        {/* Top Grid: Interactive Map + Analogs Ranking Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full">
          <div className="lg:col-span-8 h-full">
            <EarthMap candidates={queryData.candidates} />
          </div>
          <div className="lg:col-span-4 h-full">
            <AnalogsPanel
              sourceLabel={queryData.source?.label}
              priorityCategory={queryData.priority_category}
              candidates={queryData.candidates}
            />
          </div>
        </div>

        {/* Analytics Graphs Grid */}
        {queryData.charts && (
          <div className="w-full">
            <AnalyticsCharts chartsData={queryData.charts} />
          </div>
        )}

        {/* Comparison Table */}
        {queryData.comparison_table?.length > 0 && (
          <div className="w-full">
            <ComparisonTable
              comparisonRows={queryData.comparison_table}
              sourceLabel={queryData.source?.label}
            />
          </div>
        )}

        {/* Navigation Button Bar */}
        <div className="flex justify-between items-center pt-4">
          <button
            onClick={() => (window.location.href = `/${backTarget}`)}
            className="rounded-xl px-6 py-3 text-sm font-bold tracking-wide transition-all duration-300 ease-out border-2 border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:border-cyan-500 hover:text-white hover:scale-[1.02] flex items-center justify-center font-mono cursor-pointer shadow-lg"
          >
            ← Back to {backTarget === "moon" ? "Moon" : "Mars"} Mission
          </button>
          <button
            onClick={() => (window.location.href = "/selection")}
            className="rounded-xl px-6 py-3 text-sm font-bold tracking-wide transition-all duration-300 ease-out border-2 border-cyan-400 bg-cyan-300 text-zinc-950 hover:bg-cyan-200 hover:scale-[1.02] flex items-center justify-center font-mono cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            Return to Selection Hub →
          </button>
        </div>
      </main>
    </div>
  );
}