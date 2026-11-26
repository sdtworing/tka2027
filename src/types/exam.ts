export type SubjectId = 'matematika' | 'bindo';

export type QuestionType = 'pg' | 'mcma' | 'kategori';

export type KategoriLabels = ['Benar', 'Salah'] | ['Sesuai', 'Tidak Sesuai'];

export interface TableStimulus {
  caption?: string;
  headers: string[];
  rows: string[][];
}

export interface KategoriStatement {
  id: string;
  text: string;
  correctValue: number; // 0 = first label (Benar/Sesuai), 1 = second label (Salah/Tidak Sesuai)
}

export interface OptionItem {
  id: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
}

export interface Question {
  number: number; // 1 to 30
  subject: SubjectId;
  domain: string;
  subtopic: string;
  indicator: string;
  type: QuestionType;
  passageId?: string;
  svgId?: string;
  svgData?: Record<string, unknown>;
  stimulusText?: string;
  stimulusTable?: TableStimulus;
  prompt: string;
  // For 'pg' and 'mcma'
  options?: OptionItem[];
  correctOption?: string; // For 'pg'
  correctOptions?: string[]; // For 'mcma'
  // For 'kategori'
  kategoriLabels?: KategoriLabels;
  statements?: KategoriStatement[];
  // Explanation for result screen
  explanation: string;
  quoteEvidence?: string; // Specifically for Bahasa Indonesia
}

export interface Passage {
  id: string;
  title: string;
  genre: string;
  paragraphs: string[];
  isProcedureList?: boolean;
  steps?: string[];
  announcementMeta?: {
    header: string;
    date: string;
    to: string;
  };
  svgId?: string;
  svgData?: Record<string, unknown>;
}

export interface StudentIdentity {
  name: string;
  participantNo: string;
  school: string;
}

// Answer shape per question number:
// - pg: string ('A' | 'B' | 'C' | 'D')
// - mcma: string[] (['A', 'C'])
// - kategori: Record<string, number> ({ s1: 0, s2: 1, s3: 0 })
export type StudentAnswer = string | string[] | Record<string, number>;

export interface ExamSessionState {
  subject: SubjectId;
  packetNumber: number;
  identity: StudentIdentity;
  answers: Record<number, StudentAnswer>;
  doubtful: Record<number, boolean>;
  currentIndex: number; // 0 to 29
  remainingSeconds: number;
  status: 'in_progress' | 'submitted';
  startedAt: number;
  submittedAt?: number;
}

export interface QuestionEvaluation {
  question: Question;
  studentAnswer: StudentAnswer | undefined;
  isAnswered: boolean;
  isCorrect: boolean;
}

export interface DomainStat {
  domain: string;
  total: number;
  correct: number;
  percentage: number;
}

export interface EvaluationResult {
  score: number; // 0-100
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  totalQuestions: number;
  durationUsedSeconds: number;
  domainStats: DomainStat[];
  evaluations: QuestionEvaluation[];
}
