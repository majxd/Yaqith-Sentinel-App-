-- BE-04: Generate ~500 Seed Records for authentication_attempts
-- Distribution: 55% Normal, 15% Unusual Device, 8% Suspicious Time, 7% Location Anomaly, 5% Rapid Login, 5% Behavioral Deviation, 5% Continuous Monitoring
-- All records have status='completed', source_tab='seed', and span 7 days

-- Helper function to generate random time offset in milliseconds (for processing_time_ms)
-- Range: 150-500ms

-- SCENARIO 1: Normal Login (55% = ~275 records)
-- Risk: LOW, Action: ALLOW
-- Characteristics: Known device, home IP, normal behavior, typical hours

INSERT INTO authentication_attempts (
  scenario_id, scenario_title, scenario_label,
  device, device_type, device_trusted,
  location, ip_address, ip_country, location_city, location_raw,
  time_of_attempt, login_time, login_timestamp,
  behavior_match, behavior_score, behavior_raw,
  time_anomaly, geo_anomaly, behavior_anomaly, geo_velocity_violation, is_brute_force, is_mid_session,
  trigger_description, session_id, user_identifier, source_tab,
  status, risk_level, risk_score, action_taken, ai_reasoning, outcome_description,
  decision_factors, processed_at, processing_time_ms, created_at
)
SELECT
  '1', 'Normal Login', 'Normal Login',
  CASE (i % 8)
    WHEN 0 THEN 'iPhone 14 Pro (Known)'
    WHEN 1 THEN 'iPhone 15 (Known)'
    WHEN 2 THEN 'Samsung Galaxy S24 (Known)'
    WHEN 3 THEN 'iPad Air (Known)'
    WHEN 4 THEN 'MacBook Pro (Known)'
    WHEN 5 THEN 'iPhone 13 (Known)'
    WHEN 6 THEN 'Samsung Galaxy S23 (Known)'
    ELSE 'iPhone 12 (Known)'
  END,
  CASE WHEN (i % 8) < 6 THEN 'mobile' ELSE 'desktop' END,
  true,
  CASE (i % 4)
    WHEN 0 THEN 'Riyadh, SA (Home IP)'
    WHEN 1 THEN 'Jeddah, SA (Home IP)'
    WHEN 2 THEN 'Dammam, SA (Home IP)'
    ELSE 'Mecca, SA (Home IP)'
  END,
  CASE (i % 4)
    WHEN 0 THEN '192.168.' || (1 + (i % 10))::text || '.' || (100 + (i % 50))::text
    WHEN 1 THEN '10.0.' || (1 + (i % 10))::text || '.' || (100 + (i % 50))::text
    WHEN 2 THEN '172.16.' || (1 + (i % 10))::text || '.' || (100 + (i % 50))::text
    ELSE '192.168.' || (20 + (i % 10))::text || '.' || (100 + (i % 50))::text
  END,
  'SA',
  CASE (i % 4)
    WHEN 0 THEN 'Riyadh'
    WHEN 1 THEN 'Jeddah'
    WHEN 2 THEN 'Dammam'
    ELSE 'Mecca'
  END,
  CASE (i % 4)
    WHEN 0 THEN 'Riyadh, SA (Home IP)'
    WHEN 1 THEN 'Jeddah, SA (Home IP)'
    WHEN 2 THEN 'Dammam, SA (Home IP)'
    ELSE 'Mecca, SA (Home IP)'
  END,
  (8 + (i % 14))::text || ':' || LPAD((i % 60)::text, 2, '0'),
  (8 + (i % 14))::text || ':' || LPAD((i % 60)::text, 2, '0'),
  NOW() - (i % 7 || ' days')::INTERVAL + ((8 + (i % 14)) || ' hours')::INTERVAL + ((i % 60) || ' minutes')::INTERVAL,
  (95 + (i % 5))::text || '% Match',
  0.95 + (i % 5) * 0.01,
  (95 + (i % 5))::text || '% Match - Normal typing patterns',
  false, false, false, false, false, false,
  'User logs in from usual device at home IP with normal behavior',
  gen_random_uuid()::text,
  '104***' || LPAD((900 + (i % 100))::text, 3, '0'),
  'seed',
  'completed',
  'LOW',
  0.10 + (i % 10) * 0.01,
  'ALLOW',
  'Device trusted, IP matches home location, behavior normal, typical login hours.',
  'Seamless login - no friction.',
  jsonb_build_object(
    'device_match', true,
    'location_match', true,
    'behavior_normal', true,
    'time_normal', true
  ),
  NOW() - (i % 7 || ' days')::INTERVAL + ((8 + (i % 14)) || ' hours')::INTERVAL + ((i % 60) || ' minutes')::INTERVAL + ((150 + (i % 350)) || ' milliseconds')::INTERVAL,
  150 + (i % 350),
  NOW() - (i % 7 || ' days')::INTERVAL + ((8 + (i % 14)) || ' hours')::INTERVAL + ((i % 60) || ' minutes')::INTERVAL
