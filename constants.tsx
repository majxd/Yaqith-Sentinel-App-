import { RiskLevel, Scenario, ScenarioType, Storyboard } from './types';

export const SCENARIOS: Record<ScenarioType, Scenario> = {
  [ScenarioType.NORMAL_LOGIN]: {
    id: ScenarioType.NORMAL_LOGIN,
    label: 'Normal Login (Seamless)',
    description: 'Ahmed logs in from home Wi-Fi in Riyadh using his personal iPhone.',
    riskLevel: RiskLevel.LOW,
    riskScore: 0.05,
    details: {
      trigger: 'Valid Credentials + Trusted Context.',
      understanding: 'Digital DNA matches baseline (Device + Location + Time).',
      action: 'Grant Silent Access',
      outcome: 'Frictionless Experience.',
    },
    telemetry: {
      deviceType: 'iPhone 13 (Trusted)',
      ipCountry: 'Saudi Arabia (Home ISP)',
      timestamp: '20:00:00',
      behaviorScore: 0.99,
    },
  },
  [ScenarioType.NEW_DEVICE]: {
    id: ScenarioType.NEW_DEVICE,
    label: 'Traveler (Step-Up Auth)',
    description: 'Sara logs in from a hotel Wi-Fi in London using her usual laptop.',
    riskLevel: RiskLevel.MEDIUM,
    riskScore: 0.60,
    details: {
      trigger: 'New IP + Geo-velocity Anomaly.',
      understanding: 'Device is trusted, but location context has changed.',
      action: 'Trigger Step-Up (FaceID)',
      outcome: 'Access Granted after Verification.',
    },
    telemetry: {
      deviceType: 'MacBook Air (Trusted)',
      ipCountry: 'United Kingdom (Hotel)',
      timestamp: '09:15:00',
      behaviorScore: 0.92,
    },
  },
  [ScenarioType.SUSPICIOUS_TIME]: {
    id: ScenarioType.SUSPICIOUS_TIME,
    label: 'Unusual Time (Context Check)',
    description: 'User attempts login at 3:00 AM, deviating from their standard pattern.',
    riskLevel: RiskLevel.MEDIUM,
    riskScore: 0.45,
    details: {
      trigger: 'Temporal Anomaly detected.',
      understanding: 'Weak signal deviation; device and location remain trusted.',
      action: 'Trigger Simple OTP',
      outcome: 'Identity Confirmed.',
    },
    telemetry: {
      deviceType: 'iPhone 13 (Trusted)',
      ipCountry: 'Saudi Arabia',
      timestamp: '03:12:00',
      behaviorScore: 0.95,
    },
  },
  [ScenarioType.LOCATION_ANOMALY]: {
    id: ScenarioType.LOCATION_ANOMALY,
    label: 'Impossible Travel (Block)',
    description: 'Login attempt from Brazil 1 hour after a login in Riyadh.',
    riskLevel: RiskLevel.HIGH,
    riskScore: 0.92,
    details: {
      trigger: 'Geo-velocity Violation.',
      understanding: 'Physically impossible travel speed detected.',
      action: 'Hard Block',
      outcome: 'Account Locked & User Notified.',
    },
    telemetry: {
      deviceType: 'Android (Generic)',
      ipCountry: 'Brazil (Proxy)',
      timestamp: '21:00:00',
      behaviorScore: 0.20,
    },
  },
  [ScenarioType.RAPID_LOGIN]: {
    id: ScenarioType.RAPID_LOGIN,
    label: 'Brute Force (Attack)',
    description: 'Multiple failed attempts in quick succession from rotating IPs.',
    riskLevel: RiskLevel.HIGH,
    riskScore: 0.98,
    details: {
      trigger: 'High Frequency Requests.',
      understanding: 'Pattern matches known botnet signatures.',
      action: 'Block IP Range',
      outcome: 'Attack Mitigated.',
    },
    telemetry: {
      deviceType: 'Headless Browser',
      ipCountry: 'Tor Exit Node',
      timestamp: '11:00:05',
      behaviorScore: 0.05,
    },
  },
  [ScenarioType.BEHAVIORAL_DEVIATION]: {
    id: ScenarioType.BEHAVIORAL_DEVIATION,
    label: 'The Imposter (Behavioral)',
    description: 'Correct password, but detected BlueStacks emulator and perfect 0ms flight-time keystrokes.',
    riskLevel: RiskLevel.HIGH,
    riskScore: 0.95,
    details: {
      trigger: 'Biometric + Env Mismatch.',
      understanding: 'Robotic keystroke dynamics (0 variance) and linear mouse path.',
      action: 'Hard Block / Freeze',
      outcome: 'SMS Alert Sent: "Suspicious Login Blocked"',
    },
    telemetry: {
      deviceType: 'PC (BlueStacks Emulator)',
      ipCountry: 'Saudi Arabia',
      timestamp: '16:20:00',
      behaviorScore: 0.05,
    },
  },
  [ScenarioType.CONTINUOUS_MONITORING]: {
    id: ScenarioType.CONTINUOUS_MONITORING,
    label: 'Session Hijack (Mid-Session)',
    description: 'Session cookie stolen; user context changes mid-session.',
    riskLevel: RiskLevel.HIGH,
    riskScore: 0.78,
    details: {
      trigger: 'Token/IP Context Switch.',
      understanding: 'Session integrity compromised after initial auth.',
      action: 'Terminate Session',
      outcome: 'Re-authentication Required.',
    },
    telemetry: {
      deviceType: 'iPhone 13',
      ipCountry: 'Unknown',
      timestamp: '14:45:00',
      behaviorScore: 0.40,
    },
  },
};

