import React, { useState, useMemo } from "react";
import { Incident, IncidentCategory } from "../types";
import { Search, Filter, Shield, Clock, MapPin, Calendar as CalendarIcon, Info, Eye, ShieldAlert, CheckCircle, Download } from "lucide-react";

interface SafetyArchiveProps {
  incidents: Incident[];
  onSelectIncident: (inc: Incident) => void;
}

export default function SafetyArchive({ incidents, onSelectIncident }: SafetyArchiveProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [timeframe, setTimeframe] = useState<string>("60"); // Default to 60 days
  const [logTypeFilter, setLogTypeFilter] = useState<string>("all"); // "all", "incidents", "nothing"

  // Helper to calculate days ago
  const getDaysAgo = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00");
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - d.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Filtered incidents
  const filteredIncidents = useMemo(() => {
    return incidents.filter(inc => {
      // 1. Category Filter
      if (selectedCategory !== "all" && inc.category !== selectedCategory) {
        return false;
      }

      // 2. Timeframe Filter
      if (timeframe !== "all") {
        const daysAgo = getDaysAgo(inc.date);
        if (timeframe === "7" && daysAgo > 7) return false;
        if (timeframe === "30" && daysAgo > 30) return false;
        if (timeframe === "60" && daysAgo > 60) return false;
      }

      // 3. Log Type Filter (Incidents vs. Nothing to report)
      if (logTypeFilter === "incidents" && inc.isNothingToReport) {
        return false;
      }
      if (logTypeFilter === "nothing" && !inc.isNothingToReport) {
        return false;
      }

      // 4. Search Query Filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesLoc = (inc.locationName || inc.rawLocation || "").toLowerCase().includes(query);
        const matchesDesc = (inc.description || "").toLowerCase().includes(query);
        const matchesCat = (inc.category || "").toLowerCase().includes(query);
        const matchesType = (inc.type || "").toLowerCase().includes(query);
        const matchesDate = (inc.rawDateStr || "").toLowerCase().includes(query);
        
        if (!matchesLoc && !matchesDesc && !matchesCat && !matchesType && !matchesDate) {
          return false;
        }
      }

      return true;
    });
  }, [incidents, searchQuery, selectedCategory, timeframe, logTypeFilter]);

  // Group filtered incidents by Date
  const groupedIncidents = useMemo(() => {
    const groups: { dateStr: string; items: Incident[] }[] = [];
    const map = new Map<string, Incident[]>();

    filteredIncidents.forEach(inc => {
      const dateKey = inc.rawDateStr || inc.date;
      const list = map.get(dateKey) || [];
      list.push(inc);
      map.set(dateKey, list);
    });

    // Since incidents are already sorted by date, we can maintain chronological grouping
    map.forEach((items, dateStr) => {
      groups.push({ dateStr, items });
    });

    return groups;
  }, [filteredIncidents]);

  const getCategoryColor = (category: IncidentCategory) => {
    switch (category) {
      case IncidentCategory.WELFARE: return "border-[#14b8a6] text-[#14b8a6] bg-[#14b8a6]/5";
      case IncidentCategory.SUBSTANCE: return "border-[#a855f7] text-[#a855f7] bg-[#a855f7]/5";
      case IncidentCategory.FIRE: return "border-[#f97316] text-[#f97316] bg-[#f97316]/5";
      case IncidentCategory.THEFT: return "border-[#eab308] text-[#eab308] bg-[#eab308]/5";
      case IncidentCategory.MEDICAL: return "border-[#f43f5e] text-[#f43f5e] bg-[#f43f5e]/5";
      case IncidentCategory.DISORDERLY: return "border-[#2563eb] text-[#2563eb] bg-[#2563eb]/5";
      case IncidentCategory.TRAFFIC: return "border-[#475569] text-[#475569] bg-[#475569]/5";
      default: return "border-[#081e3f] text-[#081e3f] bg-[#081e3f]/5";
    }
  };

  const handleDownloadJSON = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(incidents, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "augustana_campus_safety_log_archive.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filters Panel */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4" id="archive-filter-panel">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50 pb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#081e3f]" />
            <h3 className="font-bold text-gray-900 text-base">Search & Filter Archive</h3>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#081e3f] hover:bg-[#081e3f]/90 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs border border-[#081e3f]/20"
              title="Download entire campus safety archive as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Archive</span>
            </button>
            <span className="text-xs font-mono font-bold text-gray-400">
              Showing {filteredIncidents.length} of {incidents.length} total entries
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Field */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports by location, type, keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 hover:bg-gray-100/50 focus:bg-white border border-gray-200 focus:border-[#081e3f] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#081e3f] text-gray-800 font-medium transition-all"
            />
          </div>

          {/* Log Type Filter */}
          <div>
            <select
              value={logTypeFilter}
              onChange={(e) => setLogTypeFilter(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 font-semibold focus:outline-none focus:ring-1 focus:ring-[#081e3f] focus:bg-white transition-all cursor-pointer"
            >
              <option value="all">All Log Types</option>
              <option value="incidents">Reported Incidents Only</option>
              <option value="nothing">Nothing to Report Only</option>
            </select>
          </div>

          {/* Timeframe Filter */}
          <div>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 font-semibold focus:outline-none focus:ring-1 focus:ring-[#081e3f] focus:bg-white transition-all cursor-pointer"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="60">Last 60 Days</option>
              <option value="all">Full History Archive</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills Row */}
        <div className="pt-2 border-t border-gray-50">
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-2 shrink-0">Category:</span>
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-[#081e3f] border-[#081e3f] text-white shadow-xs"
                  : "bg-gray-50 border-gray-150 text-gray-600 hover:bg-gray-100"
              }`}
            >
              All Categories
            </button>
            {Object.values(IncidentCategory).filter(c => c !== IncidentCategory.NOTHING).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#081e3f] border-[#081e3f] text-white shadow-xs"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reports Feed */}
      <div className="space-y-8" id="archive-reports-feed">
        {groupedIncidents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-xs">
            <Eye className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h4 className="font-bold text-gray-800 text-base">No Matching Safety Logs Found</h4>
            <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
              We couldn't find any reports matching your active filters. Try adjusting your search text or changing the category/timeframe settings.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setLogTypeFilter("all");
                setTimeframe("all");
              }}
              className="mt-5 px-4 py-2 bg-[#081e3f] text-white text-xs font-bold rounded-xl hover:bg-opacity-95 transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          groupedIncidents.map(group => (
            <div key={group.dateStr} className="space-y-4">
              {/* Date Header Segment */}
              <div className="sticky top-18 z-20 bg-gray-50/90 backdrop-blur-xs py-2 px-1 flex items-center gap-2 border-b border-gray-200/50">
                <CalendarIcon className="w-4 h-4 text-[#081e3f]" />
                <h3 className="text-sm sm:text-base font-extrabold text-gray-900 uppercase tracking-wide">
                  {group.dateStr}
                </h3>
              </div>

              {/* Incidents on this day */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {group.items.map(inc => {
                  const isNothing = inc.isNothingToReport;
                  
                  if (isNothing) {
                    return (
                      <div
                        key={inc.id}
                        className="bg-emerald-50/20 border border-dashed border-emerald-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 col-span-1 md:col-span-2 shadow-xs"
                        id={`archive-card-${inc.id}`}
                      >
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 select-none shrink-0">
                            <CheckCircle className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#081e3f]">
                                AUGUSTANA UNIVERSITY
                              </span>
                            </div>
                            <h4 className="font-extrabold text-emerald-950 text-sm md:text-base mt-0.5">
                              No Incidents Reported
                            </h4>
                            <p className="text-xs text-emerald-800 font-semibold mt-1">
                              Daily log explicitly recorded as "Nothing to report".
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  const colorClass = getCategoryColor(inc.category);
                  return (
                    <div
                      key={inc.id}
                      onClick={() => onSelectIncident(inc)}
                      className="group bg-white rounded-xl border border-gray-150 p-5 flex flex-col justify-between hover:border-[#081e3f]/30 hover:shadow-md transition-all duration-150 cursor-pointer"
                      id={`archive-card-${inc.id}`}
                    >
                      <div className="space-y-4">
                        {/* Card Header Masthead (similar to official log) */}
                        <div className="flex items-start justify-between gap-2 border-b border-gray-50 pb-3">
                          <div className="flex flex-col select-none">
                            <span className="text-[9px] font-black tracking-widest text-[#081e3f] uppercase">
                              Augustana University
                            </span>
                            <span className="text-xs font-bold text-gray-400">
                              Security Log Report
                            </span>
                          </div>
                          
                          {/* Colored category badge */}
                          <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border tracking-wide uppercase shrink-0 ${colorClass}`}>
                            {inc.category}
                          </span>
                        </div>

                        {/* Details content */}
                        <div className="space-y-2.5">
                          {/* Incident Type Description */}
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-extrabold text-gray-900 text-sm md:text-base tracking-tight line-clamp-1 group-hover:text-[#081e3f]">
                              {inc.type || "Incident Report"}
                            </h4>
                            {inc.id && !inc.id.startsWith("manual_") && (
                              <span className="text-[10px] font-mono text-gray-400 font-bold shrink-0 bg-gray-50 px-1.5 py-0.5 rounded-md border border-gray-100">
                                ID: {inc.id.substring(0, 8)}
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                            {/* Time */}
                            <div className="flex items-center gap-1.5 font-semibold">
                              <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Time:</span>
                              <span className="text-gray-900 font-mono">{inc.time || "Daily Log"}</span>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-1.5 font-semibold">
                              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Location:</span>
                              <span className="text-gray-900 truncate" title={inc.rawLocation}>
                                {inc.locationName || inc.rawLocation}
                              </span>
                            </div>
                          </div>

                          {/* Original dispatch details box */}
                          <div className="mt-3 bg-gray-50 group-hover:bg-gray-100/40 p-3 rounded-lg border border-gray-100 space-y-1">
                            <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                              Dispatcher Log / Details
                            </span>
                            <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed font-semibold">
                              {inc.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-50 text-[11px] font-bold">
                        <span className="text-gray-400">
                          <span className="text-amber-600 flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5" /> Incident Logged
                          </span>
                        </span>
                        
                        <span className="text-[#081e3f] group-hover:underline flex items-center gap-0.5">
                          Inspect Report &rarr;
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