FROM generate_series(1, 275) AS i;

-- SCENARIO 2: Unusual Device (15% = ~75 records)
-- Risk: MEDIUM, Action: CHALLENGE_OTP
-- Characteristics: New device, same location, behavior needs verification

INSERT INTO authentication_attempts (
  scenario_id, scenario_title, scenario_label,
  device, device_type, device_trusted,
  location, ip_address, ip_country, location_city, location_raw,
  time_of_attempt, login_time, login_timestamp,
  behavior_match, behavior_score, behavior_raw,
  time_anomaly, geo_anomaly, behavior_anomaly, geo_velocity_violation, is_brute_force, is_mid_session,
  trigger_description, session_id, user_identifier, source_tab,
  status, risk_level, risk_score, action_taken, ai_reasoning, outcome_description,
  decision_factors, processed_at, processing_time_ms, created_at
)
SELECT
  '2', 'Unusual Device', 'Unusual Device',
  CASE (i % 6)
    WHEN 0 THEN 'Windows PC (Unknown)'
    WHEN 1 THEN 'Android Phone (Unknown)'
    WHEN 2 THEN 'Linux Desktop (Unknown)'
    WHEN 3 THEN 'Chrome Browser (Unknown)'
    WHEN 4 THEN 'Samsung Tablet (Unknown)'
    ELSE 'Huawei Phone (Unknown)'
  END,
  CASE WHEN (i % 6) IN (1, 4, 5) THEN 'mobile' ELSE 'desktop' END,
  false,
  CASE (i % 4)
    WHEN 0 THEN 'Riyadh, SA (Same IP Range)'
    WHEN 1 THEN 'Jeddah, SA (Same City)'
    WHEN 2 THEN 'Dammam, SA (Same Region)'
    ELSE 'Mecca, SA (Same ISP)'
  END,
  CASE (i % 4)
    WHEN 0 THEN '192.168.' || (1 + (i % 10))::text || '.' || (200 + (i % 50))::text
    WHEN 1 THEN '10.0.' || (1 + (i % 10))::text || '.' || (200 + (i % 50))::text
    WHEN 2 THEN '172.16.' || (1 + (i % 10))::text || '.' || (200 + (i % 50))::text
    ELSE '192.168.' || (20 + (i % 10))::text || '.' || (200 + (i % 50))::text
  END,
  'SA',
  CASE (i % 4)
    WHEN 0 THEN 'Riyadh'
    WHEN 1 THEN 'Jeddah'
    WHEN 2 THEN 'Dammam'
    ELSE 'Mecca'
  END,
  CASE (i % 4)
    WHEN 0 THEN 'Riyadh, SA (Same IP Range)'
    WHEN 1 THEN 'Jeddah, SA (Same City)'
    WHEN 2 THEN 'Dammam, SA (Same Region)'
    ELSE 'Mecca, SA (Same ISP)'
  END,
  (9 + (i % 12))::text || ':' || LPAD((i % 60)::text, 2, '0'),
  (9 + (i % 12))::text || ':' || LPAD((i % 60)::text, 2, '0'),
  NOW() - (i % 7 || ' days')::INTERVAL + ((9 + (i % 12)) || ' hours')::INTERVAL + ((i % 60) || ' minutes')::INTERVAL,
  'Unknown - First Use',
  0.00,
  'No behavioral baseline for this device',
  false, false, true, false, false, false,
  'Login attempt from new unrecognized device, same location',
  gen_random_uuid()::text,
  '104***' || LPAD((900 + (i % 100))::text, 3, '0'),
  'seed',
  'completed',
  'MEDIUM',
  0.45 + (i % 15) * 0.01,
  'CHALLENGE_OTP',
  'New device detected. Location matches but device is unrecognized. OTP verification required.',
  'OTP sent to registered phone. User verified successfully.',
  jsonb_build_object(
    'device_match', false,
    'location_match', true,
    'new_device', true,
    'otp_sent', true
  ),
  NOW() - (i % 7 || ' days')::INTERVAL + ((9 + (i % 12)) || ' hours')::INTERVAL + ((i % 60) || ' minutes')::INTERVAL + ((180 + (i % 320)) || ' milliseconds')::INTERVAL,
  180 + (i % 320),
  NOW() - (i % 7 || ' days')::INTERVAL + ((9 + (i % 12)) || ' hours')::INTERVAL + ((i % 60) || ' minutes')::INTERVAL
