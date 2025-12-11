import React from 'react';

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum ScenarioType {
  NORMAL_LOGIN = 'NORMAL_LOGIN',
  NEW_DEVICE = 'NEW_DEVICE',
  SUSPICIOUS_TIME = 'SUSPICIOUS_TIME',
  LOCATION_ANOMALY = 'LOCATION_ANOMALY',
  RAPID_LOGIN = 'RAPID_LOGIN',
  BEHAVIORAL_DEVIATION = 'BEHAVIORAL_DEVIATION',
  CONTINUOUS_MONITORING = 'CONTINUOUS_MONITORING',
}

export interface Scenario {
  id: ScenarioType;
  label: string;
  description: string;
  riskLevel: RiskLevel;
  riskScore: number;
  details: {
    trigger: string;
    understanding: string;
    action: string;
    outcome: string;
  };
  telemetry: {
    deviceType: string;
    ipCountry: string;
    timestamp: string;
    behaviorScore: number; // 0-1, 1 is perfect match
  };
}

export interface SimulationState {
  step: 'IDLE' | 'SCANNING' | 'ANALYZING' | 'DECISION' | 'COMPLETE';
  progress: number;
  logs: string[];
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface StoryboardPanel {
  step: number;
  title: string;
  iconType: string;
  visualLabel: string;
  description: string;
  technicalNote: string;
}

export interface Storyboard {
  id: string;
  title: string;
  riskLevel: RiskLevel;
  panels: StoryboardPanel[];
}