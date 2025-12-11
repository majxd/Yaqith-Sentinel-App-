import React, { useState, useEffect, useRef } from 'react';
import {
  Globe, MapPin, Activity, TrendingUp, AlertTriangle,
  Clock, RefreshCw, Zap, Shield, Radio, ExternalLink
} from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '@/lib/supabase';

// Color Palette - Matching SOC Dashboard
const COLORS = {
  deepSpace: '#0A0F1C',
  navyDark: '#0D1421',
  slateBorder: '#1E293B',
  cyberCyan: '#00D4FF',
  electricGreen: '#00FF88',
  warningAmber: '#FFB800',
  threatRed: '#FF3366',
  alertOrange: '#FF6B35',
  pureWhite: '#FFFFFF',
  slateGray: '#94A3B8',
  saudiGold: '#D4AF37',
  neonPink: '#FF00FF',
  neonBlue: '#00BFFF',
};

// Location Coordinates (Hardcoded for Demo)
const LOCATION_COORDS: Record<string, { lat: number; lng: number; country: string }> = {
  // Saudi Arabia cities
  'Riyadh': { lat: 24.7136, lng: 46.6753, country: 'SA' },
  'Jeddah': { lat: 21.5433, lng: 39.1728, country: 'SA' },
  'Mecca': { lat: 21.4225, lng: 39.8262, country: 'SA' },
  'Makkah': { lat: 21.4225, lng: 39.8262, country: 'SA' },
  'Dammam': { lat: 26.4207, lng: 50.0888, country: 'SA' },
  'Khobar': { lat: 26.2172, lng: 50.1971, country: 'SA' },
  'Dhahran': { lat: 26.2361, lng: 50.0393, country: 'SA' },
  'Madinah': { lat: 24.5247, lng: 39.5692, country: 'SA' },
  'Medina': { lat: 24.5247, lng: 39.5692, country: 'SA' },
  'Tabuk': { lat: 28.3998, lng: 36.5783, country: 'SA' },
  'Abha': { lat: 18.2164, lng: 42.5053, country: 'SA' },
  'Taif': { lat: 21.2703, lng: 40.4158, country: 'SA' },
  'Buraidah': { lat: 26.3267, lng: 43.9750, country: 'SA' },
  'Najran': { lat: 17.4922, lng: 44.1277, country: 'SA' },
  'Yanbu': { lat: 24.0895, lng: 38.0618, country: 'SA' },

  // Middle East
  'Dubai': { lat: 25.2048, lng: 55.2708, country: 'AE' },
  'Abu Dhabi': { lat: 24.4539, lng: 54.3773, country: 'AE' },
  'Cairo': { lat: 30.0444, lng: 31.2357, country: 'EG' },
  'Kuwait City': { lat: 29.3759, lng: 47.9774, country: 'KW' },
  'Manama': { lat: 26.2285, lng: 50.5860, country: 'BH' },
  'Doha': { lat: 25.2854, lng: 51.5310, country: 'QA' },
  'Muscat': { lat: 23.5880, lng: 58.3829, country: 'OM' },
  'Amman': { lat: 31.9454, lng: 35.9284, country: 'JO' },
  'Baghdad': { lat: 33.3152, lng: 44.3661, country: 'IQ' },
  'Tehran': { lat: 35.6892, lng: 51.3890, country: 'IR' },

  // Europe
  'London': { lat: 51.5074, lng: -0.1278, country: 'GB' },
  'Berlin': { lat: 52.5200, lng: 13.4050, country: 'DE' },
  'Paris': { lat: 48.8566, lng: 2.3522, country: 'FR' },
  'Amsterdam': { lat: 52.3676, lng: 4.9041, country: 'NL' },
  'Frankfurt': { lat: 50.1109, lng: 8.6821, country: 'DE' },
  'Stockholm': { lat: 59.3293, lng: 18.0686, country: 'SE' },
  'Oslo': { lat: 59.9139, lng: 10.7522, country: 'NO' },
  'Helsinki': { lat: 60.1699, lng: 24.9384, country: 'FI' },
  'Warsaw': { lat: 52.2297, lng: 21.0122, country: 'PL' },
  'Prague': { lat: 50.0755, lng: 14.4378, country: 'CZ' },
  'Vienna': { lat: 48.2082, lng: 16.3738, country: 'AT' },
  'Rome': { lat: 41.9028, lng: 12.4964, country: 'IT' },
  'Madrid': { lat: 40.4168, lng: -3.7038, country: 'ES' },

  // Americas - USA (expanded)
  'New York': { lat: 40.7128, lng: -74.0060, country: 'US' },
  'Los Angeles': { lat: 34.0522, lng: -118.2437, country: 'US' },
  'Chicago': { lat: 41.8781, lng: -87.6298, country: 'US' },
  'Houston': { lat: 29.7604, lng: -95.3698, country: 'US' },
  'Phoenix': { lat: 33.4484, lng: -112.0740, country: 'US' },
  'Philadelphia': { lat: 39.9526, lng: -75.1652, country: 'US' },
  'San Antonio': { lat: 29.4241, lng: -98.4936, country: 'US' },
  'San Diego': { lat: 32.7157, lng: -117.1611, country: 'US' },
  'Dallas': { lat: 32.7767, lng: -96.7970, country: 'US' },
  'San Jose': { lat: 37.3382, lng: -121.8863, country: 'US' },
  'Austin': { lat: 30.2672, lng: -97.7431, country: 'US' },
  'San Francisco': { lat: 37.7749, lng: -122.4194, country: 'US' },
  'Seattle': { lat: 47.6062, lng: -122.3321, country: 'US' },
  'Denver': { lat: 39.7392, lng: -104.9903, country: 'US' },
  'Boston': { lat: 42.3601, lng: -71.0589, country: 'US' },
  'Miami': { lat: 25.7617, lng: -80.1918, country: 'US' },
  'Atlanta': { lat: 33.7490, lng: -84.3880, country: 'US' },
  'Las Vegas': { lat: 36.1699, lng: -115.1398, country: 'US' },
  'Portland': { lat: 45.5051, lng: -122.6750, country: 'US' },
  'Detroit': { lat: 42.3314, lng: -83.0458, country: 'US' },
  'Minneapolis': { lat: 44.9778, lng: -93.2650, country: 'US' },
  'Washington DC': { lat: 38.9072, lng: -77.0369, country: 'US' },
  // Americas - Other
  'Toronto': { lat: 43.6532, lng: -79.3832, country: 'CA' },
  'Vancouver': { lat: 49.2827, lng: -123.1207, country: 'CA' },
  'Montreal': { lat: 45.5017, lng: -73.5673, country: 'CA' },
  'Sao Paulo': { lat: -23.5505, lng: -46.6333, country: 'BR' },
  'Buenos Aires': { lat: -34.6037, lng: -58.3816, country: 'AR' },
  'Mexico City': { lat: 19.4326, lng: -99.1332, country: 'MX' },

  // Asia
  'Moscow': { lat: 55.7558, lng: 37.6173, country: 'RU' },
  'Beijing': { lat: 39.9042, lng: 116.4074, country: 'CN' },
  'Shanghai': { lat: 31.2304, lng: 121.4737, country: 'CN' },
  'Hong Kong': { lat: 22.3193, lng: 114.1694, country: 'HK' },
  'Tokyo': { lat: 35.6762, lng: 139.6503, country: 'JP' },
  'Singapore': { lat: 1.3521, lng: 103.8198, country: 'SG' },
  'Seoul': { lat: 37.5665, lng: 126.9780, country: 'KR' },
  'Mumbai': { lat: 19.0760, lng: 72.8777, country: 'IN' },
  'Delhi': { lat: 28.6139, lng: 77.2090, country: 'IN' },
  'Bangalore': { lat: 12.9716, lng: 77.5946, country: 'IN' },
  'Hyderabad': { lat: 17.3850, lng: 78.4867, country: 'IN' },
  'Karachi': { lat: 24.8607, lng: 67.0011, country: 'PK' },
  'Lahore': { lat: 31.5497, lng: 74.3436, country: 'PK' },
  'Islamabad': { lat: 33.6844, lng: 73.0479, country: 'PK' },
  'Dhaka': { lat: 23.8103, lng: 90.4125, country: 'BD' },
  'Chittagong': { lat: 22.3569, lng: 91.7832, country: 'BD' },
  'Bangkok': { lat: 13.7563, lng: 100.5018, country: 'TH' },
  'Jakarta': { lat: -6.2088, lng: 106.8456, country: 'ID' },
  'Kuala Lumpur': { lat: 3.1390, lng: 101.6869, country: 'MY' },

  // Oceania
  'Sydney': { lat: -33.8688, lng: 151.2093, country: 'AU' },
  'Melbourne': { lat: -37.8136, lng: 144.9631, country: 'AU' },

  // Africa
  'Lagos': { lat: 6.5244, lng: 3.3792, country: 'NG' },
  'Johannesburg': { lat: -26.2041, lng: 28.0473, country: 'ZA' },
  'Nairobi': { lat: -1.2921, lng: 36.8219, country: 'KE' },

  // Country fallbacks
  'Saudi Arabia': { lat: 24.0, lng: 45.0, country: 'SA' },
  'Brazil': { lat: -14.2350, lng: -51.9253, country: 'BR' },
  'Russia': { lat: 61.5240, lng: 105.3188, country: 'RU' },
  'China': { lat: 35.8617, lng: 104.1954, country: 'CN' },

  // Special
  'VPN': { lat: 0, lng: 0, country: 'XX' },
  'Tor': { lat: 0, lng: 0, country: 'XX' },
  'Unknown': { lat: 0, lng: 0, country: 'XX' },
};