FROM generate_series(1, 75) AS i;

-- SCENARIO 3: Suspicious Time (8% = ~40 records)
-- Risk: MEDIUM, Action: CHALLENGE_CONFIRMATION
-- Characteristics: Login at unusual hours (1-5 AM)

INSERT INTO authentication_attempts (
  scenario_id, scenario_title, scenario_label,
  device, device_type, device_trusted,
  location, ip_address, ip_country, location_city, location_raw,
  time_of_attempt, login_time, login_timestamp,
  behavior_match, behavior_score, behavior_raw,
  time_anomaly, geo_anomaly, behavior_anomaly, geo_velocity_violation, is_brute_force, is_mid_session,
  trigger_description, session_id, user_identifier, source_tab,
  status, risk_level, risk_score, action_taken, ai_reasoning, outcome_description,
  decision_factors, processed_at, processing_time_ms, created_at
)
SELECT
  '3', 'Suspicious Time', 'Suspicious Time',
  CASE (i % 5)
    WHEN 0 THEN 'iPhone 14 Pro (Known)'
    WHEN 1 THEN 'Samsung Galaxy S24 (Known)'
    WHEN 2 THEN 'iPad Air (Known)'
    WHEN 3 THEN 'iPhone 15 (Known)'
    ELSE 'MacBook Pro (Known)'
  END,
  CASE WHEN (i % 5) < 4 THEN 'mobile' ELSE 'desktop' END,
  true,
  CASE (i % 4)
    WHEN 0 THEN 'Riyadh, SA (Home IP)'
    WHEN 1 THEN 'Jeddah, SA (Home IP)'
    WHEN 2 THEN 'Dammam, SA (Home IP)'
    ELSE 'Mecca, SA (Home IP)'
  END,
  CASE (i % 4)
    WHEN 0 THEN '192.168.' || (1 + (i % 10))::text || '.' || (100 + (i % 50))::text
    WHEN 1 THEN '10.0.' || (1 + (i % 10))::text || '.' || (100 + (i % 50))::text
    WHEN 2 THEN '172.16.' || (1 + (i % 10))::text || '.' || (100 + (i % 50))::text
    ELSE '192.168.' || (20 + (i % 10))::text || '.' || (100 + (i % 50))::text
  END,
  'SA',
  CASE (i % 4)
    WHEN 0 THEN 'Riyadh'
    WHEN 1 THEN 'Jeddah'
    WHEN 2 THEN 'Dammam'
    ELSE 'Mecca'
  END,
  CASE (i % 4)
    WHEN 0 THEN 'Riyadh, SA (Home IP)'
    WHEN 1 THEN 'Jeddah, SA (Home IP)'
    WHEN 2 THEN 'Dammam, SA (Home IP)'
    ELSE 'Mecca, SA (Home IP)'
  END,
  '0' || (1 + (i % 4))::text || ':' || LPAD((i % 60)::text, 2, '0'),
  '0' || (1 + (i % 4))::text || ':' || LPAD((i % 60)::text, 2, '0'),
  NOW() - (i % 7 || ' days')::INTERVAL + ((1 + (i % 4)) || ' hours')::INTERVAL + ((i % 60) || ' minutes')::INTERVAL,
  (92 + (i % 6))::text || '% Match',
  0.92 + (i % 6) * 0.01,
  (92 + (i % 6))::text || '% Match - Slightly slower typing',
  true, false, false, false, false, false,
  'Login at unusual hour (1-5 AM) from known device',
  gen_random_uuid()::text,
  '104***' || LPAD((900 + (i % 100))::text, 3, '0'),
  'seed',
  'completed',
  'MEDIUM',
  0.50 + (i % 10) * 0.01,
  'CHALLENGE_CONFIRMATION',
  'Unusual login time detected (1-5 AM). Device and location match but time is atypical.',
  'Confirmation prompt sent. User acknowledged login.',
  jsonb_build_object(
    'device_match', true,
    'location_match', true,
    'time_anomaly', true,
    'confirmation_required', true
  ),
  NOW() - (i % 7 || ' days')::INTERVAL + ((1 + (i % 4)) || ' hours')::INTERVAL + ((i % 60) || ' minutes')::INTERVAL + ((200 + (i % 300)) || ' milliseconds')::INTERVAL,
  200 + (i % 300),
  NOW() - (i % 7 || ' days')::INTERVAL + ((1 + (i % 4)) || ' hours')::INTERVAL + ((i % 60) || ' minutes')::INTERVAL
