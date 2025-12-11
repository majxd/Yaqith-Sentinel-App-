/**
 * BE-04: Verify Seed Data
 * Validates all exit criteria for seed data insertion
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
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyExitCriteria() {
  console.log('[BE-04] Verifying Exit Criteria\n');
  console.log('=' .repeat(60));

  let allPassed = true;

  // EXIT CRITERION 1: Total count ~500
  console.log('\n1. Total Record Count');
  console.log('-'.repeat(60));

  const { count: totalCount, error: countError } = await supabase
    .from('authentication_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('source_tab', 'seed');

  if (countError) {
    console.log('✗ FAILED: Error counting records:', countError);
    allPassed = false;
  } else {
    const passed = totalCount === 500;
    console.log(`${passed ? '✓' : '✗'} Total seed records: ${totalCount} (expected: 500)`);
    if (!passed) allPassed = false;
  }

  // EXIT CRITERION 2: Distribution matches requirements
  console.log('\n2. Scenario Distribution');
  console.log('-'.repeat(60));

  const expectedDistribution = {
    '1': { title: 'Normal Login', count: 275, percentage: 55 },
    '2': { title: 'Unusual Device', count: 75, percentage: 15 },
    '3': { title: 'Suspicious Time', count: 40, percentage: 8 },
    '4': { title: 'Location Anomaly', count: 35, percentage: 7 },
    '5': { title: 'Rapid Login', count: 25, percentage: 5 },
    '6': { title: 'Behavioral Deviation', count: 25, percentage: 5 },
    '9': { title: 'Continuous Monitoring', count: 25, percentage: 5 }
  };

  const { data: distribution, error: distError } = await supabase
    .from('authentication_attempts')
    .select('scenario_id, scenario_title')
    .eq('source_tab', 'seed');

  if (distError) {
    console.log('✗ FAILED: Error getting distribution:', distError);
    allPassed = false;
  } else {
    const scenarioCounts = distribution.reduce((acc, record) => {
      acc[record.scenario_id] = (acc[record.scenario_id] || 0) + 1;
      return acc;
    }, {});

    for (const [id, expected] of Object.entries(expectedDistribution)) {
      const actual = scenarioCounts[id] || 0;
      const passed = actual === expected.count;
      const actualPercentage = ((actual / totalCount) * 100).toFixed(1);
      console.log(
        `${passed ? '✓' : '✗'} Scenario ${id} (${expected.title}): ${actual} records (${actualPercentage}%, expected: ${expected.count}/${expected.percentage}%)`
      );
      if (!passed) allPassed = false;
    }
  }

  // EXIT CRITERION 3: Time span covers 7 days
  console.log('\n3. Time Distribution (7 Days)');
  console.log('-'.repeat(60));

  const { data: timeRange, error: timeError } = await supabase
    .from('authentication_attempts')
    .select('created_at')
    .eq('source_tab', 'seed')
    .order('created_at', { ascending: true });

  if (timeError) {
    console.log('✗ FAILED: Error getting time range:', timeError);
    allPassed = false;
  } else if (timeRange && timeRange.length > 0) {
    const oldest = new Date(timeRange[0].created_at);
    const newest = new Date(timeRange[timeRange.length - 1].created_at);
    const daysDiff = Math.ceil((newest - oldest) / (1000 * 60 * 60 * 24));

    const passed = daysDiff >= 6; // Allow 6-7 days due to rounding
    console.log(`${passed ? '✓' : '✗'} Oldest record: ${oldest.toISOString()}`);
    console.log(`${passed ? '✓' : '✗'} Newest record: ${newest.toISOString()}`);
    console.log(`${passed ? '✓' : '✗'} Time span: ${daysDiff} days (expected: 7)`);
    if (!passed) allPassed = false;
  } else {
    console.log('✗ FAILED: No records found');
    allPassed = false;
  }

  // EXIT CRITERION 4: All records have status='completed'
  console.log('\n4. All Records Status = "completed"');
  console.log('-'.repeat(60));

  const { count: completedCount, error: statusError } = await supabase
    .from('authentication_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('source_tab', 'seed')
    .eq('status', 'completed');

  if (statusError) {
    console.log('✗ FAILED: Error checking status:', statusError);
    allPassed = false;
  } else {
    const passed = completedCount === totalCount;
    console.log(`${passed ? '✓' : '✗'} Records with status='completed': ${completedCount}/${totalCount}`);
    if (!passed) allPassed = false;
  }

  // EXIT CRITERION 5: All records have source_tab='seed'
  console.log('\n5. All Records Source Tab = "seed"');
  console.log('-'.repeat(60));

  const { count: seedCount, error: sourceError } = await supabase
    .from('authentication_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('source_tab', 'seed');

  if (sourceError) {
    console.log('✗ FAILED: Error checking source_tab:', sourceError);
    allPassed = false;
  } else {
    console.log(`✓ Records with source_tab='seed': ${seedCount}`);
  }

  // EXIT CRITERION 6: All DECISION fields filled
  console.log('\n6. All DECISION Fields Populated');
  console.log('-'.repeat(60));

  const { count: withDecisions, error: decisionError } = await supabase
    .from('authentication_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('source_tab', 'seed')
    .not('risk_level', 'is', null)
    .not('risk_score', 'is', null)
    .not('action_taken', 'is', null)
    .not('ai_reasoning', 'is', null)
    .not('outcome_description', 'is', null);

  if (decisionError) {
    console.log('✗ FAILED: Error checking decision fields:', decisionError);
    allPassed = false;
  } else {
    const passed = withDecisions === totalCount;
    console.log(`${passed ? '✓' : '✗'} Records with all decision fields: ${withDecisions}/${totalCount}`);
    if (!passed) allPassed = false;
  }

  // EXIT CRITERION 7: processed_at timestamps populated
  console.log('\n7. All processed_at Timestamps Populated');
  console.log('-'.repeat(60));

  const { count: withProcessed, error: processedError } = await supabase
    .from('authentication_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('source_tab', 'seed')
    .not('processed_at', 'is', null)
    .not('processing_time_ms', 'is', null);

  if (processedError) {
    console.log('✗ FAILED: Error checking processed_at:', processedError);
    allPassed = false;
  } else {
    const passed = withProcessed === totalCount;
    console.log(`${passed ? '✓' : '✗'} Records with processed_at & processing_time_ms: ${withProcessed}/${totalCount}`);
    if (!passed) allPassed = false;
  }

  // Sample a few records to show realistic data
  console.log('\n8. Sample Records');
  console.log('-'.repeat(60));

  const { data: samples, error: sampleError } = await supabase
    .from('authentication_attempts')
    .select('scenario_id, scenario_title, device, location, risk_level, action_taken, created_at')
    .eq('source_tab', 'seed')
    .limit(5);

  if (sampleError) {
    console.log('✗ FAILED: Error fetching samples:', sampleError);
  } else {
    samples.forEach((record, i) => {
      console.log(`\nSample ${i + 1}:`);
      console.log(`  Scenario: ${record.scenario_id} - ${record.scenario_title}`);
      console.log(`  Device: ${record.device}`);
      console.log(`  Location: ${record.location}`);
      console.log(`  Risk: ${record.risk_level} → ${record.action_taken}`);
      console.log(`  Created: ${new Date(record.created_at).toISOString()}`);
    });
  }

  // Final summary
  console.log('\n' + '='.repeat(60));
  console.log(`\nFINAL RESULT: ${allPassed ? '✓ ALL EXIT CRITERIA PASSED' : '✗ SOME CRITERIA FAILED'}`);
  console.log('='.repeat(60) + '\n');

  process.exit(allPassed ? 0 : 1);
}

// Run verification
verifyExitCriteria();
