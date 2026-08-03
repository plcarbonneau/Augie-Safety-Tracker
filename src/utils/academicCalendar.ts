import { Incident } from "../types";

export interface AcademicPeriod {
  id: string; // e.g. "2025-2026" or "summer-2026"
  label: string; // e.g. "2025–2026 School Year (Aug 22, 2025 – May 23, 2026)"
  shortLabel: string; // e.g. "2025–2026 SY" or "Summer '26"
  type: "school_year" | "summer";
  count?: number;
}

export interface MonthSummary {
  yearMonth: string; // e.g. "2026-07"
  label: string; // e.g. "July 2026"
  count: number;
}

/**
 * Calculates academic period based on Augustana's calendar:
 * School Year starts August 22 and ends May 23.
 * Summer period runs May 24 to August 21.
 */
export function getAcademicPeriodForDate(dateStr: string): AcademicPeriod {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    return {
      id: "unknown",
      label: "Unknown Period",
      shortLabel: "Unknown",
      type: "school_year"
    };
  }

  const [yearStr, monthStr, dayStr] = dateStr.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return {
      id: "unknown",
      label: "Unknown Period",
      shortLabel: "Unknown",
      type: "school_year"
    };
  }

  if ((month === 8 && day >= 22) || month > 8) {
    const startYr = year;
    const endYr = year + 1;
    return {
      id: `${startYr}-${endYr}`,
      label: `${startYr}–${endYr} School Year (Aug 22, ${startYr} – May 23, ${endYr})`,
      shortLabel: `${startYr}–${endYr} SY`,
      type: "school_year"
    };
  } else if (month < 5 || (month === 5 && day <= 23)) {
    const startYr = year - 1;
    const endYr = year;
    return {
      id: `${startYr}-${endYr}`,
      label: `${startYr}–${endYr} School Year (Aug 22, ${startYr} – May 23, ${endYr})`,
      shortLabel: `${startYr}–${endYr} SY`,
      type: "school_year"
    };
  } else {
    return {
      id: `summer-${year}`,
      label: `Summer ${year} (May 24 – Aug 21, ${year})`,
      shortLabel: `Summer '${year.toString().slice(-2)}`,
      type: "summer"
    };
  }
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function getMonthLabel(yearMonth: string): string {
  const [y, m] = yearMonth.split("-");
  const monthIndex = parseInt(m, 10) - 1;
  if (monthIndex >= 0 && monthIndex < 12) {
    return `${MONTH_NAMES[monthIndex]} ${y}`;
  }
  return yearMonth;
}

export function getAvailableMonthsList(incidents: Incident[]): MonthSummary[] {
  const map = new Map<string, number>();

  incidents.forEach(inc => {
    if (inc.date && inc.date.length >= 7) {
      const ym = inc.date.substring(0, 7);
      map.set(ym, (map.get(ym) || 0) + 1);
    }
  });

  const list: MonthSummary[] = Array.from(map.entries()).map(([yearMonth, count]) => ({
    yearMonth,
    label: getMonthLabel(yearMonth),
    count
  }));

  // Sort descending by YYYY-MM
  list.sort((a, b) => b.yearMonth.localeCompare(a.yearMonth));

  return list;
}

export function getAcademicPeriodsList(incidents: Incident[]): AcademicPeriod[] {
  const map = new Map<string, AcademicPeriod>();

  incidents.forEach(inc => {
    const period = getAcademicPeriodForDate(inc.date);
    const existing = map.get(period.id);
    if (existing) {
      existing.count = (existing.count || 0) + 1;
    } else {
      map.set(period.id, { ...period, count: 1 });
    }
  });

  const list = Array.from(map.values());

  // Sort so school years come chronologically descending, with summer periods positioned correctly
  list.sort((a, b) => {
    // Extract base year from id
    const yearA = parseInt(a.id.replace("summer-", "").split("-")[0], 10);
    const yearB = parseInt(b.id.replace("summer-", "").split("-")[0], 10);
    if (yearA !== yearB) return yearB - yearA;
    // If same year, school_year comes before summer in descending order
    if (a.type === "school_year" && b.type === "summer") return -1;
    if (a.type === "summer" && b.type === "school_year") return 1;
    return 0;
  });

  return list;
}