FROM generate_series(1, 40) AS i;

-- SCENARIO 4: Location Anomaly (7% = ~35 records)
-- Risk: HIGH, Action: BLOCK
-- Characteristics: Login from unexpected foreign location

INSERT INTO authentication_attempts (
  scenario_id, scenario_title, scenario_label,
  device, device_type, device_trusted,
  location, ip_address, ip_country, location_city, location_raw,
  time_of_attempt, login_time, login_timestamp,
  behavior_match, behavior_score, behavior_raw,
  time_anomaly, geo_anomaly, behavior_anomaly, geo_velocity_violation, is_brute_force, is_mid_session,
  trigger_description, session_id, user_identifier, source_tab,
  status, risk_level, risk_score, action_taken, ai_reasoning, outcome_description,
  decision_factors, processed_at, processing_time_ms, created_at
)
SELECT
  '4', 'Location Anomaly', 'Location Anomaly',
  CASE (i % 5)
    WHEN 0 THEN 'iPhone 14 Pro (Known)'
    WHEN 1 THEN 'Windows PC (Unknown)'
    WHEN 2 THEN 'Android Phone (Unknown)'
    WHEN 3 THEN 'iPhone 15 (Known)'
    ELSE 'Linux Desktop (Unknown)'
  END,
  CASE WHEN (i % 5) IN (0, 2, 3) THEN 'mobile' ELSE 'desktop' END,
  CASE WHEN (i % 5) IN (0, 3) THEN true ELSE false END,
  CASE (i % 5)
    WHEN 0 THEN 'Sao Paulo, Brazil'
    WHEN 1 THEN 'Moscow, Russia'
    WHEN 2 THEN 'Beijing, China'
    WHEN 3 THEN 'Lagos, Nigeria'
    ELSE 'Proxy IP (Unknown)'
  END,
  CASE (i % 5)
    WHEN 0 THEN '177.32.' || (1 + (i % 255))::text || '.' || (1 + (i % 255))::text
    WHEN 1 THEN '91.108.' || (1 + (i % 255))::text || '.' || (1 + (i % 255))::text
    WHEN 2 THEN '202.96.' || (1 + (i % 255))::text || '.' || (1 + (i % 255))::text
    WHEN 3 THEN '41.58.' || (1 + (i % 255))::text || '.' || (1 + (i % 255))::text
    ELSE '185.220.' || (1 + (i % 255))::text || '.' || (1 + (i % 255))::text
  END,
  CASE (i % 5)
    WHEN 0 THEN 'BR'
    WHEN 1 THEN 'RU'
    WHEN 2 THEN 'CN'
    WHEN 3 THEN 'NG'
    ELSE 'Unknown'
  END,
  CASE (i % 5)
    WHEN 0 THEN 'Sao Paulo'
    WHEN 1 THEN 'Moscow'
    WHEN 2 THEN 'Beijing'
    WHEN 3 THEN 'Lagos'
    ELSE 'Unknown'
  END,
  CASE (i % 5)
    WHEN 0 THEN 'Sao Paulo, Brazil'
    WHEN 1 THEN 'Moscow, Russia'
    WHEN 2 THEN 'Beijing, China'
    WHEN 3 THEN 'Lagos, Nigeria'
    ELSE 'Proxy IP (Unknown)'
  END,
  (8 + (i % 14))::text || ':' || LPAD((i % 60)::text, 2, '0'),
  (8 + (i % 14))::text || ':' || LPAD((i % 60)::text, 2, '0'),
  NOW() - (i % 7 || ' days')::INTERVAL + ((8 + (i % 14)) || ' hours')::INTERVAL + ((i % 60) || ' minutes')::INTERVAL,
  CASE WHEN (i % 3) = 0 THEN (15 + (i % 10))::text || '% Match' ELSE 'Unknown' END,
  CASE WHEN (i % 3) = 0 THEN 0.15 + (i % 10) * 0.01 ELSE 0.00 END,
  CASE WHEN (i % 3) = 0 THEN 'Poor behavioral match - unusual patterns' ELSE 'No baseline available' END,
  false, true, true, true, false, false,
  'Login attempt from geographically impossible location',
  gen_random_uuid()::text,
  '104***' || LPAD((900 + (i % 100))::text, 3, '0'),
  'seed',
  'completed',
  'HIGH',
  0.85 + (i % 15) * 0.01,
  'BLOCK',
  'Geographic anomaly detected. IP from foreign country with impossible travel time. High risk of account compromise.',
  'Login blocked. Security alert sent to user.',
  jsonb_build_object(
    'geo_anomaly', true,
    'impossible_travel', true,
    'foreign_ip', true,
    'blocked', true
  ),
  NOW() - (i % 7 || ' days')::INTERVAL + ((8 + (i % 14)) || ' hours')::INTERVAL + ((i % 60) || ' minutes')::INTERVAL + ((250 + (i % 250)) || ' milliseconds')::INTERVAL,
  250 + (i % 250),
  NOW() - (i % 7 || ' days')::INTERVAL + ((8 + (i % 14)) || ' hours')::INTERVAL + ((i % 60) || ' minutes')::INTERVAL
