# 🎓 Student-Werk-Tracker

A comprehensive, self-hosted, full-stack application designed specifically for international students in Germany. It actively tracks your working hours, ensures legal compliance with the German Residence Act (AufenthG), and provides an interactive sandbox to plan your future shifts without breaching visa conditions.

Developed to simplify the complex math behind the **140 full-days / 280 half-days** rule and the **20-hour weekly limit** during lecture periods.

---

## ✨ Features

* **🧠 Automated Compliance Engine:** Automatically calculates whether a shift costs 0.5 days (≤ 4 hours) or 1.0 days (> 4 hours) from your annual quota.
* **📅 Interactive Drag-&-Drop Planner:** A visual calendar that lets you log past shifts or mock up "Planned" future shifts. Drag and drop shifts between days to instantly see how it affects your weekly limit and annual quota.
* **⏱️ 20-Hour ISO Week Validation:** Aggregates your hours per calendar week. Flags any week that exceeds the 20-hour legal limit to prevent accidental visa breaches.
* **🏖️ Semester Break Toggles:** Mark specific shifts as occurring during "Lecture-Free Periods" to legally bypass the 20-hour weekly warning.
* **🏢 Multi-Job / Exemption Tracking:** Supports multiple contracts simultaneously. Automatically exempts University Assistant (HiWi) jobs from your 140-day quota while still tracking the hours.
* **📊 Visual Analytics:** Built-in Chart.js integration provides visual burn-rate trends and tracks your quota depletion over the calendar year.
* **☁️ Persistent Cloud Storage:** Runs on a lightweight Node.js + SQLite backend, ensuring your data is instantly synced and safely persistent across all your devices.
* **🔄 Manual Backup / Restore:** Export your entire database to a JSON file and import it anytime for safe keeping or migrations.

---

## 🏗️ Architecture

The application is built for extreme lightweight performance, optimized for self-hosting on platforms like Proxmox, Raspberry Pi, or cheap VPS instances.

* **Frontend:** Vanilla HTML5, CSS Grid, and standard JavaScript. (No heavy React/Vue build steps required).
* **Charts:** Chart.js (Loaded via CDN).
* **Backend:** Node.js with Express framework.
* **Database:** SQLite (Zero-configuration, single-file persistent database).
* **Infrastructure:** Fully containerized using Docker & Docker Compose.

---

## 🚀 Deployment (Docker / Proxmox)

This app is designed to be easily deployed as a Docker container. If you are using Proxmox, deploying this inside a Docker-enabled LXC is highly recommended.

### 1. Directory Structure
Create a directory for the app on your server and ensure the structure looks exactly like this:

```text
/opt/student-werk-tracker/
├── docker-compose.yml
├── Dockerfile
├── package.json
├── server.js
├── data/               <-- SQLite database will auto-generate here
└── public/
    └── index.html      <-- The frontend UI

```

### 2. Run Docker Compose

Navigate to your directory and build the container:

```bash
cd /opt/student-werk-tracker
docker compose up -d --build

```

### 3. Access the App

Once the container is running, the app will be exposed on port `8080` (or whichever port you mapped in your `docker-compose.yml`).

Access it via: `http://<YOUR_SERVER_IP>:8080`

*(Optional but recommended: Point an Nginx Reverse Proxy to this IP/Port to access it via a custom domain with SSL).*

---

## 🛠️ Migrating Data

If you used an older, local-storage only version of this tracker, you can seamlessly migrate your data:

1. Export the JSON from the old version.
2. Open your new deployed instance.
3. Click **Import JSON** in the top right corner. The Node.js backend will parse your JSON and safely insert all historical records into the new SQLite database.

---

## 🤝 Credits

**Author:** Built by krishnakarthikperi

**AI Collaboration:** Conceptualized, architected, and co-developed in collaboration with Google's **Gemini AI**.
