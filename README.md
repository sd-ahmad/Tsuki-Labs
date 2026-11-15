<div align="center">

# 🪞 Project Kagami

### Identify Earth Locations that Analog the Permanent Moon Base Locations and Mars

![Moon](https://img.shields.io/badge/Target-Moon-lightgrey?style=for-the-badge)
![Mars](https://img.shields.io/badge/Target-Mars-red?style=for-the-badge)
![Data](https://img.shields.io/badge/Data-NASA-0B3D91?style=for-the-badge)

</div>

---

##  Table of Contents

- [Summary](#-summary)
- [How to Run It](#-how-to-run-it)
- [NASA Datasets Used](#-nasa-datasets-used)
- [Team Members](#-team-members)

---

##  Summary

**Kagami** (鏡, *"mirror"*) is a web tool that reflects any point on the Moon or Mars back onto Earth.

The user picks a destination, chooses what matters most (geology, terrain, thermal extremes, water ice, atmosphere, radiation, landing and rover mobility, or best overall), and clicks a point on the surface map. Kagami analyzes the terrain at that location using NASA mission data and returns the **top 3 Earth locations** that most closely match it, with match percentages, a map, comparison charts, and a detailed metrics table.

This helps researchers and mission planners find realistic places on Earth to test equipment, train crews, and rehearse operations for permanent lunar bases and Mars missions.

---

##  How to Run It

### 1. Choose a destination
On the **"Select Destination"** page, hover over the **Moon** or **Mars** and click the one you want. *(Mars shows "Launch Mission" on hover.)*

### 2. Pick a priority
In the **"Priority"** panel on the right of the map page, choose what matters most for the comparison:

| # | Priority |
|---|----------|
| 1 | Geology & Mineralogy |
| 2 | Terrain & Topography |
| 3 | Thermal & Extremes |
| 4 | Water Ice & Volatiles |
| 5 | Atmospheric Pressure & Winds |
| 6 | Radiation & Solar Flux |
| 7 | Landing & Rover Mobility |
| 8 | Best Overall |

The selected priority turns **yellow**.

### 3. Click a point on the map
The latitude and longitude appear under the map and in the **"Selected Target Coordinates"** box (e.g. about `51.99°N, 76.56°E`).

### 4. Click "View Earth Locations →"
A loading message says the terrain is being analyzed and Earth analogs matched.

> ⏳ **Note:** The first request can take up to about **30 seconds** while the backend wakes up.
> Use **"← Selection"** to go back and pick a different body.

### 5. Read the top 3 matches
The Earth page shows a map with the three matching locations and a ranked list with match percentages. Example:

| Rank | Location | Match |
|:----:|----------|:-----:|
|  #1 | Northwest Territories, Canada | **90.8%** |
|  #2 | Alaska, USA | **89.4%** |
|  #3 | Nunavut, Canada | **88.9%** |

### 6. Review the charts
Three charts compare your Moon or Mars point to the Earth matches:

| Chart | Shows |
|-------|-------|
| **Category Similarity (%)** | Radar chart across all categories |
| **Thermal Envelope (°C)** | Night minimum, day maximum, and temperature swing |
| **Terrain Slope Profile (°)** | Mean slope and 95th-percentile slope |

### 7. Scroll the comparison table
Metrics for your selected priority are listed first and tagged **`PRIORITY`**. Scroll inside the table to see other categories such as geology, thermal, water and ice, and atmosphere.

### 8. Adjust and rerun *(optional)*
Use the **"Backend Analog Matcher Control Panel"** at the top to edit **Body**, **Latitude**, **Longitude**, and **Priority Category**, then click **"Find Earth Analogs"** to run a new search without going back.

### 9. Start over
Click **"Return to Selection →"** at the bottom to pick a new destination.

---

##  NASA Datasets Used

###  Mars

| # | Dataset | ID / Notes |
|:-:|---------|------------|
| 1 | MGS MOLA MEGDR | `MGS-M-MOLA-5-MEGDR-L3-V1.0` (megt90n000eb) |
| 2 | 2001 Mars Odyssey GRS Smoothed Element Maps | `ODY-M-GRS-5-ELEMENTS-V1.0` |
| 3 | MGS TES Daytime Thermal Inertia | `MGS-M-TES-5-TIMAP-V1.0` (global_ti_day_2007) |
| 4 | Mars SWIM 2.0 | Combined Ice Consistency (0–1 m) |
| 5 | Odyssey GRS H₂O | Water-equivalent hydrogen |
| 6 | MOLA Barometric Pressure Model | Derived from MOLA elevation |
| 7 | Mars Global Cave Candidate Catalog (MGC3) | Cushing et al. |
| 8 | Derived Engineering Layer | MOLA slope + elevation + TES thermal inertia |

###  Moon

| # | Dataset | ID / Notes |
|:-:|---------|------------|
| 1 | LRO LOLA GDR | `LRO-L-LOLA-4-GDR-V1.0` (ldem_16) |
| 2 | Lunar Prospector GRS Elemental Abundance | `LP-L-GRS-5-ELEM-ABUNDANCE-V1.0` |
| 3 | Derived Lunar Geometry & LOLA Layer | Derived |

###  Earth

- NASA Open World
- NASA Earthdata

###  NASA Frontend Basemaps & Visualization

- **NASA Moon Trek:** LRO WAC Global Mosaic (OGC WMTS)
- **NASA Mars Trek:** MGS MOLA Shaded Relief (OGC WMTS)

---

##  Team Members

| Name |
|------|
| Hasnain Mahmood |
| Ahmad Azhar Nafees |
| Muhammad Qamar Naveed |
| Muhammad Tayyab Naveed |
| Abdullah Atif |

---

<div align="center">

*Kagami: mirroring other worlds on Earth* 🪞

</div>
