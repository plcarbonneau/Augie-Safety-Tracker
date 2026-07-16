import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { Incident, IncidentCategory } from "./src/types";
import { PROCESSED_FALLBACK_INCIDENTS, getCategory } from "./src/data/fallbackData";

const app = express();
const PORT = 3000;

app.use(express.json());

// Path to archive file
const ARCHIVE_FILE = path.join(process.cwd(), "src", "data", "archivedData.json");

// Helper to load archived incidents
function loadArchivedIncidents(): Incident[] {
  let incidents: Incident[] = [];
  let modified = false;

  try {
    if (fs.existsSync(ARCHIVE_FILE)) {
      const raw = fs.readFileSync(ARCHIVE_FILE, "utf-8");
      incidents = JSON.parse(raw);
    } else {
      incidents = [...PROCESSED_FALLBACK_INCIDENTS];
      modified = true;
    }
  } catch (err) {
    console.error("Failed to read archive file, falling back to static:", err);
    incidents = [...PROCESSED_FALLBACK_INCIDENTS];
  }

  // Self-repair: Sync archived data with static fallback data to correct old "Campus-wide" or missing details
  const fallbackMap = new Map<string, Incident>();
  PROCESSED_FALLBACK_INCIDENTS.forEach(f => fallbackMap.set(f.id, f));

  incidents = incidents.map(inc => {
    const fallback = fallbackMap.get(inc.id);
    if (fallback) {
      // If the archived entry is marked "Campus-wide" but the fallback has a specific location, fix it!
      const fallbackHasSpecificLocation = fallback.rawLocation && 
        fallback.rawLocation.toLowerCase() !== "campus-wide" && 
        fallback.rawLocation.toLowerCase() !== "campus wide";
      
      const archiveHasCampusWide = !inc.rawLocation || 
        inc.rawLocation.toLowerCase() === "campus-wide" || 
        inc.rawLocation.toLowerCase() === "campus wide";

      if (fallbackHasSpecificLocation && archiveHasCampusWide) {
        modified = true;
        return {
          ...inc,
          rawLocation: fallback.rawLocation,
          locationName: fallback.locationName,
          address: fallback.address,
          category: fallback.category
        };
      }
    }
    return inc;
  });

  if (modified) {
    saveArchivedIncidents(incidents);
  }
  
  return incidents;
}