export const STORYBOARDS: Storyboard[] = [
  {
    id: 'SB_NEW_DEVICE',
    title: 'Scenario: The Traveler (Context Aware)',
    riskLevel: RiskLevel.MEDIUM,
    panels: [
      {
        step: 1,
        title: 'Layer 1: Trigger',
        iconType: 'laptop',
        visualLabel: 'London IP',
        description: 'Sara logs in from a London hotel. The system sees a trusted device but a new location.',
        technicalNote: 'Telemetry: DeviceID=Match, IP=New'
      },
      {
        step: 2,
        title: 'Layer 2: AI Analysis',
        iconType: 'scan',
        visualLabel: 'Risk Score: 0.60',
        description: 'The Interceptor calculates risk. Location difference triggers a "Caution" state, but device trust lowers the severity.',
        technicalNote: 'Rule: Trusted Device + New Geo'
      },
      {
        step: 3,
        title: 'Layer 3: Decision',
        iconType: 'shield_check',
        visualLabel: 'Step-Up Auth',
        description: 'Traffic Light: YELLOW. The system challenges Sara with FaceID to prove her identity.',
        technicalNote: 'Policy: Adaptive Step-Up'
      }
    ]
  },
  {
    id: 'SB_IMPOSTER',
    title: 'Scenario: The Imposter (Attack)',
    riskLevel: RiskLevel.HIGH,
    panels: [
      {
        step: 1,
        title: 'Layer 1: Trigger',
        iconType: 'cursor',
        visualLabel: 'Bot Behavior',
        description: 'Hacker uses a stolen password on a BlueStacks emulator. Typing is superhuman (0ms flight time) and mouse moves in straight lines.',
        technicalNote: 'Telemetry: Linearity=0.99, FlightVar=0'
      },
      {
        step: 2,
        title: 'Layer 2: AI Analysis',
        iconType: 'alert',
        visualLabel: 'Risk Score: 0.95',
        description: 'Behavioral Unit detects non-human input patterns and emulated environment signatures.',
        technicalNote: 'ML Model: Bot Probability > 95%'
      },
      {
        step: 3,
        title: 'Layer 3: Decision',
        iconType: 'block',
        visualLabel: 'Hard Block',
        description: 'Traffic Light: RED. Access denied instantly. SMS sent to real user: "Suspicious login attempt blocked."',
        technicalNote: 'Policy: Auto-Block & Notify'
      }
    ]
  },
  {
    id: 'SB_SEAMLESS',
    title: 'Scenario: Happy Path (Seamless)',
    riskLevel: RiskLevel.LOW,
    panels: [
      {
        step: 1,
        title: 'Layer 1: Trigger',
        iconType: 'smartphone',
        visualLabel: 'Home Context',
        description: 'Ahmed logs in from his couch in Riyadh using his personal iPhone.',
        technicalNote: 'Telemetry: All Signals Match'
      },
      {
        step: 2,
        title: 'Layer 2: AI Analysis',
        iconType: 'check_circle',
        visualLabel: 'Risk Score: 0.05',
        description: 'Interceptor confirms "Digital DNA" matches historical baseline perfectly.',
        technicalNote: 'Logic: Confidence > 90%'
      },
      {
        step: 3,
        title: 'Layer 3: Decision',
        iconType: 'lock_open',
        visualLabel: 'Silent Access',
        description: 'Traffic Light: GREEN. Ahmed enters the dashboard without any extra friction.',
        technicalNote: 'UX: Zero Interaction Auth'
      }
    ]
  }
];