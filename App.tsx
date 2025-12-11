import React, { useState } from 'react';
import { LayoutDashboard, Network, ShieldCheck, Activity, Clapperboard, FileText, Fingerprint, Lock, BarChart3, ChevronRight, BrainCircuit, Globe, Zap, Menu, X, Radio, AlertTriangle, Shield, Info, LogOut } from 'lucide-react';
import AuthGate from './components/AuthGate';
import TechnicalSpecs from './components/TechnicalSpecs';
import BiometricsDemo from './components/BiometricsDemo';
import ZKPLogin from './components/ZKPLogin';
import RiskDashboard from './components/RiskDashboard';
import LiveMonitor from './components/LiveMonitor';
import ThreatAnalytics from './components/ThreatAnalytics';
import GeoMap from './components/GeoMap';
import DecisionEngine from './components/DecisionEngine';
import RiskPolicies from './components/RiskPolicies';
import About from './components/About';
import { supabase } from '@/lib/supabase';

// Cybersecurity Neon Animations and Styles
const cyberStyles = `
  @keyframes neonPulse {
    0%, 100% { box-shadow: 0 0 5px #00D4FF, 0 0 10px #00D4FF, 0 0 15px #00D4FF; }
    50% { box-shadow: 0 0 10px #00D4FF, 0 0 20px #00D4FF, 0 0 30px #00D4FF; }
  }

  @keyframes borderGlow {
    0%, 100% { border-color: rgba(0, 212, 255, 0.3); }
    50% { border-color: rgba(0, 212, 255, 0.8); }
  }

  @keyframes gridPulse {
    0%, 100% { opacity: 0.03; }
    50% { opacity: 0.08; }
  }

  @keyframes textGlow {
    0%, 100% { text-shadow: 0 0 10px rgba(0, 212, 255, 0.5); }
    50% { text-shadow: 0 0 20px rgba(0, 212, 255, 0.8), 0 0 30px rgba(0, 212, 255, 0.6); }
  }

  @keyframes connectionPulse {
    0%, 100% {
      box-shadow: 0 0 5px rgba(0, 255, 136, 0.5), 0 0 10px rgba(0, 255, 136, 0.3);
      background-color: rgba(0, 255, 136, 0.9);
    }
    50% {
      box-shadow: 0 0 10px rgba(0, 255, 136, 0.8), 0 0 20px rgba(0, 255, 136, 0.5);
      background-color: rgba(0, 255, 136, 1);
    }
  }

  .cyber-sidebar {
    background: linear-gradient(180deg, #0A0F1C 0%, #0D1421 50%, #0A0F1C 100%);
    border-right: 1px solid rgba(0, 212, 255, 0.2);
  }

  .cyber-sidebar::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
    background-size: 20px 20px;
    pointer-events: none;
    animation: gridPulse 4s ease-in-out infinite;
  }

  .cyber-sidebar::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(180deg,
      transparent 0%,
      rgba(0, 212, 255, 0.5) 50%,
      transparent 100%);
    animation: borderGlow 2s ease-in-out infinite;
  }

  .cyber-header {
    background: rgba(10, 15, 28, 0.8);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(0, 212, 255, 0.2);
  }

  .logo-shield {
    animation: neonPulse 2s ease-in-out infinite;
  }

  .logo-text {
    animation: textGlow 3s ease-in-out infinite;
  }

  .connection-indicator {
    animation: connectionPulse 2s ease-in-out infinite;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(0, 212, 255, 0.3);
    border-radius: 3px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 212, 255, 0.5);
  }

  .nav-section-label {
    color: rgba(0, 212, 255, 0.6);
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .status-badge {
    background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
    border: 1px solid rgba(0, 212, 255, 0.3);
  }

  .version-badge {
    background: rgba(198, 166, 100, 0.1);
    border: 1px solid rgba(198, 166, 100, 0.3);
    color: #C6A664;
  }
`;

