import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, RotateCw, AlertTriangle, CheckCircle, XCircle, 
  Smartphone, Monitor, MapPin, Clock, Fingerprint, ShieldAlert,
  Terminal, Activity
} from 'lucide-react';
import { SCENARIOS } from '../constants';
import { RiskLevel, Scenario, ScenarioType, SimulationState } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Simulation: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<ScenarioType>(ScenarioType.NORMAL_LOGIN);
  const [simState, setSimState] = useState<SimulationState>({
    step: 'IDLE',
    progress: 0,
    logs: []
  });

  const scenario = SCENARIOS[selectedScenarioId];
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll logs to bottom
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [simState.logs]);

  const addLog = (message: string) => {
    setSimState(prev => ({
      ...prev,
      logs: [...prev.logs, `[${new Date().toLocaleTimeString().split(' ')[0]}] ${message}`]
    }));
  };

  const runSimulation = () => {
    setSimState({ step: 'SCANNING', progress: 0, logs: [] });
    addLog(`INITIATING SESSION: ${scenario.label}`);
    addLog(`User Identity Claim: 104***921`);

    // Step 1: Scanning (Simulate latency)
    setTimeout(() => {
      addLog('Collecting Device Fingerprint...');
      addLog(`Device: ${scenario.telemetry.deviceType}`);
      addLog('Analyzing Network Signals...');
      addLog(`IP Origin: ${scenario.telemetry.ipCountry}`);
      setSimState(prev => ({ ...prev, step: 'ANALYZING', progress: 33 }));
      
      // Step 2: Analyzing
      setTimeout(() => {
        addLog('Querying Behavioral Engine...');
        addLog(`Typing Cadence Score: ${scenario.telemetry.behaviorScore}`);
        addLog('Cross-referencing Threat Intelligence DB...');
        if (scenario.riskLevel === RiskLevel.HIGH) {
            addLog('WARNING: Anomaly Detected in Vector Analysis.');
        } else if (scenario.riskLevel === RiskLevel.MEDIUM) {
            addLog('NOTICE: Deviation from baseline pattern.');
        } else {
            addLog('Pattern Match: 99.8% (Historical Baseline).');
        }
        setSimState(prev => ({ ...prev, step: 'DECISION', progress: 66 }));

        // Step 3: Decision
        setTimeout(() => {
          addLog(`CALCULATING RISK SCORE...`);
          addLog(`Final Score: ${scenario.riskScore.toFixed(2)}`);
          addLog(`DECISION: ${scenario.details.action.toUpperCase()}`);
          setSimState(prev => ({ ...prev, step: 'COMPLETE', progress: 100 }));
        }, 1500);

      }, 2000);

    }, 1500);
  };

  const resetSimulation = () => {
    setSimState({ step: 'IDLE', progress: 0, logs: [] });
  };

  // Color mapping for risk
  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.LOW: return '#22c55e'; // Green-500
      case RiskLevel.MEDIUM: return '#eab308'; // Yellow-500
      case RiskLevel.HIGH: return '#ef4444'; // Red-500
    }
  };

  const riskData = [
    { name: 'Risk', value: scenario.riskScore * 100 },
    { name: 'Safety', value: 100 - (scenario.riskScore * 100) },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* LEFT PANEL: Controls & Scenario Info */}
      <section className="w-full lg:w-1/3 space-y-6" aria-label="Scenario Controls">
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-green-600" aria-hidden="true" />
            Select Scenario
          </h3>
          <div className="space-y-2" role="radiogroup" aria-label="Available Scenarios">
            {Object.values(SCENARIOS).map((s) => (
              <button
                key={s.id}
                role="radio"
                aria-checked={selectedScenarioId === s.id}
                onClick={() => { setSelectedScenarioId(s.id); resetSimulation(); }}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  selectedScenarioId === s.id
                    ? 'bg-green-50 border-green-200 border text-green-800 shadow-sm'
                    : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{s.label}</span>
                  <div className={`w-2 h-2 rounded-full ${
                    s.riskLevel === RiskLevel.LOW ? 'bg-green-500' :
                    s.riskLevel === RiskLevel.MEDIUM ? 'bg-yellow-500' : 'bg-red-500'
                  }`} aria-hidden="true" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Scenario Details</h3>
          <div className="space-y-4 text-sm">
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</span>
              <p className="text-slate-700 mt-1">{scenario.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Device</span>
                <p className="text-slate-700 font-mono mt-1 flex items-center gap-1">
                  <Smartphone size={12} aria-hidden="true" /> {scenario.telemetry.deviceType}
                </p>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</span>
                <p className="text-slate-700 font-mono mt-1 flex items-center gap-1">
                  <MapPin size={12} aria-hidden="true" /> {scenario.telemetry.ipCountry}
                </p>
              </div>
               <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Time</span>
                <p className="text-slate-700 font-mono mt-1 flex items-center gap-1">
                  <Clock size={12} aria-hidden="true" /> {scenario.telemetry.timestamp}
                </p>
              </div>
               <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Behavior</span>
                <p className="text-slate-700 font-mono mt-1 flex items-center gap-1">
                  <Fingerprint size={12} aria-hidden="true" /> {scenario.telemetry.behaviorScore * 100}% Match
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT PANEL: Simulation Display */}
      <section className="w-full lg:w-2/3 flex flex-col gap-6" aria-label="Live Simulation Output">
        
        {/* Main Status Card */}
        <div className="bg-slate-900 text-white rounded-xl shadow-lg p-6 relative overflow-hidden min-h-[300px] flex flex-col">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity size={120} aria-hidden="true" />
          </div>

          {/* Header */}
          <div className="flex justify-between items-center mb-8 relative z-10">
            <div>
              <h2 className="text-2xl font-bold">AI Agency Interceptor</h2>
              <p className="text-slate-400 text-sm">Real-time Identity Verification Layer</p>
            </div>
            <div className="flex gap-2">
               {simState.step === 'IDLE' || simState.step === 'COMPLETE' ? (
                 <button 
                  onClick={runSimulation}
                  className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors focus:ring-4 focus:ring-green-400 focus:outline-none"
                  aria-label="Start Simulation"
                >
                  <Play size={16} fill="currentColor" aria-hidden="true" /> Run Simulation
                </button>
               ) : (
                 <button disabled className="bg-slate-700 text-slate-400 px-4 py-2 rounded-lg font-medium flex items-center gap-2 cursor-not-allowed">
                   <RotateCw size={16} className="animate-spin" aria-hidden="true" /> Analyzing...
                 </button>
               )}
            </div>
          </div>

          {/* Visualization Area */}
          <div className="flex-1 flex items-center justify-center relative z-10" aria-live="polite">
            {simState.step === 'IDLE' && (
              <div className="text-center text-slate-500">
                <ShieldAlert className="w-16 h-16 mx-auto mb-4 opacity-50" aria-hidden="true" />
                <p>System Ready. Initiate simulation to view AI decision flow.</p>
              </div>
            )}

            {(simState.step === 'SCANNING' || simState.step === 'ANALYZING' || simState.step === 'DECISION') && (
              <div className="w-full max-w-md space-y-6">
                <div className="space-y-2">
                   <div className="flex justify-between text-xs uppercase tracking-wider text-slate-400 font-bold">
                     <span>Scanning Vectors</span>
                     <span>{simState.progress}%</span>
                   </div>
                   <div className="h-2 bg-slate-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={simState.progress} aria-valuemin={0} aria-valuemax={100}>
                     <div 
                        className="h-full bg-blue-500 transition-all duration-500 ease-out" 
                        style={{ width: `${simState.progress}%` }}
                     />
                   </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className={`p-3 rounded-lg border ${simState.step !== 'SCANNING' ? 'border-green-500/50 bg-green-500/10 text-green-400' : 'border-slate-700 bg-slate-800 text-slate-500'} transition-all`}>
                      <Smartphone className="w-6 h-6 mx-auto mb-2" aria-hidden="true" />
                      <span className="text-xs font-bold">Device</span>
                    </div>
                    <div className={`p-3 rounded-lg border ${simState.step === 'DECISION' || simState.step === 'ANALYZING' ? 'border-green-500/50 bg-green-500/10 text-green-400' : 'border-slate-700 bg-slate-800 text-slate-500'} transition-all`}>
                      <Activity className="w-6 h-6 mx-auto mb-2" aria-hidden="true" />
                      <span className="text-xs font-bold">Behavior</span>
                    </div>
                    <div className={`p-3 rounded-lg border ${simState.step === 'DECISION' ? 'border-green-500/50 bg-green-500/10 text-green-400' : 'border-slate-700 bg-slate-800 text-slate-500'} transition-all`}>
                      <ShieldAlert className="w-6 h-6 mx-auto mb-2" aria-hidden="true" />
                      <span className="text-xs font-bold">Risk Model</span>
                    </div>
                </div>
              </div>
            )}

            {simState.step === 'COMPLETE' && (
              <div className="flex flex-col items-center animate-pulse-fast">
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
                        <Cell key="cell-risk" fill={getRiskColor(scenario.riskLevel)} />
                        <Cell key="cell-safe" fill="#334155" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                     <span className="text-3xl font-bold" style={{ color: getRiskColor(scenario.riskLevel) }}>
                       {(scenario.riskScore * 100).toFixed(0)}
                     </span>
                     <span className="text-xs text-slate-400 uppercase tracking-widest">Risk Score</span>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <h3 className="text-xl font-bold mb-1" style={{ color: getRiskColor(scenario.riskLevel) }}>
                    {scenario.details.action}
                  </h3>
                  <p className="text-slate-400 text-sm">{scenario.details.outcome}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Console Log */}
        <div className="bg-slate-900 text-green-400 rounded-xl shadow-md p-4 font-mono text-xs h-48 overflow-y-auto border border-slate-800" role="log" aria-live="polite">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800 text-slate-500">
            <Terminal size={14} aria-hidden="true" />
            <span>System Log</span>
          </div>
          <div className="space-y-1">
            {simState.logs.length === 0 ? (
              <span className="text-slate-600 italic">// Awaiting session initiation...</span>
            ) : (
              simState.logs.map((log, i) => (
                <div key={i} className="break-words">{log}</div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </div>

      </section>
    </div>
  );
};

export default Simulation;