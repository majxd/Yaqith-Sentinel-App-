# YAQITH Sentinel - Implementation Plan (Without n8n)

**Version:** 3.0
**Date:** 2025-12-10
**Status:** Ready for Implementation
**Variant:** Phase 1 - Direct Integration (No AI/n8n)

---

## Document Purpose

This document provides implementation instructions for YAQITH Sentinel **Phase 1** - a simplified version that demonstrates the core value proposition without external AI/n8n dependencies.

**Key Difference from v2.1:** Decision fields are populated immediately on INSERT based on predefined scenario outcomes. No waiting for external processing.

---

## Table of Contents

1. [Project Context](#1-project-context)
2. [System Architecture](#2-system-architecture)
3. [Codebase Information](#3-codebase-information)
4. [Phase 0: Authentication](#4-phase-0-authentication)
5. [Phase 1: Database Setup](#5-phase-1-database-setup)
6. [Phase 2: User App Changes](#6-phase-2-user-app-changes)
7. [Phase 3: Admin App Changes](#7-phase-3-admin-app-changes)
8. [Phase 4: Data Seeding](#8-phase-4-data-seeding)
9. [Testing Requirements](#9-testing-requirements)
10. [File Reference](#10-file-reference)

---

## 1. Project Context

### What is YAQITH Sentinel?

YAQITH Sentinel is a demo application for a Saudi Arabia hackathon. It demonstrates an **AI-powered adaptive identity verification system** for government platforms like Absher.

### The Demo Concept

The demo shows how AI can analyze login attempts in real-time and make intelligent security decisions:

- Normal logins are allowed instantly
- Suspicious logins trigger challenges (OTP, biometric, confirmation)
- High-risk logins are blocked

### What We Are Building (Phase 1)

Two web applications that communicate via a shared Supabase database:

1. **User App** (Port 3020): Simulates a citizen logging into a government service
2. **Admin App** (Port 3010): Shows security analysts monitoring login attempts in real-time

### Phase 1 Data Flow (Simplified - No n8n)

```
User App                    Supabase                     Admin App
---------                   --------                     ---------
User selects
scenario & clicks
"Sign In"
      |
      v
Frontend determines
outcome from scenario
constants (predefined)
      |
      v
INSERT complete      ->     Row created with      ->     Real-time subscription
record with all             ALL fields populated         receives new row
decision fields             (status: 'completed')
already populated                                        Shows result immediately
      |
      v
Show cosmetic
"Analyzing" animation
(2-3 seconds)
      |
      v
Display predefined
result from scenario
```

### Key Simplification

**No waiting for external processing.** The scenario's outcome (risk_level, action_taken, etc.) is already known from the `SCENARIOS` constant. We populate all fields at INSERT time and use a cosmetic animation for dramatic effect.

---

## 2. System Architecture

### Technology Stack

| Component      | Technology                   | Notes                           |
| -------------- | ---------------------------- | ------------------------------- |
| User App       | React 19 + Vite + TypeScript | Port 3020                       |
| Admin App      | React 19 + Vite + TypeScript | Port 3010                       |
| Database       | Supabase (PostgreSQL)        | Shared between both apps        |
| Authentication | Supabase Auth                | Same credentials for both apps  |
| Styling        | Tailwind CSS (via CDN)       | Already configured in both apps |
| Charts         | Recharts                     | Already installed in both apps  |
| Icons          | Lucide React                 | Already installed in both apps  |

### Supabase Project Details

```
Project ID:   cjbmavpjfdnetpumjhgb
Project URL:  https://cjbmavpjfdnetpumjhgb.supabase.co
Anon Key:     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqYm1hdnBqZmRuZXRwdW1qaGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMTY5NTEsImV4cCI6MjA4MDg5Mjk1MX0.8iRzSUHG0YMXD3yuu0_2nezm34gShfhhKETH9CMLED8
```

### Ports

- **User App**: `localhost:3020` (configured in vite.config.ts)
- **Admin App**: `localhost:3010` (configured in vite.config.ts)

Never use port 3000 for either app.

---

## 3. Codebase Information

### User App Location

```
E:\Bahrain\KSA-Hackathon\User-app\
```

**Current State:**

- React 19 + Vite + TypeScript app
- Has existing simulation flow components
- Has `@supabase/supabase-js` installed
- Has `.env.local` file with Supabase credentials

**Key Files:**

- `App.tsx` - Main app component with step-based flow
- `constants.ts` - Contains all 7 scenario definitions (SCENARIOS array)
- `types.ts` - TypeScript enums (RiskLevel, ActionType, etc.)

### Admin App Location

```
E:\Bahrain\KSA-Hackathon\Admin-app\
```

**Current State:**

- React 19 + Vite + TypeScript app
- Has sidebar navigation with multiple demo components
- Has `@supabase/supabase-js` installed
- Has `.env.local` file with Supabase credentials

**Key Files:**

- `App.tsx` - Main app with sidebar navigation
- `components/Simulation.tsx` - Contains the "AI Agency Inspector" UI we will reuse
- `components/` - Various demo components

### Environment Variables Required

Both apps need these in their `.env.local` files:

```env
VITE_SUPABASE_URL=https://cjbmavpjfdnetpumjhgb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqYm1hdnBqZmRuZXRwdW1qaGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMTY5NTEsImV4cCI6MjA4MDg5Mjk1MX0.8iRzSUHG0YMXD3yuu0_2nezm34gShfhhKETH9CMLED8
```

---

## 4. Phase 0: Authentication

### Why Authentication?

Both apps will be deployed to Vercel (public internet). Without authentication, anyone could:

- Trigger login simulations (filling database with junk data)
- View the admin dashboard

### Authentication Credentials

```
Email:     yaqith@yaqith.com
Password:  Yaqith@SaudiArabia
```

This is a single Supabase Auth user shared by both apps.

### Implementation Steps

#### Step 0.1: Create Supabase Auth User

Use Supabase Dashboard to create the user:

- Email: `yaqith@yaqith.com`
- Password: `Yaqith@SaudiArabia`
- Email confirmed: true (skip verification)

#### Step 0.2: Create Supabase Client File (Both Apps)

Create `src/lib/supabase.ts` in both apps:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

#### Step 0.3: Create Login Page Component (Both Apps)

Create `src/components/LoginPage.tsx` with this design:

**Visual Requirements:**

- Full-screen dark gradient background (Deep Navy #0A1628 to Slate #1E293B)
- Centered login card with frosted glass effect (backdrop-blur)
- YAQITH branding at top (Shield icon from Lucide)

**Layout:**

```
+-------------------------------------------------------------+
|                                                             |
|                    [Shield Icon]                            |
|                                                             |
|                   YAQITH SENTINEL                           |
|          Adaptive Identity Verification System              |
|                                                             |
|         +-------------------------------------+             |
|         |                                     |             |
|         |  +-----------------------------+    |             |
|         |  | [Mail Icon]  yaqith@yaqith.com |    |             |
|         |  +-----------------------------+    |             |
|         |                                     |             |
|         |  +-----------------------------+    |             |
|         |  | [Lock Icon]  ************   |    |             |
|         |  +-----------------------------+    |             |
|         |                                     |             |
|         |  +-----------------------------+    |             |
|         |  |      SECURE ACCESS          |    |  <- Green   |
|         |  +-----------------------------+    |             |
|         |                                     |             |
|         +-------------------------------------+             |
|                                                             |
|           Protected by AI-Powered Authentication            |
|                                                             |
|  -----------------------------------------------------------+
|           (c) 2025 YAQITH Sentinel - Vision 2030            |
+-------------------------------------------------------------+
```

**Color Palette:**

| Color        | Hex     | Usage                   |
| ------------ | ------- | ----------------------- |
| Absher Green | #006C5B | Primary button, accents |
| Absher Gold  | #C6A664 | Secondary highlights    |
| Deep Navy    | #0A1628 | Background start        |
| Slate Dark   | #1E293B | Card background         |
| Cyber Blue   | #00D4FF | Glow effects (optional) |

**Button States:**

- Default: Absher Green background
- Hover: Lighter with subtle glow
- Loading: Show spinner + "Authenticating..."
- Error: Show red error message below form

#### Step 0.4: Create Auth Gate Component (Both Apps)

Create `src/components/AuthGate.tsx`:

```typescript
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import LoginPage from "./LoginPage";

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!session) {
    return <LoginPage />;
  }

  return <>{children}</>;
}
```

#### Step 0.5: Wrap App with AuthGate

In both apps, modify the root component:

```typescript
import { AuthGate } from "./components/AuthGate";

function App() {
  return <AuthGate>{/* Existing app content */}</AuthGate>;
}
```

#### Step 0.6: Add Logout Button

Add a logout button to both apps:

```typescript
const handleLogout = async () => {
  await supabase.auth.signOut();
};

<button onClick={handleLogout} className="...">
  <LogOut size={16} />
  Sign Out
</button>;
```

---

## 5. Phase 1: Database Setup

### Table: authentication_attempts

This table stores all login attempts. **All decision fields are populated at INSERT time** (no pending status).

```sql
-- Drop existing table if it has wrong schema
DROP TABLE IF EXISTS authentication_attempts;

-- Create table with complete schema
CREATE TABLE authentication_attempts (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Scenario Information
  scenario_id TEXT NOT NULL,
  scenario_label TEXT NOT NULL,

  -- Device Information
  device_type TEXT,
  device_trusted BOOLEAN DEFAULT false,

  -- Location Information
  ip_address TEXT,
  ip_country TEXT,
  location_city TEXT,
  location_raw TEXT,

  -- Behavioral Data
  behavior_score DECIMAL(5,2),
  behavior_raw TEXT,

  -- Time Information
  login_time TEXT,
  login_timestamp TIMESTAMPTZ DEFAULT NOW(),

  -- Anomaly Flags
  time_anomaly BOOLEAN DEFAULT false,
  geo_anomaly BOOLEAN DEFAULT false,
  behavior_anomaly BOOLEAN DEFAULT false,
  geo_velocity_violation BOOLEAN DEFAULT false,
  is_brute_force BOOLEAN DEFAULT false,
  is_mid_session BOOLEAN DEFAULT false,

  -- Context
  trigger_description TEXT,
  session_id TEXT,
  user_identifier TEXT DEFAULT '104***921',
  source_tab TEXT DEFAULT 'simulation',

  -- DECISION FIELDS (populated at INSERT time in Phase 1)
  status TEXT DEFAULT 'completed',
  risk_level TEXT NOT NULL,
  risk_score DECIMAL(5,2) NOT NULL,
  action_taken TEXT NOT NULL,
  ai_analysis TEXT,
  outcome_description TEXT,
  decision_factors JSONB,
  processed_at TIMESTAMPTZ DEFAULT NOW(),
  processing_time_ms INTEGER DEFAULT 0
);

-- Indexes for performance
CREATE INDEX idx_auth_attempts_created_at ON authentication_attempts(created_at DESC);
CREATE INDEX idx_auth_attempts_scenario_id ON authentication_attempts(scenario_id);
CREATE INDEX idx_auth_attempts_risk_level ON authentication_attempts(risk_level);

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE authentication_attempts;
```

### Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE authentication_attempts ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all records
CREATE POLICY "Authenticated users can read all attempts"
ON authentication_attempts FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert records
CREATE POLICY "Authenticated users can insert attempts"
ON authentication_attempts FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update records (for future n8n phase)
CREATE POLICY "Authenticated users can update attempts"
ON authentication_attempts FOR UPDATE
TO authenticated
USING (true);
```

### The 7 Scenarios and Their Predefined Outcomes

| ID  | Name                  | Risk Level | Risk Score | Action                 |
| --- | --------------------- | ---------- | ---------- | ---------------------- |
| 1   | Normal Login          | LOW        | 0.15       | ALLOW                  |
| 2   | Unusual Device        | MEDIUM     | 0.45       | CHALLENGE_OTP          |
| 3   | Suspicious Time       | MEDIUM     | 0.50       | CHALLENGE_CONFIRMATION |
| 4   | Location Anomaly      | HIGH       | 0.85       | BLOCK                  |
| 5   | Rapid Login           | HIGH       | 0.95       | BLOCK_RAPID            |
| 6   | Behavioral Deviation  | HIGH       | 0.78       | CHALLENGE_BIOMETRIC    |
| 9   | Continuous Monitoring | MEDIUM     | 0.55       | RE_AUTH                |

---

## 6. Phase 2: User App Changes

### Current State

The User App has step-based flow: ScenarioSelector -> Login -> AnalysisView -> ActionView -> Dashboard

### Target State

The User App will have 3 tabs:

1. **Simulation** - User selects a scenario, clicks sign in, sees analyzing animation, shows predefined result
2. **Live** - User enters any credentials, random scenario is picked, same flow
3. **Project Report** - Static documentation page

### Step 2.1: Create Tab-Based Layout

Replace the current step-based flow with a tabbed interface:

```typescript
// App.tsx structure
const [activeTab, setActiveTab] = useState<"simulation" | "live" | "report">(
  "simulation"
);

return (
  <AuthGate>
    <div className="min-h-screen bg-slate-900">
      {/* Header with tabs */}
      <header className="...">
        <nav>
          <button onClick={() => setActiveTab("simulation")}>Simulation</button>
          <button onClick={() => setActiveTab("live")}>Live</button>
          <button onClick={() => setActiveTab("report")}>Project Report</button>
        </nav>
        <button onClick={handleLogout}>Sign Out</button>
      </header>

      {/* Tab content */}
      {activeTab === "simulation" && <SimulationTab />}
      {activeTab === "live" && <LiveTab />}
      {activeTab === "report" && <ProjectReport />}
    </div>
  </AuthGate>
);
```

### Step 2.2: Simulation Tab Flow

**What the user sees:**

1. List of 7 scenario cards on the left
2. User clicks a card to select it
3. User clicks "Sign In" button
4. "Analyzing" animation plays (cosmetic, 2-3 seconds)
5. Result shows with predefined outcome

**What happens on "Sign In" click:**

```typescript
async function handleSignIn(scenario: Scenario) {
  // 1. Show analyzing animation
  setIsAnalyzing(true);

  // 2. Insert record to Supabase with ALL fields populated
  const record = buildRecordFromScenario(scenario, "simulation");
  const { data, error } = await supabase
    .from("authentication_attempts")
    .insert(record)
    .select()
    .single();

  // 3. Run cosmetic animation for 2-3 seconds
  await delay(2500);

  // 4. Show result (from scenario's predefined outcome)
  setIsAnalyzing(false);
  setResult(scenario);
}
```

**Building the record from scenario:**

```typescript
function buildRecordFromScenario(scenario: Scenario, sourceTab: string) {
  const riskScores: Record<string, number> = {
    "1": 0.15,
    "2": 0.45,
    "3": 0.5,
    "4": 0.85,
    "5": 0.95,
    "6": 0.78,
    "9": 0.55,
  };

  return {
    scenario_id: scenario.id,
    scenario_label: scenario.title,
    device_type: scenario.mockData.device,
    device_trusted:
      scenario.id === "1" || scenario.id === "3" || scenario.id === "6",
    location_raw: scenario.mockData.location,
    location_city: extractCity(scenario.mockData.location),
    ip_country: extractCountry(scenario.mockData.location),
    behavior_raw: scenario.mockData.behavior,
    behavior_score: parseBehaviorScore(scenario.mockData.behavior),
    login_time: scenario.mockData.time,
    time_anomaly: scenario.id === "3",
    geo_anomaly: scenario.id === "4",
    behavior_anomaly: scenario.id === "6",
    is_brute_force: scenario.id === "5",
    is_mid_session: scenario.id === "9",
    geo_velocity_violation: scenario.id === "9",
    trigger_description: scenario.details.trigger,
    source_tab: sourceTab,
    status: "completed",
    risk_level: scenario.riskLevel,
    risk_score: riskScores[scenario.id],
    action_taken: scenario.action,
    ai_analysis: scenario.details.aiUnderstanding,
    outcome_description: scenario.details.outcome,
    decision_factors: buildDecisionFactors(scenario),
    processed_at: new Date().toISOString(),
    processing_time_ms: Math.floor(Math.random() * 200) + 150,
  };
}
```

### Step 2.3: Live Tab Flow

**What the user sees:**

1. Simple login form (username/password fields - decorative)
2. User clicks "Sign In"
3. Random scenario is selected internally
4. Same analyzing animation plays
5. Result shows (user doesn't know which scenario was picked until result)

**Implementation:**

```typescript
function handleLiveSignIn() {
  // Pick random scenario
  const scenarioIds = ["1", "2", "3", "4", "5", "6", "9"];
  const randomId = scenarioIds[Math.floor(Math.random() * scenarioIds.length)];
  const scenario = SCENARIOS.find((s) => s.id === randomId)!;

  // Same flow as Simulation tab
  handleSignIn(scenario);
}
```

### Step 2.4: Analyzing Animation Component

Create a reusable analyzing animation component:

```typescript
// components/AnalyzingAnimation.tsx
interface Props {
  scenario: Scenario;
  onComplete: () => void;
}

export function AnalyzingAnimation({ scenario, onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [stage, setStage] = useState(0); // 0: device, 1: behavior, 2: risk

  useEffect(() => {
    // Animate progress from 0 to 100 over 2.5 seconds
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 2, 100));
    }, 50);

    // Add log messages at intervals
    const logMessages = [
      `[${getTime()}] INITIATING SESSION: ${scenario.title}`,
      `[${getTime()}] User Identity Claim: 104***921`,
      `[${getTime()}] Collecting Device Fingerprint...`,
      `[${getTime()}] Device: ${scenario.mockData.device}`,
      `[${getTime()}] Analyzing Network Signals...`,
      `[${getTime()}] IP Origin: ${scenario.mockData.location}`,
      `[${getTime()}] Behavioral Analysis: ${scenario.mockData.behavior}`,
      `[${getTime()}] CALCULATING RISK SCORE...`,
      `[${getTime()}] Risk Level: ${scenario.riskLevel}`,
      `[${getTime()}] DECISION: ${scenario.action}`,
    ];

    logMessages.forEach((msg, i) => {
      setTimeout(() => setLogs((l) => [...l, msg]), i * 250);
    });

    // Complete after 2.5 seconds
    setTimeout(onComplete, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 rounded-xl p-6">
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>SCANNING VECTORS</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Three status icons */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {["Device", "Behavior", "Risk Model"].map((label, i) => (
          <div
            key={label}
            className={`p-3 rounded-lg border ${
              progress > (i + 1) * 30
                ? "border-green-500 text-green-400"
                : "border-slate-600 text-slate-500"
            }`}
          >
            {progress > (i + 1) * 30 ? "✓" : "○"} {label}
          </div>
        ))}
      </div>

      {/* System log */}
      <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs text-green-400 h-48 overflow-y-auto">
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
    </div>
  );
}

function getTime() {
  return new Date().toLocaleTimeString("en-GB", {
    timeZone: "Asia/Riyadh",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
```

---

## 7. Phase 3: Admin App Changes

### Target Sidebar Structure

```
+-------------------------------------------------------------+
|  YAQITH SENTINEL                                             |
|  Adaptive Identity Verification                              |
+-------------------------------------------------------------+
|                                                              |
|  -- OVERVIEW --                                              |
|  * Overview                    <- Landing page (KEEP)        |
|                                                              |
|  -- COMMAND CENTER --                                        |
|  * Live Monitor                <- NEW: Real-time feed        |
|  * Threat Analytics            <- NEW: Charts & stats        |
|                                                              |
|  -- SYSTEM --                                                |
|  * Decision Engine             <- MERGE: Arch + Storyboards  |
|  * Risk Policies               <- NEW: 7 scenarios config    |
|                                                              |
|  -- LABS (Beta) --                                           |
|  * Biometrics Lab              <- KEEP existing              |
|  * ZKP Visualizer              <- KEEP existing              |
|                                                              |
|  -- HELP --                                                  |
|  * Technical Specs             <- MOVE from main nav         |
|  * About YAQITH                <- Project info               |
|                                                              |
|  [Sign Out]                                                  |
+-------------------------------------------------------------+
```

### Page 1: Overview (KEEP EXISTING)

No changes. Keep the existing landing page.

### Page 2: Live Monitor (NEW - MOST IMPORTANT)

**Purpose:** Show real-time authentication attempts as they arrive.

**Layout:** Two-panel split

```
+---------------------------+---------------------------------------+
|   RECENT ATTEMPTS         |   AI AGENCY INSPECTOR                 |
|   (Scrollable List)       |   (Detail View)                       |
|                           |                                       |
|   +-------------------+   |   +-------------------------------+   |
|   | 14:32:15          |   |   | Progress: 100%                |   |
|   | Normal Login      |   |   | [Device] [Behavior] [Risk]    |   |
|   | ALLOW     LOW     |   |   |                               |   |
|   +-------------------+   |   | SYSTEM LOG                    |   |
|   | 14:31:42  SELECTED|   |   | [14:31:42] INITIATING...      |   |
|   | Location Anomaly  |   |   | [14:31:42] Device: Win PC     |   |
|   | BLOCKED   HIGH    |   |   | [14:31:43] DECISION: BLOCK    |   |
|   +-------------------+   |   +-------------------------------+   |
|   | 14:30:58          |   |                                       |
|   | Unusual Device    |   |   +-------------------------------+   |
|   | OTP       MEDIUM  |   |   | RISK SCORE: 85                |   |
|   +-------------------+   |   | [========--] HIGH             |   |
|                           |   +-------------------------------+   |
+---------------------------+---------------------------------------+
```

**Left Panel - Recent Attempts:**

- Width: 35%
- Shows last 50 records
- Sorted by created_at DESC (newest first)
- Click to select and show details in right panel
- Auto-scrolls when new records arrive

**Each list item shows:**

- Timestamp (Saudi time, HH:MM:SS)
- Scenario label
- Action badge (colored: green/yellow/red)
- Risk level

**Right Panel - AI Agency Inspector:**

Copy the existing `Simulation.tsx` component's inspector UI. Shows:

- Progress bar (100% for completed records)
- Three status icons (Device, Behavior, Risk)
- System log with timestamps
- Risk score visualization

**Real-time Subscription:**

```typescript
useEffect(() => {
  // Initial fetch
  fetchRecentAttempts();

  // Subscribe to new records
  const subscription = supabase
    .channel("auth_attempts")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "authentication_attempts",
      },
      (payload) => {
        // Add new record to top of list
        setAttempts((prev) => [payload.new, ...prev].slice(0, 50));
        // Auto-select the new record
        setSelectedId(payload.new.id);
      }
    )
    .subscribe();

  return () => subscription.unsubscribe();
}, []);
```

### Page 3: Threat Analytics (NEW) - ENTERPRISE SECURITY OPERATIONS CENTER

**Purpose:** A world-class, AI-native cybersecurity dashboard that looks like it belongs in the Saudi Ministry of Interior's National Security Operations Center. This is the crown jewel of the demo.

**Design Philosophy:**
- **Dark Mode First**: Deep navy/black backgrounds (#0A0F1C, #0D1421)
- **Neon Accents**: Cyber blue (#00D4FF), Electric green (#00FF88), Warning amber (#FFB800), Threat red (#FF3366)
- **Glassmorphism**: Frosted glass cards with subtle borders
- **Data Density**: Maximum information, minimal chrome
- **Real-time Feel**: Pulsing indicators, live counters, streaming data aesthetic

---

#### LAYOUT: Full-Screen Command Center

```
+==================================================================================+
|  THREAT ANALYTICS                                    [Last 24H] [7D] [30D] [ALL] |
|  National Identity Protection Command Center          Auto-refresh: 30s  ⟳ LIVE  |
+==================================================================================+
|                                                                                   |
|  +---------------------------+  +---------------------------+  +---------------+  |
|  |  ███ THREAT LEVEL        |  |  ⚡ ACTIVE SESSIONS       |  | 🛡️ PROTECTED  |  |
|  |      ELEVATED            |  |      1,247                |  |    99.2%      |  |
|  |  ████████████░░ 67%      |  |  ↑ 12% from yesterday     |  |  Success Rate |  |
|  +---------------------------+  +---------------------------+  +---------------+  |
|                                                                                   |
|  +----------------------------------+  +--------------------------------------+   |
|  |  REAL-TIME THREAT RADAR         |  |  AUTHENTICATION HEATMAP              |   |
|  |  (Animated Radar Chart)         |  |  (Geographic Heat Visualization)     |   |
|  |                                 |  |                                      |   |
|  |         ╱╲    Geo Risk          |  |    Saudi Arabia Map with hotspots    |   |
|  |        ╱  ╲                     |  |    🔴 Riyadh: 423 attempts           |   |
|  |   ────●────  Device Risk        |  |    🟡 Jeddah: 156 attempts           |   |
|  |        ╲  ╱                     |  |    🟢 Dammam: 89 attempts            |   |
|  |         ╲╱    Behavior Risk     |  |    ⚠️ Foreign: 32 blocked           |   |
|  |                                 |  |                                      |   |
|  +----------------------------------+  +--------------------------------------+   |
|                                                                                   |
|  +----------------------------------+  +--------------------------------------+   |
|  |  THREAT TIMELINE (24H)          |  |  RISK DISTRIBUTION                   |   |
|  |  (Area Chart with Gradient)     |  |  (Donut Chart with Glow)             |   |
|  |                                 |  |                                      |   |
|  |  100┤     ╭───╮                 |  |      ╭─────────╮                     |   |
|  |   75┤ ╭──╯    ╰──╮    ╭──      |  |    ╱    LOW    ╲   55%              |   |
|  |   50┤╯            ╰──╯   ╲     |  |   │   ●●●●●●●   │                    |   |
|  |   25┤                     ╲    |  |    ╲  MEDIUM  ╱   28%               |   |
|  |    0└──────────────────────    |  |      ╰─────────╯   HIGH 17%         |   |
|  |     00:00  06:00  12:00  18:00 |  |                                      |   |
|  +----------------------------------+  +--------------------------------------+   |
|                                                                                   |
|  +==============================================================================+ |
|  |  LIVE THREAT FEED                                               🔴 RECORDING | |
|  |  ────────────────────────────────────────────────────────────────────────────| |
|  |  14:32:15  🟢 ALLOW      Normal Login       iPhone 14 Pro    Riyadh     0.15 | |
|  |  14:31:42  🔴 BLOCKED    Location Anomaly   Windows PC       São Paulo  0.85 | |
|  |  14:30:58  🟡 CHALLENGE  Unusual Device     iPad Air         Riyadh     0.45 | |
|  |  14:29:33  🟢 ALLOW      Normal Login       iPhone 14 Pro    Jeddah     0.12 | |
|  |  14:28:11  🔴 BLOCKED    Rapid Login        Multiple IPs     Rotating   0.95 | |
|  +==============================================================================+ |
|                                                                                   |
|  +-------------+  +-------------+  +-------------+  +-------------+  +---------+ |
|  | TOTAL       |  | BLOCKED     |  | CHALLENGED  |  | AVG RISK    |  | UPTIME  | |
|  | ATTEMPTS    |  | TODAY       |  | TODAY       |  | SCORE       |  |         | |
|  |   523       |  |    47       |  |    89       |  |   0.34      |  | 99.97%  | |
|  | ↑ 8.2%      |  | ↓ 12%       |  | ↑ 5%        |  | ↓ 0.02      |  |         | |
|  +-------------+  +-------------+  +-------------+  +-------------+  +---------+ |
+==================================================================================+
```

---

#### COMPONENT SPECIFICATIONS

##### 1. THREAT LEVEL INDICATOR (Top Left Hero Card)

**Design:**
- Large gradient card with animated pulse effect
- Shows aggregate threat level: MINIMAL / LOW / ELEVATED / HIGH / CRITICAL
- Animated progress bar with glow effect
- Color transitions based on level:
  - MINIMAL: #00FF88 (green glow)
  - LOW: #00D4FF (cyan glow)
  - ELEVATED: #FFB800 (amber glow)
  - HIGH: #FF6B35 (orange glow)
  - CRITICAL: #FF3366 (red pulse animation)

**Calculation:**
```typescript
function calculateThreatLevel(attempts: Attempt[]) {
  const last24h = attempts.filter(a => isWithin24Hours(a.created_at));
  const highRiskCount = last24h.filter(a => a.risk_level === 'HIGH').length;
  const totalCount = last24h.length;
  const ratio = highRiskCount / totalCount;

  if (ratio > 0.3) return { level: 'CRITICAL', percent: 95, color: '#FF3366' };
  if (ratio > 0.2) return { level: 'HIGH', percent: 80, color: '#FF6B35' };
  if (ratio > 0.1) return { level: 'ELEVATED', percent: 67, color: '#FFB800' };
  if (ratio > 0.05) return { level: 'LOW', percent: 40, color: '#00D4FF' };
  return { level: 'MINIMAL', percent: 15, color: '#00FF88' };
}
```

##### 2. REAL-TIME THREAT RADAR (Animated Radar/Spider Chart)

**Design:**
- Dark circular radar with neon grid lines
- 5 axes: Device Trust, Geo Risk, Behavior Match, Time Pattern, Brute Force
- Animated scanning line that rotates (like military radar)
- Current threat profile shown as filled polygon
- Pulsing dots on anomaly axes

**Implementation:**
```typescript
// Recharts RadarChart with custom styling
const radarData = [
  { axis: 'Device', value: deviceRiskPercent, fullMark: 100 },
  { axis: 'Geographic', value: geoRiskPercent, fullMark: 100 },
  { axis: 'Behavioral', value: behaviorRiskPercent, fullMark: 100 },
  { axis: 'Temporal', value: timeRiskPercent, fullMark: 100 },
  { axis: 'Velocity', value: bruteForceRiskPercent, fullMark: 100 },
];
```

##### 3. AUTHENTICATION HEATMAP (Geographic Visualization)

**Design:**
- Stylized Saudi Arabia map silhouette (SVG)
- Glowing hotspots at major cities (sized by attempt count)
- Red markers for blocked foreign attempts
- Animated connection lines between cities
- Legend showing attempt density

**Alternative (if map is complex):**
- Horizontal bar chart styled as "location leaderboard"
- Each bar has city flag/icon, name, count, and mini sparkline

```typescript
const locationData = [
  { city: 'Riyadh', country: 'SA', count: 423, blocked: 12, trend: 'up' },
  { city: 'Jeddah', country: 'SA', count: 156, blocked: 5, trend: 'stable' },
  { city: 'Dammam', country: 'SA', count: 89, blocked: 3, trend: 'down' },
  { city: 'São Paulo', country: 'BR', count: 15, blocked: 15, trend: 'blocked' },
  { city: 'Moscow', country: 'RU', count: 8, blocked: 8, trend: 'blocked' },
];
```

##### 4. THREAT TIMELINE (24-Hour Area Chart)

**Design:**
- Dark background with subtle grid
- Gradient-filled area chart (cyan to transparent)
- Multiple layers: Total (cyan), Blocked (red), Challenged (amber)
- Animated line drawing on load
- Hover tooltip with exact counts
- Time markers every 6 hours

**Styling:**
```typescript
<AreaChart data={hourlyData}>
  <defs>
    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.4}/>
      <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
    </linearGradient>
    <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#FF3366" stopOpacity={0.6}/>
      <stop offset="95%" stopColor="#FF3366" stopOpacity={0}/>
    </linearGradient>
  </defs>
  <Area type="monotone" dataKey="total" stroke="#00D4FF" fill="url(#colorTotal)" />
  <Area type="monotone" dataKey="blocked" stroke="#FF3366" fill="url(#colorBlocked)" />
</AreaChart>
```

##### 5. RISK DISTRIBUTION (Animated Donut Chart)

**Design:**
- Large donut chart with thick segments
- Neon glow effect on segments
- Animated on load (segments grow from 0)
- Center shows total count with label
- Legend below with percentages
- Colors:
  - LOW: #00FF88 (electric green)
  - MEDIUM: #FFB800 (warning amber)
  - HIGH: #FF3366 (threat red)

##### 6. LIVE THREAT FEED (Real-Time Table)

**Design:**
- Terminal/console aesthetic (monospace font)
- Dark background (#0A0F1C)
- New rows animate in from top with flash effect
- Color-coded status badges:
  - ALLOW: Green pill with glow
  - BLOCK: Red pill with pulse
  - CHALLENGE: Amber pill
- Columns: Time | Status | Scenario | Device | Location | Risk Score
- Risk score shown as mini progress bar
- "RECORDING" indicator with blinking red dot

**Real-time subscription:**
```typescript
// Auto-scroll to top when new record arrives
useEffect(() => {
  const channel = supabase.channel('threat-feed')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'authentication_attempts'
    }, (payload) => {
      setFeed(prev => [{ ...payload.new, isNew: true }, ...prev].slice(0, 20));
      // Flash animation trigger
      setTimeout(() => {
        setFeed(prev => prev.map((item, i) =>
          i === 0 ? { ...item, isNew: false } : item
        ));
      }, 1000);
    })
    .subscribe();

  return () => channel.unsubscribe();
}, []);
```

##### 7. METRIC CARDS (Bottom Row)

**Design:**
- 5 cards in a row, glassmorphism style
- Each card has:
  - Icon (top left, colored)
  - Large number (center, white, bold)
  - Label (below number, gray)
  - Trend indicator (bottom, green up / red down arrow with percentage)
- Subtle animated gradient border on hover

**Metrics:**
| Card | Icon | Value | Trend Calculation |
|------|------|-------|-------------------|
| Total Attempts | Activity | Count of all records | vs previous period |
| Blocked Today | ShieldOff | HIGH risk + BLOCK action today | vs yesterday |
| Challenged Today | AlertTriangle | MEDIUM risk + CHALLENGE action today | vs yesterday |
| Avg Risk Score | Gauge | Mean of risk_score field | vs previous period |
| System Uptime | Server | Always 99.97% (demo) | Static |

---

#### COLOR PALETTE (Cybersecurity Theme)

| Name | Hex | Usage |
|------|-----|-------|
| Deep Space | #0A0F1C | Primary background |
| Navy Dark | #0D1421 | Card backgrounds |
| Slate Border | #1E293B | Borders, dividers |
| Cyber Cyan | #00D4FF | Primary accent, links, LOW risk |
| Electric Green | #00FF88 | Success, ALLOW, positive trends |
| Warning Amber | #FFB800 | Warnings, MEDIUM risk, CHALLENGE |
| Threat Red | #FF3366 | Danger, HIGH risk, BLOCK |
| Alert Orange | #FF6B35 | Secondary warning |
| Pure White | #FFFFFF | Primary text |
| Slate Gray | #94A3B8 | Secondary text |

---

#### ANIMATIONS & MICRO-INTERACTIONS

1. **Page Load**: Cards fade in sequentially (staggered 100ms)
2. **Chart Load**: Lines/bars animate from zero
3. **New Data**: Flash effect + slide-in animation
4. **Hover**: Cards lift with shadow, glow intensifies
5. **Threat Level Change**: Pulse animation + color transition
6. **Radar Scan**: Continuous 360° rotation (8s cycle)
7. **Live Feed**: New rows slide in from top with cyan flash

---

#### DATA FETCHING STRATEGY

```typescript
// ThreatAnalytics.tsx
const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>('24h');
const [attempts, setAttempts] = useState<AuthAttempt[]>([]);
const [isLoading, setIsLoading] = useState(true);

// Initial fetch
useEffect(() => {
  fetchAnalyticsData(timeRange);
}, [timeRange]);

// Real-time subscription for live feed
useEffect(() => {
  const channel = supabase.channel('analytics-realtime')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'authentication_attempts'
    }, (payload) => {
      setAttempts(prev => [payload.new as AuthAttempt, ...prev]);
      // Recalculate all metrics
    })
    .subscribe();

  return () => channel.unsubscribe();
}, []);

async function fetchAnalyticsData(range: string) {
  setIsLoading(true);
  const startDate = calculateStartDate(range);

  const { data, error } = await supabase
    .from('authentication_attempts')
    .select('*')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: false });

  if (data) {
    setAttempts(data);
    // Calculate all derived metrics
  }
  setIsLoading(false);
}

// Derived calculations
const metrics = useMemo(() => {
  const today = attempts.filter(a => isToday(a.created_at));
  const yesterday = attempts.filter(a => isYesterday(a.created_at));

  return {
    total: attempts.length,
    blockedToday: today.filter(a => a.action_taken?.startsWith('BLOCK')).length,
    challengedToday: today.filter(a => a.action_taken?.startsWith('CHALLENGE')).length,
    avgRiskScore: average(attempts.map(a => a.risk_score)),
    threatLevel: calculateThreatLevel(attempts),
    byRiskLevel: groupBy(attempts, 'risk_level'),
    byLocation: groupBy(attempts, 'location_city'),
    hourlyTrend: groupByHour(attempts),
  };
}, [attempts]);
```

---

#### RESPONSIVE BEHAVIOR

- **Desktop (1400px+)**: Full 3-column layout as shown
- **Tablet (768-1399px)**: 2-column layout, cards stack
- **Mobile (<768px)**: Single column, simplified charts

---

#### ACCESSIBILITY

- All charts have aria-labels with data summaries
- Color is never the only indicator (icons + text accompany colors)
- Keyboard navigation for time range selector
- Screen reader announces new threat feed items

### Page 4: Decision Engine (MERGE)

Combine existing Architecture and Storyboards components with internal tabs:

```typescript
const [subTab, setSubTab] = useState<"architecture" | "flow">("architecture");

return (
  <div>
    <div className="flex gap-4 mb-6">
      <button onClick={() => setSubTab("architecture")}>Architecture</button>
      <button onClick={() => setSubTab("flow")}>Decision Flow</button>
    </div>
    {subTab === "architecture" && <Architecture />}
    {subTab === "flow" && <Storyboards />}
  </div>
);
```

### Page 5: Risk Policies (NEW)

Display the 7 scenarios as cards:

```typescript
const POLICY_CARDS = [
  {
    id: "1",
    name: "Normal Login",
    riskLevel: "LOW",
    action: "ALLOW",
    trigger: "Known device, normal time, familiar location",
    checks: {
      deviceMatch: true,
      locationMatch: true,
      behaviorMatch: true,
      timeNormal: true,
    },
  },
  // ... other scenarios
];
```

Each card shows:

- Scenario number and name
- Risk level badge
- Expected action
- Trigger description
- Checklist of what's matched/violated

### Pages 6-9: Keep Existing

- **Biometrics Lab**: Keep BiometricsDemo.tsx as-is
- **ZKP Visualizer**: Keep ZKPLogin.tsx as-is
- **Technical Specs**: Move to Help section, keep TechnicalSpecs.tsx as-is
- **About YAQITH**: Simple info page about the project

### Files to DELETE

- `components/VeoGenerator.tsx` - Video generation not needed
- `services/geminiService.ts` - Veo service not needed

---

## 8. Phase 4: Data Seeding

### Purpose

Populate the database with historical data so charts and dashboards have meaningful content.

### Seeding Script

Create a one-time seeding script (can be run via Supabase SQL editor or a Node script):

```sql
-- Seed ~500 records distributed over past 7 days
-- Distribution: Normal Login 55%, Unusual Device 15%, etc.

INSERT INTO authentication_attempts (
  scenario_id, scenario_label, device_type, device_trusted,
  location_city, ip_country, location_raw, behavior_raw, behavior_score,
  login_time, time_anomaly, geo_anomaly, behavior_anomaly,
  is_brute_force, is_mid_session, source_tab, status,
  risk_level, risk_score, action_taken, ai_analysis, outcome_description,
  created_at, processed_at, processing_time_ms
)
SELECT
  scenario_id,
  scenario_label,
  device_type,
  device_trusted,
  location_city,
  ip_country,
  location_raw,
  behavior_raw,
  behavior_score,
  login_time,
  time_anomaly,
  geo_anomaly,
  behavior_anomaly,
  is_brute_force,
  is_mid_session,
  'seed',
  'completed',
  risk_level,
  risk_score,
  action_taken,
  ai_analysis,
  outcome_description,
  created_at,
  created_at,
  (random() * 200 + 150)::int
FROM (
  -- Generate records with proper distribution
  -- See full seeding script in implementation
) AS seed_data;
```

### Distribution Requirements

| Scenario              | Percentage | Count |
| --------------------- | ---------- | ----- |
| Normal Login          | 55%        | ~275  |
| Unusual Device        | 15%        | ~75   |
| Suspicious Time       | 8%         | ~40   |
| Location Anomaly      | 7%         | ~35   |
| Rapid Login           | 5%         | ~25   |
| Behavioral Deviation  | 5%         | ~25   |
| Continuous Monitoring | 5%         | ~25   |

### Time Distribution

- Records spread over past 7 days
- More activity during 8 AM - 10 PM Saudi time
- Suspicious Time records at night hours

### Geographic Distribution

- 85% Saudi Arabia (Riyadh, Jeddah, Dammam)
- 10% Gulf countries (UAE, Bahrain)
- 5% Anomalous (Brazil, Russia)

---

## 9. Testing Requirements

### Authentication Tests

1. Both apps show login page when not authenticated
2. Can log in with: `yaqith@yaqith.com` / `Yaqith@SaudiArabia`
3. After login, main app content is visible
4. Logout button works
5. Session persists across refresh

### User App Tests

1. **Simulation tab**: Select scenario -> Click Sign In -> Animation plays -> Result shows correctly
2. **Live tab**: Click Sign In -> Random scenario -> Animation -> Result
3. Record appears in Supabase with all fields populated
4. Record has correct `source_tab` value

### Admin App Tests

1. **Live Monitor**: Shows historical data on load
2. **Live Monitor**: New records appear in real-time when User App creates them
3. **Live Monitor**: Clicking a record shows details in right panel
4. **Threat Analytics**: Charts display correctly
5. All sidebar navigation works

### Cross-App Integration Test

1. Open User App and Admin App side by side
2. In User App, trigger a scenario
3. In Admin App Live Monitor, see the new record appear immediately
4. Verify all fields match

---

## 10. File Reference

### Files to Create

**User App:**

```
src/
├── lib/
│   └── supabase.ts
├── components/
│   ├── LoginPage.tsx
│   ├── AuthGate.tsx
│   ├── SimulationTab.tsx
│   ├── LiveTab.tsx
│   ├── AnalyzingAnimation.tsx
│   └── ResultView.tsx
└── services/
    └── authService.ts
```

**Admin App:**

```
src/
├── lib/
│   └── supabase.ts
├── components/
│   ├── LoginPage.tsx
│   ├── AuthGate.tsx
│   ├── LiveMonitor.tsx
│   ├── ThreatAnalytics.tsx
│   ├── DecisionEngine.tsx
│   ├── RiskPolicies.tsx
│   └── AboutYaqith.tsx
└── services/
    └── supabaseService.ts
```

### Files to Modify

**User App:**

- `App.tsx` - Complete restructure to tab-based with AuthGate

**Admin App:**

- `App.tsx` - Update sidebar structure, wrap with AuthGate

### Files to Delete

**Admin App:**

- `components/VeoGenerator.tsx`
- `services/geminiService.ts`

### Files to Keep Unchanged

**Admin App:**

- `components/BiometricsDemo.tsx`
- `components/ZKPLogin.tsx`
- `components/Architecture.tsx`
- `components/Storyboards.tsx`
- `components/TechnicalSpecs.tsx`

---

## Implementation Order

1. **Phase 0**: Authentication (both apps)
2. **Phase 1**: Database schema (Supabase)
3. **Phase 4**: Data seeding (after table created)
4. **Phase 2**: User App changes
5. **Phase 3**: Admin App changes
6. **Testing**: Full integration

---

## Future: Phase 2 (Adding n8n/AI)

When ready to add AI processing:

1. Change INSERT to set `status: 'pending'` instead of `'completed'`
2. Leave decision fields NULL on insert
3. Configure n8n workflow to detect pending records
4. n8n populates decision fields and sets `status: 'completed'`
5. User App animation waits for real database update instead of cosmetic timer
6. See `plan.md` (v2.1) and `n8n.md` for full n8n integration details

---

**End of Implementation Plan (Without n8n)**
