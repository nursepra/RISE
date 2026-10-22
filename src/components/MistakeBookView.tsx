import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Edit3,
  Save,
  Trash2,
  Filter,
  Check,
  HelpCircle,
  Play,
  ArrowRight,
} from 'lucide-react';
import { MistakeEntry, Question } from '../types';

interface MistakeBookViewProps {
  mistakes: MistakeEntry[];
  onUpdateMistake: (id: string, reason: MistakeEntry['reason'], notes: string) => void;
  onRemoveMistake: (id: string) => void;
  onMarkMastered: (id: string, mastered: boolean) => void;
  onEarnPoints: (points: number, reason: string) => void;
}

export const MistakeBookView: React.FC<MistakeBookViewProps> = ({
  mistakes,
  onUpdateMistake,
  onRemoveMistake,
  onMarkMastered,
  onEarnPoints,
}) => {
  const [filterMastered, setFilterMastered] = useState<'all' | 'unmastered' | 'mastered'>('unmastered');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempReason, setTempReason] = useState<MistakeEntry['reason']>('careless');
  const [tempNotes, setTempNotes] = useState('');

  // Retry Mode State
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryIndex, setRetryIndex] = useState(0);
  const [retryAnswers, setRetryAnswers] = useState<Record<string, string>>({});
  const [retryFeedback, setRetryFeedback] = useState<Record<string, boolean | null>>({});

  const reasonLabels: Record<MistakeEntry['reason'], { label: string; color: string }> = {
    no_formula: { label: 'จำสูตรไม่ได้', color: 'text-rose-600 bg-rose-50 border-rose-200' },
    careless: { label: 'อ่านโจทย์ไม่รอบคอบ/โดนหลอก', color: 'text-amber-600 bg-amber-50 border-amber-200' },
    calculation: { label: 'คำนวณเลขผิด', color: 'text-orange-600 bg-orange-50 border-orange-200' },
    time_out: { label: 'บริหารเวลาไม่ทัน', color: 'text-purple-600 bg-purple-50 border-purple-200' },
    unlearned: { label: 'ยังไม่เคยเรียนเรื่องนี้', color: 'text-blue-600 bg-blue-50 border-blue-200' },
    other: { label: 'สาเหตุอื่นๆ', color: 'text-slate-600 bg-slate-50 border-slate-200' },
  };

  const filteredMistakes = mistakes.filter((m) => {
    if (filterMastered === 'unmastered') return !m.mastered;
    if (filterMastered === 'mastered') return m.mastered;
    return true;
  });

  const startEditing = (m: MistakeEntry) => {
    setEditingId(m.id);
    setTempReason(m.reason);
    setTempNotes(m.notes || '');
  };

  const saveEditing = (id: string) => {
    onUpdateMistake(id, tempReason, tempNotes);
    setEditingId(null);
  };

  // Launch interactive retry mode
  const handleStartRetry = () => {
    if (filteredMistakes.length === 0) return;
    setIsRetrying(true);
    setRetryIndex(0);
    setRetryAnswers({});
    setRetryFeedback({});
  };

  const handleSelectRetryOption = (optionLabel: string) => {
    const currentMistake = filteredMistakes[retryIndex];
    if (!currentMistake) return;

    setRetryAnswers((prev) => ({ ...prev, [currentMistake.id]: optionLabel }));
    const isCorrect = optionLabel === currentMistake.question.correctAnswer;
    setRetryFeedback((prev) => ({ ...prev, [currentMistake.id]: isCorrect }));

    if (isCorrect) {
      onMarkMastered(currentMistake.id, true);
      onEarnPoints(25, 'พิชิตข้อผิดพลาดใน My Mistake Book สำเร็จ!');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#FB6F92] uppercase tracking-wider">
            SPACED REPETITION & SELF-REFLECTION
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            คลังข้อผิดพลาดส่วนตัว (My Mistake Book)
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            บันทึกข้อที่ทำผิดจาก Mock Test อัตโนมัติ เพื่อให้คุณจดโน้ตสาเหตุที่ผิดและกลับมาฝึกซ้ำจนกว่าจะเข้าใจ 100%
          </p>
        </div>

        {filteredMistakes.length > 0 && !isRetrying && (
          <button
            onClick={handleStartRetry}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF8FAB] to-[#FB6F92] text-white font-semibold text-xs shadow-sm hover:shadow-md hover:shadow-[#FB6F92]/25 active:scale-95 transition-all shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>เริ่มฝึกซ้ำข้อที่ผิด ({filteredMistakes.length} ข้อ)</span>
          </button>
        )}
      </div>

      {/* Interactive Retry Mode Modal / Stage */}
      {isRetrying && (
        <div className="p-6 rounded-3xl bg-white border-2 border-[#FB6F92] shadow-lg space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#C23259]">
              <RotateCcw className="w-4 h-4" />
              <span>
                กำลังฝึกซ้ำข้อที่ผิด ({retryIndex + 1} / {filteredMistakes.length})
              </span>
            </div>
            <button
              onClick={() => setIsRetrying(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              ออกจากการฝึกซ้ำ
            </button>
          </div>

          {filteredMistakes[retryIndex] && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500">
                <span>{filteredMistakes[retryIndex].examTitle}</span>
                <span aria-hidden="true" className="mx-2">·</span>
                <span className="font-semibold text-slate-700">
                  {filteredMistakes[retryIndex].question.topic}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#FFF8F9] border border-[#FFC2D1]/60 text-slate-900 font-medium text-sm leading-relaxed">
                {filteredMistakes[retryIndex].question.prompt}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {filteredMistakes[retryIndex].question.options.map((opt) => {
                  const currentId = filteredMistakes[retryIndex].id;
                  const isSelected = retryAnswers[currentId] === opt.label;
                  const feedback = retryFeedback[currentId];
                  const isCorrectAnswer = opt.label === filteredMistakes[retryIndex].question.correctAnswer;

                  let optClass = 'bg-white border-slate-200 text-slate-700 hover:border-slate-300';
                  if (isSelected) {
                    if (feedback === true) {
                      optClass = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold';
                    } else if (feedback === false) {
                      optClass = 'bg-rose-50 border-rose-400 text-rose-900 line-through';
                    }
                  } else if (feedback === false && isCorrectAnswer) {
                    optClass = 'bg-emerald-50 border-emerald-400 text-emerald-800';
                  }

                  return (
                    <button
                      key={opt.label}
                      onClick={() => handleSelectRetryOption(opt.label)}
                      className={`p-3.5 rounded-xl border text-left text-xs flex items-start gap-3 transition-all ${optClass}`}
                    >
                      <span className="w-6 h-6 rounded flex items-center justify-center font-bold bg-slate-100 shrink-0">
                        {opt.label}
                      </span>
                      <span className="leading-relaxed pt-0.5">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Instant feedback strip */}
              {retryFeedback[filteredMistakes[retryIndex].id] !== undefined && (
                <div
                  className={`p-4 rounded-xl text-xs space-y-1.5 animate-in fade-in ${
                    retryFeedback[filteredMistakes[retryIndex].id]
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="font-bold flex items-center gap-2">
                    {retryFeedback[filteredMistakes[retryIndex].id] ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>ยอดเยี่ยมมาก! ตอบถูกต้องแล้ว (+25 แต้มความก้าวหน้า)</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        <span>ยังไม่ถูกต้อง คำตอบที่ถูกคือ ({filteredMistakes[retryIndex].question.correctAnswer})</span>
                      </>
                    )}
                  </div>
                  <p className="text-slate-700 pt-1 leading-relaxed">
                    {filteredMistakes[retryIndex].question.explanation}
                  </p>
                </div>
              )}

              {/* Navigation in retry */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  disabled={retryIndex === 0}
                  onClick={() => setRetryIndex((prev) => prev - 1)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold disabled:opacity-40"
                >
                  ข้อก่อนหน้า
                </button>

                {retryIndex < filteredMistakes.length - 1 ? (
                  <button
                    onClick={() => setRetryIndex((prev) => prev + 1)}
                    className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                  >
                    ข้อถัดไป →
                  </button>
                ) : (
                  <button
                    onClick={() => setIsRetrying(false)}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF8FAB] to-[#FB6F92] text-white text-xs font-bold"
                  >
                    เสร็จสิ้นการฝึกซ้ำ
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter Tabs (Zero-pill: functional buttons) */}
      <div className="flex items-center gap-1.5 p-1 bg-[#FFE5EC]/50 rounded-xl border border-[#FFC2D1]/60 w-fit">
        <button
          onClick={() => setFilterMastered('unmastered')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            filterMastered === 'unmastered'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          รอทบทวน ({mistakes.filter((m) => !m.mastered).length})
        </button>
        <button
          onClick={() => setFilterMastered('mastered')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            filterMastered === 'mastered'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          พิชิตแล้ว ({mistakes.filter((m) => m.mastered).length})
        </button>
        <button
          onClick={() => setFilterMastered('all')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            filterMastered === 'all'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ทั้งหมด ({mistakes.length})
        </button>
      </div>

      {/* List of Mistakes */}
      {filteredMistakes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#FFC2D1] p-8 space-y-2">
          <BookOpen className="w-8 h-8 text-[#FB6F92] mx-auto opacity-60" />
          <h3 className="text-sm font-bold text-slate-800">ไม่มีข้อสอบในหมวดนี้</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            เมื่อคุณทำ Mock Test ข้อที่ไม่ถูกต้องจะถูกส่งมาเก็บที่นี่โดยอัตโนมัติ เพื่อให้กลับมาฝึกซ้ำได้เรื่อยๆ
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMistakes.map((item) => {
            const isEditing = editingId === item.id;
            const reasonConfig = reasonLabels[item.reason] || reasonLabels.other;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#FFC2D1]/60 p-6 shadow-sm space-y-4 hover:border-[#FB6F92]/40 transition-all"
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-900">
                      ข้อที่ {item.question.questionNumber}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-600 font-medium">{item.examTitle}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-[#C23259] font-medium">{item.question.topic}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Reason Tag */}
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${reasonConfig.color}`}>
                      {reasonConfig.label}
                    </span>

                    {/* Mastered Status */}
                    {item.mastered ? (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ✓ พิชิตแล้ว
                      </span>
                    ) : (
                      <button
                        onClick={() => onMarkMastered(item.id, true)}
                        className="text-[11px] text-slate-500 hover:text-emerald-700 font-medium hover:underline"
                      >
                        ทำเครื่องหมายว่าพิชิตแล้ว
                      </button>
                    )}
                  </div>
                </div>

                {/* Question Prompt */}
                <p className="text-sm font-medium text-slate-800 leading-relaxed">
                  {item.question.prompt}
                </p>

                {/* Answers Comparison */}
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5 text-rose-600">
                    <span>คำตอบเดิมของคุณ:</span>
                    <strong className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200">
                      {item.userAnswer}
                    </strong>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <span>คำตอบที่ถูกต้อง:</span>
                    <strong className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                      {item.question.correctAnswer}
                    </strong>
                  </div>
                </div>

                {/* Explanation */}
                <div className="p-3.5 rounded-xl bg-[#FFF8F9] border border-[#FFC2D1]/50 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                  <span className="font-bold text-[#9F1C42] block">💡 เฉลยและวิธีคิด:</span>
                  {item.question.explanation}
                </div>

                {/* Self Reflection Notes Section */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  {isEditing ? (
                    <div className="w-full space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <select
                          value={tempReason}
                          onChange={(e) => setTempReason(e.target.value as any)}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-800"
                        >
                          <option value="no_formula">จำสูตรไม่ได้</option>
                          <option value="careless">อ่านโจทย์ไม่รอบคอบ/โดนหลอก</option>
                          <option value="calculation">คำนวณเลขผิด</option>
                          <option value="time_out">บริหารเวลาไม่ทัน</option>
                          <option value="unlearned">ยังไม่เคยเรียนเรื่องนี้</option>
                          <option value="other">สาเหตุอื่นๆ</option>
                        </select>
                        <input
                          type="text"
                          value={tempNotes}
                          onChange={(e) => setTempNotes(e.target.value)}
                          placeholder="จดบันทึกเตือนตัวเอง เช่น 'ระวังกรณีที่ลูกบอลมี 3 สี'..."
                          className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-800"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200"
                        >
                          ยกเลิก
                        </button>
                        <button
                          onClick={() => saveEditing(item.id)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#FB6F92] text-white hover:bg-[#E04D74]"
                        >
                          บันทึก
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-xs text-slate-600">
                        <span className="font-semibold text-slate-800">บันทึกเตือนตนเอง: </span>
                        <span>{item.notes || 'ยังไม่ได้เพิ่มบันทึก'}</span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => startEditing(item)}
                          className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-[#FB6F92] transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>แก้ไขบันทึก</span>
                        </button>
                        <button
                          onClick={() => onRemoveMistake(item.id)}
                          className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>ลบ</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
