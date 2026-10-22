export type ExamCategory = 'ALL' | 'TGAT' | 'TPAT' | 'ALEVEL' | 'IELTS' | 'SAT' | 'NETSAT';

export interface QuestionOption {
  label: string; // "A", "B", "C", "D" or "ก", "ข", "ค", "ง"
  text: string;
}

export interface Question {
  id: string;
  questionNumber: number;
  topic: string;
  prompt: string;
  options: QuestionOption[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  formulaOrHint?: string;
}

export interface ExamItem {
  id: string;
  title: string;
  code: string;
  category: ExamCategory;
  year: string;
  durationMinutes: number;
  totalQuestions: number;
  maxScore: number;
  description: string;
  topics: { name: string; count: number }[];
  questions: Question[];
  isPopular?: boolean;
  recommendedFor?: string[];
}

export interface MistakeEntry {
  id: string;
  examId: string;
  examTitle: string;
  question: Question;
  userAnswer: string;
  date: string;
  reason: 'no_formula' | 'careless' | 'calculation' | 'time_out' | 'unlearned' | 'other';
  notes: string;
  mastered: boolean;
  retryCount: number;
}

export interface UserProfile {
  name: string;
  points: number;
  streakDays: number;
  lastActiveDate: string;
  targetFaculty: string;
  targetUniversity: string;
  examDate: string;
  dailyStudyHours: number;
  targetScore: number;
}

export interface StudyTask {
  id: string;
  day: string; // e.g. "จันทร์", "อังคาร"
  title: string;
  subject: string;
  duration: string;
  completed: boolean;
  examCategory: ExamCategory;
  recommendedTopic?: string;
}

export interface Reward {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'physical' | 'digital';
  pointsCost: number;
  image: string;
  stock: number;
  partner?: string;
  highlight?: string;
}

export interface RedeemedItem {
  id: string;
  rewardId: string;
  title: string;
  pointsCost: number;
  category: 'physical' | 'digital';
  redeemedAt: string;
  status: 'ready' | 'processing' | 'shipped';
  code?: string;
  shippingAddress?: string;
}

export interface MockTestResult {
  id: string;
  examId: string;
  examTitle: string;
  category: ExamCategory;
  score: number;
  maxScore: number;
  percentage: number;
  timeSpentSeconds: number;
  completedAt: string;
  answers: Record<string, string>;
  topicBreakdown: {
    topic: string;
    correct: number;
    total: number;
    percentage: number;
  }[];
  pointsEarned: number;
  readinessScore: number;
  aiAdvice?: string;
}

export interface SquadMember {
  id: string;
  name: string;
  avatar: string;
  targetFaculty: string;
  targetUni: string;
  weeklyQuestions: number;
  growthRate: number; // +% this week
  streak: number;
  points: number;
  isCurrentUser?: boolean;
}