// Country flags (emoji)
const COUNTRY_FLAGS: Record<string, string> = {
  // Middle East
  'SA': '🇸🇦', 'AE': '🇦🇪', 'EG': '🇪🇬', 'KW': '🇰🇼', 'BH': '🇧🇭',
  'QA': '🇶🇦', 'OM': '🇴🇲', 'JO': '🇯🇴', 'IQ': '🇮🇶', 'IR': '🇮🇷',
  // Europe
  'GB': '🇬🇧', 'DE': '🇩🇪', 'FR': '🇫🇷', 'NL': '🇳🇱', 'SE': '🇸🇪',
  'NO': '🇳🇴', 'FI': '🇫🇮', 'PL': '🇵🇱', 'CZ': '🇨🇿', 'AT': '🇦🇹',
  'IT': '🇮🇹', 'ES': '🇪🇸',
  // Americas
  'US': '🇺🇸', 'CA': '🇨🇦', 'BR': '🇧🇷', 'AR': '🇦🇷', 'MX': '🇲🇽',
  // Asia
  'RU': '🇷🇺', 'CN': '🇨🇳', 'HK': '🇭🇰', 'JP': '🇯🇵', 'SG': '🇸🇬',
  'KR': '🇰🇷', 'IN': '🇮🇳', 'TH': '🇹🇭', 'ID': '🇮🇩', 'MY': '🇲🇾',
  'PK': '🇵🇰', 'BD': '🇧🇩',
  // Oceania
  'AU': '🇦🇺',
  // Africa
  'NG': '🇳🇬', 'ZA': '🇿🇦', 'KE': '🇰🇪',
  // Unknown
  'XX': '❓',
};

