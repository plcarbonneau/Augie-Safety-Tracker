import React, { useState, useMemo } from "react";
import { Incident, IncidentCategory } from "../types";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ShieldAlert, ShieldCheck, Clock, MapPin, AlertCircle, Info, Filter, CheckCircle } from "lucide-react";

interface SafetyCalendarProps {
  incidents: Incident[];
  onSelectIncident: (inc: Incident) => void;
}

export default function SafetyCalendar({ incidents, onSelectIncident }: SafetyCalendarProps) {
  // Find range of months from incidents
  const incidentDateRange = useMemo(() => {
    if (incidents.length === 0) {
      const now = new Date();
      return { min: new Date(now.getFullYear(), now.getMonth() - 5, 1), max: now };
    }
    let minDate = new Date();
    let maxDate = new Date();
    let hasIncidents = false;
    
    // Find boundaries based on actual incident date strings
    incidents.forEach(inc => {
      const d = new Date(inc.date + "T12:00:00");
      if (isNaN(d.getTime())) return;
      if (!hasIncidents) {
        minDate = d;
        maxDate = d;
        hasIncidents = true;
      } else {
        if (d < minDate) minDate = d;
        if (d > maxDate) maxDate = d;
      }
    });
    
    // Include current real date in maxDate as well so we can always navigate to the current month
    const today = new Date();
    if (today > maxDate) {
      maxDate = today;
    }
    
    // Ensure minDate is at least Feb 2026 for completeness
    const feb2026 = new Date(2026, 1, 1);
    if (minDate > feb2026) {
      minDate = feb2026;
    }

    return {
      min: new Date(minDate.getFullYear(), minDate.getMonth(), 1),
      max: new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)
    };
  }, [incidents]);

  // Dynamically initialize current date based on today
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  
  // Dynamically initialize selected day string based on today formatted as YYYY-MM-DD
  const [selectedDayStr, setSelectedDayStr] = useState<string>(() => {
    const today = new Date();
    const padMonth = String(today.getMonth() + 1).padStart(2, "0");
    const padDay = String(today.getDate()).padStart(2, "0");
    return `${today.getFullYear()}-${padMonth}-${padDay}`;
  });

  // Calendar filter state
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all"); // "all", "incidents", "safe"

  // Get active month metrics
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Incidents index by ISO date string (YYYY-MM-DD) for O(1) lookups
  // This map contains all incidents (unfiltered) for showing actual logs of selected day
  const rawIncidentsByDate = useMemo(() => {
    const map = new Map<string, Incident[]>();
    incidents.forEach(inc => {
      const list = map.get(inc.date) || [];
      list.push(inc);
      map.set(inc.date, list);
    });
    return map;
  }, [incidents]);

  // Incidents index by ISO date string filtered for the calendar indicators
  const filteredIncidentsByDate = useMemo(() => {
    const map = new Map<string, Incident[]>();
    
    incidents.forEach(inc => {
      // 1. Apply category filter
      if (categoryFilter !== "all" && inc.category !== categoryFilter) {
        return;
      }
      // 2. Apply status filter
      if (statusFilter === "incidents" && inc.isNothingToReport) {
        return;
      }
      if (statusFilter === "safe" && !inc.isNothingToReport) {
        return;
      }

      const list = map.get(inc.date) || [];
      list.push(inc);
      map.set(inc.date, list);
    });
    
    return map;
  }, [incidents, categoryFilter, statusFilter]);

  // Generate calendar grid
  const daysInMonth = useMemo(() => {
    const totalDays = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay(); // Weekday index of the 1st
    
    const days: { dateStr: string | null; dayNum: number | null }[] = [];
    
    // Empty cells before the 1st of the month
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dateStr: null, dayNum: null });
    }
    
    // Actual month days
    for (let d = 1; d <= totalDays; d++) {
      const padMonth = String(month + 1).padStart(2, "0");
      const padDay = String(d).padStart(2, "0");
      const dateStr = `${year}-${padMonth}-${padDay}`;
      days.push({ dateStr, dayNum: d });
    }
    
    return days;
  }, [year, month]);

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const minMonth = incidentDateRange.min.getMonth();
      const minYear = incidentDateRange.min.getFullYear();
      if (prev.getFullYear() < minYear || (prev.getFullYear() === minYear && prev.getMonth() <= minMonth)) {
        return prev;
      }
      return new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const maxMonth = incidentDateRange.max.getMonth();
      const maxYear = incidentDateRange.max.getFullYear();
      if (prev.getFullYear() > maxYear || (prev.getFullYear() === maxYear && prev.getMonth() >= maxMonth)) {
        return prev;
      }
      return new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
    });
  };

  // Selected Day Incidents - we want to show all incidents for that day, 
  // but if a category or location filter is active, filter them accordingly to make it super intuitive!
  const selectedIncidents = useMemo(() => {
    let dayIncidents = rawIncidentsByDate.get(selectedDayStr) || [];
    
    if (categoryFilter !== "all") {
      dayIncidents = dayIncidents.filter(inc => inc.category === categoryFilter || inc.isNothingToReport);
    }
    
    return dayIncidents;
  }, [rawIncidentsByDate, selectedDayStr, categoryFilter]);

  // Format header date string
  const formattedSelectedDate = useMemo(() => {
    const parts = selectedDayStr.split("-");
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  }, [selectedDayStr]);

  const getCategoryColor = (category: IncidentCategory) => {
    switch (category) {
      case IncidentCategory.WELFARE: return "bg-teal-100 text-teal-800 border-teal-200";
      case IncidentCategory.SUBSTANCE: return "bg-purple-100 text-purple-800 border-purple-200";
      case IncidentCategory.FIRE: return "bg-orange-100 text-orange-800 border-orange-200"; // Orange
      case IncidentCategory.THEFT: return "bg-yellow-100 text-yellow-800 border-yellow-200"; // Yellow
      case IncidentCategory.MEDICAL: return "bg-rose-100 text-rose-800 border-rose-200";
      case IncidentCategory.DISORDERLY: return "bg-blue-100 text-blue-800 border-blue-200";
      case IncidentCategory.TRAFFIC: return "bg-slate-100 text-slate-800 border-slate-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get current local date string dynamically
  const todayStr = useMemo(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="calendar-section">
      
      {/* Calendar Grid card */}
      <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#081e3f]" />
              <h3 className="font-semibold text-gray-900 text-lg">Event Calendar</h3>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100 self-end sm:self-auto">
              <button
                onClick={handlePrevMonth}
                disabled={year < incidentDateRange.min.getFullYear() || (year === incidentDateRange.min.getFullYear() && month <= incidentDateRange.min.getMonth())}
                className="p-1 rounded-lg text-gray-500 hover:bg-white hover:text-gray-900 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-semibold text-gray-800 px-3 min-w-[120px] text-center select-none">
                {monthNames[month]} {year}
              </span>
              <button
                onClick={handleNextMonth}
                disabled={year > incidentDateRange.max.getFullYear() || (year === incidentDateRange.max.getFullYear() && month >= incidentDateRange.max.getMonth())}
                className="p-1 rounded-lg text-gray-500 hover:bg-white hover:text-gray-900 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Filtering controls */}
          <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 mb-6 flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <span>Filters:</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {/* Category Filter Dropdown */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#081e3f] focus:border-transparent"
              >
                <option value="all">All Category Types</option>
                {Object.values(IncidentCategory)
                  .filter(c => c !== IncidentCategory.NOTHING)
                  .map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))
                }
              </select>

              {/* Status Filter Dropdown */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#081e3f] focus:border-transparent"
              >
                <option value="all">All Logs (Incidents & Safe)</option>
                <option value="incidents">Reported Incidents Only</option>
                <option value="safe">Safe Days Only</option>
              </select>
            </div>
          </div>

          {/* Weekday labels */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2.5">
            {daysInMonth.map((cell, idx) => {
              if (cell.dayNum === null || !cell.dateStr) {
                return <div key={`empty-${idx}`} className="aspect-square bg-gray-50/50 rounded-xl" />;
              }

              // Evaluate occurrences
              const isFuture = cell.dateStr > todayStr;
              const isSelected = selectedDayStr === cell.dateStr;

              // Check if there are matching events in the filtered calendar data
              const dayFilteredEvents = filteredIncidentsByDate.get(cell.dateStr) || [];
              const hasFilteredEvents = dayFilteredEvents.some(e => !e.isNothingToReport);
              
              // To determine if a day is completely "Safe" (either explicitly logged as nothing to report OR simply having no incidents)
              const isSafeDay = dayFilteredEvents.length === 0 || dayFilteredEvents.every(e => e.isNothingToReport);

              return (
                <button
                  key={cell.dateStr}
                  onClick={() => setSelectedDayStr(cell.dateStr!)}
                  className={`aspect-square rounded-xl p-1.5 flex flex-col justify-between border relative transition-all duration-150 ${
                    isSelected
                      ? "bg-gray-100 border-gray-400 text-gray-950 shadow-xs"
                      : "bg-white hover:bg-gray-50 border-gray-100 hover:border-gray-300 text-gray-800"
                  }`}
                >
                  <span className={`text-xs font-bold ${isSelected ? "text-gray-900 font-bold" : "text-gray-500"}`}>
                    {cell.dayNum}
                  </span>

                  {/* Indicators - strictly as requested: do not have an icon on calendar days that have yet to occur */}
                  <div className="w-full flex justify-center pb-1">
                    {!isFuture ? (
                      hasFilteredEvents ? (
                        // Indicator for Days WITH events (Red alert shield/circle)
                        <div className="flex items-center justify-center p-1.5 rounded-full bg-red-50 text-red-600">
                          <ShieldAlert className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        // Indicator for Days WITHOUT events (Safe green shield/check)
                        <div className="flex items-center justify-center p-1.5 rounded-full bg-emerald-50 text-emerald-600">
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                      )
                    ) : (
                      // Days that have yet to occur: DO NOT HAVE AN ICON
                      <div className="h-6 w-6" /> // Empty placeholder to keep layout heights stable
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="p-1 rounded-full bg-red-50 text-red-600"><ShieldAlert className="w-3 h-3" /></span>
              <span>Reported Incident</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="p-1 rounded-full bg-emerald-50 text-emerald-600"><ShieldCheck className="w-3 h-3" /></span>
              <span>Safe / Clear Day</span>
            </div>
          </div>
          <span className="font-medium text-gray-400">
            Month bounds: {monthNames[incidentDateRange.min.getMonth()]} {incidentDateRange.min.getFullYear()} - {monthNames[incidentDateRange.max.getMonth()]} {incidentDateRange.max.getFullYear()}
          </span>
        </div>
      </div>

      {/* Selected Day Details Panel */}
      <div className="lg:col-span-5 bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col justify-between h-full min-h-[500px]">
        <div>
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Timeline Review</h4>
            <h3 className="font-semibold text-gray-900 text-md truncate leading-tight" title={formattedSelectedDate}>
              {formattedSelectedDate}
            </h3>
            {categoryFilter !== "all" && (
              <span className="inline-block mt-1 text-[10px] font-bold bg-[#081e3f]/10 text-[#081e3f] px-2 py-0.5 rounded-md">
                Filtered: {categoryFilter}
              </span>
            )}
          </div>

          {/* List of Day's Incidents */}
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {selectedIncidents.length === 0 ? (
              <div className="bg-white rounded-xl p-6 border border-gray-150 text-center flex flex-col items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-emerald-500 mb-2" />
                <h5 className="font-semibold text-gray-800 text-sm">No incidents recorded</h5>
                <p className="text-xs text-gray-500 mt-1">No matching reports or incidents documented on this day.</p>
              </div>
            ) : selectedIncidents.some(i => i.isNothingToReport) ? (
              <div className="bg-white rounded-xl p-6 border border-gray-150 text-center flex flex-col items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-500 mb-2" />
                <h5 className="font-semibold text-gray-800 text-sm">No incidents recorded</h5>
                <p className="text-xs text-gray-500 mt-1">Daily log explicitly recorded as "Nothing to report".</p>
              </div>
            ) : (
              selectedIncidents.map(inc => (
                <div
                  key={inc.id}
                  onClick={() => onSelectIncident(inc)}
                  className="bg-white rounded-xl p-4 border border-gray-150 hover:border-[#081e3f]/30 hover:shadow-xs transition-all duration-150 cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryColor(inc.category)}`}>
                      {inc.category}
                    </span>
                    {inc.time && (
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium font-mono">
                        <Clock className="w-3 h-3" />
                        <span>{inc.time}</span>
                      </div>
                    )}
                  </div>
                  <h5 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-[#081e3f] transition-colors line-clamp-1">
                    {inc.isNothingToReport ? "Nothing to Report" : "Incident Report"}
                  </h5>
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium mb-2.5">
                    <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                    <span className="truncate">{inc.rawLocation || inc.locationName}</span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {inc.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-6 pt-4 border-t border-gray-200 flex items-start gap-2.5 text-xs text-gray-500">
          <AlertCircle className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
          <p>Select any reported log entry from the list above to view full campus details, dispatcher comments, and coordinates plotted on the map.</p>
        </div>
      </div>

    </div>
  );
}
