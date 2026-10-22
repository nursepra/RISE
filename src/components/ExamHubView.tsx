import React, { useState } from 'react';
import { Search, Play, FileDown, Clock, HelpCircle, CheckCircle, Sparkles, Filter } from 'lucide-react';
import { ExamCategory, ExamItem } from '../types';
import { EXAMS_DATABASE } from '../data/examsData';

interface ExamHubViewProps {
  onStartExam: (exam: ExamItem) => void;
  onOpenPdfExam: (exam: ExamItem) => void;
}

export const ExamHubView: React.FC<ExamHubViewProps> = ({ onStartExam, onOpenPdfExam }) => {
  const [selectedCategory, setSelectedCategory] = useState<ExamCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: ExamCategory; label: string }[] = [
    { id: 'ALL', label: 'ทั้งหมด' },
    { id: 'TGAT', label: 'T-GAT' },
    { id: 'TPAT', label: 'T-PAT' },
    { id: 'ALEVEL', label: 'A-LEVEL' },
    { id: 'IELTS', label: 'IELTS' },
    { id: 'SAT', label: 'SAT' },
    { id: 'NETSAT', label: 'NETSAT' },
  ];

  const filteredExams = EXAMS_DATABASE.filter((exam) => {
    const matchesCategory = selectedCategory === 'ALL' || exam.category === selectedCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.topics.some((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#FB6F92] uppercase tracking-wider">
            EXAM REPOSITORY & SIMULATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            คลังข้อสอบ & Mock Test เสมือนจริง
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            เลือกทำแบบ <span className="font-semibold text-slate-800">จำลองสนามสอบจริง (จับเวลา & ซ่อนเฉลย)</span> หรือ <span className="font-semibold text-slate-800">ดาวน์โหลดฉบับ PDF พร้อมกระดาษคำตอบฝน 2B</span> สำหรับฝึกซ้อมบนกระดาษ
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาข้อสอบ, บทเรียน, รหัส..."
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-[#FFC2D1] text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FB6F92] focus:border-transparent transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Segmented Category Filter Tabs (Zero-pill compliant: functional button controls) */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#FFE5EC]/50 rounded-xl border border-[#FFC2D1]/60 overflow-x-auto scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-all ${
                isActive
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Legal & Copyright Notice Note (Addressing Section 3.1 & 3.2 in user prompt) */}
      <div className="p-4 rounded-2xl bg-white border border-[#FFC2D1]/70 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-[#FB6F92] shrink-0" />
          <span>
            <strong className="text-slate-800">มาตรฐานคุณภาพ & ลิขสิทธิ์:</strong> ข้อสอบและเฉลยละเอียดใน RISE ถูกออกแบบและเรียบเรียงตามโครงสร้าง Blue Print โดยผู้เชี่ยวชาญ พร้อมระบบเปิดรับแจ้งข้อสอบผิดเพื่อความถูกต้อง 100%
          </span>
        </div>
        <span className="text-[11px] text-slate-500 whitespace-nowrap">
          พบ {filteredExams.length} ชุดข้อสอบ
        </span>
      </div>

      {/* Exam Grid */}
      {filteredExams.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#FFC2D1] p-8">
          <p className="text-sm font-semibold text-slate-700">ไม่พบข้อสอบที่ตรงกับการค้นหา</p>
          <p className="text-xs text-slate-500 mt-1">ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่น</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-2xl border border-[#FFC2D1]/60 shadow-sm hover:shadow-md hover:border-[#FB6F92]/40 transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Header & Content */}
              <div className="p-6 space-y-4">
                {/* Meta Header (No pills: clean unboxed text with typographic separators) */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 font-semibold text-[#C23259]">
                    <span>{exam.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{exam.code}</span>
                  </div>
                  <span className="tabular-nums">{exam.year}</span>
                </div>

                {/* Exam Title */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#FB6F92] transition-colors leading-snug">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {exam.description}
                  </p>
                </div>

                {/* Topics Covered */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    สัดส่วนเนื้อหาในชุดนี้:
                  </span>
                  <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-slate-600">
                    {exam.topics.map((t, i) => (
                      <span key={i} className="inline-flex items-center gap-1">
                        <span>{t.name}</span>
                        <span className="text-[11px] text-slate-400 tabular-nums">({t.count} ข้อ)</span>
                        {i < exam.topics.length - 1 && <span className="text-slate-300">/</span>}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quantitative Details */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="tabular-nums">{exam.durationMinutes} นาที</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{exam.totalQuestions} ข้อ</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums font-semibold text-slate-700">
                    เต็ม {exam.maxScore} คะแนน
                  </span>
                </div>
              </div>

              {/* Card Footer with 2 Distinct Interactive Choices */}
              <div className="p-4 bg-[#FFF8F9] border-t border-[#FFC2D1]/40 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onStartExam(exam)}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#FF8FAB] to-[#FB6F92] text-white text-xs font-bold hover:shadow-md hover:shadow-[#FB6F92]/25 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>ทำ Mock Test</span>
                </button>

                <button
                  onClick={() => onOpenPdfExam(exam)}
                  className="py-2.5 px-3 rounded-xl bg-white border border-[#FFC2D1] text-slate-700 text-xs font-semibold hover:bg-[#FFE5EC]/40 transition-colors flex items-center justify-center gap-1.5"
                >
                  <FileDown className="w-3.5 h-3.5 text-slate-500" />
                  <span>พิมพ์ PDF & OMR</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