FROM generate_series(1, 35) AS i;

-- SCENARIO 5: Rapid Login (5% = ~25 records)
-- Risk: HIGH, Action: BLOCK_RAPID
-- Characteristics: Multiple rapid login attempts in short time

INSERT INTO authentication_attempts (
  scenario_id, scenario_title, scenario_label,
  device, device_type, device_trusted,
  location, ip_address, ip_country, location_city, location_raw,
  time_of_attempt, login_time, login_timestamp,
  behavior_match, behavior_score, behavior_raw,
  time_anomaly, geo_anomaly, behavior_anomaly, geo_velocity_violation, is_brute_force, is_mid_session,
  trigger_description, session_id, user_identifier, source_tab,
  status, risk_level, risk_score, action_taken, ai_reasoning, outcome_description,
  decision_factors, processed_at, processing_time_ms, created_at
)
SELECT
  '5', 'Rapid Login', 'Rapid Login',
  CASE (i % 4)
    WHEN 0 THEN 'Unknown Device'
    WHEN 1 THEN 'Automated Script'
    WHEN 2 THEN 'Bot (Detected)'
    ELSE 'Proxy Device'
  END,
  CASE WHEN (i % 2) = 0 THEN 'mobile' ELSE 'desktop' END,
  false,
  CASE (i % 5)
    WHEN 0 THEN 'Multiple Locations'
    WHEN 1 THEN 'Proxy IP (Netherlands)'
    WHEN 2 THEN 'VPN (Germany)'
    WHEN 3 THEN 'TOR Exit Node'
    ELSE 'Sao Paulo, Brazil'
  END,
  CASE (i % 5)
    WHEN 0 THEN (100 + (i % 155))::text || '.' || (1 + (i % 255))::text || '.' || (1 + (i % 255))::text || '.' || (1 + (i % 255))::text
    WHEN 1 THEN '185.220.' || (1 + (i % 255))::text || '.' || (1 + (i % 255))::text
    WHEN 2 THEN '46.165.' || (1 + (i % 255))::text || '.' || (1 + (i % 255))::text
    WHEN 3 THEN '185.100.' || (1 + (i % 255))::text || '.' || (1 + (i % 255))::text
    ELSE '177.32.' || (1 + (i % 255))::text || '.' || (1 + (i % 255))::text
  END,
  CASE (i % 5)
    WHEN 0 THEN 'Unknown'
    WHEN 1 THEN 'NL'
    WHEN 2 THEN 'DE'
    WHEN 3 THEN 'Unknown'
    ELSE 'BR'
  END,
  CASE (i % 5)
    WHEN 0 THEN 'Unknown'
    WHEN 1 THEN 'Amsterdam'
    WHEN 2 THEN 'Frankfurt'
    WHEN 3 THEN 'Unknown'
    ELSE 'Sao Paulo'
  END,
  CASE (i % 5)
    WHEN 0 THEN 'Multiple Locations'
    WHEN 1 THEN 'Proxy IP (Netherlands)'
    WHEN 2 THEN 'VPN (Germany)'
    WHEN 3 THEN 'TOR Exit Node'
    ELSE 'Sao Paulo, Brazil'
  END,
  (8 + (i % 14))::text || ':' || LPAD((i % 60)::text, 2, '0'),
  (8 + (i % 14))::text || ':' || LPAD((i % 60)::text, 2, '0'),
  NOW() - (i % 7 || ' days')::INTERVAL + ((8 + (i % 14)) || ' hours')::INTERVAL + ((i % 60) || ' minutes')::INTERVAL + ((i % 120) || ' seconds')::INTERVAL,
  'Automated Pattern',
  0.05 + (i % 5) * 0.01,
  'Robotic typing speed, no human variance',
  false, true, true, true, true, false,
  'Rapid successive login attempts detected - possible brute force',
  gen_random_uuid()::text,
  '104***' || LPAD((900 + (i % 100))::text, 3, '0'),
  'seed',
  'completed',
  'HIGH',
  0.90 + (i % 10) * 0.01,
  'BLOCK_RAPID',
  'Multiple rapid login attempts in short timeframe. Brute force attack pattern detected.',
  'Account temporarily locked. Security team notified.',
  jsonb_build_object(
    'rapid_attempts', true,
    'brute_force_pattern', true,
    'account_locked', true,
    'attempts_within_2_min', 5 + (i % 10)
  ),
  NOW() - (i % 7 || ' days')::INTERVAL + ((8 + (i % 14)) || ' hours')::INTERVAL + ((i % 60) || ' minutes')::INTERVAL + ((i % 120) || ' seconds')::INTERVAL + ((150 + (i % 350)) || ' milliseconds')::INTERVAL,
  150 + (i % 350),
  NOW() - (i % 7 || ' days')::INTERVAL + ((8 + (i % 14)) || ' hours')::INTERVAL + ((i % 60) || ' minutes')::INTERVAL + ((i % 120) || ' seconds')::INTERVAL
