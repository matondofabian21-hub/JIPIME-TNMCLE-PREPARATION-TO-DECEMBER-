export type OptionKey = 'A' | 'B' | 'C' | 'D';

export type SectionId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface SectionInfo {
  id: SectionId;
  code: string;
  title: string;
  questionRange: [number, number];
  description: string;
}

export interface ExamQuestion {
  id: number;
  section: SectionId;
  question: string;
  options: Record<OptionKey, string>;
  correctAnswer: OptionKey;
  rationale: string;
}

export type ExamMode = 'full' | 'section' | 'custom' | 'retry-incorrect';

export type ViewMode = 'single' | 'booklet';

export interface ExamSessionConfig {
  mode: ExamMode;
  title: string;
  sectionId?: SectionId;
  questionIds: number[];
  durationSeconds: number;
  shuffleQuestions: boolean;
  shuffleOptions?: boolean;
  passThresholdPercent: number;
}

export interface ExamAttemptState {
  sessionId: string;
  config: ExamSessionConfig;
  answers: Record<number, OptionKey>;
  flagged: number[];
  hintsViewed: number[];
  currentIndex: number;
  remainingSeconds: number;
  startedAt: number;
  submittedAt: number | null;
  status: 'in-progress' | 'submitted';
}

export interface AttemptHistoryEntry {
  sessionId: string;
  title: string;
  mode: ExamMode;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  scorePercent: number;
  passed: boolean;
  timeSpentSeconds: number;
  hintsUsedCount?: number;
  submittedAt: number;
  incorrectIds: number[];
  questionIds?: number[];
  answers?: Record<number, OptionKey>;
  flagged?: number[];
  hintsViewed?: number[];
  passThresholdPercent?: number;
}

export interface RecentStudentActivity {
  displayName: string;
  paperTitle: string;
  mode: ExamMode;
  totalQuestions: number;
  correctCount: number;
  scorePercent: number;
  passed: boolean;
  submittedAtMs: number;
}

export interface GlobalDashboardStats {
  totalSubmissions: number;
  uniqueStudentsCount: number;
  fullExamSubmissions: number;
  passedSubmissions: number;
  totalScoreSum: number;
  sectionCounts: Record<SectionId, number>;
  sectionScoreSums: Record<SectionId, number>;
  recentActivity: RecentStudentActivity[];
}
