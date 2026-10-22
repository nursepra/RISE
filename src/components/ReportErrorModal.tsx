import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, X, Send } from 'lucide-react';
import { Question } from '../types';

interface ReportErrorModalProps {
  question: Question;
  examTitle: string;
  onClose: () => void;
  onSubmitReport: (errorType: string, detail: string) => void;
}

export const ReportErrorModal: React.FC<ReportErrorModalProps> = ({
  question,
  examTitle,
  onClose,
  onSubmitReport,
}) => {
  const [errorType, setErrorType] = useState('wrong_answer');
  const [detail, setDetail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport(errorType, detail);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#FFC2D1] space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#FB6F92]" />
            <h3 className="text-base font-bold text-slate-900">แจ้งข้อผิดพลาดของข้อสอบ</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <p className="text-sm font-bold text-slate-900">ขอบคุณสำหรับการรายงาน!</p>
            <p className="text-xs text-slate-500">
              ทีมวิชาการจะตรวจสอบข้อสอบนี้โดยเร็วที่สุด และคุณได้รับ +10 แต้มขอบคุณ
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-[#FFF8F9] border border-[#FFC2D1]/50 text-slate-700">
              <span className="font-semibold text-slate-900 block truncate">
                {examTitle} (ข้อที่ {question.questionNumber})
              </span>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{question.prompt}</p>
            </div>

            <div>
              <label className="text-slate-700 block mb-1 font-medium">ประเภทข้อผิดพลาด</label>
              <select
                value={errorType}
                onChange={(e) => setErrorType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white"
              >
                <option value="wrong_answer">เฉลยคำตอบผิด / ตัวเลือกไม่ตรง</option>
                <option value="unclear_prompt">โจทย์กำกวม / พิมพ์ตกหล่น</option>
                <option value="wrong_explanation">วิธีคิดในเฉลยมีข้อผิดพลาด</option>
                <option value="formatting">สูตรหรือสัญลักษณ์ทางคณิตศาสตร์แสดงผลผิด</option>
                <option value="other">สาเหตุอื่นๆ</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 block mb-1 font-medium">รายละเอียดเพิ่มเติม</label>
              <textarea
                required
                rows={3}
                placeholder="ระบุจุดที่คิดว่าผิด หรือเสนอคำตอบที่ถูกต้อง..."
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF8FAB] to-[#FB6F92] text-white font-bold hover:shadow-md hover:shadow-[#FB6F92]/25 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>ส่งรายงาน</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
