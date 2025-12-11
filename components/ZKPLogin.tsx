import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck, Key, Server, CheckCircle, FileKey, RefreshCw, Info } from 'lucide-react';

const ZKPLogin: React.FC = () => {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const reset = () => setStep(0);

  return (
    <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Context Banner */}
      <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl flex items-start gap-3">
        <Info className="text-purple-600 mt-0.5 shrink-0" />
        <div>
           <h3 className="text-sm font-bold text-purple-800">Enabling Scenario 1 & 2</h3>
           <p className="text-xs text-purple-600 mt-1">
             Zero-Knowledge Proofs are the cryptographic foundation for "Silent Access." They allow the user to prove identity (e.g., possession of a private key on a trusted device) without sending the password over the network, making "Man-in-the-Middle" attacks impossible.
           </p>
        </div>
      </div>

      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Zero-Knowledge Proof (ZKP) Protocol</h2>
        <p className="text-slate-500 mt-2">
          Demonstrating how a user can prove they know a password without ever sending the password to the server.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* Connection Line */}
        <div className="absolute top-1/2 left-[20%] right-[20%] h-1 bg-slate-100 -z-0"></div>

        <div className="flex justify-between w-full max-w-2xl relative z-10">
          
          {/* CLIENT SIDE */}
          <div className={`flex flex-col items-center transition-all duration-500 ${step >= 0 ? 'opacity-100' : 'opacity-50'}`}>
             <div className="w-20 h-20 bg-blue-50 border-2 border-blue-200 rounded-xl flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="font-bold text-xs text-blue-800 mb-1">USER</div>
                  <FileKey className="mx-auto text-blue-600" />
                </div>
             </div>
             <div className="bg-slate-50 p-3 rounded text-xs font-mono border border-slate-200 w-40 text-center">
                {step === 0 && "Secret: 'MyPassword'"}
                {step === 1 && <span className="text-orange-600">Generating Proof...</span>}
                {step >= 2 && <span className="text-green-600 font-bold">Proof Generated</span>}
             </div>
          </div>

          {/* SERVER SIDE */}
          <div className={`flex flex-col items-center transition-all duration-500 ${step >= 3 ? 'opacity-100' : 'opacity-50'}`}>
             <div className="w-20 h-20 bg-slate-50 border-2 border-slate-200 rounded-xl flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="font-bold text-xs text-slate-800 mb-1">SERVER</div>
                  <Server className="mx-auto text-slate-600" />
                </div>
             </div>
             <div className="bg-slate-50 p-3 rounded text-xs font-mono border border-slate-200 w-40 text-center">
                {step < 3 && "Waiting for Proof..."}
                {step === 3 && <span className="text-orange-600">Verifying Math...</span>}
                {step === 4 && <span className="text-green-600 font-bold">Access Granted</span>}
             </div>
          </div>

        </div>

        {/* Action Animation Area */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs h-20 flex items-center justify-center">
           {step === 2 && (
             <div className="animate-slide-right flex flex-col items-center bg-white border border-green-200 shadow-lg p-2 rounded-lg z-20">
               <ShieldCheck className="text-green-600 mb-1" />
               <span className="text-[10px] font-mono text-green-800">ZkProof(Hash)</span>
             </div>
           )}
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-slate-900 text-white p-6 rounded-xl flex items-center justify-between">
         <div>
           <div className="text-xs uppercase tracking-widest text-slate-400 mb-1">Current State</div>
           <div className="font-bold text-lg">
             {step === 0 && "1. User Input (Secret stays on device)"}
             {step === 1 && "2. Generating Cryptographic Witness"}
             {step === 2 && "3. Transmitting Zero-Knowledge Proof"}
             {step === 3 && "4. Server Verification"}
             {step === 4 && "5. Authenticated Successfully"}
           </div>
         </div>

         <div className="flex gap-4">
            {step < 4 ? (
              <button 
                onClick={nextStep}
                className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors"
              >
                Next Step <ArrowRight size={18} />
              </button>
            ) : (
              <button 
                onClick={reset}
                className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors"
              >
                Reset Demo <RefreshCw size={18} />
              </button>
            )}
         </div>
      </div>

      {/* Technical Footnote */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm text-yellow-800 flex gap-3">
        <Key className="shrink-0 mt-0.5" />
        <div>
          <strong>Why this matters:</strong> In a traditional login, the password (or a hash) is sent across the network. 
          In ZKP, the server <em>never</em> sees the password. It only sees a mathematical proof that the user <em>knows</em> the password.
          This eliminates password theft from server breaches.
        </div>
      </div>
      
      <style>{`
        @keyframes slide-right {
          0% { transform: translateX(-100px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateX(100px); opacity: 0; }
        }
        .animate-slide-right {
          animation: slide-right 1.5s ease-in-out forwards;
        }
      `}</style>

      </div>
    </div>
  );
};

export default ZKPLogin;