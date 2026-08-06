import { Incident } from "../types";
import { PROCESSED_FALLBACK_INCIDENTS } from "../data/fallbackData";

export interface MonthlyIndexEntry {
  yearMonth: string;
  label: string;
  count: number;
}

export interface MonthlyIndex {
  months: MonthlyIndexEntry[];
  totalIncidents: number;
  lastUpdated: string;
}

// In-memory cache for fetched monthly chunks
const monthCache = new Map<string, Incident[]>();
let indexCache: MonthlyIndex | null = null;

const getBaseUrl = (): string => {
  return (import.meta as any).env?.BASE_URL || "/";
};

/**
 * Fetches the lightweight monthly index (~1KB) containing metadata and counts for each month.
 */
export async function fetchMonthlyIndex(): Promise<MonthlyIndex | null> {
  if (indexCache) return indexCache;
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}data/monthly/index.json`);
    if (!res.ok) return null;
    const data: MonthlyIndex = await res.json();
    indexCache = data;
    return data;
  } catch (err) {
    console.warn("Could not fetch monthly index:", err);
    return null;
  }
}

/**
 * Lazy loads data for a single specific month (e.g. "2026-06").
 */
export async function fetchMonthData(yearMonth: string): Promise<Incident[]> {
  if (monthCache.has(yearMonth)) {
    return monthCache.get(yearMonth)!;
  }

  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}data/monthly/${yearMonth}.json`);
    if (!res.ok) return [];
    const incidents: Incident[] = await res.json();
    monthCache.set(yearMonth, incidents);
    return incidents;
  } catch (err) {
    console.warn(`Failed to lazy-load monthly data for ${yearMonth}:`, err);
    return [];
  }
}

/**
 * Efficiently loads all incidents.
 * It first tries `archivedData.json`. If unavailable or if modular loading is preferred,
 * it fetches the lightweight `index.json` and streams/loads monthly chunks progressively.
 */
export async function loadIncidentsProgressively(
  onUpdate?: (incidents: Incident[], isPartial: boolean, loadedMonths: number, totalMonths: number) => void
): Promise<Incident[]> {
  const baseUrl = getBaseUrl();
  const customLocal: Incident[] = JSON.parse(localStorage.getItem("custom_incidents") || "[]");

  // Attempt 1: Fetch full master file (fastest single HTTP roundtrip when dataset is manageable)
  try {
    const res = await fetch(`${baseUrl}archivedData.json`);
    if (res.ok) {
      const data = await res.json();
      let fetchedList: Incident[] = [];
      if (Array.isArray(data)) {
        fetchedList = data;
      } else if (data && data.success && Array.isArray(data.incidents)) {
        fetchedList = data.incidents;
      }
      if (fetchedList.length > 0) {
        const full = [...customLocal, ...fetchedList];
        onUpdate?.(full, false, 1, 1);
        return full;
      }
    }
  } catch (err) {
    console.info("Master archivedData.json not found or failed, falling back to monthly lazy loading:", err);
  }

  // Attempt 2: Modular Lazy-Loading via monthly index & chunk files
  const index = await fetchMonthlyIndex();
  if (index && index.months && index.months.length > 0) {
    let accumulatedMap = new Map<string, Incident>();

    // Load recent months first for instant display
    const monthsToLoad = index.months;
    let loadedCount = 0;

    for (let i = 0; i < monthsToLoad.length; i++) {
      const ym = monthsToLoad[i].yearMonth;
      const monthIncidents = await fetchMonthData(ym);
      monthIncidents.forEach(inc => accumulatedMap.set(inc.id, inc));
      loadedCount++;

      const currentList = Array.from(accumulatedMap.values());
      const merged = [...customLocal, ...currentList];
      const isPartial = loadedCount < monthsToLoad.length;
      onUpdate?.(merged, isPartial, loadedCount, monthsToLoad.length);
    }

    const finalList = [...customLocal, ...Array.from(accumulatedMap.values())];
    return finalList;
  }

  // Attempt 3: Hardcoded Fallback
  const fallbackList = [...customLocal, ...PROCESSED_FALLBACK_INCIDENTS];
  onUpdate?.(fallbackList, false, 1, 1);
  return fallbackList;
}
