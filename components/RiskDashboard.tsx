import React from 'react';
import { AlertTriangle, CheckCircle, Shield, Globe, Smartphone, Clock, Search, Filter, Ban, AlertOctagon } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { SCENARIOS } from '../constants';
import { RiskLevel, ScenarioType } from '../types';

const RiskDashboard: React.FC = () => {
  
  // Helper to map Scenario types to realistic user names for the demo
  const getUserForScenario = (id: ScenarioType) => {
    switch(id) {
      case ScenarioType.NORMAL_LOGIN: return 'Ahmed Al-Saud';
      case ScenarioType.NEW_DEVICE: return 'Sara Khalid';
      case ScenarioType.SUSPICIOUS_TIME: return 'Fahad M.';
      case ScenarioType.LOCATION_ANOMALY: return 'Unknown (Proxy)';
      case ScenarioType.RAPID_LOGIN: return 'Botnet Cluster';
      case ScenarioType.BEHAVIORAL_DEVIATION: return 'Compromised User';
      case ScenarioType.CONTINUOUS_MONITORING: return 'Session #9921';
      default: return 'Guest User';
    }
  };

  // Convert Scenarios constant to Table Data
  const sessions = Object.values(SCENARIOS).map((scenario, index) => ({
    id: `SES-89${20 + index}`,
    scenarioLabel: scenario.label,
    user: getUserForScenario(scenario.id),
    ip: scenario.telemetry.ipCountry,
    device: scenario.telemetry.deviceType,
    score: Math.round(scenario.riskScore * 100),
    riskLevel: scenario.riskLevel,
    action: scenario.details.action,
    timestamp: scenario.telemetry.timestamp
  }));

  const chartData = [
    { name: 'Normal', value: 4500, color: '#22c55e' },
    { name: 'Step-Up', value: 1200, color: '#eab308' },
    { name: 'Blocked', value: 340, color: '#ef4444' },
    { name: 'Review', value: 150, color: '#f97316' },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-red-600';     // High risk -> Red
    if (score >= 50) return 'text-yellow-600';  // Medium risk -> Yellow
    return 'text-green-600';                    // Low risk -> Green
  };

  const getRiskBadge = (level: RiskLevel) => {
    switch(level) {
      case RiskLevel.LOW: return 'bg-green-100 text-green-800 border-green-200';
      case RiskLevel.MEDIUM: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case RiskLevel.HIGH: return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4" aria-label="System Statistics">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-slate-500 text-xs uppercase font-bold">Monitored Sessions</div>
            <div className="text-2xl font-bold text-slate-800">14,203</div>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg" aria-hidden="true"><Globe size={20}/></div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-slate-500 text-xs uppercase font-bold">Threats Neutralized</div>
            <div className="text-2xl font-bold text-slate-800">1,892</div>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-lg" aria-hidden="true"><Shield size={20}/></div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-slate-500 text-xs uppercase font-bold">Avg Trust Score</div>
            <div className="text-2xl font-bold text-green-600">94.2%</div>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-lg" aria-hidden="true"><CheckCircle size={20}/></div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-slate-500 text-xs uppercase font-bold">Processing Latency</div>
            <div className="text-2xl font-bold text-slate-800">45ms</div>
          </div>
          <div className="p-3 bg-slate-50 text-slate-600 rounded-lg" aria-hidden="true"><Clock size={20}/></div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Table */}
        <section className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
             <div>
               <h2 className="font-bold text-lg text-slate-800">Live Session Monitor</h2>
               <p className="text-xs text-slate-500">Real-time mapping of the 7 Strategic Scenarios</p>
             </div>
             <div className="flex gap-2">
               <button className="p-2 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" aria-label="Search Sessions"><Search size={18} /></button>
               <button className="p-2 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" aria-label="Filter Sessions"><Filter size={18} /></button>
             </div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left" aria-label="Active Security Sessions Table">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th scope="col" className="px-6 py-3">Session</th>
                  <th scope="col" className="px-6 py-3">Identity / Context</th>
                  <th scope="col" className="px-6 py-3">Telemetry</th>
                  <th scope="col" className="px-6 py-3">Risk Score</th>
                  <th scope="col" className="px-6 py-3">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-slate-500">{s.id}</div>
                      <div className="font-bold text-slate-700 text-xs mt-1">{s.timestamp}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{s.user}</div>
                      <div className="text-xs text-slate-500">{s.scenarioLabel}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                       <div className="flex items-center gap-2 text-xs mb-1">
                         <Globe size={12} className="text-slate-400" aria-hidden="true" /> {s.ip}
                       </div>
                       <div className="flex items-center gap-2 text-xs">
                         <Smartphone size={12} className="text-slate-400" aria-hidden="true" /> {s.device}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden" aria-hidden="true">
                          <div 
                            className={`h-full ${s.score >= 90 ? 'bg-red-500' : s.score >= 50 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                            style={{ width: `${s.score}%` }}
                          />
                        </div>
                        <span className={`font-bold text-xs ${getScoreColor(s.score)}`} aria-label={`Score: ${s.score} percent`}>{s.score}</span>
                      </div>
                      <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${getRiskBadge(s.riskLevel)}`}>
                        {s.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2 font-bold text-xs text-slate-700">
                         {s.riskLevel === RiskLevel.LOW && <CheckCircle size={14} className="text-green-500" aria-hidden="true" />}
                         {s.riskLevel === RiskLevel.MEDIUM && <AlertTriangle size={14} className="text-yellow-500" aria-hidden="true" />}
                         {s.riskLevel === RiskLevel.HIGH && <Ban size={14} className="text-red-500" aria-hidden="true" />}
                         {s.action}
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Side Chart & Anomalies */}
        <aside className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6">
           
           <div>
             <h3 className="font-bold text-slate-800 mb-4">Traffic Disposition</h3>
             <div className="h-48">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData} layout="vertical" margin={{ left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={70} tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20} aria-label="Session disposition counts">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
           </div>

           <div className="space-y-3">
             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Alerts (Priority)</h4>
             <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs" role="alert">
                <div className="font-bold text-red-800 mb-1 flex items-center gap-2">
                  <AlertOctagon size={14} aria-hidden="true" /> IMPOSSIBLE TRAVEL
                </div>
                <p className="text-red-700">Scenario #4 Triggered: User logged in from Riyadh and Brazil within 15 minutes.</p>
             </div>
             <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-xs" role="alert">
                <div className="font-bold text-yellow-800 mb-1 flex items-center gap-2">
                  <Smartphone size={14} aria-hidden="true" /> EMULATOR DETECTED
                </div>
                <p className="text-yellow-700">Scenario #6 Triggered: Linear mouse movement detected on 12 active sessions.</p>
             </div>
           </div>
        </aside>
      </div>

    </div>
  );
};

export default RiskDashboard;