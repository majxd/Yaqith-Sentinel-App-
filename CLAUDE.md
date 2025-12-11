# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Agency Admin Dashboard - A React/Vite prototype demonstrating adaptive identity verification for government digital platforms (Absher). The system showcases behavioral biometrics, zero-knowledge proof authentication, and AI-powered risk scoring.

## Development Commands

```bash
npm install     # Install dependencies
npm run dev     # Start dev server on port 3010
npm run build   # Production build
npm run preview # Preview production build on port 3010
```

**Important**: This app must always run on port 3010 (never use port 3000).

## Environment Setup

Set `GEMINI_API_KEY` in `.env.local` for the Video Studio (Veo 3) feature.

## Architecture

### Tech Stack
- **React 19** with TypeScript
- **Vite 6** for bundling
- **Tailwind CSS** via CDN (no local config)
- **Recharts** for data visualization
- **Lucide React** for icons
- **Google GenAI SDK** for Veo video generation

### Project Structure

```
/                     # Root contains app entry and core files
├── App.tsx           # Main app with sidebar nav and tab routing
├── index.tsx         # React root mount
├── types.ts          # TypeScript enums/interfaces (RiskLevel, Scenario, etc.)
├── constants.tsx     # Scenario definitions and storyboard data
├── components/       # Feature components (each is a full page/tab)
│   ├── BiometricsDemo.tsx    # Option A: Behavioral biometrics demo
│   ├── ZKPLogin.tsx          # Option B: Zero-knowledge proof flow
│   ├── RiskDashboard.tsx     # Option C: Live risk monitoring
│   ├── Simulation.tsx        # Scenario simulation engine
│   ├── Storyboards.tsx       # Visual decision flow panels
│   ├── Architecture.tsx      # 4-layer funnel diagram
│   ├── TechnicalSpecs.tsx    # System design documentation
│   └── VeoGenerator.tsx      # AI video generation studio
└── services/
    └── geminiService.ts      # Veo 3 video generation API wrapper
```

### Navigation Tabs

The app uses client-side tab routing (no React Router). `activeTab` state in `App.tsx` controls which component renders:
- **Prototypes**: biometrics, zkp, risk
- **Documentation**: dashboard, simulation, storyboards, architecture, specs, generator

### Key Types

```typescript
// Risk levels used throughout the app
enum RiskLevel { LOW, MEDIUM, HIGH }

// 7 authentication scenarios
enum ScenarioType {
  NORMAL_LOGIN, NEW_DEVICE, SUSPICIOUS_TIME,
  LOCATION_ANOMALY, RAPID_LOGIN, BEHAVIORAL_DEVIATION,
  CONTINUOUS_MONITORING
}
```

### Path Alias

`@/*` resolves to project root (configured in both `tsconfig.json` and `vite.config.ts`).

## Solution Architecture

See `docs/SOLUTION_ARCHITECTURE.md` for the full system design including:
- Component architecture (Mobile Login App + Admin Dashboard)
- Data flow diagrams for all 7 scenarios
- Integration with Supabase, n8n, and LLM APIs
- Database schema and security controls
