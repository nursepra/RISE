import { MistakeEntry, MockTestResult, RedeemedItem, StudyTask, UserProfile } from '../types';
import { INITIAL_STUDY_TASKS, INITIAL_USER_PROFILE } from '../data/rewardsAndPlannerData';

const USER_PROFILE_KEY = 'rise_user_profile_v1';
const MISTAKES_KEY = 'rise_mistakes_v1';
const RESULTS_KEY = 'rise_results_v1';
const REDEEMED_KEY = 'rise_redeemed_v1';
const STUDY_TASKS_KEY = 'rise_study_tasks_v1';

// Initial preloaded mistakes for realistic experience
const DEFAULT_MISTAKES: MistakeEntry[] = [
  {
    id: 'mstk-1',
    examId: 'alevel-math-1-2026',
    examTitle: 'A-LEVEL คณิตศาสตร์ประยุกต์ 1',
    userAnswer: 'ก',
    date: '2026-10-21',
    reason: 'no_formula',
    notes: 'ลืมแยกกรณีว่ามีลูกบอลสีแดง 2 ลูก หรือ 3 ลูก ลืมสูตรผสม C(n,r)',
    mastered: false,
    retryCount: 1,
    question: {
      id: 'm1-q3',
      questionNumber: 3,
      topic: 'ความน่าจะเป็นและการนับ',
      prompt: 'กล่องใบหนึ่งมีลูกบอลสีแดง 4 ลูก และลูกบอลสีขาว 3 ลูก สุ่มหยิบลูกบอลขึ้นมา 3 ลูกพร้อมกัน ความน่าจะเป็นที่จะได้ลูกบอลสีแดงอย่างน้อย 2 ลูกเท่ากับข้อใด?',
      options: [
        { label: 'ก', text: '18/35' },
        { label: 'ข', text: '22/35' },
        { label: 'ค', text: '24/35' },
        { label: 'ง', text: '4/7' },
        { label: 'จ', text: '5/7' },
      ],
      correctAnswer: 'ข',
      explanation: 'วิธีคิด: n(S) = C(7, 3) = 35. เหตุการณ์แดงอย่างน้อย 2 ลูก: กรณีแดง 2 ขาว 1 = C(4,2)×C(3,1) = 6×3 = 18. กรณีแดง 3 = C(4,3) = 4. รวม 18 + 4 = 22. P(E) = 22/35',
      difficulty: 'Hard',
      formulaOrHint: 'C(n, r) = n! / (r!(n-r)!)',
    },
  },
  {
    id: 'mstk-2',
    examId: 'alevel-math-1-2026',
    examTitle: 'A-LEVEL คณิตศาสตร์ประยุกต์ 1',
    userAnswer: 'ข',
    date: '2026-10-21',
    reason: 'careless',
    notes: 'ลืมว่าโต๊ะกลม n คนจัดได้ (n-1)! แล้วลืมคิดวิธีตรงข้ามที่กุมาร ก-ข ไม่ติดกัน',
    mastered: false,
    retryCount: 0,
    question: {
      id: 'm1-q4',
      questionNumber: 4,
      topic: 'ความน่าจะเป็นและการนับ',
      prompt: 'จัดคน 6 คน ซึ่งมีนาย ก และ นาย ข รวมอยู่ด้วย นั่งรอบโต๊ะกลม ความน่าจะเป็นที่นาย ก และ นาย ข จะ "ไม่นั่งติดกัน" เท่ากับข้อใด?',
      options: [
        { label: 'ก', text: '1/5' },
        { label: 'ข', text: '2/5' },
        { label: 'ค', text: '3/5' },
        { label: 'ง', text: '4/5' },
        { label: 'จ', text: '1/2' },
      ],
      correctAnswer: 'ค',
      explanation: 'วิธีคิด: n(S) = (6 - 1)! = 120. ถ้า ก และ ข ติดกัน: มัดเป็นก้อนได้ (5-1)! × 2! = 48. ดังนั้นไม่ติดกัน = 120 - 48 = 72. P(E) = 72/120 = 3/5',
      difficulty: 'Hard',
    },
  },
];

export const loadUserProfile = (): UserProfile => {
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_USER_PROFILE;
  } catch {
    return INITIAL_USER_PROFILE;
  }
};

export const saveUserProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile:', e);
  }
};

export const loadMistakes = (): MistakeEntry[] => {
  try {
    const raw = localStorage.getItem(MISTAKES_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_MISTAKES;
  } catch {
    return DEFAULT_MISTAKES;
  }
};

export const saveMistakes = (mistakes: MistakeEntry[]): void => {
  try {
    localStorage.setItem(MISTAKES_KEY, JSON.stringify(mistakes));
  } catch (e) {
    console.error('Failed to save mistakes:', e);
  }
};

export const loadResults = (): MockTestResult[] => {
  try {
    const raw = localStorage.getItem(RESULTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveResults = (results: MockTestResult[]): void => {
  try {
    localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
  } catch (e) {
    console.error('Failed to save results:', e);
  }
};

export const loadRedeemed = (): RedeemedItem[] => {
  try {
    const raw = localStorage.getItem(REDEEMED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveRedeemed = (items: RedeemedItem[]): void => {
  try {
    localStorage.setItem(REDEEMED_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save redeemed items:', e);
  }
};

export const loadStudyTasks = (): StudyTask[] => {
  try {
    const raw = localStorage.getItem(STUDY_TASKS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_STUDY_TASKS;
  } catch {
    return INITIAL_STUDY_TASKS;
  }
};

export const saveStudyTasks = (tasks: StudyTask[]): void => {
  try {
    localStorage.setItem(STUDY_TASKS_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks:', e);
  }
};
