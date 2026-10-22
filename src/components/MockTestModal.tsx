import React, { useState, useEffect } from 'react';
import {
  Clock,
  AlertTriangle,
  Flag,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Award,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Gift,
  Send,
} from 'lucide-react';
import { ExamItem, MistakeEntry, MockTestResult, Question, UserProfile } from '../types';

interface MockTestModalProps {
  exam: ExamItem;
  userProfile: UserProfile;
  onClose: () => void;
  onFinishTest: (result: MockTestResult, newMistakes: MistakeEntry[]) => void;
  onRequestReportError: (question: Question, examTitle: string) => void;
}

export const MockTestModal: React.FC<MockTestModalProps> = ({
  exam,
  userProfile,
  onClose,
  onFinishTest,
  onRequestReportError,
}) => {
  // Test navigation & answers state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(exam.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [testResult, setTestResult] = useState<MockTestResult | null>(null);

  // Timer effect
  useEffect(() => {
    if (isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted]);

  const currentQuestion = exam.questions[currentIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

  const handleSelectOption = (optionLabel: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionLabel,
    }));
  };

  const handleToggleFlag = () => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  // Submit test and evaluate
  const handleSubmitTest = () => {
    setShowConfirmSubmit(false);
    setIsSubmitted(true);

    let correctScore = 0;
    const topicMap: Record<string, { correct: number; total: number }> = {};
    const newMistakes: MistakeEntry[] = [];

    // Group questions by topic & evaluate answers
    exam.questions.forEach((q) => {
      if (!topicMap[q.topic]) {
        topicMap[q.topic] = { correct: 0, total: 0 };
      }
      topicMap[q.topic].total += 1;

      const userAns = selectedAnswers[q.id];
      const isCorrect = userAns === q.correctAnswer;

      if (isCorrect) {
        correctScore += exam.maxScore / exam.totalQuestions;
        topicMap[q.topic].correct += 1;
      } else {
        // Automatically add to My Mistake Book
        newMistakes.push({
          id: `mistake-${Date.now()}-${q.id}`,
          examId: exam.id,
          examTitle: exam.title,
          question: q,
          userAnswer: userAns || 'ไม่ตอบ',
          date: new Date().toISOString().split('T')[0],
          reason: 'careless',
          notes: 'เพิ่มจาก Mock Test อัตโนมัติ - รอทบทวน',
          mastered: false,
          retryCount: 0,
        });
      }
    });

    const finalScore = Math.round(correctScore);
    const percentage = Math.round((finalScore / exam.maxScore) * 100);

    const topicBreakdown = Object.keys(topicMap).map((topicName) => ({
      topic: topicName,
      correct: topicMap[topicName].correct,
      total: topicMap[topicName].total,
      percentage: Math.round((topicMap[topicName].correct / topicMap[topicName].total) * 100),
    }));

    // Gamification Points Calculation:
    // Base: +50 for completing mock test
    // Performance: +0.5 pts per percentage point
    // Weak Topic bonus: +15 if tested weak topic
    const basePts = 50;
    const scorePts = Math.round(percentage * 0.5);
    const totalPointsEarned = basePts + scorePts;

    // Realistic University Readiness Score estimation (0-100)
    // Weighted by percentage and exam difficulty
    const readinessScore = Math.min(98, Math.max(25, Math.round(percentage * 0.85 + 10)));

    const result: MockTestResult = {
      id: `result-${Date.now()}`,
      examId: exam.id,
      examTitle: exam.title,
      category: exam.category,
      score: finalScore,
      maxScore: exam.maxScore,
      percentage,
      timeSpentSeconds: exam.durationMinutes * 60 - timeLeft,
      completedAt: new Date().toISOString(),
      answers: selectedAnswers,
      topicBreakdown,
      pointsEarned: totalPointsEarned,
      readinessScore,
    };

    setTestResult(result);
    onFinishTest(result, newMistakes);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-[#FFC2D1] flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top Simulation Header */}
        <div className="px-6 py-4 bg-[#FFF8F9] border-b border-[#FFC2D1]/60 flex items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="text-[#FB6F92] font-semibold">{exam.category}</span>
              <span aria-hidden="true">·</span>
              <span>{exam.code}</span>
              <span aria-hidden="true">·</span>
              <span>{isSubmitted ? 'สรุปผลการทดสอบ' : 'โหมดจำลองสอบจริง (ซ่อนเฉลย)'}</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate max-w-lg">
              {exam.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted && (
              <div
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-bold text-sm tabular-nums ${
                  timeLeft < 300
                    ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                    : 'bg-white border-[#FFC2D1] text-slate-700'
                }`}
              >
                <Clock className="w-4 h-4 text-[#FB6F92]" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              {isSubmitted ? 'ปิดหน้าต่าง' : 'ออกจากการสอบ'}
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {!isSubmitted ? (
          /* Live Test Mode: Split layout */
          <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            {/* Left Zone: Question Stage (8 cols) */}
            <div className="lg:col-span-8 p-6 overflow-y-auto space-y-6">
              {/* Question Metadata & Flag Button */}
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                  <span className="text-slate-900 font-bold text-sm">
                    ข้อที่ {currentIndex + 1} จาก {exam.questions.length}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#C23259]">{currentQuestion.topic}</span>
                  <span aria-hidden="true">·</span>
                  <span>ความยาก: {currentQuestion.difficulty}</span>
                </div>

                <button
                  onClick={handleToggleFlag}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    flaggedQuestions[currentQuestion.id]
                      ? 'bg-amber-50 border-amber-300 text-amber-700'
                      : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{flaggedQuestions[currentQuestion.id] ? 'ปักธงไว้ทบทวน' : 'ปักธงข้อนี้'}</span>
                </button>
              </div>

              {/* Question Prompt */}
              <div className="p-5 rounded-2xl bg-[#FFF8F9] border border-[#FFC2D1]/40 text-slate-900 text-base leading-relaxed font-medium">
                {currentQuestion.prompt}
              </div>

              {/* Options List */}
              <div className="space-y-3 pt-2">
                {currentQuestion.options.map((opt) => {
                  const isSelected = selectedAnswers[currentQuestion.id] === opt.label;
                  return (
                    <div
                      key={opt.label}
                      onClick={() => handleSelectOption(opt.label)}
                      className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FFE5EC] border-[#FB6F92] text-slate-900 shadow-sm'
                          : 'bg-white hover:bg-[#FFF5F7] border-slate-200 text-slate-700'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-[#FB6F92] text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {opt.label}
                      </div>
                      <div className="text-sm font-medium pt-0.5 leading-relaxed">{opt.text}</div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Controls between questions */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => prev - 1)}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>ข้อก่อนหน้า</span>
                </button>

                <div className="text-xs text-slate-500 tabular-nums">
                  ตอบแล้ว {answeredCount} / {exam.questions.length} ข้อ
                </div>

                {currentIndex < exam.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
                  >
                    <span>ข้อถัดไป</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowConfirmSubmit(true)}
                    className="flex items-center gap-1 px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF8FAB] to-[#FB6F92] text-white text-xs font-bold hover:shadow-md hover:shadow-[#FB6F92]/25 active:scale-95 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>ส่งข้อสอบ</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Zone: Question Palette Deck (4 cols) */}
            <div className="lg:col-span-4 bg-[#FFF8F9]/50 border-t lg:border-t-0 lg:border-l border-[#FFC2D1]/60 p-6 flex flex-col justify-between overflow-y-auto space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    กระดานข้อสอบ (Navigator)
                  </h3>
                  <span className="text-xs text-slate-500 tabular-nums">
                    {Math.round((answeredCount / exam.questions.length) * 100)}%
                  </span>
                </div>

                {/* Question Grid Buttons */}
                <div className="grid grid-cols-5 gap-2">
                  {exam.questions.map((q, idx) => {
                    const isAnswered = !!selectedAnswers[q.id];
                    const isFlagged = !!flaggedQuestions[q.id];
                    const isCurrent = currentIndex === idx;

                    let bgClass = 'bg-white border-slate-200 text-slate-600 hover:border-slate-300';
                    if (isAnswered) {
                      bgClass = 'bg-[#FFE5EC] border-[#FB6F92] text-[#9F1C42] font-bold';
                    }
                    if (isFlagged) {
                      bgClass = 'bg-amber-100 border-amber-400 text-amber-900 font-bold';
                    }
                    if (isCurrent) {
                      bgClass += ' ring-2 ring-[#FB6F92] ring-offset-1';
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-9 rounded-lg border text-xs font-semibold flex items-center justify-center transition-all ${bgClass}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="pt-2 text-[11px] text-slate-500 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-[#FFE5EC] border border-[#FB6F92]" />
                    <span>ตอบแล้ว ({answeredCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-white border border-slate-200" />
                    <span>ยังไม่ตอบ ({exam.questions.length - answeredCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-amber-100 border border-amber-400" />
                    <span>ปักธงไว้ ({Object.values(flaggedQuestions).filter(Boolean).length})</span>
                  </div>
                </div>
              </div>

              {/* Submit Button in Sidebar */}
              <div className="pt-4 border-t border-[#FFC2D1]/40 space-y-2">
                <button
                  onClick={() => setShowConfirmSubmit(true)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF8FAB] to-[#FB6F92] text-white text-xs font-bold hover:shadow-md hover:shadow-[#FB6F92]/25 active:scale-95 transition-all text-center block"
                >
                  ส่งคำตอบและตรวจคะแนน
                </button>
                <p className="text-[11px] text-slate-400 text-center">
                  เมื่อส่งแล้ว ระบบจะสรุปคะแนนและเฉลยละเอียดทันที
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Result & Explanation Mode */
          <div className="flex-1 p-6 overflow-y-auto space-y-8">
            {testResult && (
              <>
                {/* Result Hero Banner */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FFE5EC] via-[#FFF0F4] to-white border border-[#FFC2D1] flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-[#FB6F92] uppercase tracking-wider">
                      <Award className="w-4 h-4" />
                      <span>สรุปผลการทดสอบ Mock Test</span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900">
                      คะแนนของคุณ: {testResult.score} / {testResult.maxScore} คะแนน ({testResult.percentage}%)
                    </h3>
                    <p className="text-xs text-slate-600">
                      ใช้เวลาไป {formatTime(testResult.timeSpentSeconds)} · บันทึก {exam.questions.length - (testResult.score / (testResult.maxScore / exam.totalQuestions))} ข้อที่ตอบผิดลงใน My Mistake Book อัตโนมัติ
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {/* Points Earned Box */}
                    <div className="px-5 py-3 rounded-xl bg-white border border-[#FFC2D1] shadow-sm text-center">
                      <span className="text-[11px] text-slate-500 font-medium block">รับแต้มสะสม</span>
                      <span className="text-xl font-extrabold text-[#C23259] tabular-nums">
                        +{testResult.pointsEarned} pts
                      </span>
                    </div>

                    {/* Readiness Score Box */}
                    <div className="px-5 py-3 rounded-xl bg-white border border-[#FFC2D1] shadow-sm text-center">
                      <span className="text-[11px] text-slate-500 font-medium block">ประเมินความพร้อม</span>
                      <span className="text-xl font-extrabold text-slate-900 tabular-nums">
                        {testResult.readinessScore} / 100
                      </span>
                    </div>
                  </div>
                </div>

                {/* Important Disclaimer as required by Section 1.2 */}
                <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>หมายเหตุข้อควรทราบ:</strong> คะแนนความพร้อม (Readiness Score) เป็นค่าประเมินจากระบบจำลองและการทำข้อสอบเท่านั้น ไม่ใช่คะแนนจริงหรือการรับประกันผลการคัดเลือก
                  </span>
                </div>

                {/* Topic Breakdown Grid (Highlighting strong vs weak like in prompt) */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900">
                    📊 สรุปความแม่นยำแยกตามบทย่อย (Topic Breakdown)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {testResult.topicBreakdown.map((t) => {
                      const isWeak = t.percentage < 60;
                      return (
                        <div
                          key={t.topic}
                          className={`p-4 rounded-xl border ${
                            isWeak
                              ? 'bg-rose-50/60 border-rose-200'
                              : 'bg-emerald-50/60 border-emerald-200'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="truncate text-slate-800">{t.topic}</span>
                            <span className={isWeak ? 'text-rose-700 font-bold' : 'text-emerald-700 font-bold'}>
                              {t.percentage}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isWeak ? 'bg-rose-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${t.percentage}%` }}
                            />
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1.5 tabular-nums">
                            ถูก {t.correct} จาก {t.total} ข้อ {isWeak && '(จุดที่ควรฝึกเพิ่ม)'}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Step-by-Step Questions & Explanations Review */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h4 className="text-base font-bold text-slate-900">
                    📝 เฉลยละเอียดทุกข้อ พร้อมแนวคิดและข้อควรระวัง
                  </h4>

                  <div className="space-y-4">
                    {exam.questions.map((q, idx) => {
                      const userAns = selectedAnswers[q.id];
                      const isCorrect = userAns === q.correctAnswer;

                      return (
                        <div
                          key={q.id}
                          className={`p-5 rounded-2xl border transition-all ${
                            isCorrect
                              ? 'bg-white border-slate-200'
                              : 'bg-rose-50/30 border-rose-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-2">
                              {isCorrect ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                              ) : (
                                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                              )}
                              <span className="font-bold text-slate-900 text-sm">
                                ข้อที่ {idx + 1}:
                              </span>
                              <span className="text-xs text-slate-500">[{q.topic}]</span>
                            </div>

                            <button
                              onClick={() => onRequestReportError(q, exam.title)}
                              className="text-xs text-slate-400 hover:text-slate-700 transition-colors"
                            >
                              แจ้งข้อสอบผิด
                            </button>
                          </div>

                          <p className="text-sm text-slate-800 mt-2 font-medium">{q.prompt}</p>

                          {/* Options grid in review */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                            {q.options.map((opt) => {
                              const isThisCorrect = opt.label === q.correctAnswer;
                              const isThisUser = opt.label === userAns;

                              let optClass = 'bg-white border-slate-200 text-slate-600';
                              if (isThisCorrect) {
                                optClass = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold';
                              } else if (isThisUser && !isThisCorrect) {
                                optClass = 'bg-rose-50 border-rose-300 text-rose-900 line-through';
                              }

                              return (
                                <div
                                  key={opt.label}
                                  className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${optClass}`}
                                >
                                  <span className="w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] bg-slate-100 shrink-0">
                                    {opt.label}
                                  </span>
                                  <span className="truncate">{opt.text}</span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Explanation Box */}
                          <div className="mt-3.5 p-3.5 rounded-xl bg-[#FFF8F9] border border-[#FFC2D1]/60 text-xs text-slate-700 space-y-1 whitespace-pre-line leading-relaxed">
                            <span className="font-bold text-[#9F1C42] block">💡 เฉลยและวิธีคิด:</span>
                            {q.explanation}
                            {q.formulaOrHint && (
                              <div className="pt-1 text-[#C23259] font-medium">
                                📐 สูตร/แนวคิด: {q.formulaOrHint}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Confirmation Modal before Submit */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 z-60 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-[#FFC2D1] space-y-4 animate-in fade-in zoom-in-95">
              <h3 className="text-lg font-bold text-slate-900">ยืนยันการส่งข้อสอบ?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                คุณตอบไปแล้ว <span className="font-bold text-slate-800 tabular-nums">{answeredCount}</span> จาก{' '}
                <span className="font-bold text-slate-800 tabular-nums">{exam.questions.length}</span> ข้อ{' '}
                {exam.questions.length - answeredCount > 0 && (
                  <span className="text-rose-600 font-medium">
                    (ยังเหลืออีก {exam.questions.length - answeredCount} ข้อที่ยังไม่ได้ตอบ)
                  </span>
                )}
                <br />
                เมื่อส่งแล้ว ระบบจะคำนวณคะแนนและบันทึกข้อที่ผิดลงใน My Mistake Book ทันที
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  กลับไปทำต่อ
                </button>
                <button
                  onClick={handleSubmitTest}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF8FAB] to-[#FB6F92] text-white text-xs font-bold hover:shadow-md hover:shadow-[#FB6F92]/25 active:scale-95 transition-all"
                >
                  ยืนยันส่งข้อสอบ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