// Navigation configuration with sections
const NAV_SECTIONS = [
  {
    id: 'overview',
    label: 'OVERVIEW',
    items: [
      { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    ]
  },
  {
    id: 'command',
    label: 'COMMAND CENTER',
    items: [
      { id: 'live-monitor', label: 'Live Monitor', icon: <Radio size={20} /> },
      { id: 'threat-analytics', label: 'Threat Analytics', icon: <AlertTriangle size={20} /> },
      { id: 'geo-map', label: 'Geo Map', icon: <Globe size={20} /> },
    ]
  },
  {
    id: 'system',
    label: 'SYSTEM',
    items: [
      { id: 'decision-engine', label: 'Decision Engine', icon: <Network size={20} /> },
      { id: 'risk-policies', label: 'Risk Policies', icon: <Shield size={20} /> },
    ]
  },
  {
    id: 'labs',
    label: 'LABS (Beta)',
    items: [
      { id: 'biometrics', label: 'Biometrics Lab', icon: <Fingerprint size={20} /> },
      { id: 'zkp', label: 'ZKP Visualizer', icon: <Lock size={20} /> },
    ]
  },
  {
    id: 'help',
    label: 'HELP',
    items: [
      { id: 'specs', label: 'Technical Specs', icon: <FileText size={20} /> },
      { id: 'about', label: 'About YAQITH', icon: <Info size={20} /> },
    ]
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <AuthGate>
      <style>{cyberStyles}</style>
      <div className="h-screen w-full flex overflow-hidden font-sans text-slate-900">

        {/* Sidebar Navigation - Desktop */}
      <aside
        className="cyber-sidebar w-64 text-white flex-shrink-0 fixed inset-y-0 left-0 z-20 hidden md:flex flex-col shadow-2xl"
        aria-label="Sidebar Navigation"
      >
        {/* Logo/Header Section with glassmorphism */}
        <div className="cyber-header p-6 flex items-center gap-3 relative z-10">
          <div className="logo-shield w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
            <ShieldCheck className="text-white" size={22} aria-hidden="true" />
          </div>
          <div>
            <h1 className="logo-text font-bold text-base tracking-tight uppercase text-cyan-300">YAQITH SENTINEL</h1>
            <p className="text-xs text-cyan-500/70 font-medium">AI-Powered Protection</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar relative z-10">
          {NAV_SECTIONS.map((section, idx) => (
            <div key={section.id}>
              <div className={`nav-section-label mb-2 px-2 ${idx > 0 ? 'mt-6' : 'mt-2'}`} id={`nav-group-${section.id}`}>
                {section.label}
              </div>
              <ul aria-labelledby={`nav-group-${section.id}`} className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavClick(item.id)}
                      aria-current={activeTab === item.id ? 'page' : undefined}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                        activeTab === item.id
                          ? 'bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-400 shadow-[0_0_15px_rgba(0,212,255,0.3)]'
                          : 'text-slate-400 hover:bg-white/5 hover:text-cyan-300 hover:shadow-[0_0_10px_rgba(0,212,255,0.1)]'
                      }`}
                    >
                      <span aria-hidden="true" className={activeTab === item.id ? 'drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]' : ''}>{item.icon}</span>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Status Section */}
        <div className="p-4 border-t border-cyan-500/20 space-y-3 relative z-10">
          <button
            onClick={async () => {
              await supabase.auth.signOut();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-l-2 hover:border-red-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <LogOut size={20} aria-hidden="true" />
            Logout
          </button>
          <div className="text-xs leading-relaxed px-2">
            <div className="status-badge rounded-lg p-3 mb-2">
              <p className="font-bold text-cyan-400 mb-2 uppercase tracking-wider text-[0.65rem]">SYSTEM STATUS</p>
              <div className="flex items-center gap-2 mb-1">
                <span className="connection-indicator w-2 h-2 rounded-full" aria-hidden="true"></span>
                <span className="text-green-400 font-semibold">OPERATIONAL</span>
              </div>
              <div className="text-slate-400 text-[0.7rem]">Zero Trust Engine Active</div>
            </div>
            <div className="version-badge rounded px-2 py-1 text-center text-[0.65rem] font-bold tracking-wider">
              VER. 2.2.1-BETA
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header & Navigation */}
      <header className="md:hidden fixed top-0 w-full z-30 px-4 py-3 flex justify-between items-center shadow-lg" style={{ background: 'linear-gradient(90deg, #0A0F1C 0%, #0D1421 100%)', borderBottom: '1px solid rgba(0, 212, 255, 0.2)' }}>
         <div className="flex items-center gap-2">
             <div className="w-7 h-7 bg-gradient-to-br from-cyan-400 to-blue-600 rounded flex items-center justify-center" style={{ boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)' }}>
                <ShieldCheck size={16} aria-hidden="true" className="text-white" />
             </div>
             <span className="font-bold text-sm text-cyan-300">YAQITH SENTINEL</span>
         </div>
         <button
          onClick={toggleMobileMenu}
          className="p-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded text-cyan-400 hover:text-cyan-300 transition-colors"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
           {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
         </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="cyber-sidebar md:hidden fixed inset-0 z-20 pt-16 px-4 pb-6 overflow-y-auto">
          <nav aria-label="Mobile Navigation" className="relative z-10">
            {NAV_SECTIONS.map((section) => (
              <div key={section.id} className="mb-6">
                <div className="nav-section-label mb-3 px-4">
                  {section.label}
                </div>
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-4 border-b border-cyan-500/10 text-base font-medium transition-all duration-300 ${
                      activeTab === item.id
                        ? 'text-cyan-400 bg-cyan-500/10 border-l-2 border-cyan-400'
                        : 'text-slate-400 hover:text-cyan-300 hover:bg-white/5'
                    }`}
                  >
                    <span aria-hidden="true" className={activeTab === item.id ? 'drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]' : ''}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
            <button
              onClick={async () => {
                await supabase.auth.signOut();
              }}
              className="w-full flex items-center gap-3 px-4 py-4 border-b border-red-500/10 text-base font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
            >
              <LogOut size={24} aria-hidden="true" />
              Logout
            </button>
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main
        className="flex-1 w-full min-w-0 md:ml-64 pt-16 md:pt-0 overflow-y-auto focus:outline-none"
        role="main"
        id="main-content"
        tabIndex={-1} // Allow programmatic focus for skip links
      >
        {/* Dynamic Content - Full width, no padding on main to allow edge-to-edge dark pages */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen">
          
          {activeTab === 'dashboard' && (
            <article className="w-full space-y-10 p-4 md:p-8 pb-12 bg-slate-50">
              
              {/* 1. Hero / Introduction */}
              <section className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                  <BrainCircuit size={400} />
                </div>
                <div className="relative z-10 max-w-3xl">
                  <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-widest">
                    <Globe size={12} aria-hidden="true" /> Digital Sovereignty
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                    Digital Identity & <br/>Behavioral Security
                  </h2>
                  <p className="text-slate-300 text-lg leading-relaxed mb-8">
                    We are shifting the paradigm from <strong>"What you know"</strong> (passwords) to <strong>"Who you are"</strong> (behavior).
                    <br/><br/>
                    Passwords can be stolen. Subconscious motor skills cannot. This system analyzes <em>how</em> a user interacts—typing cadence, mouse velocity, and dwell time—to create an unforgeable <strong>Behavioral Fingerprint</strong>.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => setActiveTab('biometrics')} 
                      className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors focus:ring-4 focus:ring-blue-300 outline-none"
                    >
                      Try Behavioral Demo <ChevronRight size={18} aria-hidden="true" />
                    </button>
                    <button 
                      onClick={() => setActiveTab('specs')} 
                      className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-bold transition-colors focus:ring-4 focus:ring-slate-500 outline-none"
                    >
                      Read Technical Specs
                    </button>
                  </div>
                </div>
              </section>

              {/* 2. Strategic Value Proposition */}
              <section className="grid md:grid-cols-2 gap-8" aria-label="Comparison: Current vs Future State">
                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Lock className="text-red-500" aria-hidden="true" /> The Problem: Static Credentials
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-4 text-sm">
                    Current systems rely heavily on static secrets. If a hacker steals a password, the system cannot distinguish them from the real user.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-500">
                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5" aria-hidden="true"></div>Credentials are vulnerable to phishing.</li>
                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5" aria-hidden="true"></div>SMS OTPs are vulnerable to SIM swapping.</li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-xl border border-blue-200 shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-0"></div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 relative z-10">
                    <Fingerprint className="text-blue-600" aria-hidden="true" /> The Solution: Behavioral Biometrics
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-4 text-sm relative z-10">
                    The "AI Agency" validates the <strong>User Context</strong>. Even if a hacker has the correct password, they cannot replicate the real user's typing rhythm or mouse movements.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-500 relative z-10">
                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" aria-hidden="true"></div><strong>Keystroke Dynamics:</strong> Unique flight/dwell times.</li>
                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" aria-hidden="true"></div><strong>Mouse Geometry:</strong> Human curves vs. Robotic lines.</li>
                  </ul>
                </div>
              </section>

              {/* 4. Prototype Showcase */}
              <section className="space-y-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Zap className="text-yellow-500 fill-yellow-500" aria-hidden="true" /> Interactive Prototypes
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                 <button 
                   onClick={() => setActiveTab('biometrics')}
                   className="group cursor-pointer bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-blue-300 relative overflow-hidden text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                   aria-label="Open Option A: Biometrics Lab Demo"
                 >
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">Biometrics Lab</div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">
                      <Fingerprint className="text-blue-600" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2">Biometrics Lab</h3>
                    <p className="text-slate-500 text-sm">Experience how AI detects imposters by analyzing typing cadence and mouse linearity.</p>
                 </button>

                 <button 
                   onClick={() => setActiveTab('zkp')}
                   className="group cursor-pointer bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-purple-300 relative overflow-hidden text-left focus:outline-none focus:ring-2 focus:ring-purple-500"
                   aria-label="Open Option B: Zero Knowledge Proof Demo"
                 >
                    <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">ZKP Auth</div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">
                      <Lock className="text-purple-600" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2">ZKP Auth</h3>
                    <p className="text-slate-500 text-sm">Visualizing secure login where the server verifies identity without ever seeing the password.</p>
                 </button>

                 <button 
                   onClick={() => setActiveTab('risk')}
                   className="group cursor-pointer bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-green-300 relative overflow-hidden text-left focus:outline-none focus:ring-2 focus:ring-green-500"
                   aria-label="Open Option C: Risk Dashboard Demo"
                 >
                    <div className="absolute top-0 right-0 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">Risk Dashboard</div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">
                      <BarChart3 className="text-green-600" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2">Risk Dashboard</h3>
                    <p className="text-slate-500 text-sm">Mission Control view showing 7 specific risk scenarios and live confidence scores.</p>
                 </button>
               </div>
              </section>

            </article>
          )}

          {/* Command Center */}
          {activeTab === 'live-monitor' && <LiveMonitor />}
          {activeTab === 'threat-analytics' && <ThreatAnalytics />}
          {activeTab === 'geo-map' && <GeoMap />}

          {/* System */}
          {activeTab === 'decision-engine' && <DecisionEngine />}
          {activeTab === 'risk-policies' && <RiskPolicies />}

          {/* Labs */}
          {activeTab === 'biometrics' && <BiometricsDemo />}
          {activeTab === 'zkp' && <ZKPLogin />}

          {/* Help */}
          {activeTab === 'specs' && <TechnicalSpecs />}
          {activeTab === 'about' && <About />}

        </div>
      </main>
      </div>
    </AuthGate>
  );
};

export default App;