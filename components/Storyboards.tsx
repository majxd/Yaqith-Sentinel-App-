import React from 'react';
import { 
  Laptop, Scan, ShieldCheck, Map, AlertTriangle, Ban, 
  MousePointer2, Activity, Lock, ArrowRight, UserCheck 
} from 'lucide-react';
import { STORYBOARDS } from '../constants';
import { RiskLevel } from '../types';

const Storyboards: React.FC = () => {
  
  const getIcon = (type: string) => {
    switch(type) {
      case 'laptop': return <Laptop size={32} className="text-blue-600" />;
      case 'scan': return <Scan size={32} className="text-purple-600" />;
      case 'shield_check': return <UserCheck size={32} className="text-green-600" />;
      case 'map': return <Map size={32} className="text-orange-600" />;
      case 'alert': return <AlertTriangle size={32} className="text-red-600" />;
      case 'block': return <Ban size={32} className="text-red-700" />;
      case 'cursor': return <MousePointer2 size={32} className="text-slate-600" />;
      case 'activity': return <Activity size={32} className="text-yellow-600" />;
      case 'lock': return <Lock size={32} className="text-red-600" />;
      default: return <Activity size={32} />;
    }
  };

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.LOW: return 'bg-green-100 text-green-800 border-green-200';
      case RiskLevel.MEDIUM: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case RiskLevel.HIGH: return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="text-center mb-10 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800">Scenario Storyboards</h2>
        <p className="text-slate-500 mt-2">
          Visualizing the dynamics of the AI Agency layers across key threat scenarios.
          Each storyboard demonstrates the Trigger, AI Understanding, and Outcome flow.
        </p>
      </div>

      <div className="grid gap-12">
        {STORYBOARDS.map((story) => (
          <div key={story.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                 <h3 className="font-bold text-lg text-slate-800">{story.title}</h3>
                 <p className="text-xs text-slate-500">AI Agency Response Simulation</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getRiskColor(story.riskLevel)}`}>
                {story.riskLevel} Risk
              </span>
            </div>

            {/* Panels Container */}
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 relative">
                
                {story.panels.map((panel, index) => (
                  <React.Fragment key={index}>
                    
                    {/* Panel Card */}
                    <div className="flex-1 flex flex-col relative z-10">
                      
                      {/* Visual Mockup */}
                      <div className="aspect-[4/3] bg-slate-50 border-2 border-slate-100 rounded-lg mb-4 flex flex-col items-center justify-center p-4 relative overflow-hidden group hover:border-blue-100 transition-colors">
                         <div className="absolute inset-0 bg-slate-200/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                         <div className="bg-white p-4 rounded-full shadow-sm mb-3 z-10 ring-1 ring-slate-100">
                           {getIcon(panel.iconType)}
                         </div>
                         <span className="font-mono text-xs font-bold text-slate-600 bg-white/80 px-2 py-1 rounded backdrop-blur-sm z-10">
                           {panel.visualLabel}
                         </span>
                         
                         {/* Step Badge */}
                         <div className="absolute top-2 left-2 w-6 h-6 bg-slate-800 text-white rounded-full flex items-center justify-center text-xs font-bold z-10">
                           {panel.step}
                         </div>
                      </div>

                      {/* Content */}
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">{panel.title}</h4>
                        <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                          {panel.description}
                        </p>
                        <div className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block border border-blue-100">
                          {panel.technicalNote}
                        </div>
                      </div>
                    </div>

                    {/* Arrow Connector (Desktop only) */}
                    {index < story.panels.length - 1 && (
                      <div className="hidden md:flex flex-col justify-center items-center w-8 -mx-3 z-0 opacity-30">
                        <ArrowRight size={24} className="text-slate-400" />
                      </div>
                    )}

                    {/* Arrow Connector (Mobile only) */}
                    {index < story.panels.length - 1 && (
                      <div className="md:hidden flex justify-center py-2 opacity-30">
                        <ArrowRight size={24} className="rotate-90 text-slate-400" />
                      </div>
                    )}

                  </React.Fragment>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default Storyboards;