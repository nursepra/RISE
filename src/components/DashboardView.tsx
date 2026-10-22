import React from 'react';
import {
  Target,
  Calendar,
  Sparkles,
  TrendingUp,
  Gift,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Play,
  FileDown,
  Clock,
  BookOpen,
  Award,
} from 'lucide-react';
import { ExamItem, MistakeEntry, MockTestResult, StudyTask, UserProfile } from '../types';
import { EXAMS_DATABASE } from '../data/examsData';
import { REWARDS_CATALOG } from '../data/rewardsAndPlannerData';

interface DashboardViewProps {
  userProfile: UserProfile;
  mistakes: MistakeEntry[];
  studyTasks: StudyTask[];
  results: MockTestResult[];
  onNavigateTab: (tab: string) => void;
  onStartExam: (exam: ExamItem) => void;
  onOpenPdfExam: (exam: ExamItem) => void;
  onToggleTask: (taskId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  mistakes,
  studyTasks,
  results,
  onNavigateTab,
  onStartExam,
  onOpenPdfExam,
  onToggleTask,
}) => {
  // Calculate days remaining to target exam
  const examDate = new Date(userProfile.examDate);
  const today = new Date();
  const diffTime = Math.max(0, examDate.getTime() - today.getTime());
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Find next achievable reward
  const nextReward = REWARDS_CATALOG.find((r) => r.pointsCost > userProfile.points) || REWARDS_CATALOG[0];
  const pointsNeeded = Math.max(0, nextReward.pointsCost - userProfile.points);
  const rewardProgress = Math.min(100, Math.round((userProfile.points / nextReward.pointsCost) * 100));

  // Today's pending tasks
  const pendingTasks = studyTasks.filter((t) => !t.completed);
  const completedTasks = studyTasks.filter((t) => t.completed);

  // Recommended exam
  const recommendedExam = EXAMS_DATABASE[0]; // A-LEVEL Math 1

  // Recent score calculation
  const latestResult = results[results.length - 1];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero: Goal-Oriented Command Center */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFE5EC] via-[#FFF0F4] to-white border border-[#FFC2D1]/70 shadow-sm p-6 sm:p-8">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Personalized Target & Status */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#C23259]">
              <span>ยินดีต้อนรับกลับมา, {userProfile.name}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-slate-600">
                <Target className="w-3.5 h-3.5 text-[#FB6F92]" />
                {userProfile.targetFaculty} ({userProfile.targetUniversity})
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight text-balance leading-snug">
              พาคุณก้าวสู่คณะในฝัน{' '}
              <span className="bg-gradient-to-r from-[#FB6F92] to-[#E04D74] bg-clip-text text-transparent">
                ด้วยการฝึกอย่างตรงจุด
              </span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              วันนี้แนะนำให้ทบทวนจุดอ่อน <span className="font-semibold text-slate-800">A-LEVEL เรื่องความน่าจะเป็น</span> และฝึกทำโจทย์อย่างน้อย 15 ข้อเพื่อสะสมแต้มแลกรางวัล
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onStartExam(recommendedExam)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF8FAB] to-[#FB6F92] text-white font-semibold text-sm shadow-sm hover:shadow-md hover:shadow-[#FB6F92]/30 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>เริ่มทำ Mock Test ทันที</span>
              </button>

              <button
                onClick={() => onNavigateTab('mistakes')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#FFC2D1] text-slate-700 hover:text-[#9F1C42] hover:bg-[#FFE5EC]/40 font-medium text-sm transition-colors"
              >
                <BookOpen className="w-4 h-4 text-[#FB6F92]" />
                <span>คลังข้อผิดพลาด ({mistakes.length} ข้อ)</span>
              </button>

              <button
                onClick={() => onNavigateTab('planner')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
              >
                <span>ตารางอ่านหนังสือ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Mascot & Countdown Card */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-4 items-center">
            <div className="relative w-full max-w-[280px] aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white">
              <img
                src="/src/assets/images/rise_mascot_student_1792667701984.jpg"
                alt="RISE Student Mascot"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-4">
                <div className="text-white">
                  <p className="text-xs font-medium text-white/90">เป้าหมายสอบ TCAS69</p>
                  <p className="text-lg font-bold">เหลืออีก {daysRemaining} วัน</p>
                </div>
              </div>
            </div>

            {/* Small Motivation Strip */}
            <div className="w-full max-w-[280px] bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-[#FFC2D1]/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#FB6F92]" />
                <span className="text-slate-600">วันสอบจริง:</span>
              </div>
              <span className="font-semibold text-slate-800 tabular-nums">
                {new Date(userProfile.examDate).toLocaleDateString('th-TH', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Quantitative Metrics (No Pills, Clean Numbers) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-5 border border-[#FFC2D1]/60 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>เวลาเตรียมตัว</span>
            <Calendar className="w-4 h-4 text-[#FB6F92]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
            {daysRemaining} <span className="text-sm font-medium text-slate-500">วัน</span>
          </div>
          <p className="text-[12px] text-slate-500">มุ่งมั่นตามแผน {userProfile.dailyStudyHours} ชม./วัน</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-5 border border-[#FFC2D1]/60 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>แต้มสะสมปัจจุบัน</span>
            <Gift className="w-4 h-4 text-[#FB6F92]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#C23259] tabular-nums">
            {userProfile.points.toLocaleString()} <span className="text-sm font-medium text-slate-500">pts</span>
          </div>
          <p className="text-[12px] text-slate-500">อีก {pointsNeeded} แต้ม แลกของถัดไป</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-5 border border-[#FFC2D1]/60 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>ทำโจทย์สัปดาห์นี้</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
            52 <span className="text-sm font-medium text-slate-500">ข้อ</span>
          </div>
          <p className="text-[12px] text-emerald-600 font-medium">+18% เทียบสัปดาห์ก่อน</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-5 border border-[#FFC2D1]/60 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>ความพร้อมจำลอง</span>
            <Award className="w-4 h-4 text-[#FB6F92]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
            {latestResult ? latestResult.readinessScore : 72}{' '}
            <span className="text-sm font-medium text-slate-500">/ 100</span>
          </div>
          <p className="text-[12px] text-slate-500">เป้าหมายวิศวะ จุฬาฯ: 75+</p>
        </div>
      </section>

      {/* Two Column Layout: Today's Tasks & Reward Milestone */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Today's Focus Action & Study Plan (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-[#FFC2D1]/60 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">📚 ภารกิจเตรียมสอบประจำวัน</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  เสร็จแล้ว {completedTasks.length} จาก {studyTasks.length} รายการ (รับโบนัส +20 แต้มเมื่อครบ)
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('planner')}
                className="text-xs font-semibold text-[#FB6F92] hover:text-[#C23259] transition-colors"
              >
                ดูทั้งสัปดาห์
              </button>
            </div>

            <div className="space-y-2.5">
              {studyTasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                    task.completed
                      ? 'bg-[#FFE5EC]/30 border-[#FFC2D1]/40 text-slate-400'
                      : 'bg-white hover:bg-[#FFF5F7] border-slate-200/80 text-slate-800'
                  }`}
                >
                  <button
                    type="button"
                    className="mt-0.5 shrink-0 text-slate-400 hover:text-[#FB6F92] focus:outline-none"
                  >
                    <CheckCircle2
                      className={`w-5 h-5 transition-colors ${
                        task.completed ? 'text-[#FB6F92] fill-[#FB6F92]/20' : 'text-slate-300'
                      }`}
                    />
                  </button>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium leading-snug ${
                        task.completed ? 'line-through text-slate-400' : 'text-slate-800'
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <span>{task.subject}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{task.duration}</span>
                      {task.recommendedTopic && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#C23259] font-medium">{task.recommendedTopic}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Weakness Action Notice */}
            <div className="p-4 rounded-xl bg-[#FFE5EC]/50 border border-[#FFC2D1]/60 flex items-start gap-3 text-xs text-slate-700">
              <Sparkles className="w-4 h-4 text-[#FB6F92] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#9F1C42]">คำแนะนำจาก AI:</span> จากการวิเคราะห์ล่าสุด คุณทำคะแนนเรื่อง "ฟังก์ชัน" ได้ 80% แต่ "ความน่าจะเป็น" ได้เพียง 35% แนะนำให้กดทำข้อสอบเรื่องนี้เพิ่มเพื่อดันคะแนนความพร้อม
              </div>
            </div>
          </div>

          {/* Quick Mistake Book Spotlight */}
          <div className="bg-white rounded-2xl border border-[#FFC2D1]/60 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">คลังข้อผิดพลาดส่วนตัว (My Mistake Book)</h3>
                <p className="text-xs text-slate-500">
                  มีข้อที่ต้องทบทวนซ้ำ {mistakes.filter((m) => !m.mastered).length} ข้อ
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('mistakes')}
                className="text-xs font-semibold text-[#FB6F92] hover:text-[#C23259] transition-colors"
              >
                เปิดคลังเต็ม
              </button>
            </div>

            {mistakes.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                ยังไม่มีข้อที่ตอบผิด ยอดเยี่ยมมาก! เมื่อทำ Mock Test ข้อที่ไม่ถูกต้องจะถูกบันทึกที่นี่อัตโนมัติ
              </p>
            ) : (
              <div className="space-y-2">
                {mistakes.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-[#FFF8F9] border border-[#FFC2D1]/40 flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-semibold text-slate-800 truncate">
                        ข้อ {item.question.questionNumber}: {item.question.prompt}
                      </p>
                      <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                        <span>{item.examTitle}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#C23259]">{item.question.topic}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigateTab('mistakes')}
                      className="shrink-0 px-3 py-1 rounded-lg bg-white border border-[#FFC2D1] text-[#9F1C42] font-semibold text-xs hover:bg-[#FFE5EC] transition-colors"
                    >
                      ฝึกซ้ำ
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Gamification Milestone & Featured Mock Exam (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Reward Goal Milestone Card */}
          <div className="bg-white rounded-2xl border border-[#FFC2D1]/60 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#C23259] tracking-wider uppercase">
                เป้าหมายของรางวัลถัดไป
              </span>
              <span className="text-xs text-slate-500 tabular-nums">
                {userProfile.points} / {nextReward.pointsCost} pts
              </span>
            </div>

            <div className="flex gap-4 items-center">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 border border-[#FFC2D1] shrink-0">
                <img
                  src={nextReward.image}
                  alt={nextReward.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-1 min-w-0">
                <h4 className="font-bold text-slate-900 text-sm leading-snug truncate">
                  {nextReward.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2">{nextReward.subtitle}</p>
                <div className="text-xs font-semibold text-[#FB6F92] tabular-nums">
                  ต้องการอีก {pointsNeeded} แต้ม
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full bg-[#FFE5EC] h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#FF8FAB] to-[#FB6F92] h-full rounded-full transition-all duration-500"
                  style={{ width: `${rewardProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>ความคืบหน้า {rewardProgress}%</span>
                <span>ทำ Mock Test 1 ชุด ได้แต้มทันที!</span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('rewards')}
              className="w-full py-2.5 rounded-xl bg-[#FFE5EC] hover:bg-[#FFC2D1] text-[#9F1C42] font-semibold text-xs text-center transition-colors block"
            >
              ดูของรางวัลทั้งหมดในร้านค้า
            </button>
          </div>

          {/* Featured Exam Ready-to-Take */}
          <div className="bg-gradient-to-br from-white to-[#FFF5F7] rounded-2xl border border-[#FFC2D1]/70 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-[#FB6F92]">ข้อสอบแนะนำสำหรับคุณ</span>
              <span className="tabular-nums">{recommendedExam.year}</span>
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                {recommendedExam.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">{recommendedExam.description}</p>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {recommendedExam.durationMinutes} นาที
              </span>
              <span aria-hidden="true">·</span>
              <span>{recommendedExam.totalQuestions} ข้อ</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">เต็ม {recommendedExam.maxScore} คะแนน</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => onStartExam(recommendedExam)}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#FF8FAB] to-[#FB6F92] text-white text-xs font-bold text-center hover:shadow-md hover:shadow-[#FB6F92]/25 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>จำลองสอบจริง</span>
              </button>

              <button
                onClick={() => onOpenPdfExam(recommendedExam)}
                className="py-2.5 px-3 rounded-xl bg-white border border-[#FFC2D1] text-slate-700 text-xs font-semibold hover:bg-[#FFE5EC]/50 transition-colors flex items-center justify-center gap-1.5"
              >
                <FileDown className="w-3.5 h-3.5 text-slate-500" />
                <span>โหลด PDF & ฝนกระดาษ</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
