/**
 * BE-04: Seed Database with ~500 Authentication Records
 * Executes the seed SQL script via Supabase client
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase environment variables');
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('[BE-04] Starting database seeding...\n');
  console.log('Project:', supabaseUrl);
  console.log('Target Table: authentication_attempts\n');

  try {
    // Read the SQL file
    const sqlPath = join(__dirname, '..', 'seeds', 'generate_seed_data.sql');
    const sqlContent = readFileSync(sqlPath, 'utf8');

    console.log('Executing SQL script...');
    console.log(`SQL file size: ${(sqlContent.length / 1024).toFixed(2)} KB\n`);

    // Split SQL into individual INSERT statements (PostgreSQL handles them better separately)
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && s.startsWith('INSERT'));

    console.log(`Found ${statements.length} INSERT statements\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      const scenario = statement.match(/SCENARIO (\d+):/)?.[1] || 'Unknown';
      const scenarioName = statement.match(/-- SCENARIO \d+: ([^\n]+)/)?.[1] || '';

      console.log(`[${i + 1}/${statements.length}] Executing ${scenarioName.trim() || 'Scenario ' + scenario}...`);

      const { data, error } = await supabase.rpc('exec_sql', { sql: statement });

      if (error) {
        console.error(`Error executing statement ${i + 1}:`, error);
        throw error;
      }

      console.log(`  ✓ Completed\n`);
    }

    console.log('All INSERT statements executed successfully!\n');

    // Verify record count
    console.log('Verifying seed data...\n');

    const { count: totalCount, error: countError } = await supabase
      .from('authentication_attempts')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error counting records:', countError);
    } else {
      console.log(`Total records in authentication_attempts: ${totalCount}`);
    }

    // Get distribution by scenario
    const { data: distribution, error: distError } = await supabase
      .from('authentication_attempts')
      .select('scenario_id, scenario_title, source_tab')
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
          console.log(`  ${scenario}: ${count} records`);
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

    // Verify all records have required fields
    const { data: incomplete, error: incompleteError } = await supabase
      .from('authentication_attempts')
      .select('id')
      .eq('source_tab', 'seed')
      .or('status.is.null,risk_level.is.null,action_taken.is.null');

    if (incompleteError) {
      console.error('Error checking for incomplete records:', incompleteError);
    } else {
      console.log(`\nIncomplete records (missing required fields): ${incomplete?.length || 0}`);
    }

    console.log('\n[BE-04] Database seeding completed successfully! ✓\n');

  } catch (error) {
    console.error('\n[BE-04] Database seeding failed:', error);
    process.exit(1);
  }
}

// Run the seeding
seedDatabase();
