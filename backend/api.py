from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from analog_matcher import (
    ALL_CONDITIONS_CATEGORY,
    MARS_ONLY_CATEGORIES,
    PRIORITY_CATEGORIES,
    init_matcher,
)

matcher = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global matcher
    matcher = init_matcher(cache_dir="analog_cache", auto_build_cache=True)
    yield


app = FastAPI(title="Planetary Analog Matcher API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Set to your frontend domain in production
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


class AnalogRequest(BaseModel):
    longitude: float = Field(..., ge=-360.0, le=360.0)
    latitude: float = Field(..., ge=-90.0, le=90.0)
    astronomical_body: str = Field(..., description="'mars' or 'moon'")
    priority_category: Optional[str] = None
    top_k: int = Field(default=1, ge=1, le=25)
    include_details: bool = False


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

        source_data = matcher.get_cell_data(body, best["query_key"])
        earth_data = matcher.get_cell_data("earth", best["earth_key"])

        response = {
            "earth_longitude": best["earth_longitude"],
            "earth_latitude": best["earth_latitude"],
            "similarity_0_1": best["similarity_0_1"],
            "priority_category": best["priority_category"],
            "snapped_query": {
                "key": best["query_key"],
                "longitude": best["query_coord"][0],
                "latitude": best["query_coord"][1],
                "data": source_data,   # Exact Mars/Moon JSON object
            },
            "earth_data": earth_data,  # Exact Earth JSON object
        }

        if req.include_details or req.top_k > 1:
            enriched = []
            for m in matches:
                item = dict(m)
                item["earth_data"] = matcher.get_cell_data("earth", m["earth_key"])
                enriched.append(item)
            response["matches"] = enriched

        return response

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))