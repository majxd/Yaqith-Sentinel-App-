# GeoMap Component Installation Guide

## Overview

The GeoMap component provides an interactive world map visualization displaying authentication attempts with a cyber/SOC aesthetic.

## Installation Steps

### 1. Install Dependencies

The GeoMap component requires `react-simple-maps` for map rendering. Install it with:

```bash
npm install react-simple-maps
```

### 2. Files Created

The following files have been created/modified:

- **NEW**: `E:\Bahrain\KSA-Hackathon\Admin-app\components\GeoMap.tsx` - Main GeoMap component
- **MODIFIED**: `E:\Bahrain\KSA-Hackathon\Admin-app\App.tsx` - Updated navigation and routing

## Features Implemented

### Interactive World Map
- Dark-themed map with cyan-bordered countries
- Saudi Arabia highlighted with gold accent
- Zoom and pan capabilities

### Location Markers
- Color-coded by risk level:
  - Green: Low risk (mostly allowed attempts)
  - Amber: Medium risk (challenges)
  - Red: High risk (many blocks)
- Size based on attempt count
- Pulsing glow effects
- Click to view detailed popup

### Time Range Filters
- Last 24 Hours
- Last 7 Days
- Last 30 Days

### Real-Time Updates
- Live subscription to new authentication attempts
- Auto-refresh every 30s
- Animated marker additions

### Stats Dashboard
- Total attempts
- Unique locations
- Blocked attempts
- Challenged attempts

### Top Locations Panel
- Leaderboard of top 10 locations
- Country flags (emoji)
- Attack distribution bars
- Click to view location details

### Live Activity Feed
- Last 5 authentication attempts
- Time, location, and status
- Color-coded by action (ALLOW/CHALLENGE/BLOCK)

### Marker Popup
- Location name and flag
- Total attempts
- Breakdown by action (ALLOW/CHALLENGE/BLOCK)
- Last attempt timestamp

## Navigation

The GeoMap has been added to the sidebar under "COMMAND CENTER" with a Globe icon.

## Database Requirements

The component queries the `authentication_attempts` table with the following fields:
- `id`
- `location` / `location_city`
- `ip_country`
- `risk_level` (LOW/MEDIUM/HIGH)
- `action_taken` (ALLOW/CHALLENGE/BLOCK)
- `created_at`
- `scenario_title` / `scenario_label`
- `device_type`

## Real-Time Subscriptions

The component subscribes to INSERT events on the `authentication_attempts` table for live updates.

## Location Coordinates

Hardcoded coordinates are provided for:
- Saudi cities: Riyadh, Jeddah, Mecca, Dammam, Khobar, Dhahran, Madinah, Tabuk
- International: Dubai, Cairo, London, New York, Moscow, Beijing, Tokyo, Singapore, Sydney, Berlin, Paris, Sao Paulo, Mumbai

## Color Palette

Matches the ThreatAnalytics SOC theme:
- Deep Space: #0A0F1C (background)
- Navy Dark: #0D1421 (cards)
- Cyber Cyan: #00D4FF (borders, accents)
- Electric Green: #00FF88 (low risk)
- Warning Amber: #FFB800 (medium risk)
- Threat Red: #FF3366 (high risk)
- Saudi Gold: #D4AF37 (Saudi Arabia highlight)

## Usage

1. Install the dependency:
   ```bash
   npm install react-simple-maps
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Navigate to the "Geo Map" tab in the sidebar under "COMMAND CENTER"

4. Click on markers to view details
5. Use time range filters to adjust data view
6. Watch for live updates (indicated by pulsing red dot)

## Troubleshooting

If you encounter issues:

1. **Map not loading**: Ensure you have an internet connection (map topology is loaded from CDN)
2. **No markers appearing**: Check that you have data in the `authentication_attempts` table with valid `location_city` values matching the hardcoded coordinates
3. **Real-time not working**: Verify Supabase real-time is enabled for the `authentication_attempts` table

## Next Steps

Potential enhancements:
- Add geocoding service for automatic coordinate lookup
- Implement map clustering for high-density areas
- Add heatmap overlay option
- Export location data as CSV
- Add time-lapse playback feature
