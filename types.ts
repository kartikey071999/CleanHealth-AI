
export enum AnalysisType {
  LAB_REPORT = 'LAB_REPORT',
  SYMPTOM_CHECK = 'SYMPTOM_CHECK',
}

export interface AnalysisResult {
  title: string;
  summary: string;
  severity: 'low' | 'medium' | 'high' | 'unknown';
  findings: Array<{
    name: string;
    value?: string;
    status: 'normal' | 'abnormal' | 'critical' | 'informational';
    explanation: string;
  }>;
  trends?: Array<{
    metric: string;
    data: Array<{ date: string; value: number }>;
    unit?: string;
  }>;
  recommendations: string[];
  medicalDisclaimer: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export type ProcessingState = 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';
