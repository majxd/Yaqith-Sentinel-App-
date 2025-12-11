import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Activity,
  Terminal,
  Smartphone,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  Shield,
  Globe,
  Zap,
  BarChart3
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface AuthenticationAttempt {
  id: string;
  created_at: string;
  scenario_id: string;
  scenario_label: string;
  device_type: string | null;
  device_trusted: boolean | null;
  ip_address: string | null;
  ip_country: string | null;
  location_city: string | null;
  location_raw: string | null;
  behavior_score: number | null;
  behavior_raw: string | null;
  login_time: string | null;
  login_timestamp: string | null;
  time_anomaly: boolean | null;
  geo_anomaly: boolean | null;
  behavior_anomaly: boolean | null;
  geo_velocity_violation: boolean | null;
  is_brute_force: boolean | null;
  is_mid_session: boolean | null;
  trigger_description: string | null;
  session_id: string | null;
  user_identifier: string | null;
  source_tab: string | null;
  status: string;
  risk_level: string | null;
  risk_score: number | null;
  action_taken: string | null;
  ai_analysis: string | null;
  outcome_description: string | null;
  decision_factors: any | null;
  processed_at: string | null;
  processing_time_ms: number | null;
}

const LiveMonitor: React.FC = () => {
  const [attempts, setAttempts] = useState<AuthenticationAttempt[]>([]);
  const [selectedAttempt, setSelectedAttempt] = useState<AuthenticationAttempt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [flashId, setFlashId] = useState<string | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [simulationLogs]);

  // Convert UTC timestamp to Saudi Arabia time (UTC+3) - full timestamp
  const toSaudiTimestamp = (utcTimestamp: string): string => {
    const date = new Date(utcTimestamp);
    return date.toLocaleString('en-GB', {
      timeZone: 'Asia/Riyadh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).replace(',', '');
  };

  // Convert UTC timestamp to Saudi Arabia time (UTC+3) - time only
  const toSaudiTime = (utcTimestamp: string): string => {
    const date = new Date(utcTimestamp);
    return date.toLocaleTimeString('en-GB', {
      timeZone: 'Asia/Riyadh',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      timeZone: 'Asia/Riyadh'
    });
    setSimulationLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  // Simulate analyzing animation for pending records
  useEffect(() => {
    if (selectedAttempt && selectedAttempt.status === 'pending') {
      setSimulationProgress(0);
      setSimulationLogs([]);

      addLog(`INITIATING SESSION: ${selectedAttempt.scenario_label}`);
      addLog(`User Identity Claim: ${selectedAttempt.user_identifier || '104***921'}`);

      const interval = setInterval(() => {
        setSimulationProgress(prev => {
          if (prev < 78) {
            return prev + 2;
          }
          return prev;
        });
      }, 100);

      const timeouts = [
        setTimeout(() => {
          addLog('Collecting Device Fingerprint...');
          addLog(`Device: ${selectedAttempt.device_type || 'Unknown'}`);
          addLog('Analyzing Network Signals...');
          addLog(`IP Origin: ${selectedAttempt.ip_country || 'Unknown'}`);
        }, 500),
        setTimeout(() => {
          addLog('Querying Behavioral Engine...');
          if (selectedAttempt.behavior_score) {
            addLog(`Typing Cadence Score: ${selectedAttempt.behavior_score}`);
          }
          addLog('Cross-referencing Threat Intelligence DB...');
        }, 1500),
        setTimeout(() => {
          addLog('Awaiting AI Risk Analysis...');
          addLog('Processing authentication context...');
        }, 2500),
      ];

      return () => {
        clearInterval(interval);
        timeouts.forEach(timeout => clearTimeout(timeout));
      };
    } else if (selectedAttempt && selectedAttempt.status === 'completed') {
      setSimulationProgress(100);
      setSimulationLogs([]);

      addLog(`SESSION COMPLETED: ${selectedAttempt.scenario_label}`);
      addLog(`User Identity: ${selectedAttempt.user_identifier || '104***921'}`);
      addLog(`Device: ${selectedAttempt.device_type || 'Unknown'}`);
      addLog(`Location: ${selectedAttempt.location_city || 'Unknown'}, ${selectedAttempt.ip_country || 'Unknown'}`);
      if (selectedAttempt.behavior_score) {
        addLog(`Behavior Score: ${selectedAttempt.behavior_score}`);
      }
      addLog(`Final Risk Score: ${selectedAttempt.risk_score ? (selectedAttempt.risk_score * 100).toFixed(0) : 'N/A'}`);
      addLog(`Risk Level: ${selectedAttempt.risk_level || 'N/A'}`);
      addLog(`DECISION: ${selectedAttempt.action_taken || 'PENDING'}`);
      if (selectedAttempt.ai_analysis) {
        addLog(`Analysis: ${selectedAttempt.ai_analysis}`);
      }
    }
  }, [selectedAttempt]);

  // Load initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { data, error } = await supabase
          .from('authentication_attempts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(200);

        if (error) throw error;

        setAttempts(data || []);
        if (data && data.length > 0) {
          setSelectedAttempt(data[0]);
        }
      } catch (error) {
        console.error('Error fetching attempts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Subscribe to real-time changes
  useEffect(() => {
    if (!autoRefresh) return;

    const channel = supabase
      .channel('live-monitor-realtime')
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'authentication_attempts'
        },
        (payload) => {
          const newAttempt = payload.new as AuthenticationAttempt;

          // Add new record to top of list
          setAttempts(prev => [newAttempt, ...prev].slice(0, 50));

          // Auto-select the new record (regardless of status)
          setSelectedAttempt(newAttempt);

          // Trigger flash animation
          setFlashId(newAttempt.id);
          setTimeout(() => setFlashId(null), 1500);
        }
      )
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'authentication_attempts'
        },
        (payload) => {
          const updatedAttempt = payload.new as AuthenticationAttempt;
          setAttempts(prev => prev.map(attempt =>
            attempt.id === updatedAttempt.id ? updatedAttempt : attempt
          ));
          // Update selected attempt if it's the one being updated
          if (selectedAttempt?.id === updatedAttempt.id) {
            setSelectedAttempt(updatedAttempt);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [autoRefresh, selectedAttempt?.id]);

  const getActionBadge = (attempt: AuthenticationAttempt) => {
    if (attempt.status === 'pending') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-semibold">
          <RefreshCw size={12} className="animate-spin" />
          Analyzing...
        </span>
      );
    }

    const action = attempt.action_taken || 'UNKNOWN';
    if (action.includes('ALLOW')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-100 text-green-700 text-xs font-semibold">
          <CheckCircle size={12} />
          ALLOW
        </span>
      );
    } else if (action.includes('BLOCK')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-100 text-red-700 text-xs font-semibold">
          <XCircle size={12} />
          BLOCK
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-100 text-yellow-700 text-xs font-semibold">
          <AlertTriangle size={12} />
          CHALLENGE
        </span>
      );
    }
  };

  const getRiskLevelColor = (level: string | null) => {
    switch (level) {
      case 'LOW': return 'text-green-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'HIGH': return 'text-red-600';
      default: return 'text-slate-400';
    }
  };

  const getRiskColor = (level: string | null) => {
    switch (level) {
      case 'LOW': return '#22c55e';
      case 'MEDIUM': return '#eab308';
      case 'HIGH': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  // Compute live analytics from attempts data
  const computeAnalytics = () => {
    const total = attempts.length;
    if (total === 0) return null;

    const allowed = attempts.filter(a => a.action_taken?.includes('ALLOW')).length;
    const blocked = attempts.filter(a => a.action_taken?.includes('BLOCK')).length;
    const challenged = attempts.filter(a => a.action_taken?.includes('CHALLENGE')).length;

    const highRisk = attempts.filter(a => a.risk_level === 'HIGH').length;
    const mediumRisk = attempts.filter(a => a.risk_level === 'MEDIUM').length;
    const lowRisk = attempts.filter(a => a.risk_level === 'LOW').length;

    // Compute average risk score
    const avgRiskScore = attempts.reduce((sum, a) => sum + (a.risk_score || 0), 0) / total;

    // Get top locations
    const locationCounts: Record<string, number> = {};
    attempts.forEach(a => {
      const loc = a.location_city || 'Unknown';
      locationCounts[loc] = (locationCounts[loc] || 0) + 1;
    });
    const topLocations = Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    // Get device distribution
    const deviceCounts: Record<string, number> = {};
    attempts.forEach(a => {
      const device = a.device_type?.split('(')[0].trim() || 'Unknown';
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    });
    const topDevices = Object.entries(deviceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    // Threat rate (blocked / total)
    const threatRate = (blocked / total) * 100;

    // Challenge rate
    const challengeRate = (challenged / total) * 100;

    // Success rate (allowed / total)
    const successRate = (allowed / total) * 100;

    return {
      total,
      allowed,
      blocked,
      challenged,
      highRisk,
      mediumRisk,
      lowRisk,
      avgRiskScore,
      topLocations,
      topDevices,
      threatRate,
      challengeRate,
      successRate
    };
  };

  const analytics = computeAnalytics();

  const riskData = selectedAttempt ? [
    { name: 'Risk', value: (selectedAttempt.risk_score || 0) * 100 },
    { name: 'Safety', value: 100 - ((selectedAttempt.risk_score || 0) * 100) },
  ] : [];

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-cyan-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Loading live data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* LEFT PANEL: Recent Attempts List */}
      <section className="w-full lg:w-5/12 xl:w-4/12 space-y-4" aria-label="Recent Attempts">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-600" />
            Recent Attempts
          </h3>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              autoRefresh
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
            Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
            {attempts.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Radio className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No authentication attempts yet</p>
                <p className="text-xs mt-1">Waiting for activity from User App...</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {attempts.map((attempt) => (
                  <button
                    key={attempt.id}
                    onClick={() => setSelectedAttempt(attempt)}
                    className={`w-full text-left p-4 transition-all focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-400 ${
                      selectedAttempt?.id === attempt.id
                        ? 'bg-cyan-50 border-l-4 border-cyan-500'
                        : 'hover:bg-slate-50'
                    } ${
                      attempt.status === 'pending'
                        ? 'border-l-4 border-blue-500 animate-pulse'
                        : ''
                    } ${
                      flashId === attempt.id
                        ? 'animate-flash'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock size={12} className="text-slate-400 flex-shrink-0" />
                          <span className="text-xs font-mono text-slate-500">
                            {toSaudiTimestamp(attempt.created_at)}
                          </span>
                        </div>
                        <h4 className="font-semibold text-slate-800 text-sm mb-2 truncate">
                          {attempt.scenario_label}
                        </h4>
                        <div className="flex items-center gap-2 mb-2">
                          {getActionBadge(attempt)}
                          <span className={`text-xs font-semibold ${getRiskLevelColor(attempt.risk_level)}`}>
                            {attempt.risk_level || '...'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1 truncate">
                            <Smartphone size={10} />
                            {attempt.device_type?.split('(')[0].trim() || 'Unknown'}
                          </span>
                          <span className="flex items-center gap-1 truncate">
                            <MapPin size={10} />
                            {attempt.location_city || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RIGHT PANEL: AI Inspector */}
      <section className="w-full lg:w-7/12 xl:w-8/12 flex flex-col gap-6" aria-label="AI Inspector">
        {!selectedAttempt ? (
          <div className="bg-slate-100 rounded-xl p-12 text-center h-full flex items-center justify-center">
            <div>
              <ShieldAlert className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 text-lg">Select an authentication attempt to view details</p>
            </div>
          </div>
        ) : (
          <>
            {/* Main Status Card */}
            <div className="bg-slate-900 text-white rounded-xl shadow-lg p-6 relative overflow-hidden min-h-[400px] flex flex-col">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Activity size={120} aria-hidden="true" />
              </div>

              {/* Header */}
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <h2 className="text-2xl font-bold">AI Agency Interceptor</h2>
                  <p className="text-slate-400 text-sm">Real-time Identity Verification Layer</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Session ID</div>
                  <div className="text-xs font-mono text-slate-300">
                    {selectedAttempt.session_id?.slice(0, 8) || selectedAttempt.id.slice(0, 8)}...
                  </div>
                </div>
              </div>

              {/* Visualization Area */}
              <div className="flex-1 flex items-center justify-center relative z-10">
                {selectedAttempt.status === 'pending' ? (
                  <div className="w-full max-w-md space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs uppercase tracking-wider text-slate-400 font-bold">
                        <span>Scanning Vectors</span>
                        <span>{simulationProgress}%</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={simulationProgress} aria-valuemin={0} aria-valuemax={100}>
                        <div
                          className="h-full bg-cyan-500 transition-all duration-500 ease-out"
                          style={{ width: `${simulationProgress}%` }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className={`p-3 rounded-lg border ${simulationProgress >= 20 ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400' : 'border-slate-700 bg-slate-800 text-slate-500'} transition-all`}>
                        <Smartphone className="w-6 h-6 mx-auto mb-2" aria-hidden="true" />
                        <span className="text-xs font-bold">Device</span>
                      </div>
                      <div className={`p-3 rounded-lg border ${simulationProgress >= 45 ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400' : 'border-slate-700 bg-slate-800 text-slate-500'} transition-all`}>
                        <Activity className="w-6 h-6 mx-auto mb-2" aria-hidden="true" />
                        <span className="text-xs font-bold">Behavior</span>
                      </div>
                      <div className={`p-3 rounded-lg border ${simulationProgress >= 70 ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400' : 'border-slate-700 bg-slate-800 text-slate-500'} transition-all`}>
                        <ShieldAlert className="w-6 h-6 mx-auto mb-2" aria-hidden="true" />
                        <span className="text-xs font-bold">Risk</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="relative w-40 h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={riskData}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            startAngle={180}
                            endAngle={0}
                            stroke="none"
                          >
                            <Cell key="cell-risk" fill={getRiskColor(selectedAttempt.risk_level)} />
                            <Cell key="cell-safe" fill="#334155" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                        <span className="text-3xl font-bold" style={{ color: getRiskColor(selectedAttempt.risk_level) }}>
                          {selectedAttempt.risk_score ? ((selectedAttempt.risk_score * 100).toFixed(0)) : 'N/A'}
                        </span>
                        <span className="text-xs text-slate-400 uppercase tracking-widest">Risk Score</span>
                      </div>
                    </div>

                    <div className="mt-4 text-center">
                      <h3 className="text-xl font-bold mb-1" style={{ color: getRiskColor(selectedAttempt.risk_level) }}>
                        {selectedAttempt.action_taken || 'PENDING'}
                      </h3>
                      <p className="text-slate-400 text-sm max-w-md">
                        {selectedAttempt.outcome_description || 'Processing authentication request...'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Console Log */}
            <div className="bg-slate-900 text-green-400 rounded-xl shadow-md p-4 font-mono text-xs h-48 overflow-y-auto border border-slate-800 custom-scrollbar" role="log" aria-live="polite">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800 text-slate-500">
                <Terminal size={14} aria-hidden="true" />
                <span>System Log</span>
              </div>
              <div className="space-y-1">
                {simulationLogs.length === 0 ? (
                  <span className="text-slate-600 italic">// Awaiting session data...</span>
                ) : (
                  simulationLogs.map((log, i) => (
                    <div key={i} className="break-words">{log}</div>
                  ))
                )}
                <div ref={logsEndRef} />
              </div>
            </div>

            {/* Live Analytics Cards */}
            {analytics && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Threat Detection Rate */}
                <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <Shield className="w-4 h-4 text-red-400" />
                    </div>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Threats Blocked</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-red-400">{analytics.blocked}</span>
                    <span className="text-xs text-slate-500 mb-1">({analytics.threatRate.toFixed(1)}%)</span>
                  </div>
                  <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${analytics.threatRate}%` }} />
                  </div>
                </div>

                {/* Success Rate */}
                <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Allowed</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-green-400">{analytics.allowed}</span>
                    <span className="text-xs text-slate-500 mb-1">({analytics.successRate.toFixed(1)}%)</span>
                  </div>
                  <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${analytics.successRate}%` }} />
                  </div>
                </div>

                {/* Challenged */}
                <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    </div>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Challenged</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-yellow-400">{analytics.challenged}</span>
                    <span className="text-xs text-slate-500 mb-1">({analytics.challengeRate.toFixed(1)}%)</span>
                  </div>
                  <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${analytics.challengeRate}%` }} />
                  </div>
                </div>

                {/* Average Risk Score */}
                <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-cyan-500/20 rounded-lg">
                      <BarChart3 className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avg Risk</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-cyan-400">{(analytics.avgRiskScore * 100).toFixed(0)}</span>
                    <span className="text-xs text-slate-500 mb-1">/ 100</span>
                  </div>
                  <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${analytics.avgRiskScore > 0.6 ? 'bg-red-500' : analytics.avgRiskScore > 0.3 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${analytics.avgRiskScore * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Secondary Analytics Row */}
            {analytics && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Top Locations */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-4 h-4 text-cyan-600" />
                    <span className="text-sm font-semibold text-slate-700">Top Locations</span>
                  </div>
                  <div className="space-y-2">
                    {analytics.topLocations.map(([location, count], idx) => (
                      <div key={location} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold ${
                            idx === 0 ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="text-sm text-slate-700">{location}</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-500">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Distribution */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-cyan-600" />
                    <span className="text-sm font-semibold text-slate-700">Risk Distribution</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-sm text-slate-600">High Risk</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-700">{analytics.highRisk}</span>
                        <span className="text-xs text-slate-400">({((analytics.highRisk / analytics.total) * 100).toFixed(0)}%)</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <span className="text-sm text-slate-600">Medium Risk</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-700">{analytics.mediumRisk}</span>
                        <span className="text-xs text-slate-400">({((analytics.mediumRisk / analytics.total) * 100).toFixed(0)}%)</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-sm text-slate-600">Low Risk</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-700">{analytics.lowRisk}</span>
                        <span className="text-xs text-slate-400">({((analytics.lowRisk / analytics.total) * 100).toFixed(0)}%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <style>{`
        @keyframes flash {
          0% { background-color: rgba(0, 255, 136, 0.4); }
          100% { background-color: transparent; }
        }
        .animate-flash {
          animation: flash 1.5s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .bg-slate-900 .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b;
        }
        .bg-slate-900 .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
        }
        .bg-slate-900 .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
      </div>
    </div>
  );
};

export default LiveMonitor;
