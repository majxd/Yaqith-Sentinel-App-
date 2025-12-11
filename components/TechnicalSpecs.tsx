
import React from 'react';
import { FileText, Cpu, Server, GitBranch, Calculator, Shield, Database, ArrowRight, ArrowDown, Map, Activity, Clock, Smartphone } from 'lucide-react';

const TechnicalSpecs: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="w-full mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* 1. System Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
            <Server size={24} />
          </div>
          <div>
             <h2 className="text-2xl font-bold text-slate-800">Architecture Overview</h2>
             <p className="text-slate-500 text-sm">Zero Trust Middleware Implementation</p>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
               <Shield size={16} className="text-blue-500" /> Core Philosophy
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              The AI Agency "Interceptor" functions as an intelligent middleware layer sitting between the Frontend Load Balancer and the Backend Authentication Service. Unlike traditional firewalls that block based on static rules (IP/Port), this system evaluates the <strong>context</strong> of the request in real-time.
            </p>

            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
               <GitBranch size={16} className="text-blue-500" /> Request Lifecycle
            </h3>
            <div className="space-y-4">
               {/* Visual Sequence */}
               <div className="flex flex-col gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                     <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">1</span>
                     <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded flex-1">
                        Client sends Credentials + Telemetry Blob
                     </div>
                  </div>
                  <div className="h-4 w-0.5 bg-slate-200 ml-3"></div>
                  <div className="flex items-center gap-2">
                     <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">2</span>
                     <div className="bg-blue-50 border border-blue-200 px-3 py-2 rounded flex-1 text-blue-800">
                        Interceptor Calculates Risk Score (Latency &lt; 200ms)
                     </div>
                  </div>
                  <div className="h-4 w-0.5 bg-slate-200 ml-3"></div>
                  <div className="flex items-center gap-2">
                     <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white">3</span>
                     <div className="bg-white border-2 border-slate-800 px-3 py-2 rounded flex-1 font-bold">
                        Enforcement: Allow / Challenge / Block
                     </div>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
             <h4 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">Data Flow Diagram</h4>
             
             {/* Simple CSS Diagram */}
             <div className="relative flex flex-col items-center gap-6 text-sm">
                <div className="w-full bg-white p-3 rounded shadow-sm border border-slate-200 text-center font-bold text-slate-700">User Device (SDK)</div>
                <ArrowDown size={16} className="text-slate-400" />
                <div className="w-full bg-blue-600 p-3 rounded shadow-sm border border-blue-700 text-center font-bold text-white relative">
                   API Gateway / WAF
                   <div className="absolute -right-2 top-1/2 translate-x-full -translate-y-1/2 w-12 h-0.5 bg-slate-300"></div>
                   <div className="absolute -right-[6.5rem] top-1/2 -translate-y-1/2 bg-slate-100 px-2 py-1 rounded text-[10px] border border-slate-200 text-slate-500">Async Logs</div>
                </div>
                <ArrowDown size={16} className="text-slate-400" />
                <div className="w-full p-4 rounded bg-indigo-50 border-2 border-indigo-200 border-dashed relative">
                   <div className="absolute -top-3 left-4 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold">THE INTERCEPTOR</div>
                   <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white p-2 text-center rounded border border-indigo-100 text-xs">Behavioral Engine</div>
                      <div className="bg-white p-2 text-center rounded border border-indigo-100 text-xs">Threat Intel DB</div>
                   </div>
                </div>
                <ArrowDown size={16} className="text-slate-400" />
                <div className="w-full bg-green-50 p-3 rounded shadow-sm border border-green-200 text-center font-bold text-green-800">
                   Absher Core Services
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* 2. Decision Logic */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
          <div className="p-3 bg-yellow-100 text-yellow-700 rounded-lg">
            <GitBranch size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">The Decision Matrix</h2>
            <p className="text-slate-500 text-sm">Logic Gates & Thresholds</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
           <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                 <tr>
                    <th className="px-6 py-4">Risk Score</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Trigger Condition</th>
                    <th className="px-6 py-4">System Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 <tr className="bg-green-50/30">
                    <td className="px-6 py-4 font-mono font-bold text-green-600">0 - 49</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">LOW RISK</span></td>
                    <td className="px-6 py-4 text-slate-600">Trusted Device + Known IP + Normal Behavior</td>
                    <td className="px-6 py-4 font-bold text-slate-800">Silent Access (200 OK)</td>
                 </tr>
                 <tr className="bg-yellow-50/30">
                    <td className="px-6 py-4 font-mono font-bold text-yellow-600">50 - 89</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">CAUTION</span></td>
                    <td className="px-6 py-4 text-slate-600">New Device OR Foreign IP OR Slight Behavior Drift</td>
                    <td className="px-6 py-4 font-bold text-slate-800">Step-Up Auth (OTP / FaceID)</td>
                 </tr>
                 <tr className="bg-red-50/30">
                    <td className="px-6 py-4 font-mono font-bold text-red-600">90 - 100</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">HIGH RISK</span></td>
                    <td className="px-6 py-4 text-slate-600">Bot Signature OR Impossible Travel OR Credential Stuffing</td>
                    <td className="px-6 py-4 font-bold text-slate-800">Hard Block (403 Forbidden)</td>
                 </tr>
              </tbody>
           </table>
        </div>
      </div>

      {/* 3. Risk Scoring Algorithm */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-lg">
            <Calculator size={24} />
          </div>
          <div>
             <h2 className="text-2xl font-bold text-slate-800">Risk Scoring Algorithm</h2>
             <p className="text-slate-500 text-sm">Adaptive Weighting Formula</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
           
           {/* The Formula */}
           <div className="bg-slate-900 text-white p-6 rounded-xl font-mono text-sm shadow-md">
              <div className="text-slate-400 mb-2">// Weighted Aggregation Function</div>
              <div className="mb-4">
                <span className="text-blue-400">TotalRisk</span> = 
              </div>
              <div className="pl-4 space-y-2">
                 <div>( <span className="text-green-400">DeviceContext</span> * 0.30 ) +</div>
                 <div>( <span className="text-yellow-400">GeoVelocity</span> * 0.30 ) +</div>
                 <div>( <span className="text-purple-400">BehavioralDev</span> * 0.25 ) +</div>
                 <div>( <span className="text-red-400">ThreatIntel</span> * 0.15 )</div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700 text-slate-400">
                 // Result clamped between 0 and 100
              </div>
           </div>

           {/* Variable Explanations */}
           <div className="space-y-4">
              <div className="flex gap-3">
                 <div className="w-8 h-8 rounded bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs">01</div>
                 <div>
                    <h4 className="font-bold text-slate-800 text-sm">Device Context (30%)</h4>
                    <p className="text-xs text-slate-500">Checks Device Fingerprint consistency (Browser, OS, Screen, Battery). Known devices reduce risk significantly.</p>
                 </div>
              </div>
              <div className="flex gap-3">
                 <div className="w-8 h-8 rounded bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold text-xs">02</div>
                 <div>
                    <h4 className="font-bold text-slate-800 text-sm">Geo Velocity (30%)</h4>
                    <p className="text-xs text-slate-500">Calculates speed between login attempts. <br/><i>Speed &gt; 900km/h = Anomaly.</i></p>
                 </div>
              </div>
              <div className="flex gap-3">
                 <div className="w-8 h-8 rounded bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">03</div>
                 <div>
                    <h4 className="font-bold text-slate-800 text-sm">Behavioral Deviation (25%)</h4>
                    <p className="text-xs text-slate-500">Analyzes Keystroke Dynamics (flight time) and Mouse Trajectories. Linear, robotic movement increases risk.</p>
                 </div>
              </div>
              <div className="flex gap-3">
                 <div className="w-8 h-8 rounded bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">04</div>
                 <div>
                    <h4 className="font-bold text-slate-800 text-sm">Threat Intel (15%)</h4>
                    <p className="text-xs text-slate-500">Checks IP against blacklists (Tor nodes, known VPNs, Botnets).</p>
                 </div>
              </div>
           </div>

        </div>

        {/* Example Calculation */}
        <div className="mt-8 bg-slate-50 p-4 rounded-lg border border-slate-200">
           <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-2">Calculation Example: "The Traveler"</h4>
           <div className="flex flex-wrap gap-4 text-sm font-mono text-slate-700">
              <span className="bg-white px-2 py-1 rounded border border-slate-200">Device(0) * 0.3 = 0</span>
              <span className="text-slate-400">+</span>
              <span className="bg-white px-2 py-1 rounded border border-slate-200">Geo(100) * 0.3 = 30</span>
              <span className="text-slate-400">+</span>
              <span className="bg-white px-2 py-1 rounded border border-slate-200">Behav(10) * 0.25 = 2.5</span>
              <span className="text-slate-400">+</span>
              <span className="bg-white px-2 py-1 rounded border border-slate-200">Intel(0) * 0.15 = 0</span>
              <span className="text-slate-400">=</span>
              <span className="font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded border border-yellow-200">Total: 32.5 (Wait... + Context Penalty) → Adjusted: 60</span>
           </div>
           <p className="mt-2 text-xs text-slate-400">Note: Dynamic Context Penalties apply when trusted devices appear in untrusted locations.</p>
        </div>

      </div>

      {/* 4. Dataset Schema & Feature Engineering */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
          <div className="p-3 bg-teal-100 text-teal-700 rounded-lg">
            <Database size={24} />
          </div>
          <div>
             <h2 className="text-2xl font-bold text-slate-800">Dataset Schema & Feature Engineering</h2>
             <p className="text-slate-500 text-sm">Comprehensive Data Dictionary for ML Training</p>
          </div>
        </div>

        <p className="text-slate-600 text-sm mb-6">
          The machine learning model is trained on a rich dataset containing 2,000+ labeled login events. Each record consists of <strong>23 features</strong> categorized into temporal, spatial, device, and behavioral dimensions. This granular data allows the system to distinguish between legitimate users (Ahmed, Sara) and sophisticated attackers (The Imposter) with high precision.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Feature Name</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Security Value (Why it matters)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Identity & Device */}
              <tr className="bg-slate-50/50"><td colSpan={3} className="px-4 py-2 font-bold text-xs text-slate-500 uppercase tracking-wider">Identity & Device Context</td></tr>
              <tr>
                <td className="px-4 py-3 font-mono text-blue-600">user_id</td>
                <td className="px-4 py-3">Unique User Identifier</td>
                <td className="px-4 py-3 text-slate-600">Links current session to historical behavioral baselines.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-blue-600">device_id / type</td>
                <td className="px-4 py-3">Hardware ID & Type (Mobile/Web)</td>
                <td className="px-4 py-3 text-slate-600">Identifies known trusted devices vs. unknown or emulated hardware.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-blue-600">os_version / app_ver</td>
                <td className="px-4 py-3">OS and App Version</td>
                <td className="px-4 py-3 text-slate-600">Detects outdated software often targeted by exploits, or mismatches indicating spoofing.</td>
              </tr>

              {/* Spatial & Network */}
              <tr className="bg-slate-50/50"><td colSpan={3} className="px-4 py-2 font-bold text-xs text-slate-500 uppercase tracking-wider">Spatial & Network Context</td></tr>
              <tr>
                <td className="px-4 py-3 font-mono text-orange-600">city / country</td>
                <td className="px-4 py-3">Geo-Location</td>
                <td className="px-4 py-3 text-slate-600">Establishes the physical location of the login request.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-orange-600">distance_from_last_login_km</td>
                <td className="px-4 py-3">Distance from last known location</td>
                <td className="px-4 py-3 text-slate-600">Critical for "Impossible Travel" detection (Geo-velocity).</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-orange-600">is_vpn</td>
                <td className="px-4 py-3">VPN/Proxy Flag (0/1)</td>
                <td className="px-4 py-3 text-slate-600">High correlation with malicious anonymization attempts.</td>
              </tr>

              {/* Behavioral */}
              <tr className="bg-slate-50/50"><td colSpan={3} className="px-4 py-2 font-bold text-xs text-slate-500 uppercase tracking-wider">Behavioral Biometrics</td></tr>
              <tr>
                <td className="px-4 py-3 font-mono text-purple-600">typing_speed_cps</td>
                <td className="px-4 py-3">Typing Speed (Chars/Sec)</td>
                <td className="px-4 py-3 text-slate-600">Detects bots (superhuman speed) vs. humans (natural cadence).</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-purple-600">nav_pattern_similarity</td>
                <td className="px-4 py-3">Mouse/Touch Path Score (0-1)</td>
                <td className="px-4 py-3 text-slate-600">Quantifies how "human" the pointer movement is (curved vs linear).</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-purple-600">session_duration_sec</td>
                <td className="px-4 py-3">Session Length</td>
                <td className="px-4 py-3 text-slate-600">Identifies automated scripts executing tasks faster than humanly possible.</td>
              </tr>

              {/* Temporal & Historical */}
              <tr className="bg-slate-50/50"><td colSpan={3} className="px-4 py-2 font-bold text-xs text-slate-500 uppercase tracking-wider">Temporal & Historical</td></tr>
              <tr>
                <td className="px-4 py-3 font-mono text-green-600">timestamp / hour_of_day</td>
                <td className="px-4 py-3">Time of Access</td>
                <td className="px-4 py-3 text-slate-600">Detects anomalies in user's daily routine (Circadian Rhythm analysis).</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-green-600">failed_logins_last_24h</td>
                <td className="px-4 py-3">Recent Failures</td>
                <td className="px-4 py-3 text-slate-600">High velocity indicates Brute Force or Credential Stuffing attacks.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-green-600">past_compromised_account</td>
                <td className="px-4 py-3">History Flag (0/1)</td>
                <td className="px-4 py-3 text-slate-600">Increases base risk for users with previously leaked credentials.</td>
              </tr>

              {/* Outcomes */}
              <tr className="bg-slate-50/50"><td colSpan={3} className="px-4 py-2 font-bold text-xs text-slate-500 uppercase tracking-wider">Model Outputs</td></tr>
              <tr>
                <td className="px-4 py-3 font-mono text-red-600">risk_score</td>
                <td className="px-4 py-3">Calculated Probability (0-1)</td>
                <td className="px-4 py-3 text-slate-600">The aggregate score determining the final security decision.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-red-600">is_attack_label</td>
                <td className="px-4 py-3">Ground Truth Label (0/1)</td>
                <td className="px-4 py-3 text-slate-600">Used for supervised learning to train the Decision Engine.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      </div>
    </div>
  );
};

export default TechnicalSpecs;
