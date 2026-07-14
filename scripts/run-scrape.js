import fs from "fs";
import path from "path";

const ARCHIVE_FILE = path.join(process.cwd(), "src", "data", "archivedData.json");

const IncidentCategory = {
  WELFARE: "Welfare & Well-being",
  SUBSTANCE: "Substances & Alcohol",
  FIRE: "Fire & Safety",
  THEFT: "Theft & Property Damage",
  MEDICAL: "Medical Response",
  DISORDERLY: "Disorderly & Suspicious",
  TRAFFIC: "Traffic & Parking",
  OTHER: "Other Assistance",
  NOTHING: "Nothing to Report"
};

// Convert "Monday, June 22" or similar to ISO YYYY-MM-DD
function parseDateToISO(dateStr) {
  try {
    const cleanStr = dateStr.replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)[,\s]*/i, "").trim();
    const parsed = Date.parse(`${cleanStr} 2026`);
    if (!isNaN(parsed)) {
      const d = new Date(parsed);
      return d.toISOString().split("T")[0];
    }
  } catch (e) {
    console.error("Date parsing error for:", dateStr, e);
  }
  return new Date().toISOString().split("T")[0];
}

function getCategory(type) {
  const norm = type.toLowerCase();
  if (norm.includes("nothing to report")) return IncidentCategory.NOTHING;
  if (norm.includes("welfare") || norm.includes("well being") || norm.includes("wellbeing") || norm.includes("welfare check") || norm.includes("person of interest") || norm.includes("student conduct")) {
    return IncidentCategory.WELFARE;
  }
  if (norm.includes("narcotics") || norm.includes("alcohol") || norm.includes("substance") || norm.includes("marijuana") || norm.includes("controlled substance")) {
    return IncidentCategory.SUBSTANCE;
  }
  if (norm.includes("fire") || norm.includes("smoke") || norm.includes("gas") || norm.includes("safety") || norm.includes("alarm")) {
    return IncidentCategory.FIRE;
  }
  if (norm.includes("theft") || norm.includes("damage") || norm.includes("vandalism") || norm.includes("littering") || norm.includes("lost item") || norm.includes("scam") || norm.includes("property damage")) {
    return IncidentCategory.THEFT;
  }
  if (norm.includes("medical") || norm.includes("injury") || norm.includes("fall") || norm.includes("emergency") || norm.includes("ambulance")) {
    return IncidentCategory.MEDICAL;
  }
  if (norm.includes("suspicious") || norm.includes("trespass") || norm.includes("disorderly") || norm.includes("conduct") || norm.includes("noise") || norm.includes("shots fired") || norm.includes("public urination")) {
    return IncidentCategory.DISORDERLY;
  }
  if (norm.includes("tow") || norm.includes("vehicle") || norm.includes("collision") || norm.includes("accident") || norm.includes("car")) {
    return IncidentCategory.TRAFFIC;
  }
  return IncidentCategory.OTHER;
}

// Custom HTML Scraper / Parser
function parseCampusSafetyHTML(html) {
  const incidents = [];
  const dateRegex = /<p><strong>\s*(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)[^<]*<\/strong>/gi;
  const datePositions = [];
  
  let match;
  while ((match = dateRegex.exec(html)) !== null) {
    const rawDate = match[0].replace(/<[^>]+>/g, "").trim().replace(/&nbsp;/gi, " ");
    datePositions.push({ dateStr: rawDate, index: match.index });
  }
  
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

// Simple, robust, and ethical robots.txt parser to ensure compliance before any crawl
async function checkRobotsTxt(targetUrl, botUserAgent) {
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
    } catch (e) {
      clearTimeout(timeoutId);
      console.warn("Could not fetch robots.txt, defaulting to cautious allow for public pages.", e.message);
      return true;
    }

    if (!robotsText) {
      return true;
    }

    const lines = robotsText.split(/\r?\n/);
    let appliesToUs = false;
    const disallows = [];
    const allows = [];

    for (const line of lines) {
      const cleanLine = line.trim().replace(/#.*/, ""); // Remove comments
      if (!cleanLine) continue;

      const userAgentMatch = cleanLine.match(/^User-agent:\s*(.+)$/i);
      if (userAgentMatch) {
        const agent = userAgentMatch[1].trim();
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

    for (const allowPath of allows) {
      const regexPattern = allowPath.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&").replace(/\\\*/g, ".*");
      const regex = new RegExp(`^${regexPattern}`, "i");
      if (regex.test(targetPath)) {
        console.log(`Ethical Crawl check: URL path "${targetPath}" is explicitly ALLOWED by rule: Allow: ${allowPath}`);
        return true;
      }
    }

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
  } catch (err) {
    console.error("Error checking robots.txt rules, default to safe public path check.", err);
    const path = new URL(targetUrl).pathname;
    const isUnsafe = path.includes("/admin/") || path.includes("/user/") || path.includes("/search/") || path.includes("/login");
    return !isUnsafe;
  }
}

function loadArchivedIncidents() {
  try {
    if (fs.existsSync(ARCHIVE_FILE)) {
      const raw = fs.readFileSync(ARCHIVE_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to read archive file:", err);
  }
  return [];
}

function saveArchivedIncidents(incidents) {
  try {
    const dir = path.dirname(ARCHIVE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(ARCHIVE_FILE, JSON.stringify(incidents, null, 2), "utf-8");

    // Also write to public folder for static hosting build pipeline
    const publicArchiveFile = path.join(process.cwd(), "public", "archivedData.json");
    const publicDir = path.dirname(publicArchiveFile);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    fs.writeFileSync(publicArchiveFile, JSON.stringify(incidents, null, 2), "utf-8");
    console.log(`Saved synchronized archive files in both src/data/ and public/ directories.`);

    return true;
  } catch (err) {
    console.error("Failed to save archive file:", err);
    return false;
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
    process.exit(1);
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
  } catch (fetchErr) {
    clearTimeout(timeoutId);
    console.warn("Live fetch failed or timed out. Scraping static local fallback HTML to simulate crawl.", fetchErr.message);
    process.exit(1);
  }

  let parsedIncidents = [];
  
  if (html) {
    parsedIncidents = parseCampusSafetyHTML(html);
    console.log(`Successfully scraped and parsed ${parsedIncidents.length} incidents from live website.`);
  }
  
  if (parsedIncidents.length === 0) {
    console.log("No incidents found to scrape. Exiting.");
    process.exit(0);
  }
  
  // Merge scraped data with current archived data (preserving any user-inserted or cached edits, match by ID)
  const currentArchive = loadArchivedIncidents();
  const archiveMap = new Map();
  
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
  
  console.log(`Scrape finished. Found ${parsedIncidents.length} incidents. Saved ${newItemsCount} new items to archive.`);
  console.log(`Total archived incidents: ${mergedList.length}`);
}

performScrape()
  .then(() => {
    console.log("Scraper execution completed successfully.");
    process.exit(0);
  })
  .catch(err => {
    console.error("Scraper execution failed:", err);
    process.exit(1);
  });
