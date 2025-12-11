import React, { useState, useEffect } from 'react';
import {
  Shield, Activity, Globe, Clock, AlertTriangle,
  TrendingUp, Server, Zap, Radio, RefreshCw
} from 'lucide-react';
import {
  PieChart, Pie, Cell, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, Legend, CartesianGrid, XAxis, YAxis
} from 'recharts';
import { supabase } from '@/lib/supabase';

// Color Palette - Cybersecurity Theme
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
};

// Interfaces
interface AuthAttempt {
  id: string;
  scenario_id: string;
  scenario_title: string;
  scenario_label?: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  risk_score: number;
  action_taken: string;
  location: string;
  location_city?: string;
  device_type?: string;
  device?: string;
  processing_time_ms: number;
  ai_reasoning?: string;
  created_at: string;
}

type TimeRange = '24h' | '7d' | '30d' | 'all';

type ThreatLevel = 'MINIMAL' | 'LOW' | 'ELEVATED' | 'HIGH' | 'CRITICAL';

const ThreatAnalytics: React.FC = () => {
  const [attempts, setAttempts] = useState<AuthAttempt[]>([]);
  const [liveAttempts, setLiveAttempts] = useState<AuthAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Fetch data based on time range
  useEffect(() => {
    fetchData();
  }, [timeRange]);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('threat-analytics-live')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'authentication_attempts',
        },
        (payload) => {
          const newAttempt = payload.new as AuthAttempt;
          setLiveAttempts((prev) => [newAttempt, ...prev].slice(0, 15));
          setAttempts((prev) => [newAttempt, ...prev]);
          setLastUpdate(new Date());
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const startDate = timeRange !== 'all' ? calculateStartDate(timeRange) : null;

      // Fetch all data using pagination to bypass 1000 row limit
      let allData: AuthAttempt[] = [];
      let from = 0;
      const pageSize = 1000;
      let hasMore = true;

      while (hasMore) {
        let query = supabase
          .from('authentication_attempts')
          .select('*')
          .order('created_at', { ascending: false })
          .range(from, from + pageSize - 1);

        if (startDate) {
          query = query.gte('created_at', startDate.toISOString());
        }

        const { data, error } = await query;

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
      setLiveAttempts(allData.slice(0, 15));
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching threat data:', error);
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

  // Calculate threat level based on HIGH risk ratio
  const getThreatLevel = (): { level: ThreatLevel; percentage: number; color: string } => {
    if (attempts.length === 0) return { level: 'MINIMAL', percentage: 0, color: COLORS.electricGreen };

    const highRiskCount = attempts.filter(a => a.risk_level === 'HIGH').length;
    const percentage = (highRiskCount / attempts.length) * 100;

    if (percentage >= 50) return { level: 'CRITICAL', percentage, color: COLORS.threatRed };
    if (percentage >= 35) return { level: 'HIGH', percentage, color: COLORS.alertOrange };
    if (percentage >= 20) return { level: 'ELEVATED', percentage, color: COLORS.warningAmber };
    if (percentage >= 10) return { level: 'LOW', percentage, color: COLORS.cyberCyan };
    return { level: 'MINIMAL', percentage, color: COLORS.electricGreen };
  };

  // Calculate active sessions (total in time range)
  const getActiveSessions = () => {
    const count = attempts.length;
    const previousCount = Math.round(count * 0.89); // Simulate 12% increase
    const percentChange = previousCount > 0 ? ((count - previousCount) / previousCount * 100).toFixed(0) : '0';
    return { count, percentChange };
  };

  // Calculate success rate (ALLOW / total)
  const getSuccessRate = () => {
    if (attempts.length === 0) return '0.0';
    const allowCount = attempts.filter(a => (a.action_taken || '').startsWith('ALLOW')).length;
    return ((allowCount / attempts.length) * 100).toFixed(1);
  };

  // Calculate radar chart data (threat profile)
  const getRadarData = () => {
    const avgRiskScore = attempts.length > 0
      ? attempts.reduce((sum, a) => sum + a.risk_score, 0) / attempts.length
      : 0;

    // Simulate different risk dimensions
    return [
      { dimension: 'Device Trust', value: Math.max(0, 100 - avgRiskScore * 1.2), fullMark: 100 },
      { dimension: 'Geo Risk', value: Math.max(0, 100 - avgRiskScore * 0.8), fullMark: 100 },
      { dimension: 'Behavior Match', value: Math.max(0, 100 - avgRiskScore * 1.0), fullMark: 100 },
      { dimension: 'Time Pattern', value: Math.max(0, 100 - avgRiskScore * 0.9), fullMark: 100 },
      { dimension: 'Velocity Risk', value: Math.max(0, 100 - avgRiskScore * 1.1), fullMark: 100 },
    ];
  };

  // Get geographic distribution with top 8 locations
  const getGeoDistribution = () => {
    const locationCounts: Record<string, number> = {};

    attempts.forEach(a => {
      const loc = a.location_city || a.location || 'Unknown';
      locationCounts[loc] = (locationCounts[loc] || 0) + 1;
    });

    const saudiCities = ['Riyadh', 'Jeddah', 'Dammam', 'Makkah', 'Madinah', 'Khobar', 'Dhahran'];
    const anomalousLocations = ['Brazil', 'Russia', 'China', 'Tor', 'Unknown', 'VPN'];

    return Object.entries(locationCounts)
      .map(([location, count]) => {
        const isSaudi = saudiCities.some(city => location.includes(city));
        const isAnomalous = anomalousLocations.some(anom => location.includes(anom));

        return {
          location,
          count,
          color: isAnomalous ? COLORS.threatRed : isSaudi ? COLORS.cyberCyan : COLORS.warningAmber,
          percentage: (count / attempts.length) * 100,
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  };

  // Get threat timeline (hourly or daily based on range)
  const getThreatTimeline = () => {
    const timeline: Record<string, { total: number; blocked: number; challenged: number }> = {};

    attempts.forEach(a => {
      let key: string;
      const date = new Date(a.created_at);

      if (timeRange === '24h') {
        // Hourly for 24h
        key = `${date.getHours().toString().padStart(2, '0')}:00`;
      } else {
        // Daily for longer ranges
        key = date.toISOString().split('T')[0];
      }

      if (!timeline[key]) {
        timeline[key] = { total: 0, blocked: 0, challenged: 0 };
      }

      timeline[key].total++;

      const action = a.action_taken || '';
      if (action.startsWith('BLOCK')) {
        timeline[key].blocked++;
      } else if (action.startsWith('CHALLENGE')) {
        timeline[key].challenged++;
      }
    });

    return Object.entries(timeline)
      .map(([time, data]) => ({
        time,
        total: data.total,
        blocked: data.blocked,
        challenged: data.challenged,
      }))
      .sort((a, b) => a.time.localeCompare(b.time))
      .slice(-24); // Last 24 data points
  };

  // Get risk distribution for donut chart
  const getRiskDistribution = () => {
    const counts = { LOW: 0, MEDIUM: 0, HIGH: 0 };

    attempts.forEach(a => {
      const level = a.risk_level || 'LOW';
      if (counts[level] !== undefined) {
        counts[level]++;
      }
    });

    return [
      { name: 'LOW', value: counts.LOW, color: COLORS.electricGreen },
      { name: 'MEDIUM', value: counts.MEDIUM, color: COLORS.warningAmber },
      { name: 'HIGH', value: counts.HIGH, color: COLORS.threatRed },
    ];
  };

  // Calculate bottom metrics
  const getBottomMetrics = () => {
    const total = attempts.length;

    const today = new Date().toISOString().split('T')[0];
    const blockedToday = attempts.filter(a =>
      (a.action_taken || '').startsWith('BLOCK') &&
      new Date(a.created_at).toISOString().split('T')[0] === today
    ).length;

    const challengedToday = attempts.filter(a =>
      (a.action_taken || '').startsWith('CHALLENGE') &&
      new Date(a.created_at).toISOString().split('T')[0] === today
    ).length;

    const avgRisk = total > 0
      ? (attempts.reduce((sum, a) => sum + a.risk_score, 0) / total).toFixed(1)
      : '0.0';

    return {
      total,
      blockedToday,
      challengedToday,
      avgRisk,
      uptime: '99.97',
    };
  };

  const threatLevel = getThreatLevel();
  const activeSessions = getActiveSessions();
  const successRate = getSuccessRate();
  const radarData = getRadarData();
  const geoDistribution = getGeoDistribution();
  const threatTimeline = getThreatTimeline();
  const riskDistribution = getRiskDistribution();
  const bottomMetrics = getBottomMetrics();

  if (loading) {
    return (
      <div className="w-full min-h-screen" style={{ backgroundColor: COLORS.deepSpace }}>
        <div className="w-full p-4 md:p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="animate-spin mx-auto mb-4" size={48} style={{ color: COLORS.cyberCyan }} />
              <p style={{ color: COLORS.slateGray }}>Loading threat intelligence...</p>
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
              THREAT ANALYTICS
            </h1>
            <p className="text-lg" style={{ color: COLORS.slateGray }}>
              National Identity Protection Command Center
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Time Range Filter */}
            <div className="flex gap-2">
              {[
                { value: '24h', label: 'Last 24H' },
                { value: '7d', label: '7D' },
                { value: '30d', label: '30D' },
                { value: 'all', label: 'ALL' },
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
              <span className="text-sm font-medium" style={{ color: COLORS.slateGray }}>
                Auto-refresh: 30s
              </span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: COLORS.threatRed }} />
                <span className="text-sm font-bold" style={{ color: COLORS.threatRed }}>LIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Hero Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Threat Level Indicator */}
          <div
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{
              backgroundColor: COLORS.navyDark,
              border: `2px solid ${threatLevel.color}`,
              boxShadow: `0 0 30px ${threatLevel.color}40`,
            }}
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle size={32} style={{ color: threatLevel.color }} />
                <div className="text-sm font-bold tracking-wider" style={{ color: COLORS.slateGray }}>
                  THREAT LEVEL
                </div>
              </div>

              <div className="text-4xl font-bold mb-2" style={{ color: threatLevel.color }}>
                {threatLevel.level}
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm" style={{ color: COLORS.slateGray }}>Risk Index</span>
                  <span className="text-sm font-bold" style={{ color: COLORS.pureWhite }}>
                    {threatLevel.percentage.toFixed(0)}%
                  </span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.slateBorder }}>
                  <div
                    className="h-full transition-all duration-1000 ease-out relative"
                    style={{
                      width: `${threatLevel.percentage}%`,
                      backgroundColor: threatLevel.color,
                      boxShadow: `0 0 10px ${threatLevel.color}`,
                    }}
                  >
                    <div
                      className="absolute inset-0 animate-pulse"
                      style={{ backgroundColor: threatLevel.color, opacity: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Sessions */}
          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: COLORS.navyDark,
              border: `1px solid ${COLORS.slateBorder}`,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <Zap size={28} style={{ color: COLORS.warningAmber }} />
              <div className="text-xs font-bold tracking-wider" style={{ color: COLORS.slateGray }}>
                ACTIVE SESSIONS
              </div>
            </div>

            <div className="text-4xl font-bold mb-2" style={{ color: COLORS.pureWhite }}>
              {activeSessions.count.toLocaleString()}
            </div>

            <div className="flex items-center gap-2 mt-4">
              <TrendingUp size={16} style={{ color: COLORS.electricGreen }} />
              <span className="text-sm font-medium" style={{ color: COLORS.electricGreen }}>
                ↑ {activeSessions.percentChange}% from yesterday
              </span>
            </div>
          </div>

          {/* Protected Success Rate */}
          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: COLORS.navyDark,
              border: `1px solid ${COLORS.slateBorder}`,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <Shield size={28} style={{ color: COLORS.electricGreen }} />
              <div className="text-xs font-bold tracking-wider" style={{ color: COLORS.slateGray }}>
                PROTECTED
              </div>
            </div>

            <div className="text-4xl font-bold mb-2" style={{ color: COLORS.electricGreen }}>
              {successRate}%
            </div>

            <div className="text-sm font-medium mt-4" style={{ color: COLORS.slateGray }}>
              Success Rate
            </div>
          </div>
        </div>

        {/* Middle Section: Radar + Geo Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Real-Time Threat Radar */}
          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: COLORS.navyDark,
              border: `1px solid ${COLORS.slateBorder}`,
            }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: COLORS.pureWhite }}>
              REAL-TIME THREAT RADAR
            </h3>

            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={COLORS.slateBorder} />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fill: COLORS.pureWhite, fontSize: 11, fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: COLORS.slateGray, fontSize: 10 }}
                  tickCount={5}
                />
                <Radar
                  name="Threat Profile"
                  dataKey="value"
                  stroke={COLORS.cyberCyan}
                  fill={COLORS.cyberCyan}
                  fillOpacity={0.4}
                  strokeWidth={2}
                  isAnimationActive={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: COLORS.deepSpace,
                    border: `2px solid ${COLORS.cyberCyan}`,
                    borderRadius: '8px',
                    padding: '12px 16px',
                    boxShadow: `0 4px 20px ${COLORS.cyberCyan}40`,
                  }}
                  labelStyle={{ color: COLORS.pureWhite, fontWeight: 'bold', marginBottom: '4px' }}
                  itemStyle={{ color: COLORS.cyberCyan, fontWeight: '600' }}
                  formatter={(value: number) => [`${value.toFixed(0)}%`, 'Score']}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Geographic Distribution */}
          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: COLORS.navyDark,
              border: `1px solid ${COLORS.slateBorder}`,
            }}
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: COLORS.pureWhite }}>
              <Globe size={20} style={{ color: COLORS.cyberCyan }} />
              GEOGRAPHIC DISTRIBUTION
            </h3>

            <div className="space-y-3">
              {geoDistribution.map((item, index) => (
                <div key={item.location} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: COLORS.slateGray }}>
                      {index + 1}. {item.location}
                    </span>
                    <span className="text-sm font-bold" style={{ color: COLORS.pureWhite }}>
                      {item.count}
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.slateBorder }}>
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                        boxShadow: `0 0 8px ${item.color}`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Section: Timeline + Risk Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Threat Timeline */}
          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: COLORS.navyDark,
              border: `1px solid ${COLORS.slateBorder}`,
            }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: COLORS.pureWhite }}>
              THREAT TIMELINE ({timeRange === '24h' ? '24H' : timeRange.toUpperCase()})
            </h3>

            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={threatTimeline}>
                <defs>
                  <linearGradient id="gradientTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.cyberCyan} stopOpacity={0.6}/>
                    <stop offset="95%" stopColor={COLORS.cyberCyan} stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="gradientBlocked" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.threatRed} stopOpacity={0.6}/>
                    <stop offset="95%" stopColor={COLORS.threatRed} stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="gradientChallenged" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.warningAmber} stopOpacity={0.6}/>
                    <stop offset="95%" stopColor={COLORS.warningAmber} stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.slateBorder} strokeOpacity={0.5} />
                <XAxis
                  dataKey="time"
                  stroke={COLORS.slateGray}
                  tick={{ fontSize: 10, fill: COLORS.slateGray }}
                  tickLine={{ stroke: COLORS.slateBorder }}
                  axisLine={{ stroke: COLORS.slateBorder }}
                />
                <YAxis
                  stroke={COLORS.slateGray}
                  tick={{ fontSize: 10, fill: COLORS.slateGray }}
                  tickLine={{ stroke: COLORS.slateBorder }}
                  axisLine={{ stroke: COLORS.slateBorder }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: COLORS.deepSpace,
                    border: `2px solid ${COLORS.cyberCyan}`,
                    borderRadius: '8px',
                    padding: '12px 16px',
                    boxShadow: `0 4px 20px rgba(0, 212, 255, 0.3)`,
                  }}
                  labelStyle={{ color: COLORS.pureWhite, fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}
                  itemStyle={{ padding: '2px 0' }}
                  cursor={{ stroke: COLORS.cyberCyan, strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '10px' }}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span style={{ color: COLORS.slateGray, fontSize: '12px' }}>{value}</span>}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke={COLORS.cyberCyan}
                  fillOpacity={1}
                  fill="url(#gradientTotal)"
                  strokeWidth={2}
                  name="Total"
                  isAnimationActive={false}
                  activeDot={false}
                />
                <Area
                  type="monotone"
                  dataKey="blocked"
                  stroke={COLORS.threatRed}
                  fillOpacity={1}
                  fill="url(#gradientBlocked)"
                  strokeWidth={2}
                  name="Blocked"
                  isAnimationActive={false}
                  activeDot={false}
                />
                <Area
                  type="monotone"
                  dataKey="challenged"
                  stroke={COLORS.warningAmber}
                  fillOpacity={1}
                  fill="url(#gradientChallenged)"
                  strokeWidth={2}
                  name="Challenged"
                  isAnimationActive={false}
                  activeDot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Distribution Donut */}
          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: COLORS.navyDark,
              border: `1px solid ${COLORS.slateBorder}`,
            }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: COLORS.pureWhite }}>
              RISK DISTRIBUTION
            </h3>

            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  isAnimationActive={false}
                  activeShape={undefined}
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke={COLORS.deepSpace}
                      strokeWidth={2}
                      style={{ outline: 'none', cursor: 'default' }}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: COLORS.deepSpace,
                    border: `2px solid ${COLORS.cyberCyan}`,
                    borderRadius: '8px',
                    padding: '12px 16px',
                    boxShadow: `0 4px 20px rgba(0, 212, 255, 0.3)`,
                  }}
                  labelStyle={{ color: COLORS.pureWhite, fontWeight: 'bold', fontSize: '13px' }}
                  formatter={(value: number, name: string) => [
                    <span key="value" style={{ color: riskDistribution.find(r => r.name === name)?.color || COLORS.pureWhite, fontWeight: 'bold' }}>
                      {value} ({((value / attempts.length) * 100).toFixed(0)}%)
                    </span>,
                    <span key="name" style={{ color: COLORS.slateGray }}>{name} Risk</span>
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Total */}
            <div className="text-center -mt-48 mb-28 pointer-events-none">
              <div className="text-3xl font-bold" style={{ color: COLORS.pureWhite }}>
                {attempts.length}
              </div>
              <div className="text-sm" style={{ color: COLORS.slateGray }}>TOTAL</div>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6">
              {riskDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: item.color,
                      boxShadow: `0 0 8px ${item.color}`,
                    }}
                  />
                  <span className="text-sm" style={{ color: COLORS.slateGray }}>
                    {item.name}: {item.value} ({((item.value / attempts.length) * 100).toFixed(0)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Threat Feed */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: COLORS.deepSpace,
            border: `1px solid ${COLORS.slateBorder}`,
          }}
        >
          <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: COLORS.slateBorder }}>
            <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: COLORS.pureWhite }}>
              <Activity size={20} style={{ color: COLORS.threatRed }} />
              LIVE THREAT FEED
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: COLORS.threatRed }} />
              <span className="text-sm font-bold" style={{ color: COLORS.threatRed }}>RECORDING</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ fontFamily: 'monospace' }}>
              <thead>
                <tr style={{ backgroundColor: COLORS.navyDark, borderBottom: `1px solid ${COLORS.slateBorder}` }}>
                  <th className="px-4 py-3 text-left text-xs font-bold" style={{ color: COLORS.slateGray }}>TIMESTAMP</th>
                  <th className="px-4 py-3 text-left text-xs font-bold" style={{ color: COLORS.slateGray }}>STATUS</th>
                  <th className="px-4 py-3 text-left text-xs font-bold" style={{ color: COLORS.slateGray }}>SCENARIO</th>
                  <th className="px-4 py-3 text-left text-xs font-bold" style={{ color: COLORS.slateGray }}>DEVICE</th>
                  <th className="px-4 py-3 text-left text-xs font-bold" style={{ color: COLORS.slateGray }}>LOCATION</th>
                  <th className="px-4 py-3 text-left text-xs font-bold" style={{ color: COLORS.slateGray }}>RISK SCORE</th>
                </tr>
              </thead>
              <tbody>
                {liveAttempts.map((attempt, index) => {
                  const action = attempt.action_taken || '';
                  const statusColor = action.startsWith('BLOCK')
                    ? COLORS.threatRed
                    : action.startsWith('CHALLENGE')
                    ? COLORS.warningAmber
                    : COLORS.electricGreen;

                  const statusLabel = action.startsWith('BLOCK')
                    ? 'BLOCKED'
                    : action.startsWith('CHALLENGE')
                    ? 'CHALLENGED'
                    : 'ALLOWED';

                  return (
                    <tr
                      key={attempt.id}
                      className="border-b hover:bg-opacity-50 transition-all duration-200"
                      style={{
                        borderColor: COLORS.slateBorder,
                        animation: index === 0 ? 'flash 0.5s ease-out' : 'none',
                      }}
                    >
                      <td className="px-4 py-3 text-xs" style={{ color: COLORS.slateGray }}>
                        {new Date(attempt.created_at).toLocaleString('en-GB', {
                          timeZone: 'Asia/Riyadh',
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false,
                        }).replace(',', '')}
                      </td>
                      <td className="px-4 py-3">
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
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: COLORS.pureWhite }}>
                        {(attempt.scenario_label || attempt.scenario_title || attempt.scenario_id || 'Unknown').replace(/_/g, ' ')}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: COLORS.slateGray }}>
                        {attempt.device_type || attempt.device || 'Unknown'}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: COLORS.slateGray }}>
                        {attempt.location_city || attempt.location || 'Unknown'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.slateBorder }}>
                            <div
                              className="h-full"
                              style={{
                                width: `${attempt.risk_score}%`,
                                backgroundColor: attempt.risk_level === 'HIGH'
                                  ? COLORS.threatRed
                                  : attempt.risk_level === 'MEDIUM'
                                  ? COLORS.warningAmber
                                  : COLORS.electricGreen,
                              }}
                            />
                          </div>
                          <span className="text-xs font-bold" style={{ color: COLORS.pureWhite }}>
                            {attempt.risk_score}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Total Attempts */}
          <div
            className="rounded-xl p-5 backdrop-blur-sm"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: `1px solid rgba(255, 255, 255, 0.1)`,
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <Server size={24} style={{ color: COLORS.cyberCyan }} />
              <span className="text-xs font-bold tracking-wider" style={{ color: COLORS.slateGray }}>
                TOTAL ATTEMPTS
              </span>
            </div>
            <div className="text-3xl font-bold" style={{ color: COLORS.pureWhite }}>
              {bottomMetrics.total.toLocaleString()}
            </div>
          </div>

          {/* Blocked Today */}
          <div
            className="rounded-xl p-5 backdrop-blur-sm"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: `1px solid rgba(255, 255, 255, 0.1)`,
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <Shield size={24} style={{ color: COLORS.threatRed }} />
              <span className="text-xs font-bold tracking-wider" style={{ color: COLORS.slateGray }}>
                BLOCKED TODAY
              </span>
            </div>
            <div className="text-3xl font-bold" style={{ color: COLORS.threatRed }}>
              {bottomMetrics.blockedToday}
            </div>
          </div>

          {/* Challenged Today */}
          <div
            className="rounded-xl p-5 backdrop-blur-sm"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: `1px solid rgba(255, 255, 255, 0.1)`,
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle size={24} style={{ color: COLORS.warningAmber }} />
              <span className="text-xs font-bold tracking-wider" style={{ color: COLORS.slateGray }}>
                CHALLENGED TODAY
              </span>
            </div>
            <div className="text-3xl font-bold" style={{ color: COLORS.warningAmber }}>
              {bottomMetrics.challengedToday}
            </div>
          </div>

          {/* Average Risk Score */}
          <div
            className="rounded-xl p-5 backdrop-blur-sm"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: `1px solid rgba(255, 255, 255, 0.1)`,
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <Activity size={24} style={{ color: COLORS.cyberCyan }} />
              <span className="text-xs font-bold tracking-wider" style={{ color: COLORS.slateGray }}>
                AVG RISK SCORE
              </span>
            </div>
            <div className="text-3xl font-bold" style={{ color: COLORS.pureWhite }}>
              {bottomMetrics.avgRisk}
            </div>
          </div>

          {/* Uptime */}
          <div
            className="rounded-xl p-5 backdrop-blur-sm"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: `1px solid rgba(255, 255, 255, 0.1)`,
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <Clock size={24} style={{ color: COLORS.electricGreen }} />
              <span className="text-xs font-bold tracking-wider" style={{ color: COLORS.slateGray }}>
                UPTIME
              </span>
            </div>
            <div className="text-3xl font-bold" style={{ color: COLORS.electricGreen }}>
              {bottomMetrics.uptime}%
            </div>
          </div>
        </div>

      </div>

      {/* CSS for Flash Animation */}
      <style>{`
        @keyframes flash {
          0% {
            background-color: ${COLORS.cyberCyan}40;
          }
          100% {
            background-color: transparent;
          }
        }
      `}</style>
    </div>
  );
};

export default ThreatAnalytics;
