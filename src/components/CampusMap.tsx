import React, { useState, useMemo, useRef, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Incident, IncidentCategory } from "../types";
import { CAMPUS_BUILDINGS, getCoordinates } from "../data/campusLocations";
import { MapPin, Search, Filter, Shield, Info, Layers, Eye } from "lucide-react";

interface CampusMapProps {
  incidents: Incident[];
  onSelectIncident: (inc: Incident) => void;
  selectedIncident?: Incident | null;
}

export default function CampusMap({ incidents, onSelectIncident, selectedIncident }: CampusMapProps) {
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [timeframe, setTimeframe] = useState<string>("60"); // Default to 60 days
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Map Style State
  const [mapStyle, setMapStyle] = useState<"streets" | "satellite">("streets");

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const markerMapRef = useRef<Map<string, L.Marker>>(new Map());

  // Category Colors in Hex
  const getCategoryColorHex = (category: IncidentCategory) => {
    switch (category) {
      case IncidentCategory.WELFARE: return "#14b8a6"; // Teal
      case IncidentCategory.SUBSTANCE: return "#a855f7"; // Purple
      case IncidentCategory.FIRE: return "#f97316"; // Orange
      case IncidentCategory.THEFT: return "#eab308"; // Yellow
      case IncidentCategory.MEDICAL: return "#f43f5e"; // Rose
      case IncidentCategory.DISORDERLY: return "#2563eb"; // Blue
      case IncidentCategory.TRAFFIC: return "#475569"; // Slate
      default: return "#6b7280"; // Gray
    }
  };

  // Helper to get days difference
  const getDaysAgo = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00");
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - d.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Filtered incidents
  const filteredIncidents = useMemo(() => {
    return incidents.filter(inc => {
      // Exclude "Nothing to report" from map
      if (inc.isNothingToReport) return false;

      // Category filter
      if (selectedCategory !== "all" && inc.category !== selectedCategory) {
        return false;
      }

      // Timeframe filter
      if (timeframe !== "all") {
        const daysAgo = getDaysAgo(inc.date);
        if (timeframe === "7" && daysAgo > 7) return false;
        if (timeframe === "30" && daysAgo > 30) return false;
        if (timeframe === "60" && daysAgo > 60) return false;
      }

      // Search Query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesLoc = (inc.locationName || inc.rawLocation || "").toLowerCase().includes(query);
        const matchesDesc = (inc.description || "").toLowerCase().includes(query);
        const matchesCat = (inc.category || "").toLowerCase().includes(query);
        const matchesType = (inc.type || "").toLowerCase().includes(query);
        if (!matchesLoc && !matchesDesc && !matchesCat && !matchesType) return false;
      }

      return true;
    });
  }, [incidents, selectedCategory, timeframe, searchQuery]);

  // Split filtered incidents into mapped (exact coordinate matches) and untracked (street-level)
  const { mappedIncidents, untrackedIncidents } = useMemo(() => {
    const mapped: Incident[] = [];
    const untracked: Incident[] = [];
    filteredIncidents.forEach(inc => {
      const coords = getCoordinates(inc.rawLocation || inc.locationName);
      if (coords.exact) {
        mapped.push(inc);
      } else {
        untracked.push(inc);
      }
    });
    return { mappedIncidents: mapped, untrackedIncidents: untracked };
  }, [filteredIncidents]);

  // 1. Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center coordinates for Augustana University (Sioux Falls, SD)
    const map = L.map(mapContainerRef.current, {
      center: [43.5255, -96.7375],
      zoom: 16,
      zoomControl: true,
      minZoom: 14,
      maxZoom: 19,
    });

    mapInstanceRef.current = map;

    // Refresh layout after initialization to prevent gray tiles issue
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Load Tile Layers on Style Toggle
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let tileUrl = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
    let attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

    if (mapStyle === "satellite") {
      // Use Esri World Imagery (photographic / satellite map)
      tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      attribution = "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community";
    }

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution,
    }).addTo(map);

  }, [mapStyle]);

  // 3. Render Markers when Filtered Incidents update (only plot mapped ones)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];
    markerMapRef.current.clear();

    // Plot each filtered mapped incident
    mappedIncidents.forEach(inc => {
      const coords = getCoordinates(inc.rawLocation || inc.locationName);
      const color = getCategoryColorHex(inc.category);

      // Create beautiful custom vector PIN icon styled with tailwind styles
      const pinHtml = `
        <div class="flex items-center justify-center" style="width: 32px; height: 32px;">
          <div class="relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-md transition-all hover:scale-110 cursor-pointer" style="background-color: ${color}; color: white;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: pinHtml,
        className: "custom-map-pin",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      // Build popup description
      const popupContent = `
        <div style="font-family: system-ui, sans-serif; width: 220px; padding: 4px;">
          <div style="display: flex; align-items: center; justify-between: space-between; margin-bottom: 6px;">
            <span style="font-size: 9px; font-weight: bold; text-transform: uppercase; padding: 2px 6px; border-radius: 9999px; background-color: ${color}15; color: ${color}; border: 1px solid ${color}30;">
              ${inc.category}
            </span>
            <span style="font-size: 10px; color: #9ca3af; font-weight: 500; font-family: monospace; margin-left: auto;">${inc.time || "Daily Log"}</span>
          </div>
          <h4 style="font-size: 13px; font-weight: 700; color: #111827; margin: 0 0 4px 0; line-height: 1.25;">${inc.type || "Safety Log"}</h4>
          <p style="font-size: 11px; color: #4b5563; font-weight: 600; margin: 0 0 6px 0; display: flex; align-items: center; gap: 4px;">
            📍 ${inc.locationName || inc.rawLocation}
          </p>
          <p style="font-size: 11px; color: #6b7280; margin: 0 0 8px 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${inc.description}
          </p>
          <button id="map-pop-btn-${inc.id}" style="width: 100%; text-align: center; padding: 5px 0; background-color: #081e3f; color: white; font-size: 10px; font-weight: bold; border-radius: 6px; cursor: pointer; border: none; transition: background-color 0.15s;">
            Inspect Record
          </button>
        </div>
      `;

      const marker = L.marker([coords.lat, coords.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(popupContent, { closeButton: false });

      marker.on("popupopen", () => {
        const button = document.getElementById(`map-pop-btn-${inc.id}`);
        if (button) {
          button.addEventListener("click", () => {
            onSelectIncident(inc);
          });
        }
      });

      markersRef.current.push(marker);
      markerMapRef.current.set(inc.id, marker);
    });
  }, [mappedIncidents]);

  // 4. Center map or fly to selected incident when prop changes
  useEffect(() => {
    if (!selectedIncident || !mapInstanceRef.current) return;
    
    const marker = markerMapRef.current.get(selectedIncident.id);
    if (marker) {
      mapInstanceRef.current.setView(marker.getLatLng(), 18);
      marker.openPopup();
    } else {
      // If marker isn't currently plotted (e.g. because of filtering), calculate position & center anyway
      const coords = getCoordinates(selectedIncident.rawLocation || selectedIncident.locationName);
      if (coords.exact) {
        mapInstanceRef.current.setView([coords.lat, coords.lng], 18);
      }
    }
  }, [selectedIncident]);

  return (
    <div className="space-y-6">
      {/* Map Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row h-[600px]" id="campus-map-section">
        
        {/* Sidebar Controls */}
        <div className="w-full md:w-80 bg-gray-50 border-r border-gray-100 p-6 flex flex-col justify-between overflow-y-auto shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-[#081e3f]" />
              <h3 className="font-semibold text-gray-900 text-lg">Map Controls</h3>
            </div>

            {/* Search Box */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search locations or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#081e3f] focus:border-transparent text-gray-900"
              />
            </div>

            {/* Map Layer Style Picker */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-gray-400" />
                Map Style
              </label>
              <div className="grid grid-cols-2 gap-2 bg-white p-1 rounded-xl border border-gray-150">
                <button
                  onClick={() => setMapStyle("streets")}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    mapStyle === "streets"
                      ? "bg-[#081e3f] text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>Minimalist Vector</span>
                </button>
                <button
                  onClick={() => setMapStyle("satellite")}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    mapStyle === "satellite"
                      ? "bg-[#081e3f] text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>Satellite Image</span>
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Event Type</label>
              <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all flex items-center justify-between cursor-pointer ${
                    selectedCategory === "all"
                      ? "bg-[#081e3f] text-white font-semibold"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-150"
                  }`}
                >
                  <span>All Event Types</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/10">
                    {incidents.filter(i => !i.isNothingToReport).length}
                  </span>
                </button>

                {Object.values(IncidentCategory).filter(c => c !== IncidentCategory.NOTHING).map(cat => {
                  const count = incidents.filter(i => i.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all flex items-center justify-between cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-[#081e3f] text-white font-semibold"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-150"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: getCategoryColorHex(cat) }} />
                        <span className="truncate">{cat}</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/10 shrink-0">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Timeframe Filter */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Timeframe</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "7 Days", value: "7" },
                  { label: "30 Days", value: "30" },
                  { label: "60 Days", value: "60" },
                  { label: "All Logs", value: "all" }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setTimeframe(opt.value)}
                    className={`py-1.5 rounded-lg text-xs border transition-all cursor-pointer ${
                      timeframe === opt.value
                        ? "bg-[#081e3f] border-[#081e3f] text-white font-semibold shadow-sm"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Legend / Statistics */}
          <div className="pt-4 border-t border-gray-200/60 text-xs text-gray-500">
            <div className="flex items-center justify-between mb-1.5 font-semibold text-gray-700">
              <span>Plotted Locations</span>
              <span className="text-[#081e3f]">{mappedIncidents.length} logs</span>
            </div>
            <p>Interactive geographic map centered on Augustana University campus. Only incidents mapped to exact campus building coordinates are shown above.</p>
          </div>
        </div>

        {/* Interactive Map Visualizer */}
        <div className="flex-1 bg-[#f4f4f0] relative select-none flex flex-col justify-between overflow-hidden">
          
          {/* Map Container Ref */}
          <div ref={mapContainerRef} className="w-full h-full z-0" id="leaflet-map-element" />

          {/* Empty State Overlay if filtered out */}
          {mappedIncidents.length === 0 && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center z-10">
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-sm">
                <Info className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <h5 className="font-semibold text-gray-900 text-sm">No mapped incidents match active filters</h5>
                <p className="text-xs text-gray-500 mt-1">Try resetting the category filter, typing a different keyword, or checking the street-level logs below.</p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setTimeframe("all");
                    setSearchQuery("");
                  }}
                  className="mt-4 px-3.5 py-1.5 bg-[#081e3f] text-white text-xs font-semibold rounded-xl hover:bg-opacity-95 transition-all cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Untracked & Off-Campus Incidents Tab Panel */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4" id="untracked-locations-panel">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#fed101] shrink-0" />
              Off-Campus & Street-Level Logs ({untrackedIncidents.length})
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Occurrences reported at general municipal blocks, non-specific campus zones, or street perimeters.
            </p>
          </div>
          <div className="text-[11px] font-mono font-semibold text-[#081e3f] bg-blue-50/80 px-3 py-1.5 rounded-xl border border-blue-100 shrink-0">
            {untrackedIncidents.length} logs matching filters
          </div>
        </div>

        {untrackedIncidents.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-xs flex flex-col items-center justify-center gap-1">
            <Eye className="w-5 h-5 text-gray-300" />
            <span>No street-level or off-campus incidents recorded under active filters.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[360px] overflow-y-auto pr-1">
            {untrackedIncidents.map((inc, index) => {
              const color = getCategoryColorHex(inc.category);
              return (
                <div
                  key={inc.id || index}
                  onClick={() => onSelectIncident(inc)}
                  className="p-4 bg-gray-50/40 rounded-xl border border-gray-150 hover:border-[#081e3f]/25 hover:bg-white hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-gray-400 font-mono">
                        {inc.rawDateStr}
                      </span>
                      {inc.time && (
                        <span className="text-[10px] font-mono font-semibold text-gray-500 bg-white border border-gray-150 px-1.5 py-0.5 rounded-md">
                          {inc.time}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs line-clamp-1">
                        {inc.type || "Safety Log"}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] text-gray-500 font-semibold mt-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{inc.rawLocation}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                      {inc.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
                    <span
                      className="text-[9px] font-bold px-2 py-0.5 rounded-full border"
                      style={{
                        backgroundColor: `${color}10`,
                        color: color,
                        borderColor: `${color}25`
                      }}
                    >
                      {inc.category}
                    </span>
                    <span className="text-[10px] font-bold text-[#081e3f] hover:underline flex items-center gap-0.5">
                      Inspect Report &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
