Kagami
Challenge

Identify Earth Locations that Analog the Permanent Moon Base Locations and Mars

Summary

Kagami (鏡, "mirror") is a web tool that reflects any point on the Moon or Mars back onto Earth. The user picks a destination, chooses what matters most (geology, terrain, thermal extremes, water ice, atmosphere, radiation, landing and rover mobility, or best overall), and clicks a point on the surface map. Kagami analyzes the terrain at that location using NASA mission data and returns the top 3 Earth locations that most closely match it, with match percentages, a map, comparison charts, and a detailed metrics table. This helps researchers and mission planners find realistic places on Earth to test equipment, train crews, and rehearse operations for permanent lunar bases and Mars missions.

How to Run It

Choose a destination. On the "Select Destination" page, hover over the Moon or Mars and click the one you want. (Mars shows "Launch Mission" on hover.)
Pick a priority. In the "Priority" panel on the right of the map page, choose one of:
Geology & Mineralogy
Terrain & Topography
Thermal & Extremes
Water Ice & Volatiles
Atmospheric Pressure & Winds
Radiation & Solar Flux
Landing & Rover Mobility
Best Overall
The selected priority turns yellow.
Click a point on the map. The latitude and longitude appear under the map and in the "Selected Target Coordinates" box (e.g. about 51.99°N, 76.56°E).
Click "View Earth Locations →". A loading message says the terrain is being analyzed and Earth analogs matched. The first request can take up to about 30 seconds while the backend wakes up. Use "← Selection" to go back and pick a different body.
Read the top 3 matches. The Earth page shows a map with the three matching locations and a ranked list with match percentages (for example: #1 Northwest Territories, Canada, 90.8%; #2 Alaska, 89.4%; #3 Nunavut, Canada, 88.9%).
Review the charts. Three charts compare your Moon or Mars point to the Earth matches:
Category Similarity (%): radar chart
Thermal Envelope (°C): night minimum, day maximum, and temperature swing
Terrain Slope Profile (°): mean slope and 95th-percentile slope
Scroll the comparison table. Metrics for your selected priority are listed first and tagged "PRIORITY". Scroll inside the table to see other categories such as geology, thermal, water and ice, and atmosphere.
Adjust and rerun (optional). Use the "Backend Analog Matcher Control Panel" at the top to edit Body, Latitude, Longitude, and Priority Category, then click "Find Earth Analogs" to run a new search without going back.
Start over. Click "Return to Selection →" at the bottom to pick a new destination.
NASA Datasets Used
Mars
MGS MOLA MEGDR: MGS-M-MOLA-5-MEGDR-L3-V1.0 (megt90n000eb)
2001 Mars Odyssey GRS Smoothed Element Maps: ODY-M-GRS-5-ELEMENTS-V1.0
MGS TES Daytime Thermal Inertia: MGS-M-TES-5-TIMAP-V1.0 (global_ti_day_2007)
Mars SWIM 2.0: Combined Ice Consistency (0–1 m)
Odyssey GRS H₂O
MOLA Barometric Pressure Model (derived from MOLA elevation)
Mars Global Cave Candidate Catalog (MGC3), Cushing et al.
Derived Engineering Layer: MOLA slope + elevation + TES thermal inertia
Moon
LRO LOLA GDR: LRO-L-LOLA-4-GDR-V1.0 (ldem_16)
Lunar Prospector GRS Elemental Abundance: LP-L-GRS-5-ELEM-ABUNDANCE-V1.0
Derived Lunar Geometry & LOLA Layer
Earth
Nasa open world 
Nasa Earthdata
NASA Frontend Basemaps & Visualization
NASA Moon Trek: LRO WAC Global Mosaic (OGC WMTS)
NASA Mars Trek: MGS MOLA Shaded Relief (OGC WMTS)



Team Members

Hasnain Mahmood

Ahmad Azhar Nafees

Muhammad Qamar Naveed

Muhammad Tayyab Naveed

Abdullah Atif
