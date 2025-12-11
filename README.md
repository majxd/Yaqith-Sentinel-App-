<p align="center">
  <a href="https://absher.tuwaiq.edu.sa/"><img src="https://img.shields.io/badge/Absher_Tuwaiq-Hackathon_2025-006C5B?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTEyIDIyczgtNCA4LTEwVjVsLTgtM2wtOCAzdjdjMCA2IDggMTAgOCAxMCIvPjwvc3ZnPg==" alt="Absher Tuwaiq Hackathon 2025"/></a>
  <a href="https://www.vision2030.gov.sa/"><img src="https://img.shields.io/badge/Saudi_Vision-2030-C6A664?style=for-the-badge" alt="Saudi Vision 2030"/></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React 19"/></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript"/></a>
</p>

<h1 align="center">YAQITH SENTINEL</h1>
<h3 align="center">AI-Powered Adaptive Authentication Command Center</h3>

<p align="center">
  <strong>Admin Dashboard for Real-Time Threat Monitoring & Risk Analysis</strong>
</p>

<p align="center">
  <em>Submitted for the Absher Tuwaiq Hackathon 2025 - World's Largest Hackathon</em><br/>
  <em>Ministry of Interior & Tuwaiq Academy | Sponsored by Elm Company</em>
</p>

---

## Overview

**YAQITH SENTINEL Admin Dashboard** is a command center prototype for monitoring and analyzing authentication attempts across Saudi Arabia's national digital identity platform. Built for the [Absher Tuwaiq Hackathon 2025](https://absher.tuwaiq.edu.sa/), this solution demonstrates how AI-powered behavioral analytics can enhance the security of the Absher e-government platform while maintaining seamless user experience.

### The Challenge

Traditional authentication relies on **static credentials** (passwords, OTPs) which can be:

- Stolen via phishing attacks
- Compromised through SIM swapping
- Shared or guessed by malicious actors

### Our Solution

YAQITH shifts the paradigm from **"What you know"** (passwords) to **"Who you are"** (behavior). Even if credentials are stolen, the system detects imposters through:

- **Behavioral Biometrics** - Typing cadence, mouse movements, touch patterns
- **Contextual Analysis** - Device fingerprinting, location, time patterns
- **AI Risk Scoring** - Real-time threat assessment with adaptive responses

---

## Features

### Command Center

| Module               | Description                                                     |
| -------------------- | --------------------------------------------------------------- |
| **Live Monitor**     | Real-time authentication feed with risk indicators              |
| **Threat Analytics** | Statistical analysis of blocked attempts, anomalies, and trends |
| **Geo Map**          | Interactive map showing authentication attempts by location     |

### System Management

| Module              | Description                                   |
| ------------------- | --------------------------------------------- |
| **Decision Engine** | Visual flow of the AI decision-making process |
| **Risk Policies**   | Configurable thresholds and response rules    |

### Labs (Interactive Demos)

| Module             | Description                                            |
| ------------------ | ------------------------------------------------------ |
| **Biometrics Lab** | Live demo of behavioral biometrics detection           |
| **ZKP Visualizer** | Zero-Knowledge Proof authentication flow visualization |

---

## Tech Stack

| Technology   | Purpose                      |
| ------------ | ---------------------------- |
| React 19     | Frontend framework           |
| TypeScript   | Type safety                  |
| Vite 6       | Build tooling                |
| Tailwind CSS | Styling                      |
| Recharts     | Data visualization           |
| Leaflet      | Interactive maps             |
| Supabase     | Backend & real-time database |
| Lucide React | Icon library                 |

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for live data)

### Installation

```bash
# Clone the repository
git clone https://github.com/drasaadmoosa/Yaqith-Admin-App.git

# Navigate to the project
cd Yaqith-Admin-App

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key  # Optional: for AI video generation
```

### Access the Application

Open your browser and navigate to:

```
http://localhost:3010
```

> **Note**: This application runs on port **3010** by default.

---

## Demo Testing Guide

### For Hackathon Judges

Follow these steps to evaluate the YAQITH SENTINEL prototype:

#### 1. Login to Admin Dashboard

- Navigate to `http://localhost:3010`
- Use the demo credentials provided or create a test account

#### 2. Explore Command Center

**Live Monitor**

- View real-time authentication attempts
- Observe risk level indicators (Low/Medium/High)
- Note the behavioral match scores

**Threat Analytics**

- Toggle between 24H / 7D / 30D views
- Review blocked attempt statistics
- Analyze threat distribution by category

**Geo Map**

- Explore authentication attempts by location
- All major Saudi cities are represented (Riyadh, Jeddah, Mecca, Dammam, etc.)
- International locations show expatriate access patterns

#### 3. Interactive Labs

**Biometrics Lab (Option A)**

- Type in the demo field to see behavioral analysis
- Move your mouse to observe linearity detection
- Watch real-time "Human vs Bot" classification

**ZKP Visualizer (Option B)**

- Step through the Zero-Knowledge Proof authentication flow
- Understand how verification works without exposing credentials

#### 4. System Configuration

**Decision Engine**

- Review the AI decision flow diagram
- Understand how risk factors combine to determine actions

**Risk Policies**

- View configurable thresholds
- See how different risk levels trigger different responses

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    YAQITH SENTINEL ADMIN                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Live Monitor │  │   Threat     │  │   Geo Map    │          │
│  │              │  │  Analytics   │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐                            │
│  │   Decision   │  │    Risk      │                            │
│  │    Engine    │  │   Policies   │                            │
│  └──────────────┘  └──────────────┘                            │
├─────────────────────────────────────────────────────────────────┤
│                         Supabase                                │
│              (Real-time Database & Authentication)              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
├── App.tsx                 # Main application with navigation
├── index.tsx               # React entry point
├── types.ts                # TypeScript definitions
├── constants.tsx           # Configuration and mock data
├── components/
│   ├── LiveMonitor.tsx     # Real-time authentication feed
│   ├── ThreatAnalytics.tsx # Statistical threat analysis
│   ├── GeoMap.tsx          # Geographic visualization
│   ├── DecisionEngine.tsx  # AI decision flow visualization
│   ├── RiskPolicies.tsx    # Policy configuration UI
│   ├── BiometricsDemo.tsx  # Behavioral biometrics lab
│   ├── ZKPLogin.tsx        # ZKP visualization
│   └── ...
└── lib/
    └── supabase.ts         # Database client configuration
```

---

## Related Projects

| Project                                                            | Description              | Port |
| ------------------------------------------------------------------ | ------------------------ | ---- |
| [YAQITH User App](https://github.com/drasaadmoosa/Yaqith-User-App) | Mobile login simulation  | 3020 |
| **YAQITH Admin App** (this repo)                                   | Command center dashboard | 3010 |

---

## Hackathon Context

This project was developed for the **Absher Tuwaiq Hackathon 2025**, organized by:

- **Ministry of Interior** (Kingdom of Saudi Arabia)
- **Tuwaiq Academy**
- **Elm Company** (Sponsor)

The hackathon aims to enhance the **Absher platform** - Saudi Arabia's national e-government portal serving 28+ million digital identities - through innovative technological solutions aligned with **Saudi Vision 2030**.

---

## License

This project is a hackathon prototype developed for demonstration purposes.

---

<p align="center">
  <strong>YAQITH SENTINEL</strong> - Protecting Digital Identity Through Behavioral Intelligence
</p>

<p align="center">
  <em>يقظ - Vigilant Protection for Saudi Arabia's Digital Future</em>
</p>
