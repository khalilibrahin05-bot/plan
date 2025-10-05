
export interface PlanItem {
  id: number;
  domain: string;
  objective: string;
  indicator: string;
  evidence: string;
  activity: string;
  planned: number | null;
  schedule: (number | null)[];
  executed: number | null;
  indicatorCount: number | null;
  weeklyExecution: (number | null)[];
}

export interface ColumnPrintSettings {
  objective: boolean;
  indicator: boolean;
  indicatorCount: boolean;
  evidence: boolean;
  activity: boolean;
  planned: boolean;
  schedule: boolean;
  executed: boolean;
}

export interface PrintSettings {
  orientation: 'portrait' | 'landscape';
  columns: ColumnPrintSettings;
}

export interface ExtraActivity {
  id: string;
  domain: string;
  justification: string;
  assignedBy: string;
}

export interface ProblemSolution {
  id: string;
  problem: string;
  solution: string;
}

export interface StrengthImpact {
  id: string;
  strength: string;
  currentImpact: string;
  futureImpact: string;
}

export interface Recommendation {
  id: string;
  recommendation: string;
  justification: string;
}

export interface ReportInfoData {
  extraActivities: ExtraActivity[];
  problems: ProblemSolution[];
  strengths: StrengthImpact[];
  recommendations: Recommendation[];
}