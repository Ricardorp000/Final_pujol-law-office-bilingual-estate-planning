export interface ExplanationContent {
  title: string;
  definition: string;
  keyBenefits: string[];
  analogy: string;
}

export interface BilingualExplanation {
  english: ExplanationContent;
  spanish: ExplanationContent;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}