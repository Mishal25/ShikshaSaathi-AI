export type Language = 'en' | 'hi' | 'gu';

export type GroupTier = 'A' | 'B' | 'C';

export interface Student {
  id: number;
  name: string;
  roll: number;
  group: GroupTier;
  level: number;
  readingWpm: number;
  mathScore: number;
  flnStatus: 'Remedial Need' | 'Progressing' | 'Mastered';
  notes: string;
}

export interface StudentAssessProfile {
  id: number;
  key: string;
  name: string;
  initials: string;
  level: number;
  levelText: string;
  levelColor: string;
  lang: 'gu' | 'hi' | 'en';
  passage: string;
  transNote: string;
  mathQ: string;
  defaultMathAns: string;
  sampleVoice: string;
}

export interface SmartAlert {
  id: string;
  type: 'rose' | 'amber' | 'emerald';
  heading: string;
  body: string;
  icon: 'triangle' | 'ear' | 'rocket';
}

export interface EvaluationResult {
  level: number;
  levelLabel: string;
  htmlContent: string;
  confidence: number;
}
