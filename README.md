# Augustana Cmpus Safety Log and Archive
The Augustana Mirror is an interactive, static web application designed to preserve, archive, and visualize campus safety data. While universities are mandated by the Clery Act to maintain a daily crime log, these reports are often transient and difficult to analyze. The Mirror bridges this gap by scraping, archiving, and indexing these logs to provide a searchable, long-term historical record for the campus community.

🚀 Key Features
Persistent Archival: Bypasses the standard 60-day web visibility limit by storing logs in a robust JSON database.

Data-Driven Discovery: Features a powerful search and filter interface to query incidents by location, type, or date.

Geospatial Visualization: Integrated interactive mapping for analyzing incident clusters across campus.

Temporal Analysis: A dedicated "Safety Calendar" to visualize activity patterns month-by-month.

Open Data Access: Enables journalists and researchers to export the full historical dataset as JSON for external analysis.

⚙️ Technical Architecture
This application utilizes a "Static-First" architecture, eliminating the need for a live, always-on backend server.

The Scraper: A daily GitHub Action crawls the official Augustana Campus Safety Log.

The Database: New findings are automatically processed and committed to public/archivedData.json.

The Frontend: A React/Vite dashboard fetches the static JSON file on client-side load, ensuring high performance and zero hosting costs.

🛠️ Development & Deployment
Local Setup
Bash
# Clone the repository
git clone https://github.com/plcarbonneau/Augie-Safety-Tracker.git

# Install dependencies
npm install

# Start the development environment
npm run dev
Production Build
To prepare the application for static deployment:

Bash
npm run build
This command compiles the TypeScript source into optimized static assets within the dist/ directory.


👨‍💻 Developed By
Parker Carbonneau (07/2026)