FROM generate_series(1, 25) AS i;

-- SCENARIO 6: Behavioral Deviation (5% = ~25 records)
-- Risk: HIGH, Action: CHALLENGE_BIOMETRIC
-- Characteristics: Known device but unusual typing/behavior patterns

INSERT INTO authentication_attempts (
  scenario_id, scenario_title, scenario_label,
  device, device_type, device_trusted,
  location, ip_address, ip_country, location_city, location_raw,
  time_of_attempt, login_time, login_timestamp,
  behavior_match, behavior_score, behavior_raw,
  time_anomaly, geo_anomaly, behavior_anomaly, geo_velocity_violation, is_brute_force, is_mid_session,
  trigger_description, session_id, user_identifier, source_tab,
  status, risk_level, risk_score, action_taken, ai_reasoning, outcome_description,
  decision_factors, processed_at, processing_time_ms, created_at
)
SELECT
  '6', 'Behavioral Deviation', 'Behavioral Deviation',
  CASE (i % 4)
    WHEN 0 THEN 'iPhone 14 Pro (Known)'
    WHEN 1 THEN 'Samsung Galaxy S24 (Known)'
    WHEN 2 THEN 'MacBook Pro (Known)'
    ELSE 'iPad Air (Known)'
  END,
  CASE WHEN (i % 4) < 2 THEN 'mobile' ELSE 'desktop' END,
  true,
  CASE (i % 4)
    WHEN 0 THEN 'Riyadh, SA (Home IP)'
    WHEN 1 THEN 'Jeddah, SA (Home IP)'
    WHEN 2 THEN 'Dammam, SA (Home IP)'
    ELSE 'Mecca, SA (Home IP)'
  END,
  CASE (i % 4)
    WHEN 0 THEN '192.168.' || (1 + (i % 10))::text || '.' || (100 + (i % 50))::text
    WHEN 1 THEN '10.0.' || (1 + (i % 10))::text || '.' || (100 + (i % 50))::text
    WHEN 2 THEN '172.16.' || (1 + (i % 10))::text || '.' || (100 + (i % 50))::text
    ELSE '192.168.' || (20 + (i % 10))::text || '.' || (100 + (i % 50))::text
  END,
  'SA',
  CASE (i % 4)
    WHEN 0 THEN 'Riyadh'
    WHEN 1 THEN 'Jeddah'
    WHEN 2 THEN 'Dammam'
    ELSE 'Mecca'
  END,
  CASE (i % 4)
    WHEN 0 THEN 'Riyadh, SA (Home IP)'
    WHEN 1 THEN 'Jeddah, SA (Home IP)'
    WHEN 2 THEN 'Dammam, SA (Home IP)'
    ELSE 'Mecca, SA (Home IP)'
  END,
  (8 + (i % 14))::text || ':' || LPAD((i % 60)::text, 2, '0'),
  (8 + (i % 14))::text || ':' || LPAD((i % 60)::text, 2, '0'),
  NOW() - (i % 7 || ' days')::INTERVAL + ((8 + (i % 14)) || ' hours')::INTERVAL + ((i % 60) || ' minutes')::INTERVAL,
  (12 + (i % 8))::text || '% Match',
  0.12 + (i % 8) * 0.01,
  'Severe behavioral mismatch - typing speed/rhythm completely different',
  false, false, true, false, false, false,
  'Known device but typing behavior does not match user baseline',
  gen_random_uuid()::text,
  '104***' || LPAD((900 + (i % 100))::text, 3, '0'),
  'seed',
  'completed',
  'HIGH',
  0.75 + (i % 20) * 0.01,
  'CHALLENGE_BIOMETRIC',
  'Severe behavioral deviation detected. Device and location match but typing pattern is completely different. Possible unauthorized access.',
  'Biometric challenge (Face ID) required. User verified successfully.',
  jsonb_build_object(
    'device_match', true,
    'location_match', true,
    'behavior_mismatch', true,
    'biometric_required', true,
    'face_id_passed', true
  ),
  NOW() - (i % 7 || ' days')::INTERVAL + ((8 + (i % 14)) || ' hours')::INTERVAL + ((i % 60) || ' minutes')::INTERVAL + ((300 + (i % 200)) || ' milliseconds')::INTERVAL,
  300 + (i % 200),
  NOW() - (i % 7 || ' days')::INTERVAL + ((8 + (i % 14)) || ' hours')::INTERVAL + ((i % 60) || ' minutes')::INTERVAL
