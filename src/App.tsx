import React, { useState, useEffect, useMemo } from "react";
import { Incident, IncidentCategory } from "./types";
import { PROCESSED_FALLBACK_INCIDENTS } from "./data/fallbackData";
import CampusMap from "./components/CampusMap";
import SafetyCalendar from "./components/SafetyCalendar";
import SafetyArchive from "./components/SafetyArchive";
import IncidentModal from "./components/IncidentModal";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  Calendar as CalendarIcon,
  MapPin,
  RefreshCw,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle,
  FileText,
  Clock,
  Map as MapIcon,
  X,
  PlusCircle,
  TrendingUp,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Database,
  Info
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"archive" | "map" | "calendar">("archive");
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [scraping, setScraping] = useState<boolean>(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // Scraper status message
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [scrapeTime, setScrapeTime] = useState<string>("");

  // Calendar States
  const [currentYear, setCurrentYear] = useState<number>(2026);
  // Default to June (month index 5 is June) as logs are June/May/April/March/Feb
  const [currentMonth, setCurrentMonth] = useState<number>(5); 
  const [selectedDate, setSelectedDate] = useState<string>("2026-06-22");

  // Load Initial Incidents from static JSON or API fallback
  const fetchIncidents = async () => {
    setLoading(true);
    try {
      // Correct relative path for GitHub Pages subdirectories
      const baseUrl = (import.meta as any).env?.BASE_URL || "/";
      const res = await fetch(`${baseUrl}archivedData.json`);
      const data = await res.json();
      
      let fetchedList: Incident[] = [];
      if (Array.isArray(data)) {
        fetchedList = data;
      } else if (data && data.success && Array.isArray(data.incidents)) {
        fetchedList = data.incidents;
      } else {
        console.warn("Invalid data format received, using local fallback");
        fetchedList = PROCESSED_FALLBACK_INCIDENTS;
      }

      // Merge with custom local incidents logged locally
      const customLocal = JSON.parse(localStorage.getItem("custom_incidents") || "[]");
      setIncidents([...customLocal, ...fetchedList]);
    } catch (err) {
      console.warn("Static JSON load failed, falling back to client-side fallback data:", err);
      const customLocal = JSON.parse(localStorage.getItem("custom_incidents") || "[]");
      setIncidents([...customLocal, ...PROCESSED_FALLBACK_INCIDENTS]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  // Scrape live site
  const handleScrape = async () => {
    const isGitHubPages = window.location.hostname.includes("github.io");
    if (isGitHubPages) {
      setStatusMessage(
        "Notice: Manual crawling is disabled in production to protect university server resources. Safety logs are refreshed automatically every 24 hours via GitHub Actions."
      );
      return;
    }

    setScraping(true);
    setStatusMessage("Connecting to www.augie.edu to scrape logs...");
    try {
      const res = await fetch("/api/scrape", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setIncidents(data.incidents);
        setScrapeTime(data.timestamp || new Date().toLocaleTimeString());
        if (data.rateLimited) {
          setStatusMessage(`Rate Limit Active: ${data.message}`);
        } else {
          setStatusMessage(
            `Success! Scraped ${data.scrapedCount} items. ${data.newItemsCount} new items archived.`
          );
        }
      } else {
        setStatusMessage(`Error: ${data.error || "Scraping failed."}`);
      }
    } catch (err: any) {
      console.warn("API scraper failed, falling back to static status explanation", err);
      setStatusMessage(
        "Notice: This client is running in high-performance Static Archive mode. Safety logs are synchronized automatically every 24 hours via a secure GitHub Actions pipeline."
      );
    } finally {
      setScraping(false);
    }
  };

  // Index incidents by date for the calendar lookup
  const dayIncidentsMap = useMemo(() => {
    const map = new Map<string, Incident[]>();
    incidents.forEach(inc => {
      const list = map.get(inc.date) || [];
      list.push(inc);
      map.set(inc.date, list);
    });
    return map;
  }, [incidents]);

  // Calendar generation helpers
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = useMemo(() => {
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const days: string[] = [];

    // Pads
    for (let i = 0; i < firstDayIndex; i++) {
      days.push("");
    }

    // Days
    for (let d = 1; d <= totalDays; d++) {
      const mPad = String(currentMonth + 1).padStart(2, "0");
      const dPad = String(d).padStart(2, "0");
      days.push(`${currentYear}-${mPad}-${dPad}`);
    }

    return days;
  }, [currentYear, currentMonth]);

  const changeMonth = (direction: number) => {
    setCurrentMonth(prev => {
      let nextMonth = prev + direction;
      let nextYear = currentYear;
      if (nextMonth < 0) {
        nextMonth = 11;
        nextYear -= 1;
      } else if (nextMonth > 11) {
        nextMonth = 0;
        nextYear += 1;
      }
      setCurrentYear(nextYear);
      return nextMonth;
    });
  };

  // Selected Day Incidents list
  const selectedDayIncidents = useMemo(() => {
    return dayIncidentsMap.get(selectedDate) || [];
  }, [dayIncidentsMap, selectedDate]);

  // Overall Statistics
  const stats = useMemo(() => {
    const totalLogs = incidents.length;
    const realIncidents = incidents.filter(i => !i.isNothingToReport).length;
    const safeDays = incidents.filter(i => i.isNothingToReport).length;
    const categoriesCount = new Map<string, number>();

    incidents.forEach(inc => {
      if (!inc.isNothingToReport) {
        categoriesCount.set(inc.category, (categoriesCount.get(inc.category) || 0) + 1);
      }
    });

    const topCategory = Array.from(categoriesCount.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

    return { totalLogs, realIncidents, safeDays, topCategory };
  }, [incidents]);

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-800 font-sans antialiased pb-20">
      
      {/* Majestic Navy Blue Header Banner */}
      <header className="bg-[#081e3f] text-white border-b-4 border-[#fed101] shadow-lg relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/40 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
          <div className="space-y-4 max-w-3xl">
            {/* Logo Masthead */}
            <div className="flex flex-col select-none tracking-tight">
              <span className="text-xs sm:text-sm font-semibold tracking-[0.3em] text-[#fed101] uppercase">
                The Augustana
              </span>
              <span className="text-5xl sm:text-7xl font-black tracking-[-0.03em] leading-none text-white uppercase font-sans">
                Mirror
              </span>
            </div>

            <div className="pt-3 border-t border-blue-800/60">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Campus Safety Log Scraper and Archive
              </h1>
              <p className="text-base sm:text-lg text-blue-200 font-semibold mt-1.5">
                By: Parker Carbonneau
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 w-full md:w-auto self-start md:self-end shrink-0">
            <button
              onClick={handleScrape}
              disabled={scraping}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-[#fed101] hover:bg-[#fed101]/95 text-[#081e3f] text-sm font-bold rounded-xl shadow-md transition-all duration-150 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${scraping ? "animate-spin" : ""}`} />
              {scraping ? "Scraping augie.edu..." : "Crawl Live Logs"}
            </button>
          </div>
        </div>
      </header>

      {/* Scraper Status Notification Panel */}
      {statusMessage && (
        <div className="bg-blue-50/80 border-b border-blue-100 py-3 px-6 animate-fade-in">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-blue-800 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>{statusMessage}</span>
            </div>
            {scrapeTime && <span className="text-gray-400 font-mono">Last updated: {scrapeTime}</span>}
          </div>
        </div>
      )}

      {/* Segmented Control Navigation Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="grid grid-cols-3 gap-1.5 bg-gray-100/80 p-1.5 rounded-2xl border border-gray-200 shadow-xs">
          <button
            onClick={() => setActiveTab("archive")}
            className={`py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "archive"
                ? "bg-[#081e3f] text-white shadow-md shadow-[#081e3f]/10"
                : "text-gray-600 hover:bg-white/60 hover:text-gray-900"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Archive Feed</span>
          </button>
          <button
            onClick={() => setActiveTab("map")}
            className={`py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "map"
                ? "bg-[#081e3f] text-white shadow-md shadow-[#081e3f]/10"
                : "text-gray-600 hover:bg-white/60 hover:text-gray-900"
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>Interactive Map</span>
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "calendar"
                ? "bg-[#081e3f] text-white shadow-md shadow-[#081e3f]/10"
                : "text-gray-600 hover:bg-white/60 hover:text-gray-900"
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Safety Calendar</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 mt-6 space-y-6">
        
        {/* Clery Act Mandated Crime Log About Section */}
        <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-start gap-4" id="about-section">
          <div className="p-3 bg-blue-50 text-[#081e3f] rounded-xl border border-blue-100/50 flex-shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              Under the Clery Act of 1990 all colleges and universities are mandated to maintain a daily crime log. Augustana's website only reports incidents that occurred within the last 60 days. This archive scrapes campus safety data from Augustana website to preserve and integrate the log into an accessible, interactive application.
            </p>
            <p className="text-xs text-gray-500 font-semibold">
              Augustana's campus safety log is located at:{" "}
              <a
                href="https://www.augie.edu/student-affairs/campus-safety/campus-safety-log"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#081e3f] hover:underline font-bold inline-flex items-center gap-1"
              >
                https://www.augie.edu/student-affairs/campus-safety/campus-safety-log
              </a>
            </p>
          </div>
        </section>

        {/* Tab-driven Conditional Views */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-20 text-center flex flex-col items-center justify-center gap-4">
            <RefreshCw className="w-8 h-8 text-[#081e3f] animate-spin" />
            <p className="text-sm font-semibold text-gray-500">Loading historical campus safety archives...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === "archive" && (
                <SafetyArchive incidents={incidents} onSelectIncident={setSelectedIncident} />
              )}
              {activeTab === "map" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <MapIcon className="w-5 h-5 text-[#081e3f]" />
                      Campus Safety Log Map
                    </h2>
                  </div>
                  <CampusMap incidents={incidents} onSelectIncident={setSelectedIncident} selectedIncident={selectedIncident} />
                </div>
              )}
              {activeTab === "calendar" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-[#081e3f]" />
                        Interactive Safety Calendar
                      </h2>
                      <p className="text-xs text-gray-500">Navigate month-by-month to inspect occurrences. Safe days display a green safety shield, while days with warnings indicate incidents.</p>
                    </div>
                  </div>
                  <SafetyCalendar incidents={incidents} onSelectIncident={setSelectedIncident} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}



      </main>

      {/* Full Incident Details Modal */}
      <AnimatePresence>
        {selectedIncident && (
          <IncidentModal
            incident={selectedIncident}
            onClose={() => setSelectedIncident(null)}
            onViewOnMap={(inc) => {
              setSelectedIncident(inc);
              setActiveTab("map");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