interface AuthAttempt {
  id: string;
  location: string;
  location_city?: string;
  ip_country?: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  action_taken: string;
  created_at: string;
  scenario_title?: string;
  scenario_label?: string;
  device_type?: string;
}

interface GeoMarker {
  location: string;
  lat: number;
  lng: number;
  country: string;
  totalCount: number;
  allowCount: number;
  challengeCount: number;
  blockCount: number;
  lastAttempt: string;
  color: string;
  riskLevel: 'low' | 'medium' | 'high';
}

type TimeRange = '24h' | '7d' | '30d';
type FilterType = 'all' | 'blocked' | 'challenged' | 'allowed';

// Map controller component for zoom/pan
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const GeoMap: React.FC = () => {
  const [attempts, setAttempts] = useState<AuthAttempt[]>([]);
  const [markers, setMarkers] = useState<GeoMarker[]>([]);
  const [recentActivity, setRecentActivity] = useState<AuthAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [selectedMarker, setSelectedMarker] = useState<GeoMarker | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [mapCenter, setMapCenter] = useState<[number, number]>([25, 20]);
  const [mapZoom, setMapZoom] = useState(2);

  // Fetch data based on time range
  useEffect(() => {
    fetchData();
  }, [timeRange]);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('geo-map-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'authentication_attempts',
        },
        (payload) => {
          const newAttempt = payload.new as AuthAttempt;
          setAttempts((prev) => [newAttempt, ...prev]);
          setRecentActivity((prev) => [newAttempt, ...prev].slice(0, 5));
          setLastUpdate(new Date());
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Update markers when attempts or filter changes
  useEffect(() => {
    processGeoData();
  }, [attempts, activeFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const startDate = calculateStartDate(timeRange);

      // Fetch all data using pagination to bypass 1000 row limit
      let allData: AuthAttempt[] = [];
      let from = 0;
      const pageSize = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await supabase
          .from('authentication_attempts')
          .select('*')
          .gte('created_at', startDate.toISOString())
          .order('created_at', { ascending: false })
          .range(from, from + pageSize - 1);

        if (error) throw error;

        if (data && data.length > 0) {
          allData = [...allData, ...data];
          from += pageSize;
          hasMore = data.length === pageSize;
        } else {
          hasMore = false;
        }
      }

      setAttempts(allData);
      setRecentActivity(allData.slice(0, 5));
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching geo data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStartDate = (range: TimeRange): Date => {
    const now = new Date();
    switch (range) {
      case '24h':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default:
        return new Date(0);
    }
  };

  const processGeoData = () => {
    const locationMap: Record<string, GeoMarker> = {};

    // Filter attempts based on activeFilter
    const filteredAttempts = attempts.filter((attempt) => {
      const action = attempt.action_taken || '';
      switch (activeFilter) {
        case 'blocked':
          return action.startsWith('BLOCK');
        case 'challenged':
          return action.startsWith('CHALLENGE');
        case 'allowed':
          return action.startsWith('ALLOW');
        default:
          return true;
      }
    });

    filteredAttempts.forEach((attempt) => {
      const location = attempt.location_city || attempt.location || 'Unknown';

      // Skip if location not in our coordinate map
      if (!LOCATION_COORDS[location]) return;

      if (!locationMap[location]) {
        const coords = LOCATION_COORDS[location];
        locationMap[location] = {
          location,
          lat: coords.lat,
          lng: coords.lng,
          country: coords.country,
          totalCount: 0,
          allowCount: 0,
          challengeCount: 0,
          blockCount: 0,
          lastAttempt: attempt.created_at,
          color: COLORS.electricGreen,
          riskLevel: 'low',
        };
      }

      const marker = locationMap[location];
      marker.totalCount++;

      const action = attempt.action_taken || '';
      if (action.startsWith('ALLOW')) {
        marker.allowCount++;
      } else if (action.startsWith('CHALLENGE')) {
        marker.challengeCount++;
      } else if (action.startsWith('BLOCK')) {
        marker.blockCount++;
      }

      // Update last attempt if more recent
      if (new Date(attempt.created_at) > new Date(marker.lastAttempt)) {
        marker.lastAttempt = attempt.created_at;
      }
    });

    // Calculate marker colors based on risk distribution
    Object.values(locationMap).forEach((marker) => {
      const blockRatio = marker.blockCount / marker.totalCount;
      const challengeRatio = marker.challengeCount / marker.totalCount;

      if (blockRatio > 0.3) {
        marker.color = COLORS.neonPink;
        marker.riskLevel = 'high';
      } else if (blockRatio > 0.1 || challengeRatio > 0.3) {
        marker.color = COLORS.warningAmber;
        marker.riskLevel = 'medium';
      } else {
        marker.color = COLORS.electricGreen;
        marker.riskLevel = 'low';
      }
    });

    setMarkers(Object.values(locationMap));
  };

  // Get top locations sorted by count
  const getTopLocations = () => {
    return [...markers]
      .sort((a, b) => b.totalCount - a.totalCount)
      .slice(0, 10);
  };

  // Calculate stats
  const getStats = () => {
    const total = attempts.length;
    const locations = new Set(attempts.map(a => a.location_city || a.location)).size;
    const blocked = attempts.filter(a => (a.action_taken || '').startsWith('BLOCK')).length;
    const challenged = attempts.filter(a => (a.action_taken || '').startsWith('CHALLENGE')).length;

    return { total, locations, blocked, challenged };
  };

  const stats = getStats();
  const topLocations = getTopLocations();

  // Get marker radius based on count
  const getMarkerRadius = (count: number) => {
    return Math.min(Math.max(6, Math.sqrt(count) * 2), 20);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen" style={{ backgroundColor: COLORS.deepSpace }}>
        <div className="w-full p-4 md:p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="animate-spin mx-auto mb-4" size={48} style={{ color: COLORS.cyberCyan }} />
              <p style={{ color: COLORS.slateGray }}>Loading geolocation data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: COLORS.deepSpace }}>
      <div className="w-full p-4 md:p-8 space-y-6">

        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.pureWhite }}>
              GLOBAL THREAT MAP
            </h1>
            <p className="text-lg" style={{ color: COLORS.slateGray }}>
              Interactive visualization of authentication activity
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Time Range Filter */}
            <div className="flex gap-2">
              {[
                { value: '24h', label: 'Last 24H' },
                { value: '7d', label: '7D' },
                { value: '30d', label: '30D' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTimeRange(option.value as TimeRange)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                  style={{
                    backgroundColor: timeRange === option.value ? COLORS.cyberCyan : COLORS.navyDark,
                    color: timeRange === option.value ? COLORS.deepSpace : COLORS.slateGray,
                    border: `1px solid ${COLORS.slateBorder}`,
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Live Status */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg" style={{ backgroundColor: COLORS.navyDark, border: `1px solid ${COLORS.slateBorder}` }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: COLORS.threatRed }} />
                <span className="text-sm font-bold" style={{ color: COLORS.threatRed }}>LIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Clickable Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveFilter('all')}
            className="rounded-xl p-5 text-left transition-all duration-200 hover:scale-[1.02]"
            style={{
              backgroundColor: COLORS.navyDark,
              border: activeFilter === 'all' ? `2px solid ${COLORS.cyberCyan}` : `1px solid ${COLORS.slateBorder}`,
              boxShadow: activeFilter === 'all' ? `0 0 20px ${COLORS.cyberCyan}40` : 'none',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Globe size={24} style={{ color: COLORS.cyberCyan }} />
              <span className="text-xs font-bold tracking-wider" style={{ color: COLORS.slateGray }}>
                TOTAL ATTEMPTS
              </span>
            </div>
            <div className="text-3xl font-bold" style={{ color: COLORS.pureWhite }}>
              {stats.total.toLocaleString()}
            </div>
            {activeFilter === 'all' && (
              <div className="text-xs mt-2 font-semibold" style={{ color: COLORS.cyberCyan }}>
                SHOWING ALL
              </div>
            )}
          </button>

          <button
            onClick={() => setActiveFilter(activeFilter === 'allowed' ? 'all' : 'allowed')}
            className="rounded-xl p-5 text-left transition-all duration-200 hover:scale-[1.02]"
            style={{
              backgroundColor: COLORS.navyDark,
              border: activeFilter === 'allowed' ? `2px solid ${COLORS.electricGreen}` : `1px solid ${COLORS.slateBorder}`,
              boxShadow: activeFilter === 'allowed' ? `0 0 20px ${COLORS.electricGreen}40` : 'none',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <MapPin size={24} style={{ color: COLORS.electricGreen }} />
              <span className="text-xs font-bold tracking-wider" style={{ color: COLORS.slateGray }}>
                ALLOWED
              </span>
            </div>
            <div className="text-3xl font-bold" style={{ color: COLORS.electricGreen }}>
              {stats.total - stats.blocked - stats.challenged}
            </div>
            {activeFilter === 'allowed' && (
              <div className="text-xs mt-2 font-semibold" style={{ color: COLORS.electricGreen }}>
                FILTER ACTIVE
              </div>
            )}
          </button>

          <button
            onClick={() => setActiveFilter(activeFilter === 'blocked' ? 'all' : 'blocked')}
            className="rounded-xl p-5 text-left transition-all duration-200 hover:scale-[1.02]"
            style={{
              backgroundColor: COLORS.navyDark,
              border: activeFilter === 'blocked' ? `2px solid ${COLORS.neonPink}` : `1px solid ${COLORS.slateBorder}`,
              boxShadow: activeFilter === 'blocked' ? `0 0 20px ${COLORS.neonPink}40` : 'none',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Shield size={24} style={{ color: COLORS.neonPink }} />
              <span className="text-xs font-bold tracking-wider" style={{ color: COLORS.slateGray }}>
                BLOCKED
              </span>
            </div>
            <div className="text-3xl font-bold" style={{ color: COLORS.neonPink }}>
              {stats.blocked}
            </div>
            {activeFilter === 'blocked' && (
              <div className="text-xs mt-2 font-semibold" style={{ color: COLORS.neonPink }}>
                FILTER ACTIVE
              </div>
            )}
          </button>

          <button
            onClick={() => setActiveFilter(activeFilter === 'challenged' ? 'all' : 'challenged')}
            className="rounded-xl p-5 text-left transition-all duration-200 hover:scale-[1.02]"
            style={{
              backgroundColor: COLORS.navyDark,
              border: activeFilter === 'challenged' ? `2px solid ${COLORS.warningAmber}` : `1px solid ${COLORS.slateBorder}`,
              boxShadow: activeFilter === 'challenged' ? `0 0 20px ${COLORS.warningAmber}40` : 'none',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle size={24} style={{ color: COLORS.warningAmber }} />
              <span className="text-xs font-bold tracking-wider" style={{ color: COLORS.slateGray }}>
                CHALLENGED
              </span>
            </div>
            <div className="text-3xl font-bold" style={{ color: COLORS.warningAmber }}>
              {stats.challenged}
            </div>
            {activeFilter === 'challenged' && (
              <div className="text-xs mt-2 font-semibold" style={{ color: COLORS.warningAmber }}>
                FILTER ACTIVE
              </div>
            )}
          </button>
        </div>

        {/* Main Map Section */}
        <div
          className="rounded-2xl overflow-hidden relative"
          style={{
            backgroundColor: COLORS.navyDark,
            border: `1px solid ${COLORS.slateBorder}`,
            height: '600px',
          }}
        >
          {/* Filter Indicator */}
          {activeFilter !== 'all' && (
            <div
              className="absolute top-4 left-4 z-[1000] px-3 py-2 rounded-lg flex items-center gap-2"
              style={{
                backgroundColor: COLORS.navyDark,
                border: `1px solid ${activeFilter === 'blocked' ? COLORS.neonPink : activeFilter === 'challenged' ? COLORS.warningAmber : COLORS.electricGreen}`,
              }}
            >
              <span className="text-xs font-bold" style={{ color: activeFilter === 'blocked' ? COLORS.neonPink : activeFilter === 'challenged' ? COLORS.warningAmber : COLORS.electricGreen }}>
                FILTER: {activeFilter.toUpperCase()}
              </span>
              <button
                onClick={() => setActiveFilter('all')}
                className="text-xs hover:opacity-70"
                style={{ color: COLORS.slateGray }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Legend */}
          <div
            className="absolute bottom-4 right-4 z-[1000] p-4 rounded-lg"
            style={{
              backgroundColor: 'rgba(13, 20, 33, 0.95)',
              border: `1px solid ${COLORS.slateBorder}`,
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="text-xs font-bold mb-3" style={{ color: COLORS.pureWhite }}>
              THREAT LEGEND
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.electricGreen, boxShadow: `0 0 10px ${COLORS.electricGreen}` }} />
                <span className="text-xs" style={{ color: COLORS.slateGray }}>Low Risk (Allowed)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.warningAmber, boxShadow: `0 0 10px ${COLORS.warningAmber}` }} />
                <span className="text-xs" style={{ color: COLORS.slateGray }}>Medium Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.neonPink, boxShadow: `0 0 10px ${COLORS.neonPink}` }} />
                <span className="text-xs" style={{ color: COLORS.slateGray }}>High Risk</span>
              </div>
            </div>
          </div>

          {/* Leaflet Map */}
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%', background: '#0A0F1C' }}
            zoomControl={true}
            scrollWheelZoom={true}
          >
            {/* Dark Map Tiles - CartoDB Dark Matter */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* Markers with static glow effect (layered circles) */}
            {markers.map((marker) => {
              const radius = getMarkerRadius(marker.totalCount);

              return (
                <React.Fragment key={marker.location}>
                  {/* Outer glow - largest, most transparent */}
                  <CircleMarker
                    center={[marker.lat, marker.lng]}
                    radius={radius + 8}
                    pathOptions={{
                      fillColor: marker.color,
                      fillOpacity: 0.12,
                      color: 'transparent',
                      weight: 0,
                    }}
                  />
                  {/* Middle glow */}
                  <CircleMarker
                    center={[marker.lat, marker.lng]}
                    radius={radius + 4}
                    pathOptions={{
                      fillColor: marker.color,
                      fillOpacity: 0.25,
                      color: 'transparent',
                      weight: 0,
                    }}
                  />
                  {/* Main marker - solid center */}
                  <CircleMarker
                    center={[marker.lat, marker.lng]}
                    radius={radius}
                    pathOptions={{
                      fillColor: marker.color,
                      fillOpacity: 0.9,
                      color: marker.color,
                      weight: 2,
                      opacity: 1,
                    }}
                    eventHandlers={{
                      click: () => setSelectedMarker(marker),
                    }}
                  >
                  <Popup>
                    <div style={{ minWidth: '250px', padding: '8px' }}>
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-600">
                        <span className="text-2xl">{COUNTRY_FLAGS[marker.country] || '🌍'}</span>
                        <div>
                          <div className="font-bold text-lg">{marker.location}</div>
                          <div className="text-xs text-gray-400">{marker.country}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="text-center">
                          <div className="text-lg font-bold" style={{ color: COLORS.electricGreen }}>{marker.allowCount}</div>
                          <div className="text-xs text-gray-400">Allowed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold" style={{ color: COLORS.warningAmber }}>{marker.challengeCount}</div>
                          <div className="text-xs text-gray-400">Challenged</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold" style={{ color: COLORS.neonPink }}>{marker.blockCount}</div>
                          <div className="text-xs text-gray-400">Blocked</div>
                        </div>
                      </div>

                      <div className="text-center pt-2 border-t border-gray-600">
                        <div className="text-2xl font-bold">{marker.totalCount}</div>
                        <div className="text-xs text-gray-400">Total Attempts</div>
                      </div>
                    </div>
                  </Popup>
                  </CircleMarker>
                </React.Fragment>
              );
            })}

            <MapController center={mapCenter} zoom={mapZoom} />
          </MapContainer>
        </div>

        {/* Bottom Section: Top Locations & Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Top Locations */}
          <div
            className="rounded-2xl p-6 col-span-2"
            style={{
              backgroundColor: COLORS.navyDark,
              border: `1px solid ${COLORS.slateBorder}`,
            }}
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: COLORS.pureWhite }}>
              <TrendingUp size={20} style={{ color: COLORS.cyberCyan }} />
              TOP LOCATIONS
            </h3>

            <div className="space-y-3">
              {topLocations.map((location, index) => {
                const percentage = (location.totalCount / stats.total) * 100;

                return (
                  <div
                    key={location.location}
                    className="flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-opacity-50 transition-all"
                    style={{ backgroundColor: COLORS.deepSpace }}
                    onClick={() => setSelectedMarker(location)}
                  >
                    <div className="text-2xl font-bold" style={{ color: COLORS.slateGray }}>
                      #{index + 1}
                    </div>
                    <div className="text-2xl">
                      {COUNTRY_FLAGS[location.country] || '🌍'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold" style={{ color: COLORS.pureWhite }}>
                          {location.location}
                        </span>
                        <span className="text-sm font-bold" style={{ color: location.color }}>
                          {location.totalCount} attempts
                        </span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.slateBorder }}>
                        <div
                          className="h-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: location.color,
                            boxShadow: `0 0 8px ${location.color}`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div className="text-xs" style={{ color: COLORS.electricGreen }}>
                        {location.allowCount}
                      </div>
                      <div className="text-xs" style={{ color: COLORS.slateGray }}>/</div>
                      <div className="text-xs" style={{ color: COLORS.warningAmber }}>
                        {location.challengeCount}
                      </div>
                      <div className="text-xs" style={{ color: COLORS.slateGray }}>/</div>
                      <div className="text-xs" style={{ color: COLORS.neonPink }}>
                        {location.blockCount}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: COLORS.navyDark,
              border: `1px solid ${COLORS.slateBorder}`,
            }}
          >
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: COLORS.slateBorder }}>
              <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: COLORS.pureWhite }}>
                <Radio size={20} style={{ color: COLORS.threatRed }} />
                LIVE FEED
              </h3>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: COLORS.threatRed }} />
            </div>

            <div className="p-4 space-y-3">
              {recentActivity.map((attempt, index) => {
                const action = attempt.action_taken || '';
                const statusColor = action.startsWith('BLOCK')
                  ? COLORS.neonPink
                  : action.startsWith('CHALLENGE')
                  ? COLORS.warningAmber
                  : COLORS.electricGreen;

                const statusLabel = action.startsWith('BLOCK')
                  ? 'BLOCKED'
                  : action.startsWith('CHALLENGE')
                  ? 'CHALLENGED'
                  : 'ALLOWED';

                const location = attempt.location_city || attempt.location || 'Unknown';
                const country = LOCATION_COORDS[location]?.country || 'XX';

                return (
                  <div
                    key={attempt.id}
                    className="p-3 rounded-lg"
                    style={{
                      backgroundColor: COLORS.deepSpace,
                      animation: index === 0 ? 'slideIn 0.5s ease-out' : 'none',
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{COUNTRY_FLAGS[country] || '🌍'}</span>
                        <span className="text-sm font-semibold" style={{ color: COLORS.pureWhite }}>
                          {location}
                        </span>
                      </div>
                      <span
                        className="px-2 py-1 rounded text-xs font-bold"
                        style={{
                          backgroundColor: `${statusColor}20`,
                          color: statusColor,
                          border: `1px solid ${statusColor}`,
                        }}
                      >
                        {statusLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: COLORS.slateGray }}>
                      <Clock size={12} />
                      {new Date(attempt.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations & Leaflet Overrides */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        /* Leaflet dark theme overrides */
        .leaflet-container {
          background: #0A0F1C;
        }

        .leaflet-control-zoom {
          border: 1px solid #1E293B !important;
          background: #0D1421 !important;
        }

        .leaflet-control-zoom a {
          background: #0D1421 !important;
          color: #00D4FF !important;
          border-bottom: 1px solid #1E293B !important;
        }

        .leaflet-control-zoom a:hover {
          background: #1E293B !important;
          color: #FFFFFF !important;
        }

        .leaflet-control-attribution {
          background: rgba(13, 20, 33, 0.8) !important;
          color: #94A3B8 !important;
        }

        .leaflet-control-attribution a {
          color: #00D4FF !important;
        }

        .leaflet-popup-content-wrapper {
          background: rgba(13, 20, 33, 0.95) !important;
          color: #FFFFFF !important;
          border: 1px solid #1E293B !important;
          border-radius: 12px !important;
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.3) !important;
        }

        .leaflet-popup-tip {
          background: rgba(13, 20, 33, 0.95) !important;
          border-right: 1px solid #1E293B !important;
          border-bottom: 1px solid #1E293B !important;
        }

        .leaflet-popup-close-button {
          color: #94A3B8 !important;
        }

        .leaflet-popup-close-button:hover {
          color: #FFFFFF !important;
        }
      `}</style>
    </div>
  );
};

export default GeoMap;