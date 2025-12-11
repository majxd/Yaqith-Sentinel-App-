
import React from 'react';
import { 
  Shield, Activity, Lock, Smartphone, Database, Globe, 
  BrainCircuit, TrafficCone, ScanFace, MousePointer2, 
  Wifi, FileWarning, ArrowDown, Key, Server, CheckCircle2, AlertTriangle, Ban
} from 'lucide-react';

const Architecture: React.FC = () => {
  return (
    <div className="w-full bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-4 md:p-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-800">Adaptive Security Architecture</h2>
        <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
          A 4-Layer Zero Trust Model: Transforming static credentials into dynamic, context-aware identity assurance.
        </p>
      </div>

      <div className="relative flex flex-col items-center max-w-4xl mx-auto">
        
        {/* Connection Line Background */}
        <div className="absolute top-10 bottom-20 left-1/2 w-0.5 bg-gradient-to-b from-slate-300 via-blue-300 to-slate-300 -z-0"></div>

        {/* ==================== Layer 1: User Interface ==================== */}
        <div className="w-full relative z-10 mb-8">
          <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-slate-800 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-20 shadow-sm ring-4 ring-slate-50">
            Layer 1: Interaction
          </div>
          
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm max-w-lg mx-auto hover:border-blue-400 transition-all duration-300 relative">
            {/* Animated Data Packet */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full animate-bounce shadow-lg shadow-blue-500/50 z-20"></div>

            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
                  <Smartphone className="w-6 h-6 text-slate-700" />
               </div>
               <div>
                 <h3 className="text-base font-bold text-slate-800">Absher Login Interface</h3>
                 <div className="flex gap-3 text-xs text-slate-500 mt-1">
                   <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100"><Key size={10} /> Credential Input</span>
                   <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100"><ScanFace size={10} /> Telemetry Collection</span>
                 </div>
               </div>
            </div>
            <div className="hidden sm:block">
               <div className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                 HTTPS / TLS 1.3
               </div>
            </div>
          </div>
        </div>

        {/* ==================== Layer 2: The Interceptor ==================== */}
        <div className="w-full relative z-10 mb-8">
          <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-20 shadow-md ring-4 ring-slate-50">
            Layer 2: AI Agency "Interceptor"
          </div>

          <div className="bg-white border-2 border-blue-500 rounded-2xl shadow-xl overflow-hidden max-w-3xl mx-auto">
            
            {/* Header */}
            <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
               <div className="flex items-center gap-2">
                 <BrainCircuit className="text-blue-600 animate-pulse" size={18} />
                 <div>
                   <h3 className="font-bold text-slate-800 text-sm">Contextual Analysis Engine</h3>
                 </div>
               </div>
               <div className="flex items-center gap-1.5">
                  <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Latency: 120ms</span>
               </div>
            </div>

            {/* Modules Container */}
            <div className="p-6 bg-gradient-to-b from-white to-blue-50/30">
               
               {/* Animated Flow Lines */}
               <div className="hidden md:block absolute top-[55%] left-10 right-10 h-0.5 bg-slate-100 -z-0">
                  <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-blue-200 rounded-full -translate-y-1/2 animate-ping"></div>
                  <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-blue-200 rounded-full -translate-y-1/2 animate-ping delay-75"></div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Module A: Scanner */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative z-10">
                     <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-xs text-slate-600 uppercase tracking-wider">A. Scanner</h4>
                        <Wifi size={14} className="text-slate-400" />
                     </div>
                     <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-100">
                           <Smartphone size={14} className="text-blue-500" />
                           <span className="text-xs font-medium text-slate-700">Device Fingerprint</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-100">
                           <Globe size={14} className="text-blue-500" />
                           <span className="text-xs font-medium text-slate-700">Geo-Location</span>
                        </div>
                     </div>
                  </div>

                  {/* Module B: Behavioral Unit (Center) */}
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 shadow-md transform md:scale-105 z-20 relative">
                     <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">Core Logic</div>
                     <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-xs text-blue-800 uppercase tracking-wider">B. Behavioral</h4>
                        <Activity size={14} className="text-blue-500" />
                     </div>
                     <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 bg-white rounded border border-blue-100">
                           <MousePointer2 size={14} className="text-indigo-500" />
                           <span className="text-xs font-medium text-indigo-900">Mouse Dynamics</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white rounded border border-blue-100">
                           <BrainCircuit size={14} className="text-indigo-500" />
                           <span className="text-xs font-medium text-indigo-900">Deviation Model</span>
                        </div>
                     </div>
                  </div>

                  {/* Module C: Threat Intel */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative z-10">
                     <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-xs text-slate-600 uppercase tracking-wider">C. Intel DB</h4>
                        <Database size={14} className="text-slate-400" />
                     </div>
                     <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-100">
                           <FileWarning size={14} className="text-red-400" />
                           <span className="text-xs font-medium text-slate-700">Bot Signatures</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-100">
                           <Lock size={14} className="text-red-400" />
                           <span className="text-xs font-medium text-slate-700">Leaked Creds</span>
                        </div>
                     </div>
                  </div>

               </div>
            </div>
            
            {/* Output Arrow */}
            <div className="bg-slate-50 p-2 flex justify-center border-t border-slate-200 relative">
               <div className="absolute -bottom-6 w-3 h-3 bg-yellow-500 rounded-full animate-bounce delay-100 shadow-lg shadow-yellow-500/50 z-20"></div>
               <span className="text-[10px] font-mono text-slate-400">Risk Score Output (0-100)</span>
            </div>
          </div>
        </div>

        {/* ==================== Layer 3: Decision Gate ==================== */}
        <div className="w-full relative z-10 mb-8 max-w-2xl">
          <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-yellow-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-20 shadow-md ring-4 ring-slate-50">
            Layer 3: The Decision Gate
          </div>

          <div className="bg-white border-x-4 border-yellow-400 rounded-2xl p-6 shadow-sm flex flex-col items-center relative border-y border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <TrafficCone className="w-5 h-5 text-yellow-500" />
              <h3 className="font-bold text-slate-800">Traffic Light Enforcement</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-3 w-full">
               {/* Green Light */}
               <div className="flex flex-col items-center p-3 rounded-xl bg-green-50 border border-green-100 relative group hover:bg-green-100 transition-colors cursor-default">
                 <div className="w-4 h-4 rounded-full bg-green-500 mb-2 shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse"></div>
                 <span className="text-xs font-extrabold text-green-800 uppercase tracking-wide">Pass</span>
                 <div className="mt-2 flex items-center gap-1 text-[10px] font-mono text-green-700 bg-white px-2 py-1 rounded border border-green-200">
                    <CheckCircle2 size={10} /> Silent
                 </div>
               </div>
               
               {/* Yellow Light */}
               <div className="flex flex-col items-center p-3 rounded-xl bg-yellow-50 border border-yellow-100 relative group hover:bg-yellow-100 transition-colors cursor-default">
                 <div className="w-4 h-4 rounded-full bg-yellow-500 mb-2 shadow-[0_0_10px_rgba(234,179,8,0.6)]"></div>
                 <span className="text-xs font-extrabold text-yellow-800 uppercase tracking-wide">Challenge</span>
                 <div className="mt-2 flex items-center gap-1 text-[10px] font-mono text-yellow-700 bg-white px-2 py-1 rounded border border-yellow-200">
                    <ScanFace size={10} /> Step-Up
                 </div>
               </div>
               
               {/* Red Light */}
               <div className="flex flex-col items-center p-3 rounded-xl bg-red-50 border border-red-100 relative group hover:bg-red-100 transition-colors cursor-default">
                 <div className="w-4 h-4 rounded-full bg-red-500 mb-2 shadow-[0_0_10px_rgba(239,68,68,0.6)]"></div>
                 <span className="text-xs font-extrabold text-red-800 uppercase tracking-wide">Block</span>
                 <div className="mt-2 flex items-center gap-1 text-[10px] font-mono text-red-700 bg-white px-2 py-1 rounded border border-red-200">
                    <Ban size={10} /> Lock
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* ==================== Layer 4: Core Services ==================== */}
        <div className="w-full relative z-10">
          <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-green-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-20 shadow-md ring-4 ring-slate-50">
            Layer 4: Core Services
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 flex flex-col items-center relative overflow-hidden">
             {/* Background Pattern */}
             <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
             
             <div className="relative z-10 flex items-center gap-2 text-slate-800 font-bold text-lg mb-6">
              <Server className="w-5 h-5 text-slate-600" />
              <span>Absher Protected Dashboard</span>
            </div>
            
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl">
                {['Vehicles', 'Passport', 'Civil Affairs', 'Appointments'].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 shadow-sm hover:-translate-y-1 transition-transform cursor-default">
                    <div className="text-xl">
                      {i === 0 && '🚗'}
                      {i === 1 && '🛂'}
                      {i === 2 && '🆔'}
                      {i === 3 && '📅'}
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">{item}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Architecture;
