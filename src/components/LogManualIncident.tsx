import React, { useState } from "react";
import { IncidentCategory, Incident } from "../types";
import { ShieldAlert, Plus, Calendar, Clock, MapPin, AlignLeft, Check, AlertCircle } from "lucide-react";

interface LogManualIncidentProps {
  onIncidentAdded: (newCount: number) => void;
}

export default function LogManualIncident({ onIncidentAdded }: LogManualIncidentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("Welfare & Well-being");
  const [isNothingToReport, setIsNothingToReport] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !description) {
      setError("Please provide at least a date and incident description.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const isStaticOnly = window.location.hostname.includes("github.io");
      
      const newIncident: Incident = {
        id: `custom-${Date.now()}`,
        date,
        rawDateStr: date,
        time: time || "",
        rawLocation: location || "Campus-wide",
        locationName: location || "Campus-wide",
        address: "",
        category: category as IncidentCategory,
        description,
        isNothingToReport
      };

      // Save locally to localStorage
      const customIncidents = JSON.parse(localStorage.getItem("custom_incidents") || "[]");
      customIncidents.unshift(newIncident); // Put new items at the top
      localStorage.setItem("custom_incidents", JSON.stringify(customIncidents));

      let totalCount = customIncidents.length;

      // Optional backend synchronization if running locally/non-static
      if (!isStaticOnly) {
        try {
          const response = await fetch("/api/incidents", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              date,
              time,
              rawLocation: location || "Campus-wide",
              description,
              category,
              isNothingToReport
            })
          });
          const data = await response.json();
          if (data.success) {
            totalCount = data.count;
          }
        } catch (apiErr) {
          console.warn("Backend sync failed, falling back to local storage only", apiErr);
        }
      }

      setSuccess(true);
      // Reset form
      setDate("");
      setTime("");
      setLocation("");
      setDescription("");
      setIsNothingToReport(false);
      onIncidentAdded(totalCount);
      
      // Automatically close after a short delay
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to log the custom incident.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm mb-8" id="log-manual-incident-section">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-[#081e3f]" />
          <div>
            <h3 className="font-semibold text-gray-900 text-base">CSO Manual Logging Portal</h3>
            <p className="text-xs text-gray-500">Authorized Campus Safety Officers can manually log or archive custom safety occurrences.</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            isOpen
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
              : "bg-[#081e3f] text-white hover:bg-opacity-95"
          }`}
        >
          <Plus className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-45" : ""}`} />
          {isOpen ? "Close Portal" : "Log New Occurrence"}
        </button>
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-6 pt-6 border-t border-gray-100 space-y-4 animate-slide-down">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Occurrence Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#081e3f] focus:border-transparent text-gray-900"
                  required
                />
              </div>
            </div>

            {/* Time */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Time of Day</label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g. 10:25 AM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#081e3f] focus:border-transparent text-gray-900"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Report Classification</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#081e3f] focus:border-transparent text-gray-900"
              >
                {Object.values(IncidentCategory).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Location */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Location & Street Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g. Solberg Hall (2312 S Grange Ave)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#081e3f] focus:border-transparent text-gray-900"
                />
              </div>
            </div>

            {/* Toggle isNothingToReport */}
            <div className="flex items-center h-full pt-6">
              <label className="relative flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNothingToReport}
                  onChange={(e) => setIsNothingToReport(e.target.checked)}
                  className="w-4.5 h-4.5 text-[#081e3f] border-gray-300 rounded-lg focus:ring-[#081e3f]"
                />
                <span className="text-xs font-medium text-gray-700">Flag as "Nothing to report" day</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Dispatcher Narrative / incident Summary</label>
            <div className="relative">
              <AlignLeft className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <textarea
                rows={3}
                placeholder="Narrative summary of occurrence, officer response, and conclusion..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#081e3f] focus:border-transparent text-gray-900"
                required
              />
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-xs text-emerald-700 font-semibold">
              <Check className="w-4 h-4 shrink-0" />
              <span>Occurrence safely added to active archive! Closing portal...</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-gray-500 font-semibold text-xs rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-[#081e3f] text-white font-semibold text-xs rounded-xl hover:bg-opacity-95 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
            >
              {loading ? "Archiving..." : "Archive Log Entry"}
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