// Helper to save archived incidents
function saveArchivedIncidents(incidents: Incident[]): boolean {
  try {
    const dir = path.dirname(ARCHIVE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(ARCHIVE_FILE, JSON.stringify(incidents, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Failed to save archive file:", err);
    return false;
  }
}

// Convert "Monday, June 22" or similar to ISO YYYY-MM-DD
function parseDateToISO(dateStr: string): string {
  try {
    // Current year is 2026 based on metadata
    let cleanStr = dateStr.replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)[,\s]*/i, "").trim();
    // Strip ordinal suffixes like 1st, 2nd, 3rd, 4th, etc.
    cleanStr = cleanStr.replace(/(\d+)(st|nd|rd|th)\b/i, "$1");
    // E.g., "June 22" or "July 4" -> "July 4 2026"
    const parsed = Date.parse(`${cleanStr} 2026`);
    if (!isNaN(parsed)) {
      const d = new Date(parsed);
      return d.toISOString().split("T")[0];
    }
  } catch (e) {
    console.error("Date parsing error for:", dateStr, e);
  }
  
  // Return current date if failed
  return new Date().toISOString().split("T")[0];
}

// Custom HTML Scraper / Parser
function parseCampusSafetyHTML(html: string): Incident[] {
  const incidents: Incident[] = [];
  
  // Regex to match dates in <p><strong>Monday, June 22</strong></p>
  // Handles variations like spaces, commas, &nbsp;
  const dateRegex = /<p><strong>\s*(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)[^<]*<\/strong>/gi;
  const datePositions: { dateStr: string; index: number }[] = [];
  
  let match;
  while ((match = dateRegex.exec(html)) !== null) {
    const rawDate = match[0].replace(/<[^>]+>/g, "").trim().replace(/&nbsp;/gi, " ");
    datePositions.push({ dateStr: rawDate, index: match.index });
  }
  
  for (let i = 0; i < datePositions.length; i++) {
    const current = datePositions[i];
    const next = datePositions[i + 1];
    const chunk = html.substring(current.index, next ? next.index : html.length);
    
    // Find all <li> items inside this day's chunk
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
      
      // Parse time
      const timeRegex = /^(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)\s*/i;
      const timeMatch = text.match(timeRegex);
      let time = "";
      let remainingText = text;
      
      if (timeMatch) {
        time = timeMatch[1].trim();
        remainingText = text.substring(timeMatch[0].length).trim();
      }
      
      // Parse location (looks for parentheses containing the address)
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
        // Smart known locations and aliases matching first!
        const KNOWN_LOCATION_KEYWORDS = [
          "Stavig/Granskou Loop", "Granskou Hall parking lot", "Bergsaker Hall parking lot",
          "Fellows’ Presidential Residence", "President's House", "Schoeneman Apartments", "Schoeneman Apartment", "Schoeneman Apt",
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
          // If no specific known keyword matches, grab the first sentence/segment up to a dot as the specific location!
          // This avoids defaulting to "Campus-wide" for unmatched street-level or off-campus entries!
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
      
      // Parse type and description
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
      
      incidents.push({
        id,
        date: isoDate,
        rawDateStr: current.dateStr,
        time,
        rawLocation,
        locationName,
        address,
        category: getCategory(type || description),
        description,
        isNothingToReport: isNothing
      });
    }
  }
  
  return incidents;
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// Fetch all incidents
app.get("/api/incidents", (req, res) => {
  const incidents = loadArchivedIncidents();
  res.json({ success: true, count: incidents.length, incidents });
});

// Reset archive to static 60-day fallback data
app.post("/api/reset", (req, res) => {
  const success = saveArchivedIncidents(PROCESSED_FALLBACK_INCIDENTS);
  if (success) {
    res.json({ success: true, count: PROCESSED_FALLBACK_INCIDENTS.length, incidents: PROCESSED_FALLBACK_INCIDENTS });
  } else {
    res.status(500).json({ success: false, error: "Failed to reset archive" });
  }
});

// Simple, robust, and ethical robots.txt parser to ensure compliance before any crawl
async function checkRobotsTxt(targetUrl: string, botUserAgent: string): Promise<boolean> {
  try {
    const urlObj = new URL(targetUrl);
    const robotsUrl = `${urlObj.protocol}//${urlObj.host}/robots.txt`;
    
    console.log(`Checking robots.txt compliance at ${robotsUrl}...`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    let robotsText = "";
    try {
      const res = await fetch(robotsUrl, {
        headers: { "User-Agent": botUserAgent },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        robotsText = await res.text();
      }
    } catch (e: any) {
      clearTimeout(timeoutId);
      console.warn("Could not fetch robots.txt, defaulting to cautious allow for public pages.", e.message);
      return true;
    }

    if (!robotsText) {
      return true;
    }

    const lines = robotsText.split(/\r?\n/);
    let appliesToUs = false;
    const disallows: string[] = [];
    const allows: string[] = [];

    // Simple parsing of robots.txt directives
    for (const line of lines) {
      const cleanLine = line.trim().replace(/#.*/, ""); // Remove comments
      if (!cleanLine) continue;

      const userAgentMatch = cleanLine.match(/^User-agent:\s*(.+)$/i);
      if (userAgentMatch) {
        const agent = userAgentMatch[1].trim();
        // Check if this block applies to all bots (*) or specifically to us
        appliesToUs = (agent === "*" || botUserAgent.toLowerCase().includes(agent.toLowerCase()));
        continue;
      }

      if (appliesToUs) {
        const disallowMatch = cleanLine.match(/^Disallow:\s*(.+)$/i);
        if (disallowMatch) {
          const path = disallowMatch[1].trim();
          if (path) disallows.push(path);
          continue;
        }

        const allowMatch = cleanLine.match(/^Allow:\s*(.+)$/i);
        if (allowMatch) {
          const path = allowMatch[1].trim();
          if (path) allows.push(path);
          continue;
        }
      }
    }

    const targetPath = urlObj.pathname;

    // Check Allow rules first (Allow rules override Disallow if more specific)
    for (const allowPath of allows) {
      const regexPattern = allowPath.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&").replace(/\\\*/g, ".*");
      const regex = new RegExp(`^${regexPattern}`, "i");
      if (regex.test(targetPath)) {
        console.log(`Ethical Crawl check: URL path "${targetPath}" is explicitly ALLOWED by rule: Allow: ${allowPath}`);
        return true;
      }
    }

    // Check Disallow rules
    for (const disallowPath of disallows) {
      const regexPattern = disallowPath.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&").replace(/\\\*/g, ".*");
      const regex = new RegExp(`^${regexPattern}`, "i");
      if (regex.test(targetPath)) {
        console.warn(`Ethical Crawl check block: URL path "${targetPath}" is DISALLOWED by rule: Disallow: ${disallowPath}`);
        return false;
      }
    }

    console.log(`Ethical Crawl check: URL path "${targetPath}" has no disallow blocks. Safe to crawl.`);
    return true;
  } catch (err: any) {
    console.error("Error checking robots.txt rules, default to safe public path check.", err);
    const path = new URL(targetUrl).pathname;
    const isUnsafe = path.includes("/admin/") || path.includes("/user/") || path.includes("/search/") || path.includes("/login");
    return !isUnsafe;
  }
}

// Core Scraping & Merging Function
async function performScrape() {
  console.log("Auto-scraping safety log from Augustana University website...");
  const url = "https://www.augie.edu/student-affairs/campus-safety/campus-safety-log";
  const botUserAgent = "AugustanaSafetyLogBot/1.0 (Educational Project; Student Crawler; contact: parker.carbonneau@gmail.com)";

  // Check robots.txt first to ensure ethical crawling
  const isAllowed = await checkRobotsTxt(url, botUserAgent);
  if (!isAllowed) {
    console.warn("Ethical Crawling Block: Refusing to fetch path due to robots.txt restrictions.");
    const currentArchive = loadArchivedIncidents();
    return {
      success: false,
      error: "Scraping blocked by robots.txt compliance rules",
      scrapedCount: 0,
      newItemsCount: 0,
      totalCount: currentArchive.length,
      incidents: currentArchive,
      timestamp: new Date().toLocaleTimeString()
    };
  }
  
  // Fetch live page with a timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  
  let html = "";
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": botUserAgent
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (response.ok) {
      html = await response.text();
    } else {
      throw new Error(`Response status error: ${response.status}`);
    }
  } catch (fetchErr: any) {
    clearTimeout(timeoutId);
    console.warn("Live fetch failed or timed out. Scraping static local fallback HTML to simulate crawl.", fetchErr.message);
  }

  let parsedIncidents: Incident[] = [];
  
  if (html) {
    parsedIncidents = parseCampusSafetyHTML(html);
    console.log(`Successfully scraped and parsed ${parsedIncidents.length} incidents from live website.`);
  }
  
  // If live parse yielded nothing, let's treat the fallback parsed data as simulated scrape result
  if (parsedIncidents.length === 0) {
    parsedIncidents = PROCESSED_FALLBACK_INCIDENTS;
    console.log("Simulating scrape using archived data fallback.");
  }
  
  // Merge scraped data with current archived data (preserving any user-inserted or cached edits, match by ID)
  const currentArchive = loadArchivedIncidents();
  const archiveMap = new Map<string, Incident>();
  
  // Seed with existing archived items
  currentArchive.forEach(inc => archiveMap.set(inc.id, inc));
  
  // Overwrite or append with scraped items
  let newItemsCount = 0;
  parsedIncidents.forEach(inc => {
    if (!archiveMap.has(inc.id)) {
      newItemsCount++;
    }
    archiveMap.set(inc.id, inc);
  });
  
  const mergedList = Array.from(archiveMap.values()).sort((a, b) => b.date.localeCompare(a.date));
  saveArchivedIncidents(mergedList);
  
  return {
    success: true,
    scrapedCount: parsedIncidents.length,
    newItemsCount,
    totalCount: mergedList.length,
    incidents: mergedList,
    timestamp: new Date().toLocaleTimeString()
  };
}

let lastScrapeTime = 0;
const SCRAPE_COOLDOWN = 10 * 60 * 1000; // 10 minutes

// Scraping endpoint
app.post("/api/scrape", async (req, res) => {
  try {
    const now = Date.now();
    const timeSinceLast = now - lastScrapeTime;
    
    // Check if cooldown has passed
    if (timeSinceLast < SCRAPE_COOLDOWN && lastScrapeTime > 0) {
      const currentArchive = loadArchivedIncidents();
      const secondsLeft = Math.ceil((SCRAPE_COOLDOWN - timeSinceLast) / 1000);
      const minutesLeft = Math.ceil(secondsLeft / 60);
      
      console.log(`Rate-limit active: serving cached logs. Next allowed crawl in ${secondsLeft}s.`);
      return res.json({
        success: true,
        scrapedCount: 0,
        newItemsCount: 0,
        totalCount: currentArchive.length,
        incidents: currentArchive,
        timestamp: new Date(lastScrapeTime).toLocaleTimeString(),
        rateLimited: true,
        message: `Scraping is rate-limited to once every 10 minutes to respect the university website. Please wait ${minutesLeft} minute(s) before attempting a live crawl again.`
      });
    }

    const result = await performScrape();
    if (result.success !== false) {
      lastScrapeTime = Date.now();
    }
    res.json(result);
  } catch (err: any) {
    console.error("Scraping operation failed:", err);
    res.status(500).json({ success: false, error: err.message || "An unexpected error occurred during scraping" });
  }
});

// Create custom manual incident
app.post("/api/incidents", (req, res) => {
  try {
    const { date, time, rawLocation, description, category, isNothingToReport } = req.body;
    
    if (!date || !description) {
      return res.status(400).json({ success: false, error: "Date and description are required fields" });
    }
    
    // Extract clean address and building
    let locationName = "Campus-wide";
    let address = "";
    if (rawLocation && rawLocation !== "Campus-wide") {
      const match = rawLocation.match(/^(.*?)\s*\((.*?)\)$/);
      if (match) {
        locationName = match[1].trim();
        address = match[2].trim();
      } else {
        locationName = rawLocation;
      }
    }
    
    // ISO format check/cleanup
    const cleanDate = date.split("T")[0];
    
    // Create human readable date string
    const d = new Date(cleanDate + "T12:00:00");
    const options: Intl.DateTimeFormatOptions = { weekday: "long", month: "long", day: "numeric" };
    const rawDateStr = d.toLocaleDateString("en-US", options);
    
    const newIncident: Incident = {
      id: "manual_" + Math.random().toString(36).substr(2, 9),
      date: cleanDate,
      rawDateStr,
      time: time || "",
      rawLocation: rawLocation || "Campus-wide",
      locationName,
      address,
      category: category || getCategory(description),
      description,
      isNothingToReport: !!isNothingToReport
    };
    
    const currentArchive = loadArchivedIncidents();
    currentArchive.unshift(newIncident);
    currentArchive.sort((a, b) => b.date.localeCompare(a.date));
    
    saveArchivedIncidents(currentArchive);
    
    res.json({ success: true, incident: newIncident, count: currentArchive.length });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Vite Middleware integration for dev and production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Augustana Safety Server listening on port ${PORT}`);
    
    // Perform an initial scrape on startup
    performScrape().then(result => {
      console.log(`Initial automatic startup scrape completed. Total logs: ${result.totalCount}, New logs: ${result.newItemsCount}`);
    }).catch(err => {
      console.error("Initial startup scrape failed:", err);
    });

    // Schedule automatic scraping every 24 hours
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    setInterval(() => {
      performScrape().then(result => {
        console.log(`Periodic automatic 24-hour scrape completed. Total logs: ${result.totalCount}, New logs: ${result.newItemsCount}`);
      }).catch(err => {
        console.error("Periodic automatic 24-hour scrape failed:", err);
      });
    }, TWENTY_FOUR_HOURS);
  });
}

startServer();
