import React from "react";
import { Incident } from "../types";
import { CAMPUS_BUILDINGS } from "../data/campusLocations";
import { X, Clock, MapPin, Calendar, Shield, Clipboard } from "lucide-react";

interface IncidentModalProps {
  incident: Incident | null;
  onClose: () => void;
  onViewOnMap?: (incident: Incident) => void;
}

export default function IncidentModal({ incident, onClose, onViewOnMap }: IncidentModalProps) {
  if (!incident) return null;

  // Find associated campus building for additional context
  const associatedBuilding = CAMPUS_BUILDINGS.find(b => {
    const locLower = incident.locationName.toLowerCase();
    const bNameLower = b.name.toLowerCase();
    return locLower.includes(bNameLower) || bNameLower.includes(locLower) || 
           (b.aliases && b.aliases.some(alias => locLower.includes(alias.toLowerCase())));
  });

  const getCategoryBadgeClass = (category: string) => {
    return "bg-[#081e3f]/5 text-[#081e3f] border-[#081e3f]/10";
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 transition-all animate-fade-in">
      
      {/* Modal Container */}
      <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#081e3f]" />
            <span className="font-semibold text-gray-900 text-sm">Security Log Report</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 sm:p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
          
          {/* Main Title / Type */}
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(incident.category)}`}>
                {incident.category}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
              {incident.isNothingToReport ? "Nothing to Report" : "Incident Report"}
            </h3>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 bg-gray-50/50 p-3.5 sm:p-4 rounded-xl border border-gray-100/80">
            
            {/* Date */}
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Report Date</span>
                <span className="text-xs font-semibold text-gray-700">{incident.rawDateStr}</span>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Occurrence Time</span>
                <span className="text-xs font-semibold text-gray-700">{incident.time || "Not Recorded"}</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-2 col-span-2">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Occurrence Location</span>
                <span className="text-xs font-semibold text-gray-700 leading-relaxed">{incident.rawLocation || "Campus-wide"}</span>
              </div>
            </div>

          </div>

          {/* Description Block */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Dispatcher Log / Details</h4>
            <div className="p-3.5 sm:p-4 bg-white border border-gray-150 rounded-xl">
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line font-medium">
                {incident.description}
              </p>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 text-gray-400 font-medium">
            <Clipboard className="w-4 h-4" />
            <span>Safety Archive</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onViewOnMap && (
              <button
                onClick={() => onViewOnMap(incident)}
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-blue-50 text-[#081e3f] font-semibold rounded-xl hover:bg-blue-100 transition-all cursor-pointer text-center"
              >
                View on Map
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#081e3f] text-white font-semibold rounded-xl hover:bg-opacity-95 transition-all cursor-pointer text-center"
            >
              Close Report
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
