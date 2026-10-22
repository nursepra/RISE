import React, { useState } from 'react';
import { Printer, Download, Eye, EyeOff, X, FileText, CheckCircle2 } from 'lucide-react';
import { ExamItem } from '../types';

interface PrintableExamModalProps {
  exam: ExamItem;
  onClose: () => void;
}

export const PrintableExamModal: React.FC<PrintableExamModalProps> = ({ exam, onClose }) => {
  const [includeAnswerKey, setIncludeAnswerKey] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-[#FFC2D1] flex flex-col max-h-[94vh] overflow-hidden my-auto animate-in fade-in zoom-in-95">
        {/* Modal Toolbar (Hidden when printing via no-print class) */}
        <div className="no-print px-6 py-4 bg-[#FFF8F9] border-b border-[#FFC2D1]/60 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FFE5EC] flex items-center justify-center text-[#FB6F92]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                เอกสารข้อสอบ & กระดาษคำตอบ OMR (สำหรับพิมพ์หรือเซฟ PDF)
              </h3>
              <p className="text-xs text-slate-500">
                {exam.title} ({exam.code})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Toggle Answer Key */}
            <button
              onClick={() => setIncludeAnswerKey(!includeAnswerKey)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#FFC2D1] bg-white text-xs font-semibold text-slate-700 hover:bg-[#FFE5EC]/40 transition-colors"
            >
              {includeAnswerKey ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-[#FB6F92]" />
                  <span>ซ่อนเฉลยท้ายชุด</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>รวมเฉลยท้ายชุด</span>
                </>
              )}
            </button>

            {/* Print / Save to PDF Button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#FF8FAB] to-[#FB6F92] text-white text-xs font-bold hover:shadow-md hover:shadow-[#FB6F92]/25 active:scale-95 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์ / บันทึกเป็น PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="flex-1 p-8 sm:p-12 overflow-y-auto font-sans bg-white text-slate-900 space-y-10">
          {/* Exam Cover Header */}
          <div className="border-b-2 border-slate-900 pb-6 text-center space-y-2">
            <div className="text-xs font-bold tracking-widest text-slate-500 uppercase">
              RISE STANDARDIZED TEST SIMULATION · TCAS SIMULATOR
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {exam.title}
            </h1>
            <p className="text-sm font-semibold text-slate-700">
              รหัสวิชา: {exam.code} · ประจำปีการศึกษา {exam.year}
            </p>
            <div className="flex justify-center gap-8 text-xs text-slate-600 pt-2 font-medium">
              <span>เวลาสอบ: {exam.durationMinutes} นาที</span>
              <span>จำนวน: {exam.totalQuestions} ข้อ</span>
              <span>คะแนนเต็ม: {exam.maxScore} คะแนน</span>
            </div>
          </div>

          {/* Test Instructions */}
          <div className="p-4 rounded-xl border border-slate-300 bg-slate-50/50 text-xs text-slate-700 space-y-1.5">
            <span className="font-bold text-slate-900 block">คำชี้แจงในการทำข้อสอบ:</span>
            <p>1. ข้อสอบชุดนี้เป็นแบบปรนัย 4 หรือ 5 ตัวเลือก ให้เลือกคำตอบที่ถูกต้องที่สุดเพียงคำตอบเดียว</p>
            <p>2. สำหรับการฝึกซ้อม ให้ใช้ดินสอดำ 2B ฝนลงในกระดาษคำตอบ OMR ในหน้าถัดไปให้ดำเข้มเต็มวง</p>
            <p>3. ห้ามใช้เครื่องคำนวณหรืออุปกรณ์สื่อสารทุกชนิดในขณะทำข้อสอบ</p>
          </div>

          {/* Realistic OMR Answer Sheet Section (กระดาษคำตอบสำหรับฝึกฝน 2B) */}
          <div className="p-6 rounded-2xl border-2 border-slate-900 bg-white space-y-6 page-break-after">
            <div className="border-b border-slate-300 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                  กระดาษคำตอบ OMR (ANSWER SHEET)
                </h2>
                <span className="text-[11px] text-slate-500">
                  ใช้ดินสอ 2B ฝนในวงกลมให้เต็มวง ห้ามขีดกากบาท
                </span>
              </div>
              <div className="text-xs font-mono border border-slate-300 px-3 py-1 rounded bg-slate-50">
                CODE: {exam.code}
              </div>
            </div>

            {/* Student ID & Info Line */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="border-b border-dashed border-slate-400 pb-1">
                <span className="text-slate-500">ชื่อ-นามสกุล:</span>
              </div>
              <div className="border-b border-dashed border-slate-400 pb-1">
                <span className="text-slate-500">เลขประจำตัวสอบ:</span>
              </div>
              <div className="border-b border-dashed border-slate-400 pb-1">
                <span className="text-slate-500">ห้องสอบ/สถานที่:</span>
              </div>
            </div>

            {/* Bubble Grid */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-3">
                ส่วนที่ 1: คำตอบแบบปรนัย (ข้อ 1 - {exam.questions.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
                {exam.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="flex items-center gap-3 py-1 border-b border-slate-100 text-xs"
                  >
                    <span className="w-6 font-bold tabular-nums text-slate-700">
                      {idx + 1}.
                    </span>
                    <div className="flex items-center gap-2">
                      {['A', 'B', 'C', 'D', 'E'].slice(0, q.options.length).map((label, optIdx) => {
                        const thaiLabels = ['ก', 'ข', 'ค', 'ง', 'จ'];
                        const displayLabel = q.options[optIdx]?.label || label;
                        return (
                          <div
                            key={label}
                            className="w-6 h-6 rounded-full border border-slate-400 flex items-center justify-center font-bold text-[10px] text-slate-600 hover:bg-slate-100"
                          >
                            {displayLabel}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Exam Questions Section */}
          <div className="space-y-8 pt-4">
            <h2 className="text-base font-extrabold text-slate-900 border-b pb-2">
              แบบทดสอบฉบับเต็ม ({exam.questions.length} ข้อ)
            </h2>

            <div className="space-y-8">
              {exam.questions.map((q, idx) => (
                <div key={q.id} className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="font-extrabold text-slate-900 text-sm tabular-nums shrink-0 mt-0.5">
                      ข้อ {idx + 1}.
                    </span>
                    <div className="text-sm text-slate-800 font-medium leading-relaxed">
                      {q.prompt}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pl-8 text-xs">
                    {q.options.map((opt) => (
                      <div key={opt.label} className="flex items-baseline gap-2">
                        <span className="font-bold text-slate-700 shrink-0">
                          ({opt.label})
                        </span>
                        <span className="text-slate-700 leading-normal">{opt.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optional Answer Key & Explanations */}
          {includeAnswerKey && (
            <div className="pt-10 border-t-2 border-slate-900 space-y-6 page-break-after">
              <h2 className="text-lg font-black text-slate-900">
                เฉลยละเอียดและแนวคิด (ANSWER KEY & SOLUTIONS)
              </h2>

              <div className="space-y-6">
                {exam.questions.map((q, idx) => (
                  <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <span>ข้อ {idx + 1}: เฉลย ({q.correctAnswer})</span>
                      <span className="text-slate-400 font-normal">[{q.topic}]</span>
                    </div>
                    <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                      {q.explanation}
                    </p>
                    {q.formulaOrHint && (
                      <p className="text-[#C23259] font-medium pt-1">
                        สูตรสำคัญ: {q.formulaOrHint}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
