import React, { useState, useEffect, useRef } from 'react';
import { Fingerprint, MousePointer2, Keyboard, RefreshCw, Bot, UserCheck, Info, Activity, Zap, Move, Eye, Scale } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const BiometricsDemo: React.FC = () => {
  const [inputText, setInputText] = useState('');
  
  // Advanced Telemetry State
  const [flightTimes, setFlightTimes] = useState<number[]>([]); // Press to Press (ms)
  const [dwellTimes, setDwellTimes] = useState<number[]>([]);   // Press to Release (ms)
  const [mousePoints, setMousePoints] = useState<{x: number, y: number}[]>([]);
  const [mouseTotalDist, setMouseTotalDist] = useState(0);

  // Refs for calculations to avoid re-renders on every event
  const lastKeyTime = useRef<number>(0);
  const activeKeys = useRef<Record<string, number>>({});
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);

  // Analysis Result State
  const [score, setScore] = useState(50);
  const [status, setStatus] = useState<'ANALYZING' | 'HUMAN' | 'BOT'>('ANALYZING');
  const [reasons, setReasons] = useState<string[]>([]);
  const [weights, setWeights] = useState({ typing: 50, mouse: 50 }); // For UI visualization
  const [metrics, setMetrics] = useState({
    wpm: 0,
    dwellAvg: 0,
    flightVar: 0,
    linearity: 0 // 0 to 1 (1 is perfect straight line)
  });

  // --- EVENT HANDLERS ---

  // Track Mouse Geometry
  const handleMouseMove = (e: React.MouseEvent) => {
    const currentPos = { x: e.clientX, y: e.clientY };

    if (lastMousePos.current) {
      const dx = currentPos.x - lastMousePos.current.x;
      const dy = currentPos.y - lastMousePos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      setMouseTotalDist(prev => prev + dist);
      
      // Sample points every ~5px of movement to save memory but keep resolution
      if (dist > 5) {
        setMousePoints(prev => [...prev, currentPos]);
      }
    }
    lastMousePos.current = currentPos;
  };

  // Track Flight Time (Press -> Press)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const now = Date.now();
    
    // Ignore repeat events (holding key down)
    if (e.repeat) return;

    if (lastKeyTime.current > 0) {
      const flight = now - lastKeyTime.current;
      // Filter out unreasonably long pauses (e.g., user stopped thinking)
      if (flight < 2000) {
        setFlightTimes(prev => [...prev, flight]);
      }
    }
    lastKeyTime.current = now;
    
    // Start Dwell Timer
    activeKeys.current[e.code] = now;
  };

  // Track Dwell Time (Press -> Release)
  const handleKeyUp = (e: React.KeyboardEvent) => {
    const now = Date.now();
    const pressTime = activeKeys.current[e.code];
    
    if (pressTime) {
      const dwell = now - pressTime;
      setDwellTimes(prev => [...prev, dwell]);
      delete activeKeys.current[e.code];
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const resetDemo = () => {
    setInputText('');
    setFlightTimes([]);
    setDwellTimes([]);
    setMousePoints([]);
    setMouseTotalDist(0);
    setScore(50);
    setStatus('ANALYZING');
    setReasons([]);
    setWeights({ typing: 50, mouse: 50 });
    setMetrics({ wpm: 0, dwellAvg: 0, flightVar: 0, linearity: 0 });
    lastKeyTime.current = 0;
    activeKeys.current = {};
    lastMousePos.current = null;
  };

  // --- CORE ANALYSIS ALGORITHM ---

  useEffect(() => {
    // Only analyze if we have enough data points
    if (flightTimes.length < 3 && dwellTimes.length < 3 && mousePoints.length < 5) return;

    // 1. Calculate Statistical Metrics
    const calcStats = (arr: number[]) => {
      if (arr.length === 0) return { mean: 0, stdDev: 0 };
      const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
      const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;
      return { mean, stdDev: Math.sqrt(variance) };
    };

    const flightStats = calcStats(flightTimes);
    const dwellStats = calcStats(dwellTimes);

    // Estimate WPM (Words Per Minute)
    // Avg 5 chars per word. WPM = (Chars / 5) / (Minutes)
    const totalTimeMs = flightTimes.reduce((a, b) => a + b, 0);
    const estimatedWPM = totalTimeMs > 0 ? (flightTimes.length / 5) / (totalTimeMs / 60000) : 0;

    // Calculate Mouse Linearity
    // Linearity = Euclidean Distance (Start to End) / Total Path Distance
    let linearity = 0;
    if (mousePoints.length > 1 && mouseTotalDist > 0) {
      const start = mousePoints[0];
      const end = mousePoints[mousePoints.length - 1];
      const euclideanDist = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
      linearity = euclideanDist / mouseTotalDist;
    }

    // 2. Component Scoring (0 = Bot, 100 = Human)
    let typingScore = 50; 
    let mouseScore = 50;
    const currentReasons: string[] = [];

    // --- Typing Logic ---
    // Rule: Bots are super consistent (low flight variance)
    if (flightStats.stdDev < 10) {
      typingScore -= 30; 
      currentReasons.push("Typing Rhythm: Suspiciously consistent (Low Variance)");
    } else if (flightStats.stdDev > 25) {
      typingScore += 20; // Humans are messy/variable
    }

    // Rule: Humans dwell for ~70-120ms. Bots often < 30ms.
    if (dwellStats.mean < 35) {
      typingScore -= 20;
      currentReasons.push("Dwell Time: Too short (<35ms)");
    } else if (dwellStats.mean > 60) {
      typingScore += 10;
    }

    // Rule: Speed Cap
    if (estimatedWPM > 180) {
        typingScore = 0;
        currentReasons.push("Speed: Exceeds human physiological limit");
    }

    // --- Mouse Logic ---
    if (mouseTotalDist < 20) {
        mouseScore = 50; // Neutral/No data
    } else {
        // Rule: Bots move in straight lines (Linearity ~ 1.0)
        if (linearity > 0.96) {
            mouseScore = 10;
            currentReasons.push("Mouse: Robotic straight lines detected");
        } else if (linearity < 0.85) {
            mouseScore = 80; // Curved human movement
        } else {
            mouseScore = 50;
        }
    }

    // 3. Dynamic Weighting (Context Aware)
    let typingWeight = 0.5;
    let mouseWeight = 0.5;

    // Context A: High Speed Expert
    if (estimatedWPM > 70) {
        // If user is typing fast, we prioritize typing metrics.
        // We care LESS about mouse linearity (maybe they just moved it quickly to focus).
        typingWeight = 0.85;
        mouseWeight = 0.15;
        currentReasons.push("Context: High WPM detected, prioritizing typing biometrics");
    } 
    // Context B: Low Mouse Usage
    else if (mouseTotalDist < 50) {
        // Almost no mouse data, rely 90% on typing
        typingWeight = 0.9;
        mouseWeight = 0.1;
    }
    // Context C: Slow Typing but Active Mouse
    else if (estimatedWPM < 30 && mouseTotalDist > 200) {
        typingWeight = 0.4;
        mouseWeight = 0.6;
    }

    // Calculate Final Weighted Score
    const finalScore = (typingScore * typingWeight) + (mouseScore * mouseWeight);
    
    // Clamp
    const clampedScore = Math.min(99, Math.max(1, Math.round(finalScore)));

    // Update State
    setScore(clampedScore);
    setWeights({ typing: Math.round(typingWeight * 100), mouse: Math.round(mouseWeight * 100) });
    
    if (clampedScore > 75) setStatus('HUMAN');
    else if (clampedScore < 45) setStatus('BOT');
    else setStatus('ANALYZING');

    // Clean up reasons (unique)
    setReasons([...new Set(currentReasons)]);

    setMetrics({
      wpm: Math.round(estimatedWPM),
      dwellAvg: Math.round(dwellStats.mean),
      flightVar: Math.round(flightStats.stdDev),
      linearity: parseFloat(linearity.toFixed(2))
    });

  }, [flightTimes, dwellTimes, mousePoints, mouseTotalDist]);

  // UI Helper
  const chartData = [
    { name: 'Human', value: score },
    { name: 'Bot', value: 100 - score },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8" onMouseMove={handleMouseMove}>
      <div className="w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Educational Banner */}
      <section className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl flex flex-col md:flex-row items-start gap-4" aria-label="Behavioral Analysis Explained">
        <div className="p-3 bg-indigo-100 rounded-lg text-indigo-700 shrink-0">
           <Eye size={24} aria-hidden="true" />
        </div>
        <div>
           <h3 className="text-lg font-bold text-indigo-900 mb-2">Behavioral Biometrics Engine</h3>
           <p className="text-sm text-indigo-800 mb-3">
             This prototype analyzes subconscious motor skills to generate a "Digital DNA" profile. 
             Unlike passwords, these patterns are extremely difficult for bots to mimic perfectly.
           </p>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded border border-indigo-100">
                <strong className="text-xs uppercase tracking-wide text-indigo-500 block">Metric 1: Keystroke Dynamics</strong>
                <p className="text-xs text-slate-500 mt-1">
                  <strong>Flight Time:</strong> Speed between keys.<br/>
                  <strong>Dwell Time:</strong> Duration of key press.
                </p>
              </div>
              <div className="bg-white p-3 rounded border border-indigo-100">
                <strong className="text-xs uppercase tracking-wide text-indigo-500 block">Metric 2: Mouse Geometry</strong>
                <p className="text-xs text-slate-500 mt-1">
                  <strong>Linearity:</strong> Humans move in arcs. Bots move in straight lines (Linearity &gt; 0.95).
                </p>
              </div>
           </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Interactive Zone */}
        <div className="space-y-6">
          <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-200" aria-label="Typing Test Area">
            <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Keyboard className="text-blue-600" aria-hidden="true" />
              Input Analysis Layer
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              Type the phrase below. Try typing naturally, then try "bot-like" behavior (super consistent speed, straight mouse movements).
            </p>

            <div className="bg-slate-50 p-4 rounded-lg mb-4 text-center border border-dashed border-slate-300">
              <span className="font-mono text-slate-700 font-medium select-none text-lg">
                "Digital sovereignty relies on adaptive security."
              </span>
            </div>

            <div className="relative">
              <label htmlFor="typing-input" className="sr-only">Type the phrase to test biometrics</label>
              <input
                id="typing-input"
                type="text"
                value={inputText}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-lg font-mono"
                placeholder="Start typing here..."
                autoComplete="off"
              />
              {inputText.length > 0 && (
                <button 
                  onClick={resetDemo}
                  className="absolute right-3 top-3 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors focus:ring-2 focus:ring-blue-400"
                  aria-label="Reset text and metrics"
                >
                  <RefreshCw size={18} />
                </button>
              )}
            </div>

            {/* Visual Weight Balance Indicator */}
            <div className="mt-3 bg-slate-50 rounded-lg p-3 border border-slate-100 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <Scale size={16} className="text-slate-400" />
                <span className="text-xs font-semibold text-slate-600">Adaptive Weights</span>
              </div>
              <div className="flex items-center gap-3 flex-1 max-w-[240px]">
                 <span className={`text-[10px] font-mono transition-colors ${weights.typing > 60 ? 'text-blue-700 font-bold' : 'text-blue-500'}`}>Typing {weights.typing}%</span>
                 <div className="h-2 flex-1 bg-slate-200 rounded-full overflow-hidden flex">
                    <div className="bg-blue-500 h-full transition-all duration-500 ease-out" style={{ width: `${weights.typing}%` }} />
                    <div className="bg-indigo-500 h-full transition-all duration-500 ease-out" style={{ width: `${weights.mouse}%` }} />
                 </div>
                 <span className={`text-[10px] font-mono transition-colors ${weights.mouse > 60 ? 'text-indigo-700 font-bold' : 'text-indigo-500'}`}>Mouse {weights.mouse}%</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded border border-slate-100">
                 <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                   <MousePointer2 size={10} aria-hidden="true" /> Mouse Telemetry
                 </div>
                 <div className="text-xs font-mono text-slate-600">
                    Samples: {mousePoints.length} | Dist: {Math.round(mouseTotalDist)}px
                 </div>
              </div>
              <div className="bg-slate-50 p-3 rounded border border-slate-100">
                 <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                   <Keyboard size={10} aria-hidden="true" /> Key Telemetry
                 </div>
                 <div className="text-xs font-mono text-slate-600">
                    Keystrokes: {dwellTimes.length} | Flights: {flightTimes.length}
                 </div>
              </div>
            </div>
          </section>
        </div>

        {/* Visualization Zone */}
        <section className="space-y-6" aria-label="Live Analysis Results">
          <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg border border-slate-800 relative overflow-hidden flex flex-col h-full">
            
            <div className="flex justify-between items-start mb-6">
               <div>
                  <h2 className="text-xl font-bold">Identity Confidence</h2>
                  <p className="text-slate-400 text-xs">Real-time Vector Analysis</p>
               </div>
               <div 
                 className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-2 ${
                    status === 'HUMAN' ? 'bg-green-500/10 border-green-500 text-green-400' : 
                    status === 'BOT' ? 'bg-red-500/10 border-red-500 text-red-400' : 
                    'bg-blue-500/10 border-blue-500 text-blue-400'
                 }`}
                 role="status"
                 aria-live="polite"
               >
                  {status === 'HUMAN' && <UserCheck size={14} aria-hidden="true" />}
                  {status === 'BOT' && <Bot size={14} aria-hidden="true" />}
                  {status === 'ANALYZING' && <RefreshCw size={14} className="animate-spin" aria-hidden="true" />}
                  {status}
               </div>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
               
               {/* Score Chart */}
               <div className="relative min-h-[160px]" aria-label={`Trust Score Chart: ${score}%`}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        startAngle={180}
                        endAngle={0}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                      >
                        <Cell fill={score > 60 ? '#22c55e' : score > 40 ? '#eab308' : '#ef4444'} />
                        <Cell fill="#334155" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 pt-10 flex flex-col items-center justify-center pointer-events-none" aria-hidden="true">
                    <span className={`text-4xl font-bold ${score > 60 ? 'text-green-500' : score > 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                      {score}%
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Trust Score</span>
                  </div>
               </div>

               {/* Detailed Metrics Grid */}
               <div className="grid grid-cols-2 gap-3 content-center" role="list">
                  <div className="bg-slate-800/50 p-2 rounded border border-slate-700" role="listitem">
                     <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                        <Zap size={10} aria-hidden="true" /> Typing Speed
                     </div>
                     <div className="font-mono font-bold text-lg text-white" aria-label={`${metrics.wpm} words per minute`}>
                        {metrics.wpm} <span className="text-[10px] font-normal text-slate-500">WPM</span>
                     </div>
                  </div>
                  
                  <div className="bg-slate-800/50 p-2 rounded border border-slate-700" role="listitem">
                     <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                        <Activity size={10} aria-hidden="true" /> Flight Var
                     </div>
                     <div className={`font-mono font-bold text-lg ${metrics.flightVar > 15 ? 'text-green-400' : 'text-red-400'}`} aria-label={`${metrics.flightVar} milliseconds variance`}>
                        {metrics.flightVar} <span className="text-[10px] font-normal text-slate-500">ms</span>
                     </div>
                  </div>

                  <div className="bg-slate-800/50 p-2 rounded border border-slate-700" role="listitem">
                     <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                        <Keyboard size={10} aria-hidden="true" /> Dwell Avg
                     </div>
                     <div className="font-mono font-bold text-lg text-white" aria-label={`${metrics.dwellAvg} milliseconds average`}>
                        {metrics.dwellAvg} <span className="text-[10px] font-normal text-slate-500">ms</span>
                     </div>
                  </div>

                  <div className="bg-slate-800/50 p-2 rounded border border-slate-700" role="listitem">
                     <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                        <Move size={10} aria-hidden="true" /> Linearity
                     </div>
                     <div className={`font-mono font-bold text-lg ${metrics.linearity > 0.9 ? 'text-red-400' : 'text-green-400'}`} aria-label={`${metrics.linearity} linearity score out of 1`}>
                        {metrics.linearity} <span className="text-[10px] font-normal text-slate-500">/ 1.0</span>
                     </div>
                  </div>
               </div>

            </div>
            
            {/* Dynamic Weights Display */}
            <div className="mt-4 pt-4 border-t border-slate-800">
               <div className="flex justify-between items-center mb-2">
                 <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                   <Scale size={10} /> Dynamic Weights Applied
                 </div>
               </div>
               <div className="flex h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                 <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${weights.typing}%` }} title="Typing Weight"></div>
                 <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: `${weights.mouse}%` }} title="Mouse Weight"></div>
               </div>
               <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>Typing: {weights.typing}%</span>
                  <span>Mouse: {weights.mouse}%</span>
               </div>
            </div>

            {/* Analysis Log */}
            <div className="mt-4 pt-4 border-t border-slate-800">
               <div className="text-[10px] uppercase font-bold text-slate-500 mb-2">Decision Factors</div>
               <div className="space-y-1" aria-live="polite">
                  {reasons.length === 0 ? (
                    <div className="text-xs text-slate-600 italic">Waiting for sufficient telemetry data...</div>
                  ) : (
                    reasons.map((reason, idx) => (
                      <div key={idx} className="text-xs flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${reason.includes('Human') || reason.includes('Expert') || reason.includes('Context') ? 'bg-green-500' : 'bg-red-500'}`} aria-hidden="true"></span>
                        <span className="text-slate-300">{reason}</span>
                      </div>
                    ))
                  )}
               </div>
            </div>

          </div>
        </section>
      </div>

      </div>
    </div>
  );
};

export default BiometricsDemo;