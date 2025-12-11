# YAQITH Sentinel - n8n Workflow Integration

**Document Version:** 1.0
**Created:** 2025-12-10
**Status:** Draft
**Purpose:** Detailed specification for n8n AI workflow that processes authentication attempts

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [Workflow Design](#3-workflow-design)
4. [Decision Logic](#4-decision-logic)
5. [Database Integration](#5-database-integration)
6. [Expected Latency](#6-expected-latency)
7. [JSON Workflow Export](#7-json-workflow-export)

---

## 1. Overview

### Purpose

The n8n workflow acts as the **AI Decision Engine** for YAQITH Sentinel. It:

1. Monitors the `authentication_attempts` table for new records with `status = 'pending'`
2. Analyzes the telemetry data (device, location, behavior, time)
3. Calculates a risk score and determines the appropriate action
4. Updates the record with the decision fields

### Why n8n?

- **External Processing**: The decision logic is NOT hardcoded in the frontend
- **AI Integration**: Can connect to LLM APIs (OpenAI, Claude) for advanced analysis
- **Flexibility**: Rules can be adjusted without code deployment
- **Audit Trail**: All decisions are logged with factors and timestamps

---

## 2. Architecture

### Data Flow

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   USER APP       │    │   SUPABASE       │    │   n8n WORKFLOW   │
│                  │    │                  │    │                  │
│  User clicks     │    │                  │    │                  │
│  "Sign In"       │    │                  │    │                  │
│       │          │    │                  │    │                  │
│       ▼          │    │                  │    │                  │
│  INSERT record   │───▶│  auth_attempts   │    │                  │
│  status='pending'│    │  (new row)       │    │                  │
│                  │    │       │          │    │                  │
│                  │    │       ▼          │    │                  │
│                  │    │  Webhook/Poll ───────▶│  TRIGGER         │
│                  │    │                  │    │       │          │
│                  │    │                  │    │       ▼          │
│                  │    │                  │    │  FETCH record    │
│                  │    │                  │    │       │          │
│                  │    │                  │    │       ▼          │
│                  │    │                  │    │  ANALYZE context │
│                  │    │                  │    │       │          │
│                  │    │                  │    │       ▼          │
│                  │    │                  │    │  DECIDE action   │
│                  │    │                  │    │       │          │
│                  │    │                  │◀───────────┘          │
│                  │    │  UPDATE record   │    │  UPDATE with     │
│                  │    │  status='done'   │    │  decision fields │
│                  │    │                  │    │                  │
└──────────────────┘    └──────────────────┘    └──────────────────┘
```

### Integration Points

| Component | Connection Method | Details |
|-----------|-------------------|---------|
| Supabase (Read) | HTTP Request / Supabase Node | Poll for `status = 'pending'` |
| Supabase (Write) | HTTP Request / Supabase Node | Update decision fields |
| AI/LLM (Optional) | OpenAI Node / HTTP Request | Advanced risk analysis |

---

## 3. Workflow Design

### Workflow Nodes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           n8n WORKFLOW: Risk Assessment                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │  TRIGGER    │───▶│   FETCH     │───▶│  ANALYZE    │───▶│   UPDATE    │   │
│  │  (Schedule) │    │   Record    │    │   & DECIDE  │    │   Record    │   │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘   │
│        │                  │                  │                  │            │
│        ▼                  ▼                  ▼                  ▼            │
│   Every 2 sec        GET where          Calculate:         UPDATE SET:       │
│   OR Webhook         status=            - risk_score       - risk_level      │
│                      'pending'          - risk_level       - risk_score      │
│                                         - action           - action_taken    │
│                                         - factors          - decision_factors│
│                                                            - status          │
│                                                            - processed_at    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Node Details

#### Node 1: Trigger (Schedule or Webhook)

**Option A: Schedule Trigger (Polling)**
- Interval: Every 2 seconds
- Simpler setup, slight delay

**Option B: Webhook Trigger**
- Supabase Database Webhook on INSERT
- Real-time, requires Supabase webhook configuration

#### Node 2: Fetch Pending Records

```
HTTP Request to Supabase REST API:
GET /rest/v1/authentication_attempts?status=eq.pending&order=created_at.asc&limit=1

Headers:
- apikey: <SUPABASE_ANON_KEY>
- Authorization: Bearer <SUPABASE_ANON_KEY>
```

#### Node 3: Analyze & Decide (Code Node)

See Section 4 for full decision logic.

#### Node 4: Update Record

```
HTTP Request to Supabase REST API:
PATCH /rest/v1/authentication_attempts?id=eq.<record_id>

Body:
{
  "status": "completed",
  "risk_level": "<calculated>",
  "risk_score": <calculated>,
  "action_taken": "<calculated>",
  "ai_analysis": "<generated>",
  "outcome_description": "<generated>",
  "decision_factors": <json_array>,
  "processed_at": "<now>",
  "processing_time_ms": <elapsed>
}

Headers:
- apikey: <SUPABASE_ANON_KEY>
- Authorization: Bearer <SUPABASE_ANON_KEY>
- Content-Type: application/json
- Prefer: return=minimal
```

---

## 4. Decision Logic

### Risk Score Calculation

```javascript
// n8n Code Node: Risk Analysis

function analyzeRisk(attempt) {
  const startTime = Date.now();
  let riskScore = 0;
  let factors = [];

  // =============================================
  // FACTOR 1: Device Trust (Weight: 0.20)
  // =============================================
  if (attempt.device_trusted === false) {
    riskScore += 0.20;
    factors.push({
      factor: 'device_fingerprint',
      status: 'untrusted',
      weight: 0.20,
      detail: `Device "${attempt.device_type}" not in trusted list`
    });
  } else {
    factors.push({
      factor: 'device_fingerprint',
      status: 'trusted',
      weight: 0.00,
      detail: `Device "${attempt.device_type}" is trusted`
    });
  }

  // =============================================
  // FACTOR 2: Geographic Anomaly (Weight: 0.40)
  // =============================================
  if (attempt.geo_anomaly === true) {
    riskScore += 0.40;
    factors.push({
      factor: 'geo_location',
      status: 'anomaly',
      weight: 0.40,
      detail: `Location "${attempt.location_city}, ${attempt.ip_country}" outside normal region`
    });
  } else if (attempt.geo_velocity_violation === true) {
    riskScore += 0.35;
    factors.push({
      factor: 'geo_velocity',
      status: 'violation',
      weight: 0.35,
      detail: `Impossible travel detected: ${attempt.location_raw}`
    });
  } else {
    factors.push({
      factor: 'geo_location',
      status: 'normal',
      weight: 0.00,
      detail: `Location "${attempt.location_city}" is expected`
    });
  }

  // =============================================
  // FACTOR 3: Time Anomaly (Weight: 0.15)
  // =============================================
  if (attempt.time_anomaly === true) {
    riskScore += 0.15;
    factors.push({
      factor: 'time_context',
      status: 'unusual',
      weight: 0.15,
      detail: `Login at ${attempt.login_time} is outside normal hours`
    });
  } else {
    factors.push({
      factor: 'time_context',
      status: 'normal',
      weight: 0.00,
      detail: `Login time ${attempt.login_time} is typical`
    });
  }

  // =============================================
  // FACTOR 4: Behavioral Match (Weight: 0.30)
  // =============================================
  const behaviorScore = parseFloat(attempt.behavior_score) || 0;

  if (attempt.behavior_anomaly === true || behaviorScore < 0.50) {
    const behaviorPenalty = 0.30 * (1 - behaviorScore);
    riskScore += behaviorPenalty;
    factors.push({
      factor: 'behavior_pattern',
      status: 'mismatch',
      weight: parseFloat(behaviorPenalty.toFixed(2)),
      detail: `Behavioral match ${(behaviorScore * 100).toFixed(0)}% - below threshold`
    });
  } else {
    factors.push({
      factor: 'behavior_pattern',
      status: 'match',
      weight: 0.00,
      detail: `Behavioral match ${(behaviorScore * 100).toFixed(0)}% - within normal range`
    });
  }

  // =============================================
  // FACTOR 5: Brute Force Detection (Override)
  // =============================================
  if (attempt.is_brute_force === true) {
    riskScore = 1.0; // Maximum risk
    factors.push({
      factor: 'brute_force',
      status: 'detected',
      weight: 1.00,
      detail: 'Multiple rapid login attempts detected - bot pattern'
    });
  }

  // =============================================
  // CALCULATE FINAL RISK LEVEL
  // =============================================
  riskScore = Math.min(1.0, Math.max(0.0, riskScore)); // Clamp 0-1

  let riskLevel;
  if (riskScore < 0.40) {
    riskLevel = 'LOW';
  } else if (riskScore < 0.70) {
    riskLevel = 'MEDIUM';
  } else {
    riskLevel = 'HIGH';
  }

  // =============================================
  // DETERMINE ACTION
  // =============================================
  let action;
  let aiAnalysis;
  let outcome;

  if (attempt.is_brute_force === true) {
    action = 'BLOCK_RAPID';
    aiAnalysis = 'Brute force attack pattern detected. Multiple failed attempts from rotating IPs.';
    outcome = 'Attack mitigated. IP range flagged for monitoring.';
  } else if (attempt.geo_anomaly === true) {
    action = 'BLOCK';
    aiAnalysis = 'Geo-velocity violation detected. Login attempt from unexpected country.';
    outcome = 'Fraud prevented. Access denied. User notified via registered email.';
  } else if (attempt.behavior_anomaly === true) {
    action = 'CHALLENGE_BIOMETRIC';
    aiAnalysis = 'Behavioral deviation detected. Typing/navigation patterns do not match profile.';
    outcome = 'Biometric verification required. Session suspended pending FaceID confirmation.';
  } else if (attempt.is_mid_session === true || attempt.geo_velocity_violation === true) {
    action = 'RE_AUTH';
    aiAnalysis = 'Session anomaly detected. Possible token hijacking or location jump mid-session.';
    outcome = 'Re-authentication required. User prompted to verify identity.';
  } else if (attempt.time_anomaly === true) {
    action = 'CHALLENGE_CONFIRMATION';
    aiAnalysis = 'Unusual login time detected. All other signals normal.';
    outcome = 'Confirmation prompt sent. User verified identity successfully.';
  } else if (attempt.device_trusted === false) {
    action = 'CHALLENGE_OTP';
    aiAnalysis = 'New device detected. Location and behavior patterns match profile.';
    outcome = 'OTP verification completed. Device added to trusted list.';
  } else {
    action = 'ALLOW';
    aiAnalysis = 'All signals normal. Device, location, time, and behavior match historical profile.';
    outcome = 'Seamless login. No additional verification required.';
  }

  const processingTime = Date.now() - startTime;

  return {
    risk_level: riskLevel,
    risk_score: parseFloat(riskScore.toFixed(2)),
    action_taken: action,
    ai_analysis: aiAnalysis,
    outcome_description: outcome,
    decision_factors: factors,
    status: action.startsWith('BLOCK') ? 'blocked' : 'completed',
    processed_at: new Date().toISOString(),
    processing_time_ms: processingTime
  };
}

// Execute
const attempt = $input.first().json;
const decision = analyzeRisk(attempt);
return { json: { ...attempt, ...decision } };
```

### Action Mapping by Scenario

| Scenario | Expected Risk Level | Expected Action |
|----------|---------------------|-----------------|
| 1 - Normal Login | LOW | ALLOW |
| 2 - Unusual Device | MEDIUM | CHALLENGE_OTP |
| 3 - Suspicious Time | MEDIUM | CHALLENGE_CONFIRMATION |
| 4 - Location Anomaly | HIGH | BLOCK |
| 5 - Rapid Login | HIGH | BLOCK_RAPID |
| 6 - Behavioral Deviation | HIGH | CHALLENGE_BIOMETRIC |
| 9 - Continuous Monitoring | MEDIUM | RE_AUTH |

---

## 5. Database Integration

### Supabase Configuration

**Project URL:** `https://cjbmavpjfdnetpumjhgb.supabase.co`
**Table:** `authentication_attempts`

### Required Environment Variables (n8n)

```
SUPABASE_URL=https://cjbmavpjfdnetpumjhgb.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
```

### Query: Fetch Pending Records

```sql
SELECT * FROM authentication_attempts
WHERE status = 'pending'
ORDER BY created_at ASC
LIMIT 1;
```

### Query: Update with Decision

```sql
UPDATE authentication_attempts
SET
  status = $status,
  risk_level = $risk_level,
  risk_score = $risk_score,
  action_taken = $action_taken,
  ai_analysis = $ai_analysis,
  outcome_description = $outcome_description,
  decision_factors = $decision_factors,
  processed_at = $processed_at,
  processing_time_ms = $processing_time_ms
WHERE id = $id;
```

---

## 6. Expected Latency

| Stage | Expected Time |
|-------|---------------|
| User App → Supabase INSERT | 50-100ms |
| n8n detects new record (polling) | 0-2000ms |
| n8n detects new record (webhook) | 50-100ms |
| n8n Code Node execution | 10-50ms |
| n8n → Supabase UPDATE | 50-100ms |
| Supabase → Admin App (realtime) | 50ms |
| **Total (polling)** | **200ms - 2500ms** |
| **Total (webhook)** | **200ms - 500ms** |

### Optimization: Use Webhook for Real-Time

For the demo, configure Supabase Database Webhook:
1. Go to Supabase Dashboard → Database → Webhooks
2. Create webhook on `authentication_attempts` table
3. Trigger on INSERT
4. POST to n8n webhook URL

---

## 7. JSON Workflow Export

> **TODO:** This section will contain the complete n8n workflow JSON for import.
>
> The JSON will be generated after:
> 1. Creating the workflow in n8n
> 2. Testing the complete flow
> 3. Exporting via n8n's "Download" feature

### Placeholder Structure

```json
{
  "name": "YAQITH Sentinel - Risk Assessment",
  "nodes": [
    {
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "parameters": {
        "rule": {
          "interval": [{ "field": "seconds", "secondsInterval": 2 }]
        }
      }
    },
    {
      "name": "Fetch Pending",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "GET",
        "url": "={{ $env.SUPABASE_URL }}/rest/v1/authentication_attempts",
        "qs": {
          "status": "eq.pending",
          "order": "created_at.asc",
          "limit": "1"
        },
        "headers": {
          "apikey": "={{ $env.SUPABASE_ANON_KEY }}",
          "Authorization": "=Bearer {{ $env.SUPABASE_ANON_KEY }}"
        }
      }
    },
    {
      "name": "Risk Analysis",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// See Section 4 for full code"
      }
    },
    {
      "name": "Update Record",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "PATCH",
        "url": "={{ $env.SUPABASE_URL }}/rest/v1/authentication_attempts",
        "qs": {
          "id": "=eq.{{ $json.id }}"
        },
        "body": "={{ JSON.stringify($json) }}",
        "headers": {
          "apikey": "={{ $env.SUPABASE_ANON_KEY }}",
          "Authorization": "=Bearer {{ $env.SUPABASE_ANON_KEY }}",
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        }
      }
    }
  ],
  "connections": {
    "Schedule Trigger": { "main": [[{ "node": "Fetch Pending", "type": "main", "index": 0 }]] },
    "Fetch Pending": { "main": [[{ "node": "Risk Analysis", "type": "main", "index": 0 }]] },
    "Risk Analysis": { "main": [[{ "node": "Update Record", "type": "main", "index": 0 }]] }
  }
}
```

---

## Next Steps

1. [ ] Set up n8n instance (cloud or self-hosted)
2. [ ] Configure Supabase credentials in n8n
3. [ ] Import/create the workflow
4. [ ] Test with manual inserts to `authentication_attempts`
5. [ ] Configure Supabase webhook for real-time triggering (optional)
6. [ ] Export final JSON workflow for documentation

---

**Document Status:** Draft - Pending n8n Implementation

**Related Documents:**
- `plan.md` - Main implementation plan
- `SOLUTION_ARCHITECTURE.md` - Original architecture reference
