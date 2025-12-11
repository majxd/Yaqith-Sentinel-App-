/**
 * BE-04: Seed Database with ~500 Authentication Records
 * Generates and inserts realistic seed data via Supabase client
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase environment variables');
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to generate UUID
function generateUUID() {
  return crypto.randomUUID();
}

// Helper function to get random element from array
function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper function to generate records for a scenario
function generateScenarioRecords(scenario, count) {
  const records = [];
  const now = new Date();

  for (let i = 1; i <= count; i++) {
    // Distribute over 7 days (starting from 1 day ago to ensure new records appear at top)
    const dayOffset = 1 + (i % 7);
    const hourOffset = scenario.hourRange ?
      scenario.hourRange[0] + (i % (scenario.hourRange[1] - scenario.hourRange[0] + 1)) :
      8 + (i % 14);
    const minuteOffset = i % 60;
    const secondOffset = scenario.includeSeconds ? (i % 120) : 0;

    const timestamp = new Date(now);
    timestamp.setDate(timestamp.getDate() - dayOffset);
    timestamp.setHours(hourOffset, minuteOffset, secondOffset, 0);

    const processingTime = 150 + (i % 350);
    const processedAt = new Date(timestamp.getTime() + processingTime);

    const record = {
      scenario_id: scenario.id.toString(),
      scenario_title: scenario.title,
      scenario_label: scenario.label,
      device: scenario.devices[i % scenario.devices.length],
      device_type: scenario.deviceTypes[i % scenario.deviceTypes.length],
      device_trusted: scenario.deviceTrusted,
      location: scenario.locations[i % scenario.locations.length],
      ip_address: scenario.generateIP(i),
      ip_country: scenario.ipCountries[i % scenario.ipCountries.length],
      location_city: scenario.cities[i % scenario.cities.length],
      location_raw: scenario.locations[i % scenario.locations.length],
      time_of_attempt: `${hourOffset.toString().padStart(2, '0')}:${minuteOffset.toString().padStart(2, '0')}`,
      login_time: `${hourOffset.toString().padStart(2, '0')}:${minuteOffset.toString().padStart(2, '0')}`,
      login_timestamp: timestamp.toISOString(),
      behavior_match: scenario.behaviorMatch(i),
      behavior_score: scenario.behaviorScore(i),
      behavior_raw: scenario.behaviorRaw(i),
      time_anomaly: scenario.timeAnomaly || false,
      geo_anomaly: scenario.geoAnomaly || false,
      behavior_anomaly: scenario.behaviorAnomaly || false,
      geo_velocity_violation: scenario.geoVelocityViolation || false,
      is_brute_force: scenario.isBruteForce || false,
      is_mid_session: scenario.isMidSession || false,
      trigger_description: scenario.triggerDescription,
      session_id: generateUUID(),
      user_identifier: `104***${(900 + (i % 100)).toString().padStart(3, '0')}`,
      source_tab: 'seed',
      status: 'completed',
      risk_level: scenario.riskLevel,
      risk_score: scenario.riskScore(i),
      action_taken: scenario.actionTaken,
      ai_reasoning: scenario.aiReasoning,
      outcome_description: scenario.outcomeDescription,
      decision_factors: scenario.decisionFactors(i),
      processed_at: processedAt.toISOString(),
      processing_time_ms: processingTime,
      created_at: timestamp.toISOString()
    };

    records.push(record);
  }

  return records;
}

// Scenario definitions
const scenarios = {
  normalLogin: {
    id: 1,
    title: 'Normal Login',
    label: 'Normal Login',
    devices: ['iPhone 14 Pro (Known)', 'iPhone 15 (Known)', 'Samsung Galaxy S24 (Known)', 'iPad Air (Known)', 'MacBook Pro (Known)', 'iPhone 13 (Known)', 'Samsung Galaxy S23 (Known)', 'iPhone 12 (Known)'],
    deviceTypes: ['mobile', 'mobile', 'mobile', 'mobile', 'desktop', 'mobile', 'mobile', 'mobile'],
    deviceTrusted: true,
    locations: ['Riyadh, SA (Home IP)', 'Jeddah, SA (Home IP)', 'Dammam, SA (Home IP)', 'Mecca, SA (Home IP)'],
    ipCountries: ['SA'],
    cities: ['Riyadh', 'Jeddah', 'Dammam', 'Mecca'],
    generateIP: (i) => {
      const ranges = [
        (idx) => `192.168.${1 + (idx % 10)}.${100 + (idx % 50)}`,
        (idx) => `10.0.${1 + (idx % 10)}.${100 + (idx % 50)}`,
        (idx) => `172.16.${1 + (idx % 10)}.${100 + (idx % 50)}`,
        (idx) => `192.168.${20 + (idx % 10)}.${100 + (idx % 50)}`
      ];
      return ranges[i % 4](i);
    },
    hourRange: [8, 21],
    behaviorMatch: (i) => `${95 + (i % 5)}% Match`,
    behaviorScore: (i) => 0.95 + (i % 5) * 0.01,
    behaviorRaw: (i) => `${95 + (i % 5)}% Match - Normal typing patterns`,
    riskLevel: 'LOW',
    riskScore: (i) => 0.10 + (i % 10) * 0.01,
    actionTaken: 'ALLOW',
    aiReasoning: 'Device trusted, IP matches home location, behavior normal, typical login hours.',
    outcomeDescription: 'Seamless login - no friction.',
    decisionFactors: () => ({ device_match: true, location_match: true, behavior_normal: true, time_normal: true }),
    triggerDescription: 'User logs in from usual device at home IP with normal behavior'
  },

  unusualDevice: {
    id: 2,
    title: 'Unusual Device',
    label: 'Unusual Device',
    devices: ['Windows PC (Unknown)', 'Android Phone (Unknown)', 'Linux Desktop (Unknown)', 'Chrome Browser (Unknown)', 'Samsung Tablet (Unknown)', 'Huawei Phone (Unknown)'],
    deviceTypes: ['desktop', 'mobile', 'desktop', 'desktop', 'mobile', 'mobile'],
    deviceTrusted: false,
    locations: ['Riyadh, SA (Same IP Range)', 'Jeddah, SA (Same City)', 'Dammam, SA (Same Region)', 'Mecca, SA (Same ISP)'],
    ipCountries: ['SA'],
    cities: ['Riyadh', 'Jeddah', 'Dammam', 'Mecca'],
    generateIP: (i) => {
      const ranges = [
        (idx) => `192.168.${1 + (idx % 10)}.${200 + (idx % 50)}`,
        (idx) => `10.0.${1 + (idx % 10)}.${200 + (idx % 50)}`,
        (idx) => `172.16.${1 + (idx % 10)}.${200 + (idx % 50)}`,
        (idx) => `192.168.${20 + (idx % 10)}.${200 + (idx % 50)}`
      ];
      return ranges[i % 4](i);
    },
    hourRange: [9, 20],
    behaviorMatch: () => 'Unknown - First Use',
    behaviorScore: () => 0.00,
    behaviorRaw: () => 'No behavioral baseline for this device',
    behaviorAnomaly: true,
    riskLevel: 'MEDIUM',
    riskScore: (i) => 0.45 + (i % 15) * 0.01,
    actionTaken: 'CHALLENGE_OTP',
    aiReasoning: 'New device detected. Location matches but device is unrecognized. OTP verification required.',
    outcomeDescription: 'OTP sent to registered phone. User verified successfully.',
    decisionFactors: () => ({ device_match: false, location_match: true, new_device: true, otp_sent: true }),
    triggerDescription: 'Login attempt from new unrecognized device, same location'
  },

  suspiciousTime: {
    id: 3,
    title: 'Suspicious Time',
    label: 'Suspicious Time',
    devices: ['iPhone 14 Pro (Known)', 'Samsung Galaxy S24 (Known)', 'iPad Air (Known)', 'iPhone 15 (Known)', 'MacBook Pro (Known)'],
    deviceTypes: ['mobile', 'mobile', 'mobile', 'mobile', 'desktop'],
    deviceTrusted: true,
    locations: ['Riyadh, SA (Home IP)', 'Jeddah, SA (Home IP)', 'Dammam, SA (Home IP)', 'Mecca, SA (Home IP)'],
    ipCountries: ['SA'],
    cities: ['Riyadh', 'Jeddah', 'Dammam', 'Mecca'],
    generateIP: (i) => {
      const ranges = [
        (idx) => `192.168.${1 + (idx % 10)}.${100 + (idx % 50)}`,
        (idx) => `10.0.${1 + (idx % 10)}.${100 + (idx % 50)}`,
        (idx) => `172.16.${1 + (idx % 10)}.${100 + (idx % 50)}`,
        (idx) => `192.168.${20 + (idx % 10)}.${100 + (idx % 50)}`
      ];
      return ranges[i % 4](i);
    },
    hourRange: [1, 4], // 1-5 AM
    behaviorMatch: (i) => `${92 + (i % 6)}% Match`,
    behaviorScore: (i) => 0.92 + (i % 6) * 0.01,
    behaviorRaw: (i) => `${92 + (i % 6)}% Match - Slightly slower typing`,
    timeAnomaly: true,
    riskLevel: 'MEDIUM',
    riskScore: (i) => 0.50 + (i % 10) * 0.01,
    actionTaken: 'CHALLENGE_CONFIRMATION',
    aiReasoning: 'Unusual login time detected (1-5 AM). Device and location match but time is atypical.',
    outcomeDescription: 'Confirmation prompt sent. User acknowledged login.',
    decisionFactors: () => ({ device_match: true, location_match: true, time_anomaly: true, confirmation_required: true }),
    triggerDescription: 'Login at unusual hour (1-5 AM) from known device'
  },

  locationAnomaly: {
    id: 4,
    title: 'Location Anomaly',
    label: 'Location Anomaly',
    devices: ['iPhone 14 Pro (Known)', 'Windows PC (Unknown)', 'Android Phone (Unknown)', 'iPhone 15 (Known)', 'Linux Desktop (Unknown)'],
    deviceTypes: ['mobile', 'desktop', 'mobile', 'mobile', 'desktop'],
    deviceTrusted: (i) => [0, 3].includes(i % 5),
    locations: ['Sao Paulo, Brazil', 'Moscow, Russia', 'Beijing, China', 'Lagos, Nigeria', 'Proxy IP (Unknown)'],
    ipCountries: ['BR', 'RU', 'CN', 'NG', 'Unknown'],
    cities: ['Sao Paulo', 'Moscow', 'Beijing', 'Lagos', 'Unknown'],
    generateIP: (i) => {
      const ranges = [
        (idx) => `177.32.${1 + (idx % 255)}.${1 + (idx % 255)}`,
        (idx) => `91.108.${1 + (idx % 255)}.${1 + (idx % 255)}`,
        (idx) => `202.96.${1 + (idx % 255)}.${1 + (idx % 255)}`,
        (idx) => `41.58.${1 + (idx % 255)}.${1 + (idx % 255)}`,
        (idx) => `185.220.${1 + (idx % 255)}.${1 + (idx % 255)}`
      ];
      return ranges[i % 5](i);
    },
    hourRange: [8, 21],
    behaviorMatch: (i) => (i % 3) === 0 ? `${15 + (i % 10)}% Match` : 'Unknown',
    behaviorScore: (i) => (i % 3) === 0 ? 0.15 + (i % 10) * 0.01 : 0.00,
    behaviorRaw: (i) => (i % 3) === 0 ? 'Poor behavioral match - unusual patterns' : 'No baseline available',
    geoAnomaly: true,
    behaviorAnomaly: true,
    geoVelocityViolation: true,
    riskLevel: 'HIGH',
    riskScore: (i) => 0.85 + (i % 15) * 0.01,
    actionTaken: 'BLOCK',
    aiReasoning: 'Geographic anomaly detected. IP from foreign country with impossible travel time. High risk of account compromise.',
    outcomeDescription: 'Login blocked. Security alert sent to user.',
    decisionFactors: () => ({ geo_anomaly: true, impossible_travel: true, foreign_ip: true, blocked: true }),
    triggerDescription: 'Login attempt from geographically impossible location'
  },

  rapidLogin: {
    id: 5,
    title: 'Rapid Login',
    label: 'Rapid Login',
    devices: ['Unknown Device', 'Automated Script', 'Bot (Detected)', 'Proxy Device'],
    deviceTypes: ['mobile', 'desktop', 'mobile', 'desktop'],
    deviceTrusted: false,
    locations: ['Multiple Locations', 'Proxy IP (Netherlands)', 'VPN (Germany)', 'TOR Exit Node', 'Sao Paulo, Brazil'],
    ipCountries: ['Unknown', 'NL', 'DE', 'Unknown', 'BR'],
    cities: ['Unknown', 'Amsterdam', 'Frankfurt', 'Unknown', 'Sao Paulo'],
    generateIP: (i) => {
      const ranges = [
        (idx) => `${100 + (idx % 155)}.${1 + (idx % 255)}.${1 + (idx % 255)}.${1 + (idx % 255)}`,
        (idx) => `185.220.${1 + (idx % 255)}.${1 + (idx % 255)}`,
        (idx) => `46.165.${1 + (idx % 255)}.${1 + (idx % 255)}`,
        (idx) => `185.100.${1 + (idx % 255)}.${1 + (idx % 255)}`,
        (idx) => `177.32.${1 + (idx % 255)}.${1 + (idx % 255)}`
      ];
      return ranges[i % 5](i);
    },
    hourRange: [8, 21],
    includeSeconds: true,
    behaviorMatch: () => 'Automated Pattern',
    behaviorScore: (i) => 0.05 + (i % 5) * 0.01,
    behaviorRaw: () => 'Robotic typing speed, no human variance',
    geoAnomaly: true,
    behaviorAnomaly: true,
    geoVelocityViolation: true,
    isBruteForce: true,
    riskLevel: 'HIGH',
    riskScore: (i) => 0.90 + (i % 10) * 0.01,
    actionTaken: 'BLOCK_RAPID',
    aiReasoning: 'Multiple rapid login attempts in short timeframe. Brute force attack pattern detected.',
    outcomeDescription: 'Account temporarily locked. Security team notified.',
    decisionFactors: (i) => ({ rapid_attempts: true, brute_force_pattern: true, account_locked: true, attempts_within_2_min: 5 + (i % 10) }),
    triggerDescription: 'Rapid successive login attempts detected - possible brute force'
  },

  behavioralDeviation: {
    id: 6,
    title: 'Behavioral Deviation',
    label: 'Behavioral Deviation',
    devices: ['iPhone 14 Pro (Known)', 'Samsung Galaxy S24 (Known)', 'MacBook Pro (Known)', 'iPad Air (Known)'],
    deviceTypes: ['mobile', 'mobile', 'desktop', 'desktop'],
    deviceTrusted: true,
    locations: ['Riyadh, SA (Home IP)', 'Jeddah, SA (Home IP)', 'Dammam, SA (Home IP)', 'Mecca, SA (Home IP)'],
    ipCountries: ['SA'],
    cities: ['Riyadh', 'Jeddah', 'Dammam', 'Mecca'],
    generateIP: (i) => {
      const ranges = [
        (idx) => `192.168.${1 + (idx % 10)}.${100 + (idx % 50)}`,
        (idx) => `10.0.${1 + (idx % 10)}.${100 + (idx % 50)}`,
        (idx) => `172.16.${1 + (idx % 10)}.${100 + (idx % 50)}`,
        (idx) => `192.168.${20 + (idx % 10)}.${100 + (idx % 50)}`
      ];
      return ranges[i % 4](i);
    },
    hourRange: [8, 21],
    behaviorMatch: (i) => `${12 + (i % 8)}% Match`,
    behaviorScore: (i) => 0.12 + (i % 8) * 0.01,
    behaviorRaw: () => 'Severe behavioral mismatch - typing speed/rhythm completely different',
    behaviorAnomaly: true,
    riskLevel: 'HIGH',
    riskScore: (i) => 0.75 + (i % 20) * 0.01,
    actionTaken: 'CHALLENGE_BIOMETRIC',
    aiReasoning: 'Severe behavioral deviation detected. Device and location match but typing pattern is completely different. Possible unauthorized access.',
    outcomeDescription: 'Biometric challenge (Face ID) required. User verified successfully.',
    decisionFactors: () => ({ device_match: true, location_match: true, behavior_mismatch: true, biometric_required: true, face_id_passed: true }),
    triggerDescription: 'Known device but typing behavior does not match user baseline'
  },

  continuousMonitoring: {
    id: 9,
    title: 'Continuous Monitoring',
    label: 'Continuous Monitoring',
    devices: ['iPhone 14 Pro (Known)', 'Samsung Galaxy S24 (Known)', 'iPad Air (Known)', 'MacBook Pro (Known)', 'iPhone 15 (Known)'],
    deviceTypes: ['mobile', 'mobile', 'mobile', 'desktop', 'mobile'],
    deviceTrusted: true,
    locations: ['Riyadh, SA (Home IP)', 'Jeddah, SA (Home IP)', 'Dammam, SA (Home IP)', 'Mecca, SA (Home IP)'],
    ipCountries: ['SA'],
    cities: ['Riyadh', 'Jeddah', 'Dammam', 'Mecca'],
    generateIP: (i) => {
      const ranges = [
        (idx) => `192.168.${1 + (idx % 10)}.${100 + (idx % 50)}`,
        (idx) => `10.0.${1 + (idx % 10)}.${100 + (idx % 50)}`,
        (idx) => `172.16.${1 + (idx % 10)}.${100 + (idx % 50)}`,
        (idx) => `192.168.${20 + (idx % 10)}.${100 + (idx % 50)}`
      ];
      return ranges[i % 4](i);
    },
    hourRange: [8, 21],
    behaviorMatch: (i) => `${65 + (i % 15)}% Match (Drifting)`,
    behaviorScore: (i) => 0.65 + (i % 15) * 0.01,
    behaviorRaw: () => 'Behavior started normal but drifting during session - possible session takeover',
    behaviorAnomaly: true,
    isMidSession: true,
    riskLevel: 'MEDIUM',
    riskScore: (i) => 0.55 + (i % 20) * 0.01,
    actionTaken: 'RE_AUTH',
    aiReasoning: 'Continuous monitoring detected behavioral drift mid-session. Requiring re-authentication for security.',
    outcomeDescription: 'Re-authentication prompt sent. User verified with biometric.',
    decisionFactors: (i) => ({
      device_match: true,
      location_match: true,
      mid_session_drift: true,
      initial_behavior_score: 0.95,
      current_behavior_score: 0.65 + (i % 15) * 0.01,
      re_auth_required: true
    }),
    triggerDescription: 'Mid-session behavioral drift detected - pattern changing over time'
  },

  // US-based suspicious logins (mostly blocked/challenged)
  usaSuspiciousLogin: {
    id: 10,
    title: 'USA Suspicious Login',
    label: 'USA Suspicious Login',
    devices: ['Windows PC (Unknown)', 'MacBook (Unknown)', 'iPhone (Unknown)', 'Android Phone (Unknown)', 'Linux Desktop (Unknown)', 'Chrome Browser (Unknown)'],
    deviceTypes: ['desktop', 'desktop', 'mobile', 'mobile', 'desktop', 'desktop'],
    deviceTrusted: false,
    locations: [
      'New York, US', 'Los Angeles, US', 'Chicago, US', 'Houston, US',
      'Phoenix, US', 'San Francisco, US', 'Seattle, US', 'Miami, US',
      'Boston, US', 'Denver, US', 'Atlanta, US', 'Dallas, US',
      'Las Vegas, US', 'Washington DC, US', 'San Diego, US'
    ],
    ipCountries: ['US'],
    cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'San Francisco', 'Seattle', 'Miami', 'Boston', 'Denver', 'Atlanta', 'Dallas', 'Las Vegas', 'Washington DC', 'San Diego'],
    generateIP: (i) => {
      // US IP ranges
      const ranges = [
        (idx) => `73.${1 + (idx % 255)}.${1 + (idx % 255)}.${1 + (idx % 255)}`,    // Comcast
        (idx) => `98.${1 + (idx % 255)}.${1 + (idx % 255)}.${1 + (idx % 255)}`,    // AT&T
        (idx) => `108.${1 + (idx % 255)}.${1 + (idx % 255)}.${1 + (idx % 255)}`,   // Various US
        (idx) => `174.${1 + (idx % 255)}.${1 + (idx % 255)}.${1 + (idx % 255)}`,   // Cogent
        (idx) => `24.${1 + (idx % 255)}.${1 + (idx % 255)}.${1 + (idx % 255)}`,    // Cable ISPs
        (idx) => `67.${1 + (idx % 255)}.${1 + (idx % 255)}.${1 + (idx % 255)}`     // Various US
      ];
      return ranges[i % 6](i);
    },
    hourRange: [0, 23], // Any hour (different timezone)
    behaviorMatch: (i) => (i % 5) === 0 ? `${20 + (i % 15)}% Match` : 'Unknown',
    behaviorScore: (i) => (i % 5) === 0 ? 0.20 + (i % 15) * 0.01 : 0.00,
    behaviorRaw: (i) => (i % 5) === 0 ? 'Poor behavioral match - unfamiliar patterns' : 'No baseline - unknown device',
    geoAnomaly: true,
    behaviorAnomaly: true,
    geoVelocityViolation: true,
    riskLevel: 'HIGH',
    riskScore: (i) => 0.80 + (i % 20) * 0.01,
    actionTaken: 'BLOCK',
    aiReasoning: 'Login attempt from United States. User profile indicates Saudi Arabia residence. Geographic anomaly detected - impossible travel time.',
    outcomeDescription: 'Login blocked. Security alert sent to registered email and phone.',
    decisionFactors: () => ({ geo_anomaly: true, impossible_travel: true, foreign_country: 'USA', device_unknown: true, blocked: true }),
    triggerDescription: 'Suspicious login attempt from US location - geographic anomaly'
  },

  // US-based logins that were allowed (legitimate travel)
  usaAllowedLogin: {
    id: 11,
    title: 'USA Allowed Login',
    label: 'USA Travel Login',
    devices: ['iPhone 14 Pro (Known)', 'iPhone 15 (Known)', 'Samsung Galaxy S24 (Known)', 'MacBook Pro (Known)'],
    deviceTypes: ['mobile', 'mobile', 'mobile', 'desktop'],
    deviceTrusted: true,
    locations: [
      'New York, US (Travel)', 'Los Angeles, US (Travel)', 'San Francisco, US (Travel)',
      'Miami, US (Travel)', 'Washington DC, US (Travel)', 'Chicago, US (Travel)'
    ],
    ipCountries: ['US'],
    cities: ['New York', 'Los Angeles', 'San Francisco', 'Miami', 'Washington DC', 'Chicago'],
    generateIP: (i) => {
      const ranges = [
        (idx) => `73.${50 + (idx % 50)}.${1 + (idx % 255)}.${1 + (idx % 255)}`,
        (idx) => `98.${50 + (idx % 50)}.${1 + (idx % 255)}.${1 + (idx % 255)}`,
        (idx) => `108.${50 + (idx % 50)}.${1 + (idx % 255)}.${1 + (idx % 255)}`
      ];
      return ranges[i % 3](i);
    },
    hourRange: [8, 22],
    behaviorMatch: (i) => `${88 + (i % 10)}% Match`,
    behaviorScore: (i) => 0.88 + (i % 10) * 0.01,
    behaviorRaw: (i) => `${88 + (i % 10)}% Match - Recognized typing pattern`,
    geoAnomaly: false,
    riskLevel: 'LOW',
    riskScore: (i) => 0.25 + (i % 15) * 0.01,
    actionTaken: 'ALLOW',
    aiReasoning: 'Device recognized and behavior matches user profile. Travel flag detected from recent flight booking. Login approved.',
    outcomeDescription: 'Login allowed - travel context verified.',
    decisionFactors: () => ({ device_match: true, behavior_match: true, travel_context: true, flight_booking_detected: true }),
    triggerDescription: 'Login from US with known device - legitimate travel detected'
  }
};

async function seedDatabase() {
  console.log('[BE-04] Starting database seeding...\n');
  console.log('Project:', supabaseUrl);
  console.log('Target Table: authentication_attempts\n');

  try {
    const allRecords = [];

    // Generate records for each scenario
    console.log('Generating seed data...\n');

    const scenarioDistribution = [
      { name: 'normalLogin', count: 220, percentage: '44%' },
      { name: 'unusualDevice', count: 60, percentage: '12%' },
      { name: 'suspiciousTime', count: 30, percentage: '6%' },
      { name: 'locationAnomaly', count: 30, percentage: '6%' },
      { name: 'rapidLogin', count: 20, percentage: '4%' },
      { name: 'behavioralDeviation', count: 20, percentage: '4%' },
      { name: 'continuousMonitoring', count: 20, percentage: '4%' },
      { name: 'usaSuspiciousLogin', count: 80, percentage: '16%' },  // US blocked logins
      { name: 'usaAllowedLogin', count: 20, percentage: '4%' }       // US allowed (travel)
    ];

    for (const { name, count, percentage } of scenarioDistribution) {
      console.log(`Generating ${count} records for ${scenarios[name].title} (${percentage})...`);
      const records = generateScenarioRecords(scenarios[name], count);
      allRecords.push(...records);
    }

    console.log(`\nTotal records generated: ${allRecords.length}\n`);

    // Insert in batches (Supabase limit is ~1000 per request, we'll use 100 for safety)
    const batchSize = 100;
    const batches = Math.ceil(allRecords.length / batchSize);

    console.log(`Inserting records in ${batches} batches...\n`);

    for (let i = 0; i < batches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, allRecords.length);
      const batch = allRecords.slice(start, end);

      console.log(`[${i + 1}/${batches}] Inserting records ${start + 1}-${end}...`);

      const { data, error } = await supabase
        .from('authentication_attempts')
        .insert(batch);

      if (error) {
        console.error(`Error inserting batch ${i + 1}:`, error);
        throw error;
      }

      console.log(`  ✓ Batch ${i + 1} completed\n`);
    }

    console.log('All records inserted successfully!\n');

    // Verify
    console.log('Verifying seed data...\n');

    const { count: totalCount, error: countError } = await supabase
      .from('authentication_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('source_tab', 'seed');

    if (countError) {
      console.error('Error counting records:', countError);
    } else {
      console.log(`Total seed records: ${totalCount}`);
    }

    // Get distribution by scenario
    const { data: distribution, error: distError } = await supabase
      .from('authentication_attempts')
      .select('scenario_id, scenario_title')
      .eq('source_tab', 'seed');

    if (distError) {
      console.error('Error getting distribution:', distError);
    } else {
      const scenarioCounts = distribution.reduce((acc, record) => {
        const key = `${record.scenario_id}: ${record.scenario_title}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      console.log('\nDistribution by scenario:');
      Object.entries(scenarioCounts)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .forEach(([scenario, count]) => {
          const percentage = ((count / totalCount) * 100).toFixed(1);
          console.log(`  ${scenario}: ${count} records (${percentage}%)`);
        });
    }

    // Get time range
    const { data: timeRange, error: timeError } = await supabase
      .from('authentication_attempts')
      .select('created_at')
      .eq('source_tab', 'seed')
      .order('created_at', { ascending: true });

    if (timeError) {
      console.error('Error getting time range:', timeError);
    } else if (timeRange && timeRange.length > 0) {
      const oldest = new Date(timeRange[0].created_at);
      const newest = new Date(timeRange[timeRange.length - 1].created_at);
      const daysDiff = Math.ceil((newest - oldest) / (1000 * 60 * 60 * 24));

      console.log('\nTime Distribution:');
      console.log(`  Oldest record: ${oldest.toISOString()}`);
      console.log(`  Newest record: ${newest.toISOString()}`);
      console.log(`  Span: ${daysDiff} days`);
    }

    console.log('\n[BE-04] Database seeding completed successfully! ✓\n');

  } catch (error) {
    console.error('\n[BE-04] Database seeding failed:', error);
    process.exit(1);
  }
}

// Clear only seed data (preserves user test records)
async function clearSeedData() {
  console.log('\n[BE-04] Clearing seed data...\n');

  try {
    // Count existing seed records
    const { count: beforeCount } = await supabase
      .from('authentication_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('source_tab', 'seed');

    console.log(`Found ${beforeCount} seed records to delete...`);

    if (beforeCount === 0) {
      console.log('No seed records to delete.');
      return;
    }

    // Delete all seed records at once (Supabase handles this)
    const { error } = await supabase
      .from('authentication_attempts')
      .delete()
      .eq('source_tab', 'seed');

    if (error) {
      console.error('Error deleting seed data:', error);
      throw error;
    }

    // Verify deletion
    const { count: afterCount } = await supabase
      .from('authentication_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('source_tab', 'seed');

    console.log(`\nSeed data cleared. Remaining seed records: ${afterCount}`);
    console.log('[BE-04] Clear completed! ✓\n');

  } catch (error) {
    console.error('\n[BE-04] Clear failed:', error);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0] || 'seed';

if (command === 'clear') {
  clearSeedData();
} else if (command === 'reseed') {
  // Clear then seed
  clearSeedData().then(() => seedDatabase());
} else {
  seedDatabase();
}