FROM generate_series(1, 25) AS i;

-- SCENARIO 9: Continuous Monitoring (5% = ~25 records)
-- Risk: MEDIUM, Action: RE_AUTH
-- Characteristics: Mid-session behavioral drift requiring re-authentication

INSERT INTO authentication_attempts (
  scenario_id, scenario_title, scenario_label,
  device, device_type, device_trusted,
  location, ip_address, ip_country, location_city, location_raw,
  time_of_attempt, login_time, login_timestamp,
  behavior_match, behavior_score, behavior_raw,
  time_anomaly, geo_anomaly, behavior_anomaly, geo_velocity_violation, is_brute_force, is_mid_session,
  trigger_description, session_id, user_identifier, source_tab,
  status, risk_level, risk_score, action_taken, ai_reasoning, outcome_description,
  decision_factors, processed_at, processing_time_ms, created_at
)
SELECT
  '9', 'Continuous Monitoring', 'Continuous Monitoring',
  CASE (i % 5)
    WHEN 0 THEN 'iPhone 14 Pro (Known)'
    WHEN 1 THEN 'Samsung Galaxy S24 (Known)'
    WHEN 2 THEN 'iPad Air (Known)'
    WHEN 3 THEN 'MacBook Pro (Known)'
    ELSE 'iPhone 15 (Known)'
  END,
  CASE WHEN (i % 5) < 3 THEN 'mobile' ELSE 'desktop' END,
  true,
  CASE (i % 4)
    WHEN 0 THEN 'Riyadh, SA (Home IP)'
    WHEN 1 THEN 'Jeddah, SA (Home IP)'
    WHEN 2 THEN 'Dammam, SA (Home IP)'
    ELSE 'Mecca, SA (Home IP)'
  END,
  CASE (i % 4)
    WHEN 0 THEN '192.168.' || (1 + (i % 10))::text || '.' || (100 + (i % 50))::text
    WHEN 1 THEN '10.0.' || (1 + (i % 10))::text || '.' || (100 + (i % 50))::text
    WHEN 2 THEN '172.16.' || (1 + (i % 10))::text || '.' || (100 + (i % 50))::text
    ELSE '192.168.' || (20 + (i % 10))::text || '.' || (100 + (i % 50))::text
  END,
  'SA',
  CASE (i % 4)
    WHEN 0 THEN 'Riyadh'
    WHEN 1 THEN 'Jeddah'
    WHEN 2 THEN 'Dammam'
    ELSE 'Mecca'
  END,
  CASE (i % 4)
    WHEN 0 THEN 'Riyadh, SA (Home IP)'
    WHEN 1 THEN 'Jeddah, SA (Home IP)'
    WHEN 2 THEN 'Dammam, SA (Home IP)'
    ELSE 'Mecca, SA (Home IP)'
  END,
  (8 + (i % 14))::text || ':' || LPAD((i % 60)::text, 2, '0'),
  (8 + (i % 14))::text || ':' || LPAD((i % 60)::text, 2, '0'),
  NOW() - (i % 7 || ' days')::INTERVAL + ((8 + (i % 14)) || ' hours')::INTERVAL + ((i % 60) || ' minutes')::INTERVAL,
  (65 + (i % 15))::text || '% Match (Drifting)',
  0.65 + (i % 15) * 0.01,
  'Behavior started normal but drifting during session - possible session takeover',
  false, false, true, false, false, true,
  'Mid-session behavioral drift detected - pattern changing over time',
  gen_random_uuid()::text,
  '104***' || LPAD((900 + (i % 100))::text, 3, '0'),
  'seed',
  'completed',
  'MEDIUM',
  0.55 + (i % 20) * 0.01,
  'RE_AUTH',
  'Continuous monitoring detected behavioral drift mid-session. Requiring re-authentication for security.',
  'Re-authentication prompt sent. User verified with biometric.',
  jsonb_build_object(
    'device_match', true,
    'location_match', true,
    'mid_session_drift', true,
    'initial_behavior_score', 0.95,
    'current_behavior_score', 0.65 + (i % 15) * 0.01,
    're_auth_required', true
  ),
  NOW() - (i % 7 || ' days')::INTERVAL + ((8 + (i % 14)) || ' hours')::INTERVAL + ((i % 60) || ' minutes')::INTERVAL + ((220 + (i % 280)) || ' milliseconds')::INTERVAL,
  220 + (i % 280),
  NOW() - (i % 7 || ' days')::INTERVAL + ((8 + (i % 14)) || ' hours')::INTERVAL + ((i % 60) || ' minutes')::INTERVAL
FROM generate_series(1, 25) AS i;
