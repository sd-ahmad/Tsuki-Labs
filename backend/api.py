import math
import os
import tarfile
import urllib.request
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional, Tuple

import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from analog_matcher import (
    ALL_CONDITIONS_CATEGORY,
    FEATURE_GROUPS,
    MARS_ONLY_CATEGORIES,
    PRIORITY_CATEGORIES,
    init_matcher,
)

matcher = None

CACHE_DIR = Path("analog_cache")
CACHE_URL = os.getenv("ANALOG_CACHE_URL", "")


def ensure_cache() -> None:
    if (CACHE_DIR / "meta.json").exists() and (CACHE_DIR / "lookup.db").exists():
        return
    if not CACHE_URL:
        return
    archive = Path("analog_cache.tar.gz")
    urllib.request.urlretrieve(CACHE_URL, archive)
    with tarfile.open(archive, "r:gz") as tar:
        tar.extractall(".")
    archive.unlink(missing_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    global matcher
    ensure_cache()
    matcher = init_matcher(cache_dir=CACHE_DIR, auto_build_cache=True)
    yield


app = FastAPI(title="Planetary Analog Matcher API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend domain in production
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


class AnalogRequest(BaseModel):
    longitude: float = Field(..., ge=-360.0, le=360.0)
    latitude: float = Field(..., ge=-90.0, le=90.0)
    astronomical_body: str = Field(..., description="'mars' or 'moon'")
    priority_category: Optional[str] = None
    top_k: int = Field(default=3, ge=1, le=10)


# --- Formatting Helpers ---

def _num(val: Any, decimals: int = 2) -> Optional[float]:
    if val is None or isinstance(val, bool):
        return None
    try:
        v = float(val)
        return round(v, decimals) if math.isfinite(v) else None
    except (TypeError, ValueError):
        return None


def _k_to_c(val: Any) -> Optional[float]:
    v = _num(val, 2)
    return round(v - 273.15, 1) if v is not None else None


def _fmt_temp(val: Any) -> Tuple[Optional[float], str]:
    c = _k_to_c(val)
    k = _num(val, 1)
    if c is None or k is None:
        return None, "—"
    return c, f"{c} °C ({k} K)"


def _fmt_num(val: Any, unit: str = "", decimals: int = 2) -> Tuple[Optional[float], str]:
    v = _num(val, decimals)
    if v is None:
        return None, "—"
    return v, f"{v}{(' ' + unit) if unit else ''}"


def _fmt_bool(val: Any, true_label: str = "Yes", false_label: str = "No") -> Tuple[Optional[bool], str]:
    if val is None:
        return None, "—"
    b = bool(val)
    return b, (true_label if b else false_label)


def _fmt_text(val: Any) -> Tuple[Optional[str], str]:
    if val is None or str(val).strip() == "":
        return None, "—"
    s = str(val).strip()
    return s, s


def _compute_category_scores(body: str, src_idx: int, earth_lon: float, earth_lat: float) -> Dict[str, Optional[float]]:
    """Computes 0-100% ML match score per category between query cell and an Earth match."""
    e_idx = int(
        np.argmin(
            (matcher.earth_coords[:, 0] - earth_lon) ** 2
            + (matcher.earth_coords[:, 1] - earth_lat) ** 2
        )
    )
    q = matcher.body_feats[body][src_idx]
    e_x = matcher.earth_X0_T[:, e_idx]
    e_v = matcher.earth_V_T[:, e_idx]

    scores: Dict[str, Optional[float]] = {}
    for cat, cols in FEATURE_GROUPS.items():
        if body == "moon" and cat in MARS_ONLY_CATEGORIES:
            continue
        idx_arr = np.asarray(cols, dtype=np.int32)
        valid = (~np.isnan(q[idx_arr])) & (e_v[idx_arr] > 0.0)
        if not valid.any():
            scores[cat] = None
            continue
        diff = q[idx_arr][valid] - e_x[idx_arr][valid]
        mse = float(np.mean(diff * diff))
        scores[cat] = round(100.0 * math.exp(-mse), 1)
    return scores


def _build_comparison_table(
    body: str,
    priority_cat: str,
    src_data: Dict[str, Any],
    earth_cells: List[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    """
    Builds a structured comparison table across Source vs Top-3 Earth matches,
    placing rows belonging to `priority_cat` at the top.
    """
    # Row spec: (key, label, category, unit, extractor_fn_for_mars_moon, extractor_fn_for_earth, mars_only)
    specs: List[Tuple[str, str, str, str, Callable, Callable, bool]] = [
        # Geology & Mineralogy
        (
            "geo_unit", "Geological Unit / Class", "Geology & Mineralogy", "",
            lambda d: _fmt_text((d.get("geology") or {}).get("unit_desc") or (d.get("geology") or {}).get("unit_name")),
            lambda d: _fmt_text((d.get("geology") or {}).get("unit_desc") or (d.get("geology") or {}).get("lith_class")),
            False,
        ),
        (
            "geo_code", "Unit Code", "Geology & Mineralogy", "",
            lambda d: _fmt_text((d.get("geology") or {}).get("unit_code")),
            lambda d: _fmt_text((d.get("geology") or {}).get("lith_class") or (d.get("geology") or {}).get("unit_code")),
            False,
        ),
        (
            "fe_pct", "Iron / FeO Content", "Geology & Mineralogy", "wt%",
            lambda d: _fmt_num((d.get("geology") or {}).get("fe_wt_pct") or (d.get("geology") or {}).get("feo_wt_pct"), "wt%", 2),
            lambda d: (None, "—"),
            False,
        ),
        (
            "k_pct", "Potassium (K)", "Geology & Mineralogy", "wt%",
            lambda d: _fmt_num((d.get("geology") or {}).get("k_wt_pct"), "wt%", 3),
            lambda d: (None, "—"),
            False,
        ),
        (
            "th_ppm", "Thorium (Th)", "Geology & Mineralogy", "ppm",
            lambda d: _fmt_num((d.get("geology") or {}).get("th_ppm"), "ppm", 2),
            lambda d: (None, "—"),
            False,
        ),

        # Terrain & Topography
        (
            "elev_mean_m", "Mean Elevation", "Terrain & Topography", "m",
            lambda d: _fmt_num((d.get("terrain") or {}).get("elev_mean_m"), "m", 1),
            lambda d: _fmt_num((d.get("terrain") or {}).get("elev_mean_m"), "m", 1),
            False,
        ),
        (
            "relief_m", "Local Relief", "Terrain & Topography", "m",
            lambda d: _fmt_num((d.get("terrain") or {}).get("relief_m"), "m", 1),
            lambda d: _fmt_num((d.get("terrain") or {}).get("relief_m"), "m", 1),
            False,
        ),
        (
            "slope_mean_deg", "Mean Slope", "Terrain & Topography", "°",
            lambda d: _fmt_num((d.get("terrain") or {}).get("slope_mean_deg"), "°", 2),
            lambda d: _fmt_num((d.get("terrain") or {}).get("slope_mean_deg"), "°", 2),
            False,
        ),
        (
            "slope_p95_deg", "95th-Percentile Slope", "Terrain & Topography", "°",
            lambda d: _fmt_num((d.get("terrain") or {}).get("slope_p95_deg"), "°", 2),
            lambda d: _fmt_num((d.get("terrain") or {}).get("slope_p95_deg"), "°", 2),
            False,
        ),
        (
            "roughness_std_m", "Surface Roughness (Std)", "Terrain & Topography", "m",
            lambda d: _fmt_num((d.get("terrain") or {}).get("roughness_std_m"), "m", 1),
            lambda d: _fmt_num((d.get("terrain") or {}).get("roughness_std_m"), "m", 1),
            False,
        ),

        # Thermal & Extremes
        (
            "temp_day_max_c", "Daytime Max Temperature", "Thermal & Extremes", "°C",
            lambda d: _fmt_temp((d.get("thermal") or {}).get("temp_day_max_k")),
            lambda d: _fmt_temp((d.get("thermal") or {}).get("temp_day_max_k")),
            False,
        ),
        (
            "temp_night_min_c", "Nighttime Min Temperature", "Thermal & Extremes", "°C",
            lambda d: _fmt_temp((d.get("thermal") or {}).get("temp_night_min_k")),
            lambda d: _fmt_temp((d.get("thermal") or {}).get("temp_night_min_k")),
            False,
        ),
        (
            "diurnal_swing_c", "Diurnal Temperature Swing", "Thermal & Extremes", "°C",
            lambda d: _fmt_num((d.get("thermal") or {}).get("diurnal_swing_k"), "°C", 1),
            lambda d: _fmt_num((d.get("thermal") or {}).get("diurnal_swing_k"), "°C", 1),
            False,
        ),
        (
            "mean_annual_temp_c", "Earth Mean Annual Temp", "Thermal & Extremes", "°C",
            lambda d: (None, "—"),
            lambda d: _fmt_temp((d.get("thermal") or {}).get("mean_annual_temp_k")),
            False,
        ),
        (
            "thermal_inertia_tiu", "Thermal Inertia (TIU)", "Thermal & Extremes", "tiu",
            lambda d: _fmt_num((d.get("thermal") or {}).get("thermal_inertia_tiu"), "tiu", 1),
            lambda d: (None, "—"),
            True,
        ),

        # Water & Ice
        (
            "polar_ice", "Polar Ice / PSR Zone", "Water & Ice", "",
            lambda d: _fmt_bool(
                (d.get("water_ice") or {}).get("polar_ice_flag")
                if "polar_ice_flag" in (d.get("water_ice") or {})
                else (d.get("water_ice") or {}).get("polar_psr_zone"),
                "Present", "Absent",
            ),
            lambda d: _fmt_bool((d.get("water_ice") or {}).get("polar_ice_flag"), "Present", "Absent"),
            False,
        ),
        (
            "weh_wt_pct", "Water-Equivalent Hydrogen", "Water & Ice", "wt%",
            lambda d: _fmt_num((d.get("water_ice") or {}).get("weh_wt_pct"), "wt%", 2),
            lambda d: (None, "—"),
            True,
        ),
        (
            "annual_precip_mm", "Earth Annual Precipitation", "Water & Ice", "mm/yr",
            lambda d: (None, "—"),
            lambda d: _fmt_num((d.get("water_ice") or {}).get("annual_precip_mm"), "mm", 1),
            False,
        ),
        (
            "barren_pct", "Earth Barren Cover", "Water & Ice", "%",
            lambda d: (None, "—"),
            lambda d: _fmt_num((d.get("water_ice") or {}).get("barren_pct"), "%", 1),
            False,
        ),
        (
            "snow_ice_pct", "Earth Snow & Ice Cover", "Water & Ice", "%",
            lambda d: (None, "—"),
            lambda d: _fmt_num((d.get("water_ice") or {}).get("snow_ice_pct"), "%", 1),
            False,
        ),

        # Atmospheric/Dust (MARS)
        (
            "surface_pressure_mbar", "Surface Pressure", "Atmospheric/Dust (MARS)", "mbar",
            lambda d: _fmt_num((d.get("atmosphere_dust") or {}).get("surface_pressure_mbar"), "mbar", 2),
            lambda d: (None, "—"),
            True,
        ),
        (
            "dust_cover_index", "Dust Cover Index", "Atmospheric/Dust (MARS)", "",
            lambda d: _fmt_num((d.get("atmosphere_dust") or {}).get("dust_cover_index"), "", 2),
            lambda d: (None, "—"),
            True,
        ),

        # Subsurface/Caves (MARS)
        (
            "cave_count", "Known Cave Count", "Subsurface/Caves (MARS)", "",
            lambda d: _fmt_num((d.get("subsurface_caves") or {}).get("cave_count"), "", 0),
            lambda d: (None, "—"),
            True,
        ),
        (
            "nearest_cave_km", "Nearest Cave Distance", "Subsurface/Caves (MARS)", "km",
            lambda d: _fmt_num((d.get("subsurface_caves") or {}).get("nearest_cave_km"), "km", 1),
            lambda d: (None, "—"),
            True,
        ),

        # Landing/Mobility
        (
            "mobility_rating", "Mobility Rating (0–100)", "Landing/Mobility", "/100",
            lambda d: _fmt_num((d.get("landing_mobility") or {}).get("mobility_rating_0_100"), "/100", 1),
            lambda d: (None, "—"),
            False,
        ),
        (
            "hazard_slope_p95_deg", "Landing Hazard Slope (P95)", "Landing/Mobility", "°",
            lambda d: _fmt_num((d.get("landing_mobility") or {}).get("hazard_slope_p95_deg"), "°", 2),
            lambda d: _fmt_num((d.get("terrain") or {}).get("slope_p95_deg"), "°", 2),
            False,
        ),
        (
            "edl_feasible", "EDL Elevation Feasible", "Landing/Mobility", "",
            lambda d: _fmt_bool((d.get("landing_mobility") or {}).get("edl_elev_feasible"), "Feasible", "Too High"),
            lambda d: (None, "—"),
            True,
        ),
    ]

    rows: List[Dict[str, Any]] = []
    for key, label, category, unit, src_fn, earth_fn, mars_only in specs:
        if body == "moon" and mars_only:
            continue

        src_val, src_disp = src_fn(src_data)
        cand_entries = []
        for rank, e_cell in enumerate(earth_cells, 1):
            e_val, e_disp = earth_fn(e_cell)
            cand_entries.append({"rank": rank, "value": e_val, "display": e_disp})

        rows.append(
            {
                "key": key,
                "label": label,
                "category": category,
                "unit": unit,
                "is_priority": (category == priority_cat),
                "source": {"value": src_val, "display": src_disp},
                "candidates": cand_entries,
            }
        )

    # Sort so priority category rows appear strictly at the top, preserving order within groups
    rows.sort(key=lambda r: (0 if r["is_priority"] else 1))
    return rows


def _build_charts(
    body: str,
    priority_cat: str,
    src_label: str,
    src_data: Dict[str, Any],
    candidates: List[Dict[str, Any]],
    earth_cells: List[Dict[str, Any]],
) -> Dict[str, Any]:
    # 1. Category Similarity Radar Chart
    radar_cats = [
        c for c in PRIORITY_CATEGORIES
        if not (body == "moon" and c in MARS_ONLY_CATEGORIES)
    ]
    category_radar = []
    for cat in radar_cats:
        entry: Dict[str, Any] = {
            "category": cat,
            "is_priority": (cat == priority_cat),
        }
        for c in candidates:
            entry[f"candidate_{c['rank']}"] = c["category_scores"].get(cat)
        category_radar.append(entry)

    # 2. Thermal Envelope Chart (Min, Max, Swing in °C)
    thermal_envelope = []
    all_points = [(src_label, src_data)] + [
        (f"Match #{c['rank']}", e_cell) for c, e_cell in zip(candidates, earth_cells)
    ]
    for label, cell in all_points:
        thm = cell.get("thermal") or {}
        thermal_envelope.append(
            {
                "location": label,
                "temp_night_min_c": _k_to_c(thm.get("temp_night_min_k")),
                "temp_day_max_c": _k_to_c(thm.get("temp_day_max_k")),
                "diurnal_swing_c": _num(thm.get("diurnal_swing_k"), 1),
            }
        )

    # 3. Terrain Profile Chart (Mean Slope, P95 Slope, Relief, Roughness)
    terrain_profile = []
    for label, cell in all_points:
        ter = cell.get("terrain") or {}
        terrain_profile.append(
            {
                "location": label,
                "slope_mean_deg": _num(ter.get("slope_mean_deg"), 2),
                "slope_p95_deg": _num(ter.get("slope_p95_deg"), 2),
                "relief_m": _num(ter.get("relief_m"), 1),
                "roughness_std_m": _num(ter.get("roughness_std_m"), 1),
            }
        )

    return {
        "category_radar": category_radar,
        "thermal_envelope": thermal_envelope,
        "terrain_profile": terrain_profile,
    }


# --- API Endpoints ---

@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/categories")
def get_categories(body: Optional[str] = None):
    b = body.strip().lower() if body else None
    cats = [
        c for c in PRIORITY_CATEGORIES
        if not (b == "moon" and c in MARS_ONLY_CATEGORIES)
    ]
    return {
        "default": ALL_CONDITIONS_CATEGORY,
        "categories": [ALL_CONDITIONS_CATEGORY, *cats],
        "mars_only": sorted(MARS_ONLY_CATEGORIES),
    }


@app.post("/api/find-analogs")
def find_analogs_endpoint(req: AnalogRequest):
    try:
        body = req.astronomical_body.strip().lower()
        matches = matcher.find_analogs(
            longitude_inp=req.longitude,
            latitude_inp=req.latitude,
            astronomical_body=body,
            priority_category=req.priority_category,
            top_k=req.top_k,
            return_details=True,
        )
        best = matches[0]
        src_idx = matcher._lookup_source_idx(req.longitude, req.latitude, body)
        src_data = matcher.get_cell_data(body, best["query_key"]) or {}

        candidates: List[Dict[str, Any]] = []
        earth_cells: List[Dict[str, Any]] = []
        for rank, m in enumerate(matches, 1):
            e_cell = matcher.get_cell_data("earth", m["earth_key"]) or {}
            earth_cells.append(e_cell)
            candidates.append(
                {
                    "rank": rank,
                    "earth_longitude": m["earth_longitude"],
                    "earth_latitude": m["earth_latitude"],
                    "earth_key": m["earth_key"],
                    "similarity_pct": round(m["similarity_0_1"] * 100.0, 1),
                    "earth_geology_desc": m["earth_geology_desc"],
                    "category_scores": _compute_category_scores(
                        body, src_idx, m["earth_longitude"], m["earth_latitude"]
                    ),
                    "raw_data": e_cell,
                }
            )

        q_lon, q_lat = best["query_coord"]
        src_label = f"{body.capitalize()} ({q_lon:.1f}, {q_lat:.1f})"
        priority_cat = best["priority_category"]

        return {
            "priority_category": priority_cat,
            "source": {
                "body": body,
                "key": best["query_key"],
                "longitude": q_lon,
                "latitude": q_lat,
                "label": src_label,
                "raw_data": src_data,
            },
            "candidates": candidates,
            "comparison_table": _build_comparison_table(body, priority_cat, src_data, earth_cells),
            "charts": _build_charts(body, priority_cat, src_label, src_data, candidates, earth_cells),
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))