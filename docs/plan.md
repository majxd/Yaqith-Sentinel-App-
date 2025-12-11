# YAQITH Sentinel - Implementation Plan

**Version:** 2.1
**Date:** 2025-12-10
**Status:** Ready for Implementation

---

## Document Purpose

This document provides complete implementation instructions for the YAQITH Sentinel hackathon demo. It is designed to be read by Claude Code agents (Solution Architect, Frontend Engineer, Backend Engineer, Security Engineer, QA teams) who will implement the system across two codebases.

**Read this entire document before starting any work.**

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

### What We Are Building

Two web applications that communicate via a shared Supabase database:

1. **User App** (Port 3020): Simulates a citizen logging into a government service
2. **Admin App** (Port 3010): Shows security analysts monitoring login attempts in real-time

### The Data Flow

```
User App                    Supabase                     Admin App
─────────                   ────────                     ─────────
User clicks          →      INSERT new row        →      Real-time subscription
"Sign In"                   (status: pending)            receives new row
                                                         Shows "Analyzing..."
                                   ↓
                            n8n workflow
                            processes row
                            (EXTERNAL - not our work)
                                   ↓
                            UPDATE row             →      Real-time subscription
                            (status: completed,          receives update
                             risk_level, action)         Shows final decision
```

### What n8n Does (NOT Our Responsibility)

n8n is an external workflow automation tool. The hackathon team will configure it separately. Our job is to:

- Write records with `status: 'pending'`
- Design the schema so n8n can update `risk_level`, `action_taken`, etc.
- Read the updated records in Admin App

We do NOT implement n8n. We just prepare the database for it.

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
- Has 2 tabs: Simulation, Project Report
- Does NOT have `@supabase/supabase-js` installed (must add)
- Has `.env` file including `VITE_SUPABASE_ANON_KEY`

**Key Files:**

- `App.tsx` - Main app component with tab navigation
- `constants.ts` - Contains all 7 scenario definitions (SCENARIOS array)
- `types.ts` - TypeScript enums (RiskLevel, ActionType, etc.)

### Admin App Location

```
E:\Bahrain\KSA-Hackathon\Admin-app\
```

**Current State:**

- React 19 + Vite + TypeScript app
- Has sidebar navigation with multiple demo components
- Already has many components we will reorganize
- Has `.env` file including `VITE_SUPABASE_ANON_KEY`

**Key Files:**

- `App.tsx` - Main app with sidebar navigation
- `components/Simulation.tsx` - Contains the "AI Agency Inspector" UI we will reuse
- `components/` - Various demo components

### Environment Variables Required

Both apps need these in their `.env` files:

```env
VITE_SUPABASE_URL=https://cjbmavpjfdnetpumjhgb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqYm1hdnBqZmRuZXRwdW1qaGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMTY5NTEsImV4cCI6MjA4MDg5Mjk1MX0.8iRzSUHG0YMXD3yuu0_2nezm34gShfhhKETH9CMLED8
```

---

## 4. Phase 0: Authentication

### Why Authentication?

Both apps will be deployed to Vercel (public internet). Without authentication, anyone could:

- Trigger login simulations (consuming n8n API tokens)
- View the admin dashboard

### Authentication Credentials

```
Username:  yaqith
Password:  Yaqith@SaudiArabia
```

This is a single Supabase Auth user shared by both apps.

### Implementation Steps

#### Step 0.1: Create Supabase Auth User

Use Supabase MCP or Dashboard to create the user:

- Email: `yaqith` (Supabase allows non-email usernames)
- Password: `Yaqith@SaudiArabia`
- Email confirmed: true (skip verification)

#### Step 0.2: Install Supabase Client in User App

```bash
cd E:\Bahrain\KSA-Hackathon\User-app
npm install @supabase/supabase-js
```

(Admin App may already have it - check package.json first)

#### Step 0.3: Create Supabase Client File (Both Apps)

Create `src/lib/supabase.ts` in both apps:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

#### Step 0.4: Create Login Page Component (Both Apps)

Create `src/components/LoginPage.tsx` with this design:

**Visual Requirements:**

