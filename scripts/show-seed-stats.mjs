/**
 * BE-04: Display Seed Data Statistics
 * Shows comprehensive statistics about the seeded data
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function showStats() {
  console.log('\n' + '='.repeat(70));
  console.log('  BE-04 SEED DATA STATISTICS');
  console.log('='.repeat(70) + '\n');

  // Get all seed records
  const { data: records, error } = await supabase
    .from('authentication_attempts')
    .select('*')
    .eq('source_tab', 'seed');

  if (error) {
    console.error('Error fetching data:', error);
    return;
  }

  // 1. Risk Level Distribution
  console.log('📊 RISK LEVEL DISTRIBUTION\n');
  const riskLevels = records.reduce((acc, r) => {
    acc[r.risk_level] = (acc[r.risk_level] || 0) + 1;
    return acc;
  }, {});

  Object.entries(riskLevels).sort(([a], [b]) => a.localeCompare(b)).forEach(([level, count]) => {
    const bar = '█'.repeat(Math.floor(count / 5));
    const pct = ((count / records.length) * 100).toFixed(1);
    console.log(`  ${level.padEnd(8)} ${bar.padEnd(55)} ${count.toString().padStart(3)} (${pct}%)`);
  });

  // 2. Action Taken Distribution
  console.log('\n📋 ACTION TAKEN DISTRIBUTION\n');
  const actions = records.reduce((acc, r) => {
    acc[r.action_taken] = (acc[r.action_taken] || 0) + 1;
    return acc;
  }, {});

  Object.entries(actions).sort(([a], [b]) => a.localeCompare(b)).forEach(([action, count]) => {
    const bar = '█'.repeat(Math.floor(count / 5));
    const pct = ((count / records.length) * 100).toFixed(1);
    console.log(`  ${action.padEnd(25)} ${bar.padEnd(35)} ${count.toString().padStart(3)} (${pct}%)`);
  });

  // 3. Country Distribution
  console.log('\n🌍 COUNTRY DISTRIBUTION\n');
  const countries = records.reduce((acc, r) => {
    acc[r.ip_country] = (acc[r.ip_country] || 0) + 1;
    return acc;
  }, {});

  Object.entries(countries).sort(([a, aCount], [b, bCount]) => bCount - aCount).forEach(([country, count]) => {
    const bar = '█'.repeat(Math.floor(count / 5));
    const pct = ((count / records.length) * 100).toFixed(1);
    const countryName = country === 'SA' ? 'Saudi Arabia' :
                       country === 'BR' ? 'Brazil' :
                       country === 'RU' ? 'Russia' :
                       country === 'CN' ? 'China' :
                       country === 'NG' ? 'Nigeria' :
                       country === 'NL' ? 'Netherlands' :
                       country === 'DE' ? 'Germany' :
                       'Unknown';
    console.log(`  ${country} ${countryName.padEnd(20)} ${bar.padEnd(35)} ${count.toString().padStart(3)} (${pct}%)`);
  });

  // 4. Device Type Distribution
  console.log('\n📱 DEVICE TYPE DISTRIBUTION\n');
  const deviceTypes = records.reduce((acc, r) => {
    acc[r.device_type] = (acc[r.device_type] || 0) + 1;
    return acc;
  }, {});

  Object.entries(deviceTypes).forEach(([type, count]) => {
    const bar = '█'.repeat(Math.floor(count / 5));
    const pct = ((count / records.length) * 100).toFixed(1);
    console.log(`  ${type.padEnd(10)} ${bar.padEnd(50)} ${count.toString().padStart(3)} (${pct}%)`);
  });

  // 5. Trusted vs Untrusted Devices
  console.log('\n🔒 DEVICE TRUST STATUS\n');
  const trusted = records.filter(r => r.device_trusted).length;
  const untrusted = records.length - trusted;
  const trustedBar = '█'.repeat(Math.floor(trusted / 5));
  const untrustedBar = '█'.repeat(Math.floor(untrusted / 5));
  console.log(`  Trusted   ${trustedBar.padEnd(50)} ${trusted.toString().padStart(3)} (${((trusted / records.length) * 100).toFixed(1)}%)`);
  console.log(`  Untrusted ${untrustedBar.padEnd(50)} ${untrusted.toString().padStart(3)} (${((untrusted / records.length) * 100).toFixed(1)}%)`);

  // 6. Time Distribution by Hour
  console.log('\n⏰ LOGIN ATTEMPTS BY HOUR (Saudi Time)\n');
  const hourCounts = Array(24).fill(0);
  records.forEach(r => {
    const hour = parseInt(r.time_of_attempt.split(':')[0]);
    hourCounts[hour]++;
  });

  hourCounts.forEach((count, hour) => {
    if (count > 0) {
      const bar = '█'.repeat(Math.floor(count / 2));
      const timeRange = `${hour.toString().padStart(2, '0')}:00-${(hour + 1).toString().padStart(2, '0')}:00`;
      console.log(`  ${timeRange} ${bar.padEnd(40)} ${count.toString().padStart(3)}`);
    }
  });

  // 7. Anomaly Flags
  console.log('\n⚠️  ANOMALY FLAGS\n');
  const anomalies = {
    'Time Anomaly': records.filter(r => r.time_anomaly).length,
    'Geo Anomaly': records.filter(r => r.geo_anomaly).length,
    'Behavior Anomaly': records.filter(r => r.behavior_anomaly).length,
    'Geo Velocity Violation': records.filter(r => r.geo_velocity_violation).length,
    'Brute Force': records.filter(r => r.is_brute_force).length,
    'Mid-Session': records.filter(r => r.is_mid_session).length
  };

  Object.entries(anomalies).forEach(([flag, count]) => {
    const bar = '█'.repeat(Math.floor(count / 2));
    const pct = ((count / records.length) * 100).toFixed(1);
    console.log(`  ${flag.padEnd(25)} ${bar.padEnd(35)} ${count.toString().padStart(3)} (${pct}%)`);
  });

  // 8. Processing Time Stats
  console.log('\n⚡ PROCESSING TIME STATISTICS\n');
  const processingTimes = records.map(r => r.processing_time_ms).filter(t => t != null);
  const min = Math.min(...processingTimes);
  const max = Math.max(...processingTimes);
  const avg = processingTimes.reduce((sum, t) => sum + t, 0) / processingTimes.length;
  console.log(`  Min:     ${min}ms`);
  console.log(`  Max:     ${max}ms`);
  console.log(`  Average: ${avg.toFixed(2)}ms`);

  // 9. Risk Score Distribution
  console.log('\n📈 RISK SCORE DISTRIBUTION\n');
  const riskBuckets = {
    '0.00-0.20 (Very Low)': 0,
    '0.21-0.40 (Low)': 0,
    '0.41-0.60 (Medium)': 0,
    '0.61-0.80 (High)': 0,
    '0.81-1.00 (Very High)': 0
  };

  records.forEach(r => {
    if (r.risk_score <= 0.20) riskBuckets['0.00-0.20 (Very Low)']++;
    else if (r.risk_score <= 0.40) riskBuckets['0.21-0.40 (Low)']++;
    else if (r.risk_score <= 0.60) riskBuckets['0.41-0.60 (Medium)']++;
    else if (r.risk_score <= 0.80) riskBuckets['0.61-0.80 (High)']++;
    else riskBuckets['0.81-1.00 (Very High)']++;
  });

  Object.entries(riskBuckets).forEach(([bucket, count]) => {
    const bar = '█'.repeat(Math.floor(count / 5));
    const pct = ((count / records.length) * 100).toFixed(1);
    console.log(`  ${bucket.padEnd(22)} ${bar.padEnd(38)} ${count.toString().padStart(3)} (${pct}%)`);
  });

  console.log('\n' + '='.repeat(70) + '\n');
}

showStats();
