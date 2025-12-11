import React from 'react';
import { Shield, Globe, Cpu, Database, Workflow, BarChart3, Users, Award, Target, Zap } from 'lucide-react';

const About: React.FC = () => {
  const technologies = [
    { name: 'React 19', icon: <Zap size={20} />, description: 'Modern UI framework with latest features' },
    { name: 'Supabase', icon: <Database size={20} />, description: 'PostgreSQL database with real-time capabilities' },
    { name: 'Recharts', icon: <BarChart3 size={20} />, description: 'Advanced data visualization library' },
    { name: 'n8n', icon: <Workflow size={20} />, description: 'Workflow automation for AI orchestration' },
    { name: 'TypeScript', icon: <Cpu size={20} />, description: 'Type-safe development environment' },
  ];

  const features = [
    {
      title: 'Behavioral Biometrics',
      description: 'Analyzes typing cadence, mouse movements, and interaction patterns to detect imposters',
      icon: <Shield size={24} className="text-blue-600" />,
    },
    {
      title: 'Zero-Knowledge Proofs',
      description: 'Cryptographic authentication that verifies identity without exposing sensitive data',
      icon: <Cpu size={24} className="text-purple-600" />,
    },
    {
      title: 'AI Risk Scoring',
      description: 'Machine learning models evaluate 7 risk scenarios in real-time with adaptive thresholds',
      icon: <BarChart3 size={24} className="text-green-600" />,
    },
    {
      title: 'Continuous Monitoring',
      description: 'Session integrity checks detect mid-session hijacking and context anomalies',
      icon: <Target size={24} className="text-orange-600" />,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="w-full mx-auto space-y-8">

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Shield size={300} />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
            <Globe size={14} />
            Digital Sovereignty
          </div>
          <h1 className="text-5xl font-bold mb-4">YAQITH Sentinel</h1>
          <p className="text-2xl text-blue-100 mb-6 font-light">Adaptive Identity Verification System</p>
          <p className="text-lg text-blue-100 leading-relaxed max-w-3xl">
            An AI-powered authentication platform designed for Saudi Arabia's government digital services (Absher).
            YAQITH Sentinel replaces static credentials with behavioral intelligence, ensuring both security and seamless user experience.
          </p>
        </div>
      </div>

      {/* Vision 2030 Connection */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Award className="text-green-600" size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-green-900 mb-3">Aligned with Vision 2030</h2>
            <p className="text-green-800 leading-relaxed mb-4">
              YAQITH Sentinel supports Saudi Arabia's Vision 2030 digital transformation initiative by providing
              next-generation security infrastructure for government services. Our adaptive authentication system
              strengthens digital sovereignty while maintaining user trust and accessibility.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-semibold">Digital Government</span>
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-semibold">Cybersecurity</span>
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-semibold">AI Innovation</span>
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-semibold">User Experience</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Grid */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Core Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <Cpu className="text-slate-600" size={28} />
          Technology Stack
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-lg p-4 flex items-start gap-3 hover:border-blue-300 transition-all"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                {tech.icon}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">{tech.name}</h4>
                <p className="text-xs text-slate-600">{tech.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hackathon Info */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-8">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Target className="text-purple-600" size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-purple-900 mb-3">Saudi Arabia Government Hackathon 2025</h2>
            <p className="text-purple-800 leading-relaxed mb-4">
              YAQITH Sentinel was developed for the Saudi Arabia Government Hackathon 2025, addressing the critical
              challenge of balancing security with user experience in government digital services. Our solution
              demonstrates how behavioral AI can eliminate credential-based attacks while providing frictionless
              authentication for legitimate users.
            </p>
            <div className="bg-purple-100 rounded-lg p-4 border border-purple-200">
              <h3 className="font-bold text-purple-900 mb-2">Challenge Scope</h3>
              <p className="text-sm text-purple-800 leading-relaxed">
                Design an adaptive authentication system that detects imposters even when they have valid credentials,
                using behavioral biometrics and AI-driven risk assessment to protect government services like Absher.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-8">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Users className="text-slate-600" size={32} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Development Team</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              YAQITH Sentinel is built by a dedicated team of security researchers, AI engineers, and UX designers
              committed to advancing digital trust in government services.
            </p>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="text-sm text-slate-600 italic">
                "We envision a future where authentication is invisible to legitimate users but impenetrable to attackers.
                YAQITH Sentinel transforms this vision into reality through behavioral intelligence and adaptive security."
              </p>
              <p className="text-sm text-slate-800 font-semibold mt-2">— YAQITH Development Team</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 text-center">
          <div className="text-4xl font-bold text-blue-900 mb-2">7</div>
          <div className="text-sm text-blue-700 font-semibold">Risk Scenarios</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 text-center">
          <div className="text-4xl font-bold text-green-900 mb-2">&lt;250ms</div>
          <div className="text-sm text-green-700 font-semibold">Avg Response Time</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 text-center">
          <div className="text-4xl font-bold text-purple-900 mb-2">95%+</div>
          <div className="text-sm text-purple-700 font-semibold">Attack Detection Rate</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 text-center">
          <div className="text-4xl font-bold text-orange-900 mb-2">Zero</div>
          <div className="text-sm text-orange-700 font-semibold">Password Storage</div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 text-white rounded-xl p-8 text-center">
        <Shield className="mx-auto mb-4 text-blue-400" size={48} />
        <h3 className="text-xl font-bold mb-2">YAQITH Sentinel</h3>
        <p className="text-slate-400 text-sm">
          Protecting Digital Identity. Empowering Digital Transformation.
        </p>
        <div className="mt-6 text-xs text-slate-500">
          Version 2.2.0 (Beta) | Built with React 19 + Supabase | Saudi Arabia 2025
        </div>
      </div>

      </div>
    </div>
  );
};

export default About;
