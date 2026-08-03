import fs from "fs";
import path from "path";
import { PROCESSED_FALLBACK_INCIDENTS, getCategory } from "../src/data/fallbackData";

async function main() {
  const url = "https://www.augie.edu/student-affairs/campus-safety/campus-safety-log";
  const botUserAgent = "Mozilla/5.0";

  console.log("Fetching live campus safety log...");
  const res = await fetch(url, { headers: { "User-Agent": botUserAgent } });
  if (!res.ok) {
    throw new Error(`Failed to fetch live page: ${res.status}`);
  }
  const html = await res.text();

  function parseDateToISO(dateStr: string): string {
    let cleanStr = dateStr.replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)[,\s]*/i, "").trim();
    cleanStr = cleanStr.replace(/(\d+)(st|nd|rd|th)\b/i, "$1");
    const parsed = Date.parse(`${cleanStr} 2026`);
    if (!isNaN(parsed)) {
      const d = new Date(parsed);
      return d.toISOString().split("T")[0];
    }
    return new Date().toISOString().split("T")[0];
  }

  const dateRegex = /<p><strong>\s*(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)[^<]*<\/strong>/gi;
  const datePositions: { dateStr: string; index: number }[] = [];
  let match;
  while ((match = dateRegex.exec(html)) !== null) {
    const rawDate = match[0].replace(/<[^>]+>/g, "").trim().replace(/&nbsp;/gi, " ");
    datePositions.push({ dateStr: rawDate, index: match.index });
  }

  const scrapedIncidents: any[] = [];

  for (let i = 0; i < datePositions.length; i++) {
    const current = datePositions[i];
    const next = datePositions[i + 1];
    const chunk = html.substring(current.index, next ? next.index : html.length);
    const liRegex = /<li\s+[^>]*data-list-item-id="([^"]+)"[^>]*>([\s\S]*?)<\/li>/gi;
    let liMatch;
    
    while ((liMatch = liRegex.exec(chunk)) !== null) {
      const id = liMatch[1];
      const text = liMatch[2]
        .replace(/&nbsp;/gi, " ")
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();
        
      if (!text) continue;
      
      const isNothing = text.toLowerCase().includes("nothing to report") || text === ". Nothing to report." || text === "Nothing to report";
      
      const timeRegex = /^(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)\s*/i;
      const timeMatch = text.match(timeRegex);
      let time = "";
      let remainingText = text;
      
      if (timeMatch) {
        time = timeMatch[1].trim();
        remainingText = text.substring(timeMatch[0].length).trim();
      }
      
      let rawLocation = "Campus-wide";
      let locationName = "Campus-wide";
      let address = "";
      
      const parenMatch = remainingText.match(/^([^\(]+)\s*\(([^\)]+)\)/);
      if (parenMatch) {
        locationName = parenMatch[1].trim();
        address = parenMatch[2].trim();
        rawLocation = `${locationName} (${address})`;
        remainingText = remainingText.substring(parenMatch[0].length).trim();
      } else {
        const KNOWN_LOCATION_KEYWORDS = [
          "33rd and Grange Ave", "33rd & Grange Ave", "33rd and Grange",
          "33rd and Summit Ave", "33rd & Summit Ave", "33rd and Summit",
          "Summit Ave", "Summit Avenue", "Grange Ave", "Grange Avenue",
          "Prairie Ave", "Prairie Avenue", "Menlo Ave", "Menlo Avenue",
          "Walts Ave", "Walts Avenue", "33rd St", "33rd Street",
          "26th St", "26th Street", "28th St", "28th Street", "31st St", "31st Street",
          "Stavig/Granskou Loop", "Granskou Hall parking lot", "Bergsaker Hall parking lot",
          "President's House", "Schoeneman Apartments", "Schoeneman Apartment", "Schoeneman Apt",
          "Solberg Hall lot", "Solberg Lot", "Charles Orin Solberg Hall", "Stavig Hall parking lot", "Clemens M. Stavig Hall",
          "Summit Apt Alley", "Svendsbye Apartments", "Svendsbye Apartment", "Svendsbye Apt", "University Welcome Center",
          "Edith Mortenson Center", "Center for Western Studies", "Chapel of Reconciliation", "Archaeology Laboratories",
          "Center for Visual Arts", "Eide/Dalrymple Gallery", "Augustana Garden", "Augustana University Garden",
          "Campus Garden", "Balcer Apartments", "Balcer Apartment", "Balcer Apt", "Bergsaker Hall", "Bergsaker Dorm",
          "A.J. Bergsaker Hall", "Bowden Field", "Softball Field", "Ronken Field", "Baseball Field", "Campus Green",
          "Campus House", "Campus Pond", "Viking Oasis", "Costello Hall", "Costello Hall Apartments", "Commons Drive",
          "Commons loop", "East Hall", "Elmen Center lot", "Elmen Center", "Foundation Heights", "Froiland Science Center",
          "Froiland Science", "Froiland", "Fryxell Humanities Center", "Fryxell Humanities", "Fryxell", "Granskou Hall",
          "Halverson House", "Heritage Park", "Kirkeby-Over Stadium", "Kirkeby-Over", "Kresge Recital Hall",
          "Larson Track & Field Complex", "Larson Track", "Lillehaug Hall", "Madsen Center", "McKennan House",
          "Midco Arena", "Mikkelsen Library", "Morrison Commons", "Morrison Commons lot", "Morrison Commons Lot",
          "Nelson Service Center", "Nelsen Service Center", "Nelson Service", "OSL lot", "Our Savior's Lutheran",
          "Our Saviors Lutheran", "Ole Hall", "Solberg Hall", "Stavig Hall", "Terning House", "Tuve Hall lot",
          "Tuve Hall", "Track", "Valhalla House", "Ralph H. Wagoner Hall", "Wagoner Hall", "Wagoner Lot", "Younkers Hall",
          "Stavig", "Granskou", "Bergsaker", "Solberg", "Tuve", "Wagoner", "Costello", "Mikkelsen", "Commons", "Elmen",
          "Midco", "Valhalla", "Nelson", "Nelsen", "Balcer", "Schoeneman", "Svendsbye", "Terning", "Pond"
        ];

        let matchedKeyword = "";
        const normText = remainingText.toLowerCase();
        for (const kw of KNOWN_LOCATION_KEYWORDS) {
          const kwLower = kw.toLowerCase();
          const startsWithKw = normText.startsWith(kwLower) && 
            (normText.length === kwLower.length || /^[.,\s]/.test(normText.substring(kwLower.length)));
          if (startsWithKw) {
            matchedKeyword = kw;
            const typedText = remainingText.substring(0, kw.length).trim();
            locationName = typedText;
            rawLocation = typedText;
            remainingText = remainingText.substring(kw.length).trim();
            if (remainingText.startsWith(".") || remainingText.startsWith(",")) {
              remainingText = remainingText.substring(1).trim();
            }
            break;
          }
        }

        if (!matchedKeyword) {
          const sentences = remainingText.split(/\.(?=\s|[A-Z]|$)/);
          if (sentences.length > 0) {
            const firstSentence = sentences[0].trim();
            const isNothing = /nothing\s+to\s+report/i.test(firstSentence) || /no\s+incidents/i.test(firstSentence);
            if (!isNothing && firstSentence.length > 0 && firstSentence.length < 100) {
              locationName = firstSentence;
              rawLocation = firstSentence;
              remainingText = remainingText.substring(sentences[0].length).trim();
              if (remainingText.startsWith(".")) {
                remainingText = remainingText.substring(1).trim();
              }
            }
          }
        }
      }
      
      let type = "General Incident";
      let description = remainingText;
      
      if (isNothing) {
        type = "Nothing to report";
        description = "Nothing to report.";
      } else {
        const sentences = remainingText.split(/\.(?=\s|[A-Z])/);
        if (sentences.length > 0) {
          type = sentences[0].trim();
          description = sentences.slice(1).join(".").trim();
          if (!description) {
            description = type;
          }
        }
      }
      
      const isoDate = parseDateToISO(current.dateStr);
      
      scrapedIncidents.push({
        id,
        date: isoDate,
        rawDateStr: current.dateStr,
        time,
        type,
        rawLocation,
        locationName,
        address,
        category: getCategory(type || description),
        description,
        isNothingToReport: isNothing
      });
    }
  }

  console.log(`Parsed ${scrapedIncidents.length} incidents from live site.`);

  // Write main archive
  const archivePath = path.join(process.cwd(), "src", "data", "archivedData.json");
  fs.writeFileSync(archivePath, JSON.stringify(scrapedIncidents, null, 2), "utf-8");
  console.log(`Saved ${scrapedIncidents.length} incidents to ${archivePath}`);

  const publicArchivePath = path.join(process.cwd(), "public", "archivedData.json");
  if (fs.existsSync(path.dirname(publicArchivePath))) {
    fs.writeFileSync(publicArchivePath, JSON.stringify(scrapedIncidents, null, 2), "utf-8");
  }

  // --- MONTHLY BREAKDOWN & SCHOOL YEAR INDEX ---
  const monthlyMap = new Map<string, any[]>();
  scrapedIncidents.forEach(inc => {
    const ym = inc.date.substring(0, 7); // e.g., "2026-07"
    if (!monthlyMap.has(ym)) {
      monthlyMap.set(ym, []);
    }
    monthlyMap.get(ym)!.push(inc);
  });

  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const monthSummaries: any[] = [];
  const srcMonthlyDir = path.join(process.cwd(), "src", "data", "monthly");
  const publicMonthlyDir = path.join(process.cwd(), "public", "data", "monthly");

  if (!fs.existsSync(srcMonthlyDir)) fs.mkdirSync(srcMonthlyDir, { recursive: true });
  if (!fs.existsSync(publicMonthlyDir)) fs.mkdirSync(publicMonthlyDir, { recursive: true });

  monthlyMap.forEach((incidents, ym) => {
    const [y, m] = ym.split("-");
    const monthIndex = parseInt(m, 10) - 1;
    const monthLabel = `${MONTH_NAMES[monthIndex]} ${y}`;

    monthSummaries.push({
      yearMonth: ym,
      label: monthLabel,
      count: incidents.length
    });

    // Write monthly JSON
    const srcFile = path.join(srcMonthlyDir, `${ym}.json`);
    const publicFile = path.join(publicMonthlyDir, `${ym}.json`);
    fs.writeFileSync(srcFile, JSON.stringify(incidents, null, 2), "utf-8");
    fs.writeFileSync(publicFile, JSON.stringify(incidents, null, 2), "utf-8");
  });

  // Sort months descending
  monthSummaries.sort((a, b) => b.yearMonth.localeCompare(a.yearMonth));

  const monthlyIndexData = {
    months: monthSummaries,
    totalIncidents: scrapedIncidents.length,
    lastUpdated: new Date().toISOString()
  };

  fs.writeFileSync(path.join(srcMonthlyDir, "index.json"), JSON.stringify(monthlyIndexData, null, 2), "utf-8");
  fs.writeFileSync(path.join(publicMonthlyDir, "index.json"), JSON.stringify(monthlyIndexData, null, 2), "utf-8");
  console.log(`Saved ${monthSummaries.length} monthly JSON files and index to src/data/monthly/ & public/data/monthly/`);

  // Generate updated fallbackData.ts
  const fallbackPath = path.join(process.cwd(), "src", "data", "fallbackData.ts");
  const fallbackCode = `import { Incident, IncidentCategory } from "../types";

export function getCategory(text: string): IncidentCategory {
  const t = text.toLowerCase();
  if (t.includes("nothing to report")) return IncidentCategory.NOTHING;
  if (t.includes("medical") || t.includes("injury") || t.includes("ambulance") || t.includes("well being check") || t.includes("welfare check") || t.includes("intoxicated")) return IncidentCategory.MEDICAL;
  if (t.includes("theft") || t.includes("stolen") || t.includes("damage") || t.includes("vandalism") || t.includes("property")) return IncidentCategory.THEFT;
  if (t.includes("disorderly") || t.includes("suspicious") || t.includes("trespass") || t.includes("noise") || t.includes("conduct")) return IncidentCategory.DISORDERLY;
  if (t.includes("traffic") || t.includes("auto") || t.includes("vehicle") || t.includes("accident") || t.includes("collision") || t.includes("tow") || t.includes("parking")) return IncidentCategory.TRAFFIC;
  if (t.includes("fire") || t.includes("smoke") || t.includes("alarm")) return IncidentCategory.FIRE;
  return IncidentCategory.OTHER;
}

export const FALLBACK_INCIDENTS: any[] = ${JSON.stringify(scrapedIncidents, null, 2)};

export const PROCESSED_FALLBACK_INCIDENTS: Incident[] = (FALLBACK_INCIDENTS as any[]).map(inc => {
  const category = getCategory(inc.type || inc.description);
  return {
    id: inc.id,
    date: inc.date,
    rawDateStr: inc.rawDateStr,
    time: inc.time || "",
    type: inc.type || "",
    rawLocation: inc.rawLocation || "Campus-wide",
    locationName: inc.locationName || "Campus-wide",
    address: inc.address || "",
    category,
    description: inc.description || "",
    isNothingToReport: inc.isNothingToReport ?? (inc.type === "Nothing to report" || inc.rawLocation === "Campus-wide")
  };
});
`;

  fs.writeFileSync(fallbackPath, fallbackCode, "utf-8");
  console.log(`Updated ${fallbackPath} with ${scrapedIncidents.length} incidents.`);
}

main().catch(console.error);
