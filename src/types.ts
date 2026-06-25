/**
 * Shared types for Augustana Campus Safety Tracker
 */

export interface Incident {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  rawDateStr: string; // E.g., "Monday, June 22" or "Sunday May 17"
  time: string; // E.g., "9:35 AM" or "" (if none)
  type?: string; // E.g. "Well Being check" or "Fire Alarm"
  rawLocation: string; // E.g., "Solberg Hall (2312 S Grange Ave)"
  locationName: string; // E.g., "Solberg Hall"
  address: string; // E.g., "2312 S Grange Ave"
  category: IncidentCategory;
  description: string;
  isNothingToReport: boolean;
}

export enum IncidentCategory {
  WELFARE = "Welfare & Well-being",
  SUBSTANCE = "Substances & Alcohol",
  FIRE = "Fire & Safety",
  THEFT = "Theft & Property Damage",
  MEDICAL = "Medical Response",
  DISORDERLY = "Disorderly & Suspicious",
  TRAFFIC = "Traffic & Parking",
  OTHER = "Other Assistance",
  NOTHING = "Nothing to Report"
}

export interface CampusBuilding {
  name: string;
  lat: number;
  lng: number;
  description: string;
  address?: string;
  aliases?: string[];
}

export interface ScraperResult {
  incidents: Incident[];
  timestamp: string;
  success: boolean;
  error?: string;
}