- Full-screen dark gradient background (Deep Navy #0A1628 to Slate #1E293B)
- Centered login card with frosted glass effect (backdrop-blur)
- Subtle animated neural network grid pattern in background
- YAQITH branding at top (can use Shield icon from Lucide)

**Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    [Shield Icon]                            │
│                                                             │
│                   YAQITH SENTINEL                           │
│          Adaptive Identity Verification System              │
│                                                             │
│         ┌─────────────────────────────────────┐            │
│         │                                     │            │
│         │  ┌─────────────────────────────┐   │            │
│         │  │ [User Icon]  yaqith         │   │            │
│         │  └─────────────────────────────┘   │            │
│         │                                     │            │
│         │  ┌─────────────────────────────┐   │            │
│         │  │ [Lock Icon]  ••••••••••••   │   │            │
│         │  └─────────────────────────────┘   │            │
│         │                                     │            │
│         │  ┌─────────────────────────────┐   │            │
│         │  │      SECURE ACCESS          │   │  <- Green  │
│         │  └─────────────────────────────┘   │            │
│         │                                     │            │
│         └─────────────────────────────────────┘            │
│                                                             │
│           Protected by AI-Powered Authentication            │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│           © 2025 YAQITH Sentinel • Vision 2030              │
└─────────────────────────────────────────────────────────────┘
```

**Color Palette:**
| Color | Hex | Usage |
|-------|-----|-------|
| Absher Green | #006C5B | Primary button, accents |
| Absher Gold | #C6A664 | Secondary highlights |
| Deep Navy | #0A1628 | Background start |
| Slate Dark | #1E293B | Card background |
| Cyber Blue | #00D4FF | Glow effects |

**Button States:**

- Default: Absher Green background
- Hover: Lighter with subtle glow
- Loading: Show spinner + "Authenticating..."
- Error: Show red error message below form

#### Step 0.5: Create Auth Gate Component (Both Apps)

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

#### Step 0.6: Wrap App with AuthGate

In both apps, modify the main App component or index.tsx:

```typescript
// In App.tsx or index.tsx
import { AuthGate } from "./components/AuthGate";

function App() {
  return <AuthGate>{/* Existing app content */}</AuthGate>;
}
```

#### Step 0.7: Add Logout Button

Add a logout button to:

- User App: In the header/nav area
- Admin App: In the sidebar (bottom)

```typescript
const handleLogout = async () => {
  await supabase.auth.signOut();
};

// Button component
<button onClick={handleLogout} className="...">
  <LogOut size={16} />
  Sign Out
</button>;
```

---

## 5. Phase 1: Database Setup

### Table: authentication_attempts

This single table stores all login attempts from the User App.

```sql
CREATE TABLE authentication_attempts (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- ═══════════════════════════════════════════════════════════
  -- INPUT FIELDS - Written by User App when user clicks "Sign In"
  -- ═══════════════════════════════════════════════════════════

  -- Which scenario was triggered
  scenario_id TEXT NOT NULL,              -- '1', '2', '3', '4', '5', '6', or '9'
  scenario_label TEXT NOT NULL,           -- Human-readable name

  -- Device information
  device_type TEXT,                       -- e.g., 'iPhone 14 Pro (Known)'
  device_trusted BOOLEAN DEFAULT false,

  -- Location information
  ip_address TEXT,                        -- Simulated IP
  ip_country TEXT,                        -- 'SA', 'BR', etc.
  location_city TEXT,                     -- 'Riyadh', 'Sao Paulo', etc.
  location_raw TEXT,                      -- Full string like 'Riyadh, SA (Home IP)'

  -- Behavioral data
  behavior_score DECIMAL(5,2),            -- 0.00 to 1.00
  behavior_raw TEXT,                      -- '98% Match', 'Bot Pattern', etc.

  -- Time information
  login_time TEXT,                        -- '20:00', '03:12', etc.
  login_timestamp TIMESTAMPTZ DEFAULT NOW(),

  -- Anomaly flags (only one should be true per record)
  time_anomaly BOOLEAN DEFAULT false,     -- Scenario 3
  geo_anomaly BOOLEAN DEFAULT false,      -- Scenario 4
  behavior_anomaly BOOLEAN DEFAULT false, -- Scenario 6
  geo_velocity_violation BOOLEAN DEFAULT false, -- Scenario 9
  is_brute_force BOOLEAN DEFAULT false,   -- Scenario 5
  is_mid_session BOOLEAN DEFAULT false,   -- Scenario 9

  -- Additional context
  trigger_description TEXT,               -- Why this scenario was triggered
  session_id TEXT,                        -- Unique session ID
  user_identifier TEXT DEFAULT '104***921', -- Masked user ID for display

  -- Which tab in User App triggered this
  source_tab TEXT DEFAULT 'simulation',   -- 'simulation' or 'live'

  -- Processing status
  status TEXT DEFAULT 'pending',          -- 'pending', 'processing', 'completed'

  -- ═══════════════════════════════════════════════════════════
  -- DECISION FIELDS - Written by n8n after AI analysis
  -- These will be NULL until n8n processes the record
  -- ═══════════════════════════════════════════════════════════

  risk_level TEXT,                        -- 'LOW', 'MEDIUM', 'HIGH'
  risk_score DECIMAL(5,2),                -- 0.00 to 1.00
  action_taken TEXT,                      -- 'ALLOW', 'BLOCK', 'CHALLENGE_OTP', etc.
  ai_analysis TEXT,                       -- Explanation of decision
  outcome_description TEXT,               -- What happened to the user
  decision_factors JSONB,                 -- Factors that influenced decision
  processed_at TIMESTAMPTZ,               -- When n8n finished
  processing_time_ms INTEGER              -- How long processing took
);

-- Indexes for performance
CREATE INDEX idx_auth_attempts_created_at ON authentication_attempts(created_at DESC);
CREATE INDEX idx_auth_attempts_status ON authentication_attempts(status);
CREATE INDEX idx_auth_attempts_risk_level ON authentication_attempts(risk_level);

-- Enable real-time subscriptions (CRITICAL)
ALTER PUBLICATION supabase_realtime ADD TABLE authentication_attempts;
```

### Why These Columns?

The User App has 7 predefined scenarios. Each scenario has different mock data. The table must accommodate ALL possible fields from ALL scenarios, even though each individual record only uses some of them.

### The 7 Scenarios (from User App constants.ts)

| ID  | Name                  | Risk   | Action                 | Key Characteristics                            |
| --- | --------------------- | ------ | ---------------------- | ---------------------------------------------- |
| 1   | Normal Login          | LOW    | ALLOW                  | Known device, normal time, high behavior match |
| 2   | Unusual Device        | MEDIUM | CHALLENGE_OTP          | New device, but known location                 |
| 3   | Suspicious Time       | MEDIUM | CHALLENGE_CONFIRMATION | Login at 3 AM                                  |
| 4   | Location Anomaly      | HIGH   | BLOCK                  | Login from Brazil (geo violation)              |
| 5   | Rapid Login           | HIGH   | BLOCK_RAPID            | Brute force attack pattern                     |
| 6   | Behavioral Deviation  | HIGH   | CHALLENGE_BIOMETRIC    | Typing cadence mismatch                        |
| 9   | Continuous Monitoring | MEDIUM | RE_AUTH                | Mid-session location change                    |

---

## 6. Phase 2: User App Changes

### Current State

The User App currently has 2 tabs:

1. **Simulation** - User selects a scenario from a list, clicks sign in, sees animation with result
2. **Project Report** - Static documentation page

### Target State

The User App will have 3 tabs:

1. **Simulation** - User selects a scenario, clicks sign in, writes to Supabase, shows analyzing animation, waits for n8n, shows result
2. **Live** - User enters any credentials, clicks sign in, system randomly picks a scenario, writes to Supabase, shows analyzing animation, waits for n8n, shows result
3. **Project Report** - No changes

---

### Shared Behavior: The Analyzing Animation

**CRITICAL: Both Simulation and Live tabs MUST show the same analyzing animation.**

When the user clicks "Sign In" on either tab, the following sequence occurs:

```
STEP 1: User clicks "Sign In" button
        ↓
STEP 2: Frontend determines which scenario to use:
        - Simulation tab: User already selected a scenario from the list
        - Live tab: Generate random number 0-6, map to scenario ID
        ↓
STEP 3: Frontend inserts record to Supabase with status='pending'
        ↓
STEP 4: Frontend subscribes to that specific record for updates
        ↓
STEP 5: Frontend shows "ANALYZING" animation:
        - Dark card appears
        - Progress bar animates from 0% to ~70%
        - System log shows messages appearing one by one
        - Three icons (Device, Behavior, Risk) light up progressively
        - This animation loops/pauses at ~70% while waiting
        ↓
STEP 6: n8n (external) detects the pending record, processes it,
        updates the record with: status='completed', risk_level, action_taken, risk_score
        ↓
STEP 7: Frontend's subscription receives the update
        ↓
STEP 8: Frontend completes the animation:
        - Progress bar jumps to 100%
        - Final system log message shows the decision
        - Risk Score pie chart appears with the actual risk_score value
        - Action badge appears (ALLOW=green, BLOCK=red, CHALLENGE=yellow)
        - Outcome message displays
```

**The animation MUST NOT complete until the database record changes from `pending` to `completed`.**

If n8n is not running, the animation stays at the "Analyzing..." state indefinitely. This is correct behavior.

---

### The 7 Scenarios and Their Expected Outcomes

When a scenario is selected (manually in Simulation, randomly in Live), the result shown to the user MUST match that scenario's expected outcome:

| Random Index | Scenario ID | Scenario Name | Expected risk_level | Expected action_taken | Result Color |
|--------------|-------------|---------------|---------------------|----------------------|--------------|
| 0 | '1' | Normal Login | LOW | ALLOW | Green |
| 1 | '2' | Unusual Device | MEDIUM | CHALLENGE_OTP | Yellow |
| 2 | '3' | Suspicious Time | MEDIUM | CHALLENGE_CONFIRMATION | Yellow |
| 3 | '4' | Location Anomaly | HIGH | BLOCK | Red |
| 4 | '5' | Rapid Login | HIGH | BLOCK_RAPID | Red |
| 5 | '6' | Behavioral Deviation | HIGH | CHALLENGE_BIOMETRIC | Red |
| 6 | '9' | Continuous Monitoring | MEDIUM | RE_AUTH | Yellow |

---

### Step 2.1: Simulation Tab - Detailed Behavior

**What the user sees:**

1. A list of 7 scenario cards on the left side (already exists in current app)
2. Each card shows: scenario name, description, risk level badge
3. User clicks a card to select it (card highlights)
4. User clicks "Sign In" button

**What happens when user clicks "Sign In":**

1. Get the selected scenario object from the SCENARIOS constant
2. Call `insertAuthAttempt(scenario, 'simulation')` to write to Supabase
3. Store the returned record ID
4. Call `subscribeToAttempt(recordId, onUpdate)` to listen for changes
5. Transition UI to "Analyzing" state:
   - Hide the scenario selection panel
   - Show the dark analyzing card (same design as existing Simulation.tsx)
   - Start the progress bar animation
   - Start the system log messages:
     - `[HH:MM:SS] INITIATING SESSION: {scenario.title}`
     - `[HH:MM:SS] User Identity Claim: 104***921`
     - `[HH:MM:SS] Collecting Device Fingerprint...`
     - `[HH:MM:SS] Device: {scenario.mockData.device}`
     - `[HH:MM:SS] Analyzing Network Signals...`
     - `[HH:MM:SS] IP Origin: {scenario.mockData.location}`
     - (pause here, loop animation, wait for database update)
6. When subscription receives update with `status='completed'`:
   - Add final log messages:
     - `[HH:MM:SS] CALCULATING RISK SCORE...`
     - `[HH:MM:SS] Final Score: {risk_score}`
     - `[HH:MM:SS] DECISION: {action_taken}`
   - Complete progress bar to 100%
   - Show the Risk Score pie chart with actual value
   - Show the action result card:
     - GREEN background for ALLOW
     - RED background for BLOCK, BLOCK_RAPID
     - YELLOW/AMBER background for CHALLENGE_* and RE_AUTH
   - Show "Try Another" button to reset

**Timestamps:** All timestamps in the system log MUST be in Saudi Arabia time (Asia/Riyadh), format HH:MM:SS (24-hour, no date).

---

### Step 2.2: Live Tab - Detailed Behavior

**Purpose:** Create suspense during demo. Presenter clicks "Sign In" without knowing which scenario will trigger.

**What the user sees:**

1. A simple login form in the center of the screen:
   - Absher-style design (green accents, government look)
   - Username input field (pre-filled with "104***921" or empty)
   - Password input field (shows dots/masked)
   - "Sign In" button (Absher Green color)
2. NO scenario selection visible
3. Text below form: "Experience real-time AI-powered authentication"

**What happens when user clicks "Sign In":**

1. **The username and password fields are IGNORED.** They are purely decorative for the demo. The user can type anything or nothing.

2. Generate random scenario:
   ```javascript
   const scenarioIds = ['1', '2', '3', '4', '5', '6', '9'];
   const randomIndex = Math.floor(Math.random() * scenarioIds.length);
   const selectedScenarioId = scenarioIds[randomIndex];
   const scenario = SCENARIOS.find(s => s.id === selectedScenarioId);
   ```

3. Call `insertAuthAttempt(scenario, 'live')` to write to Supabase

4. Store the returned record ID

5. Call `subscribeToAttempt(recordId, onUpdate)` to listen for changes

6. Transition UI to "Analyzing" state:
   - Hide the login form
   - Show the EXACT SAME analyzing animation as Simulation tab
   - The system log messages use data from the randomly selected scenario:
     - `[HH:MM:SS] INITIATING SESSION: {scenario.title}`
     - `[HH:MM:SS] Device: {scenario.mockData.device}`
     - `[HH:MM:SS] IP Origin: {scenario.mockData.location}`
     - etc.

7. Wait for database update (same as Simulation tab)

8. When subscription receives update:
   - Complete animation with actual values from database
   - Show result matching the scenario that was randomly selected
   - Example: If random picked scenario '4' (Location Anomaly), user sees:
     - RED result card
     - "BLOCKED" action
     - Risk score ~0.85
     - Message about geo violation detected

9. Show "Try Again" button to reset and allow another attempt

**Key Point:** The presenter does NOT know which scenario was selected until the result appears. This creates genuine suspense. They might get "ALLOW" (scenario 1) or "BLOCKED" (scenario 4) randomly.

---

### Step 2.3: Add Tab Navigation

The User App header must show 3 tabs:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  YAQITH SENTINEL    [Simulation]  [Live]  [Project Report]    [Logout] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                     (Tab content renders here)                           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

- Active tab has underline or highlight
- Clicking tab changes view
- Tab state persists during session

---

### Step 2.4: Supabase Service Implementation

Create `src/services/supabaseService.ts` with these exact functions:

**Function 1: insertAuthAttempt**
- Input: Scenario object, source tab ('simulation' or 'live')
- Output: Record ID (UUID string)
- Action: INSERT into authentication_attempts table with status='pending'
- Must parse scenario.mockData fields and map to database columns

**Function 2: subscribeToAttempt**
- Input: Record ID, callback function
- Output: Subscription object
- Action: Subscribe to UPDATE events on that specific record
- When record changes, call the callback with the new data

---

## 7. Phase 3: Admin App Changes - Comprehensive Specifications

### Current State

The Admin App has a sidebar with these components:
- Overview (Dashboard) - Landing page explaining the concept
- Biometrics Demo - Interactive typing/mouse behavior demo
- ZKP Login - Zero-knowledge proof visualization
- Risk Dashboard - Mock dashboard with fake data
- Simulation - Contains the "AI Agency Inspector" interface we will reuse
- Storyboards - Visual decision flow panels
- Architecture - 4-layer funnel diagram
- Technical Specs - Detailed system design documentation
- Video Generator - Veo AI video generation (NOT RELEVANT - DELETE)

### Target State - New Sidebar Structure

```
┌─────────────────────────────────────────────────────────────┐
│  YAQITH SENTINEL                                             │
│  Adaptive Identity Verification                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ── OVERVIEW ──────────────────────────────────────────────  │
│  ◉ Overview                    ← Landing page (KEEP AS-IS)  │
│                                                              │
│  ── COMMAND CENTER ────────────────────────────────────────  │
│  ◉ Live Monitor                ← NEW: Real-time feed        │
│  ◉ Threat Analytics            ← NEW: Charts & statistics   │
│                                                              │
│  ── SYSTEM ────────────────────────────────────────────────  │
│  ◉ Decision Engine             ← MERGE: Architecture +      │
│                                   Storyboards                │
│  ◉ Risk Policies               ← NEW: 7 scenarios config    │
│                                                              │
│  ── LABS (Beta) ───────────────────────────────────────────  │
│  ◉ Biometrics Lab              ← KEEP: Existing component   │
│  ◉ ZKP Visualizer              ← KEEP: Existing component   │
│                                                              │
│  ── HELP ──────────────────────────────────────────────────  │
│  ◉ Technical Specs             ← MOVE: From main nav        │
│  ◉ About YAQITH                ← KEEP/CREATE: Project info  │
│                                                              │
│  ────────────────────────────────────────────────────────── │
│  [Logout Button]                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### Page 1: Overview (KEEP EXISTING)

**Location:** First page users see when they open the Admin App

**Purpose:** Explain the YAQITH Sentinel concept to hackathon assessors

**Action:** Keep this page exactly as it currently exists. Do not modify.

---

### Page 2: Live Monitor (NEW - MOST IMPORTANT PAGE)

**Purpose:** Show real-time authentication attempts as they happen, with the AI Agency Inspector visualization.

**Layout:** Two-panel split screen

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              LIVE MONITOR                                    │
├─────────────────────────────┬───────────────────────────────────────────────┤
│                             │                                                │
│   RECENT ATTEMPTS           │        AI AGENCY INTERCEPTOR                   │
│   (Scrollable List)         │        Real-time Identity Verification Layer  │
│                             │                                                │
│  ┌────────────────────────┐ │  ┌──────────────────────────────────────────┐ │
│  │ 14:32:15               │ │  │                                          │ │
│  │ Normal Login           │ │  │     [Progress Bar: Scanning Vectors]     │ │
│  │ ✓ ALLOW      LOW       │ │  │     ████████████████░░░░░░  78%          │ │
│  │ iPhone 14 Pro, Riyadh  │ │  │                                          │ │
│  ├────────────────────────┤ │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐    │ │
│  │ 14:31:42      ◀ SELECTED│  │  │  Device  │ │ Behavior│ │  Risk   │    │ │
│  │ Location Anomaly       │ │  │  │   ✓     │ │    ✓    │ │   ...   │    │ │
│  │ ✗ BLOCKED    HIGH      │ │  │  └─────────┘ └─────────┘ └─────────┘    │ │
│  │ Windows PC, Sao Paulo  │ │  │                                          │ │
│  ├────────────────────────┤ │  └──────────────────────────────────────────┘ │
│  │ 14:30:58               │ │                                                │
│  │ Unusual Device         │ │  ┌──────────────────────────────────────────┐ │
│  │ ⚠ OTP        MEDIUM    │ │  │  SYSTEM LOG                              │ │
│  │ iPad Air, Riyadh       │ │  │  ──────────────────────────────────────  │ │
│  ├────────────────────────┤ │  │  [14:31:42] INITIATING SESSION...        │ │
│  │ 14:29:33               │ │  │  [14:31:42] Device: Unknown Windows PC   │ │
│  │ Normal Login           │ │  │  [14:31:42] IP Origin: BR                │ │
│  │ ✓ ALLOW      LOW       │ │  │  [14:31:43] WARNING: Geo violation       │ │
│  │ iPhone 14 Pro, Riyadh  │ │  │  [14:31:43] DECISION: BLOCK              │ │
│  └────────────────────────┘ │  └──────────────────────────────────────────┘ │
│                             │                                                │
│   Showing 50 most recent    │        ┌─────────────────────┐                │
│   Auto-refresh: ON          │        │   RISK SCORE: 85    │                │
│                             │        │   ████████░░ HIGH   │                │
│                             │        └─────────────────────┘                │
└─────────────────────────────┴───────────────────────────────────────────────┘
```

**Left Panel - Recent Attempts List:**

| Element | Specification |
|---------|---------------|
| Width | 35% of screen |
| Background | White or very light gray (#F8FAFC) |
| Max items | 50 most recent, scrollable |
| Sort order | Newest at top |
| Item height | ~80px |
| Selection | Clicking an item highlights it and shows details in right panel |

**Each list item shows:**
1. **Timestamp** (top-left): Saudi Arabia time, format HH:MM:SS, font-mono, text-slate-500
2. **Scenario Label** (main text): Bold, text-slate-800
3. **Action Badge** (right side):
   - ALLOW: Green badge (#22C55E background, white text)
   - BLOCK/BLOCK_RAPID: Red badge (#EF4444 background, white text)
   - CHALLENGE_*: Yellow/Amber badge (#F59E0B background, black text)
   - RE_AUTH: Yellow badge
4. **Risk Level** (right side, below action): Text only, colored:
   - LOW: Green text
   - MEDIUM: Yellow text
   - HIGH: Red text
5. **Device + Location** (bottom): Small text, text-slate-400, e.g., "iPhone 14 Pro, Riyadh"

**For PENDING records:**
- Show pulsing/animated border
- Action badge shows "Analyzing..." with spinner
- Risk level shows "..."

**Right Panel - AI Agency Inspector:**

This panel MUST be copied from the existing `Simulation.tsx` component. It contains:

1. **Header Section** (top):
   - Background: Dark slate (#0F172A)
   - Title: "AI Agency Interceptor" - white, bold, text-2xl
   - Subtitle: "Real-time Identity Verification Layer" - slate-400, text-sm

2. **Progress Bar**:
   - Label: "Scanning Vectors" - slate-400, uppercase, text-xs
   - Percentage display: Right-aligned
   - Bar: Blue fill on dark background
   - Animate from 0% to 100% as analysis completes

3. **Three Status Icons** (Device, Behavior, Risk Model):
   - Grid of 3 cards
   - Each card has icon + label
   - Inactive: Dark background, slate-500 text
   - Active (completed): Green border, green text, checkmark
   - Icons light up left-to-right as analysis progresses

4. **System Log** (terminal style):
   - Background: Very dark (#0F172A)
   - Text: Green monospace (#22C55E)
   - Shows timestamped messages
   - Auto-scrolls to bottom
   - Timestamps in Saudi Arabia time (HH:MM:SS only)

5. **Risk Score Visualization** (when complete):
   - Semi-circle pie chart (Recharts)
   - Score displayed in center (0-100)
   - Color based on risk level:
     - LOW (0-33): Green
     - MEDIUM (34-66): Yellow
     - HIGH (67-100): Red

**Real-time Behavior:**

1. On page load:
   - Query last 50 records from `authentication_attempts` ordered by `created_at DESC`
   - Subscribe to INSERT and UPDATE events on the table

2. When new INSERT arrives (status='pending'):
   - Add new item to TOP of the list with pulsing animation
   - AUTO-SELECT this item (highlight it)
   - Right panel starts showing the analyzing animation
   - System log starts populating with the record's data

3. When UPDATE arrives (status='completed'):
   - Update the list item with final action/risk
   - If this item is selected, complete the animation in right panel
   - Show final risk score and decision

4. If user manually clicks a different list item:
   - Stop auto-selecting new items
   - Show that item's data in right panel
   - If item is 'completed', show final state immediately
   - If item is 'pending', show analyzing state

---

### Page 3: Threat Analytics (NEW)

**Purpose:** Show aggregated statistics and charts from historical data.

**Layout:** Dashboard grid with multiple chart cards

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           THREAT ANALYTICS                                   │
│                                                                              │
│  Period: [Last 24 Hours ▼]  [Last 7 Days]  [Last 30 Days]  [All Time]       │
│                                                                              │
├─────────────────────────────────┬───────────────────────────────────────────┤
│                                 │                                            │
│   RISK LEVEL DISTRIBUTION       │   AUTHENTICATION OUTCOMES                  │
│   (Pie Chart)                   │   (Pie Chart)                              │
│                                 │                                            │
│      ┌─────────────┐            │      ┌─────────────┐                       │
│      │   ██████    │            │      │   ██████    │                       │
│      │ ██    ██    │            │      │ ██    ██    │                       │
│      │██      ██   │            │      │██      ██   │                       │
│      │ ██    ██    │            │      │ ██    ██    │                       │
│      │   ██████    │            │      │   ██████    │                       │
│      └─────────────┘            │      └─────────────┘                       │
│                                 │                                            │
│   ● LOW: 275 (55%)              │   ● ALLOW: 275 (55%)                       │
│   ● MEDIUM: 140 (28%)           │   ● CHALLENGE: 140 (28%)                   │
│   ● HIGH: 85 (17%)              │   ● BLOCK: 85 (17%)                        │
│                                 │                                            │
├─────────────────────────────────┴───────────────────────────────────────────┤
│                                                                              │
│   ATTEMPTS OVER TIME (Line Chart - Last 7 Days)                             │
│                                                                              │
│   100 ┤                                     ╭──╮                             │
│    80 ┤              ╭─╮                   ╱    ╲                            │
│    60 ┤     ╭──╮    ╱   ╲    ╭─╮         ╱      ╲                           │
│    40 ┤    ╱    ╲  ╱     ╲  ╱   ╲   ╭──╱        ╲──╮                        │
│    20 ┤───╱      ╲╱       ╲╱     ╲─╱              ╲──                        │
│     0 ┼────────────────────────────────────────────────                     │
│        Mon    Tue    Wed    Thu    Fri    Sat    Sun                         │
│                                                                              │
│   ── Total Attempts   ── Blocked   ── Challenged                            │
│                                                                              │
├─────────────────────────────────┬───────────────────────────────────────────┤
│                                 │                                            │
│   SCENARIO BREAKDOWN            │   TOP LOCATIONS                            │
│   (Horizontal Bar Chart)        │   (Horizontal Bar Chart)                   │
│                                 │                                            │
│   Normal Login     ████████ 275 │   Riyadh, SA     █████████████████ 320    │
│   Unusual Device   ███░░░░░  75 │   Jeddah, SA     ████████░░░░░░░░  120    │
│   Suspicious Time  ██░░░░░░  40 │   Dammam, SA     ███░░░░░░░░░░░░░   45    │
│   Location Anomaly ██░░░░░░  35 │   Dubai, UAE     ██░░░░░░░░░░░░░░   25    │
│   Rapid Login      █░░░░░░░  25 │   Sao Paulo, BR  █░░░░░░░░░░░░░░░   10    │
│   Behavioral Dev.  █░░░░░░░  25 │                                            │
│   Cont. Monitoring █░░░░░░░  25 │                                            │
│                                 │                                            │
├─────────────────────────────────┴───────────────────────────────────────────┤
│                                                                              │
│   KEY METRICS (Summary Cards)                                                │
│                                                                              │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│   │     500      │  │    17%       │  │   285ms      │  │     85       │   │
│   │ Total        │  │ Block Rate   │  │ Avg Process  │  │ Blocked      │   │
│   │ Attempts     │  │              │  │ Time         │  │ Today        │   │
│   └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Chart 1: Risk Level Distribution (Pie Chart)**
- Shows count and percentage of LOW/MEDIUM/HIGH
- Colors: LOW=#22C55E, MEDIUM=#F59E0B, HIGH=#EF4444
- Use Recharts PieChart component

**Chart 2: Authentication Outcomes (Pie Chart)**
- Groups actions into categories:
  - ALLOW → "Allowed" (green)
  - CHALLENGE_* → "Challenged" (yellow)
  - BLOCK, BLOCK_RAPID → "Blocked" (red)
  - RE_AUTH → "Re-authenticated" (blue)

**Chart 3: Attempts Over Time (Line Chart)**
- X-axis: Days of the week or dates
- Y-axis: Count of attempts
- Multiple lines: Total, Blocked, Challenged
- Use Recharts LineChart component

**Chart 4: Scenario Breakdown (Horizontal Bar Chart)**
- Shows count for each of the 7 scenarios
- Bars colored by risk level
- Use Recharts BarChart component (layout="vertical")

**Chart 5: Top Locations (Horizontal Bar Chart)**
- Shows count by location_city
- Top 5-10 locations
- Anomalous locations (Brazil, etc.) highlighted in red

**Summary Cards (Bottom Row):**
- 4 cards showing key metrics
- Each card: Large number, small label below
- Calculate from query results

**Data Source:**
- Query `authentication_attempts` table
- Filter by selected time period
- Aggregate using SQL GROUP BY
- Refresh data every 30 seconds or on page focus

---

### Page 4: Decision Engine (MERGE Architecture + Storyboards)

**Purpose:** Explain how the AI decision engine works.

**Action:** Combine the existing Architecture component and Storyboards component into a single page with tabs.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DECISION ENGINE                                    │
│                                                                              │
│   [Architecture]  [Decision Flow]                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   (Content from existing Architecture.tsx OR Storyboards.tsx                │
│    depending on which tab is selected)                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

- Tab 1 "Architecture": Render existing Architecture component (4-layer funnel diagram)
- Tab 2 "Decision Flow": Render existing Storyboards component (visual decision panels)

No new content needed - just reorganize existing components.

---

### Page 5: Risk Policies (NEW)

**Purpose:** Display the 7 authentication scenarios and their configured thresholds.

**Layout:** Cards grid showing each scenario

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            RISK POLICIES                                     │
│                                                                              │
│   These policies define how YAQITH Sentinel responds to different           │
│   authentication scenarios. Policies are read-only in this demo.            │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────────────────┐  ┌─────────────────────────┐                  │
│   │ SCENARIO 1              │  │ SCENARIO 2              │                  │
│   │ Normal Login        LOW │  │ Unusual Device    MEDIUM│                  │
│   ├─────────────────────────┤  ├─────────────────────────┤                  │
│   │ Trigger:                │  │ Trigger:                │                  │
│   │ Known device, normal    │  │ Login from new device   │                  │
│   │ time, familiar location │  │ but known location      │                  │
│   ├─────────────────────────┤  ├─────────────────────────┤                  │
│   │ Action: ALLOW           │  │ Action: CHALLENGE_OTP   │                  │
│   │ Risk Score: 0.15        │  │ Risk Score: 0.45        │                  │
│   │                         │  │                         │                  │
│   │ ✓ Device Match          │  │ ✗ Device Match          │                  │
│   │ ✓ Location Match        │  │ ✓ Location Match        │                  │
│   │ ✓ Behavior Match        │  │ ✓ Behavior Match        │                  │
│   │ ✓ Time Normal           │  │ ✓ Time Normal           │                  │
│   └─────────────────────────┘  └─────────────────────────┘                  │
│                                                                              │
│   ┌─────────────────────────┐  ┌─────────────────────────┐                  │
│   │ SCENARIO 3              │  │ SCENARIO 4              │                  │
│   │ Suspicious Time   MEDIUM│  │ Location Anomaly   HIGH │                  │
│   ├─────────────────────────┤  ├─────────────────────────┤                  │
│   │ Trigger:                │  │ Trigger:                │                  │
│   │ Login at unusual hour   │  │ Login from unexpected   │                  │
│   │ (e.g., 3 AM)            │  │ country (geo violation) │                  │
│   ├─────────────────────────┤  ├─────────────────────────┤                  │
│   │ Action: CHALLENGE_      │  │ Action: BLOCK           │                  │
│   │         CONFIRMATION    │  │ Risk Score: 0.85        │                  │
│   │ Risk Score: 0.50        │  │                         │                  │
│   │                         │  │ ✓ Device Unknown        │                  │
│   │ ✓ Device Match          │  │ ✗ Location Match        │                  │
│   │ ✓ Location Match        │  │ ✗ Geo Velocity OK       │                  │
│   │ ✓ Behavior Match        │  │ ⚠ BLOCKED               │                  │
│   │ ✗ Time Normal           │  │                         │                  │
│   └─────────────────────────┘  └─────────────────────────┘                  │
│                                                                              │
│   (Continue for scenarios 5, 6, 9...)                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Each scenario card shows:**
- Scenario number and name
- Risk level badge (colored)
- Trigger description
- Expected action
- Typical risk score
- Checklist of what's matched/violated

**Data Source:** Static data from the SCENARIOS constant (can copy from User App constants.ts or define locally)

**Styling:**
- Cards with white background, subtle shadow
- Risk badge colors match standard (green/yellow/red)
- 2-3 cards per row depending on screen width
- Read-only display (no edit buttons)

---

### Page 6: Biometrics Lab (KEEP EXISTING)

**Action:** Keep the existing BiometricsDemo.tsx component exactly as-is.

This page shows an interactive demo of behavioral biometrics (typing patterns, mouse movements). It is educational content for the hackathon assessors.

---

### Page 7: ZKP Visualizer (KEEP EXISTING)

**Action:** Keep the existing ZKPLogin.tsx component exactly as-is.

This page explains zero-knowledge proof authentication concepts. It is educational content for the hackathon assessors.

---

### Page 8: Technical Specs (MOVE TO HELP SECTION)

**Action:** Move the existing TechnicalSpecs.tsx component to the Help section of the sidebar.

No content changes needed - just move its location in the navigation.

---

### Page 9: About YAQITH (KEEP/CREATE)

**Purpose:** Show information about the project, team, and hackathon context.

If this page already exists, keep it. If not, create a simple page with:
- Project name and tagline
- Brief description
- Team members (if known)
- Hackathon context
- Saudi Vision 2030 reference

---

### Components to DELETE

**Delete these files:**
- `VeoGenerator.tsx` (or similar video-related component)
- Any other Veo/video-related files

**Why:** The video generation feature is not relevant to the core demo and adds unnecessary complexity.

---

### Sidebar Implementation Details

**Sidebar Width:** 280px fixed

**Styling:**
- Background: White or very light gray
- Border-right: 1px solid #E2E8F0
- Section headers: Uppercase, small, gray text, letter-spacing
- Menu items: Padding, hover state (light gray background), active state (green left border + green text)

**Active State:**
- Left border: 3px solid #006C5B (Absher Green)
- Text color: #006C5B
- Background: Very light green tint

**Logout Button:**
- Position: Bottom of sidebar
- Style: Gray text, hover red
- Icon: LogOut from Lucide

---

### Color Reference for Admin App

| Element | Color | Hex |
|---------|-------|-----|
| Sidebar background | White | #FFFFFF |
| Sidebar border | Slate 200 | #E2E8F0 |
| Active menu item | Absher Green | #006C5B |
| Section headers | Slate 400 | #94A3B8 |
| Card background | White | #FFFFFF |
| Page background | Slate 50 | #F8FAFC |
| LOW risk | Green | #22C55E |
| MEDIUM risk | Yellow/Amber | #F59E0B |
| HIGH risk | Red | #EF4444 |
| AI Inspector background | Slate 900 | #0F172A |
| System log text | Green | #22C55E |

---

## 8. Phase 4: Data Seeding

### Why Seed Data?

The Admin App dashboards need historical data to display:

- Charts showing trends over time
- Distribution of risk levels
- Scenario frequency

Without seeded data, the dashboards would be empty on first load.

### Seeding Requirements

Create ~500 records with this distribution:

| Scenario              | Percentage | Count | Risk   |
| --------------------- | ---------- | ----- | ------ |
| Normal Login          | 55%        | ~275  | LOW    |
| Unusual Device        | 15%        | ~75   | MEDIUM |
| Suspicious Time       | 8%         | ~40   | MEDIUM |
| Location Anomaly      | 7%         | ~35   | HIGH   |
| Rapid Login           | 5%         | ~25   | HIGH   |
| Behavioral Deviation  | 5%         | ~25   | HIGH   |
| Continuous Monitoring | 5%         | ~25   | MEDIUM |

### Seeded Record Requirements

All seeded records must have:

- `status: 'completed'` (already processed)
- `source_tab: 'seed'` (to distinguish from real attempts)
- All DECISION fields filled in (risk_level, risk_score, action_taken)
- `processed_at` timestamps distributed over past 7 days
- `processing_time_ms` realistic values (150-500ms)

### Time Distribution

- Records distributed over past 7 days
- More activity during 8 AM - 10 PM Saudi time
- Fewer at night (except Scenario 3 - Suspicious Time, which should be at night)

### Geographic Distribution

- 85% Saudi Arabia (Riyadh, Jeddah, Dammam, Mecca)
- 10% Gulf countries (UAE, Bahrain, Kuwait)
- 5% Anomalous (Brazil, Russia, proxy IPs)

---

## 9. Testing Requirements

### Authentication Tests

1. Both apps show login page when not authenticated
2. Can log in with: `yaqith` / `Yaqith@SaudiArabia`
3. After login, main app content is visible
4. Logout button works and returns to login page
5. Session persists across page refresh

### User App Tests

1. Simulation tab: Select scenario → Click Sign In → Record created in Supabase
2. Live tab: Click Sign In → Random scenario selected → Record created
3. Both tabs: Animation plays correctly
4. Record has correct `source_tab` value

### Admin App Tests

1. Live Monitor: Shows seeded historical data
2. Live Monitor: New records appear in real-time when User App creates them
3. Live Monitor: Auto-selects new `pending` records
4. Live Monitor: Updates when record changes to `completed`
5. Threat Analytics: Charts display correctly with seeded data
6. All sidebar navigation works

### Cross-App Integration Tests

1. Open User App and Admin App side by side
2. In User App Simulation tab, select "Location Anomaly", click Sign In
3. In Admin App Live Monitor, see new row appear with "Analyzing..."
4. After n8n processes (or simulate by manually updating record), see final decision

---

## 10. File Reference

### Files to Create

**User App:**

```
src/
├── lib/
│   └── supabase.ts              # Supabase client
├── components/
│   ├── LoginPage.tsx            # Enterprise login UI
│   ├── AuthGate.tsx             # Auth wrapper
│   └── LiveTab.tsx              # New Live tab
└── services/
    └── supabaseService.ts       # Database operations
```

**Admin App:**

```
src/
├── lib/
│   └── supabase.ts              # Supabase client
├── components/
│   ├── LoginPage.tsx            # Enterprise login UI
│   ├── AuthGate.tsx             # Auth wrapper
│   ├── LiveMonitor.tsx          # Real-time feed + AI Inspector
│   ├── ThreatAnalytics.tsx      # Charts and graphs
│   └── SessionInspector.tsx     # Detailed view
└── services/
    └── supabaseService.ts       # Database operations
```

### Files to Modify

**User App:**

- `App.tsx` - Wrap with AuthGate, add third tab
- `.env` - Add Supabase credentials
- `package.json` - Add @supabase/supabase-js

**Admin App:**

- `App.tsx` - Wrap with AuthGate, update sidebar structure
- `.env` - Add Supabase credentials

### Files to Remove

**Admin App:**

- `components/VeoGenerator.tsx` (or similar video-related file)

### Files to Keep Unchanged

**User App:**

- `constants.ts` - All scenario definitions (reference only)
- `types.ts` - TypeScript types (may extend)

**Admin App:**

- `components/BiometricsDemo.tsx` - Keep as-is
- `components/ZKPLogin.tsx` - Keep as-is

---

## Implementation Order

Execute phases in this order:

1. **Phase 0**: Authentication (both apps)
2. **Phase 1**: Database (Supabase)
3. **Phase 4**: Data seeding (run after table created)
4. **Phase 2**: User App changes
5. **Phase 3**: Admin App changes
6. **Testing**: Full integration tests

---

## Related Documents

- `n8n.md` - Workflow integration specification (for external n8n team)

---

**End of Implementation Plan**
