export enum EvaluationCategory {
  GEO = 'GEO',
  AIO = 'AIO',
  SEO = 'SEO',
}

export interface MetricScore {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  observation: string;
  recommendation: string;
}

export interface CategoryResult {
  score: number;
  maxScore: number;
  metrics: MetricScore[];
  summary: string;
}

export interface IdvsReport {
  timestamp: string;
  targetUrlOrTitle: string;
  overallScore: number;
  grade: string; // A+, A-, B, F
  breakdown: {
    [EvaluationCategory.GEO]: CategoryResult;
    [EvaluationCategory.AIO]: CategoryResult;
    [EvaluationCategory.SEO]: CategoryResult;
  };
  criticalIssues: string[];
  jsonLdSuggestion: object;
}

export const INITIAL_REPORT: IdvsReport = {
  timestamp: '',
  targetUrlOrTitle: '',
  overallScore: 0,
  grade: 'N/A',
  breakdown: {
    [EvaluationCategory.GEO]: { score: 0, maxScore: 40, metrics: [], summary: '' },
    [EvaluationCategory.AIO]: { score: 0, maxScore: 30, metrics: [], summary: '' },
    [EvaluationCategory.SEO]: { score: 0, maxScore: 30, metrics: [], summary: '' },
  },
  criticalIssues: [],
  jsonLdSuggestion: {},
};
