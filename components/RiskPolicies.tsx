import React from 'react';
import { Shield, CheckCircle, XCircle, Clock, MapPin, Smartphone, Activity } from 'lucide-react';
import { SCENARIOS } from '@/constants';
import { RiskLevel, ScenarioType } from '@/types';

const RiskPolicies: React.FC = () => {
  const scenariosList = Object.values(SCENARIOS);

  const getRiskLevelBadge = (riskLevel: RiskLevel) => {
    const styles = {
      LOW: 'bg-green-100 text-green-800 border-green-300',
      MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      HIGH: 'bg-red-100 text-red-800 border-red-300',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[riskLevel]}`}>
        {riskLevel}
      </span>
    );
  };

  const getActionBadge = (action: string) => {
    const styles: { [key: string]: string } = {
      'Grant Silent Access': 'bg-green-50 text-green-700 border-green-200',
      'Trigger Step-Up (FaceID)': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'Trigger Simple OTP': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'Hard Block': 'bg-red-50 text-red-700 border-red-200',
      'Block IP Range': 'bg-red-50 text-red-700 border-red-200',
      'Hard Block / Freeze': 'bg-red-50 text-red-700 border-red-200',
      'Terminate Session': 'bg-red-50 text-red-700 border-red-200',
    };

    return (
      <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${styles[action] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
        {action}
      </span>
    );
  };

  const getFactorIcon = (matches: boolean) => {
    return matches ? (
      <CheckCircle className="text-green-600" size={16} />
    ) : (
      <XCircle className="text-red-600" size={16} />
    );
  };

  const getScenarioFactors = (scenario: typeof SCENARIOS[ScenarioType]) => {
    const factors = [];

    // Determine factors based on scenario type
    switch (scenario.id) {
      case ScenarioType.NORMAL_LOGIN:
        factors.push(
          { label: 'Device Match', matches: true },
          { label: 'Location Match', matches: true },
          { label: 'Behavior Match', matches: true },
          { label: 'Time Normal', matches: true }
        );
        break;
      case ScenarioType.NEW_DEVICE:
        factors.push(
          { label: 'Device Match', matches: false },
          { label: 'Location Match', matches: true },
          { label: 'Behavior Match', matches: true },
          { label: 'Time Normal', matches: true }
        );
        break;
      case ScenarioType.SUSPICIOUS_TIME:
        factors.push(
          { label: 'Device Match', matches: true },
          { label: 'Location Match', matches: true },
          { label: 'Behavior Match', matches: true },
          { label: 'Time Normal', matches: false }
        );
        break;
      case ScenarioType.LOCATION_ANOMALY:
        factors.push(
          { label: 'Device Match', matches: false },
          { label: 'Location Match', matches: false },
          { label: 'Geo-velocity', matches: false },
          { label: 'Time Normal', matches: false }
        );
        break;
      case ScenarioType.RAPID_LOGIN:
        factors.push(
          { label: 'Device Match', matches: false },
          { label: 'Request Rate', matches: false },
          { label: 'Botnet Pattern', matches: false },
          { label: 'IP Reputation', matches: false }
        );
        break;
      case ScenarioType.BEHAVIORAL_DEVIATION:
        factors.push(
          { label: 'Device Match', matches: false },
          { label: 'Location Match', matches: true },
          { label: 'Behavior Match', matches: false },
          { label: 'Keystroke Variance', matches: false }
        );
        break;
      case ScenarioType.CONTINUOUS_MONITORING:
        factors.push(
          { label: 'Device Match', matches: true },
          { label: 'Session Integrity', matches: false },
          { label: 'IP Context', matches: false },
          { label: 'Time Normal', matches: false }
        );
        break;
    }

    return factors;
  };

  const getCardGradient = (riskLevel: RiskLevel) => {
    const gradients = {
      LOW: 'from-green-50 to-emerald-50 border-green-200',
      MEDIUM: 'from-yellow-50 to-orange-50 border-yellow-200',
      HIGH: 'from-red-50 to-rose-50 border-red-200',
    };
    return gradients[riskLevel];
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8">

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Risk-Based Authentication Policies</h2>
            <p className="text-slate-600">
              YAQITH Sentinel uses 7 adaptive scenarios to evaluate authentication risk. Each scenario combines multiple trust factors to determine the appropriate security action.
            </p>
          </div>
          <Shield className="text-blue-600" size={48} />
        </div>
      </div>

      {/* Scenario Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenariosList.map((scenario, index) => {
          const factors = getScenarioFactors(scenario);

          return (
            <div
              key={scenario.id}
              className={`bg-gradient-to-br ${getCardGradient(scenario.riskLevel)} border rounded-xl p-6 shadow-sm hover:shadow-md transition-all`}
            >
              {/* Card Header */}
              <div className="mb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-700 font-bold text-sm shadow-sm">
                      {index + 1}
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg leading-tight">
                      {scenario.label}
                    </h3>
                  </div>
                  {getRiskLevelBadge(scenario.riskLevel)}
                </div>
              </div>

              {/* Trigger Section */}
              <div className="mb-4 bg-white/60 rounded-lg p-3">
                <div className="flex items-start gap-2 mb-2">
                  <Activity className="text-slate-600 flex-shrink-0 mt-0.5" size={16} />
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase mb-1">Trigger Condition</p>
                    <p className="text-sm text-slate-700">{scenario.details.trigger}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                {scenario.description}
              </p>

              {/* Action & Risk Score */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 uppercase">Action:</span>
                  {getActionBadge(scenario.details.action)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 uppercase">Risk Score:</span>
                  <span className="px-3 py-1 bg-slate-100 rounded-lg text-sm font-mono font-bold text-slate-800">
                    {scenario.riskScore.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Trust Factors Checklist */}
              <div className="border-t border-slate-200/60 pt-4">
                <p className="text-xs font-semibold text-slate-600 uppercase mb-3">Trust Factors</p>
                <div className="space-y-2">
                  {factors.map((factor, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      {getFactorIcon(factor.matches)}
                      <span className={factor.matches ? 'text-slate-700' : 'text-slate-500 line-through'}>
                        {factor.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Telemetry Footer */}
              <div className="mt-4 pt-4 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-1">
                  <Smartphone size={12} className="text-slate-500" />
                  <span className="truncate">{scenario.telemetry.deviceType}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={12} className="text-slate-500" />
                  <span className="truncate">{scenario.telemetry.ipCountry}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} className="text-slate-500" />
                  <span>{scenario.telemetry.timestamp}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity size={12} className="text-slate-500" />
                  <span>Behavior: {(scenario.telemetry.behaviorScore * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Shield className="text-blue-600" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-blue-900 mb-2">Adaptive Security Model</h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              These policies are dynamic and continuously refined by machine learning models. The system evaluates multiple context signals in real-time—device fingerprints, location patterns, behavioral biometrics, and temporal anomalies—to calculate a composite risk score. This zero-trust approach ensures that legitimate users experience minimal friction while sophisticated attacks are intercepted instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskPolicies;
