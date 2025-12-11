import React, { useState } from 'react';
import Architecture from './Architecture';
import Storyboards from './Storyboards';

const DecisionEngine: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'architecture' | 'storyboards'>('architecture');

  return (
    <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="space-y-6">
      {/* Sub-navigation tabs */}
      <div className="flex gap-4 border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab('architecture')}
          className={`px-4 py-3 font-semibold text-sm transition-all border-b-2 ${
            activeSubTab === 'architecture'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          4-Layer Funnel
        </button>
        <button
          onClick={() => setActiveSubTab('storyboards')}
          className={`px-4 py-3 font-semibold text-sm transition-all border-b-2 ${
            activeSubTab === 'storyboards'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Traffic Light Flow
        </button>
      </div>

      {/* Content */}
      <div>
        {activeSubTab === 'architecture' && <Architecture />}
        {activeSubTab === 'storyboards' && <Storyboards />}
      </div>
      </div>
    </div>
  );
};

export default DecisionEngine;
