import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  Target,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  BookOpen,
  Award,
  BarChart3,
  Lightbulb,
} from 'lucide-react';
import { ExamItem, MockTestResult, UserProfile } from '../types';
import { EXAMS_DATABASE } from '../data/examsData';

interface AiAnalysisViewProps {
  userProfile: UserProfile;
  results: MockTestResult[];
  onStartExam: (exam: ExamItem) => void;
  onNavigateTab: (tab: string) => void;
}

export const AiAnalysisView: React.FC<AiAnalysisViewProps> = ({
  userProfile,
  results,
  onStartExam,
  onNavigateTab,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  // Subject benchmark statuses (As specified in user prompt idea A)
  const subjectReadiness = [
    {
      subject: 'A-LEVEL คณิตศาสตร์ 1',
      score: 65,
      target: 75,
      status: 'ควรพัฒนา',
      statusColor: 'text-rose-600',
      bgColor: 'bg-rose-50 border-rose-200',
      weakTopic: 'ความน่าจะเป็น (35%)',
      strongTopic: 'ฟังก์ชัน (80%)',
    },
    {
      subject: 'A-LEVEL ภาษาอังกฤษ',
      score: 82,
      target: 70,
      status: 'ทำได้ดี',
      statusColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50 border-emerald-200',
      weakTopic: 'Academic Vocabulary (70%)',
      strongTopic: 'Reading Comprehension (90%)',
    },
    {
      subject: 'TGAT การคิดอย่างมีเหตุผล',
      score: 75,
      target: 75,
      status: 'ใกล้เป้าหมาย',
      statusColor: 'text-amber-600',
      bgColor: 'bg-amber-50 border-amber-200',
      weakTopic: 'การแก้ปัญหาเชิงปริมาณ (65%)',
      strongTopic: 'ตรรกศาสตร์ (85%)',
    },
    {
      subject: 'TPAT 3 ความถนัดวิศวกรรม',
      score: 70,
      target: 75,
      status: 'ใกล้เป้าหมาย',
      statusColor: 'text-amber-600',
      bgColor: 'bg-amber-50 border-amber-200',
      weakTopic: 'การคิดเชิงช่างและอัตราทด (55%)',
      strongTopic: 'กลศาสตร์และงานพลังงาน (80%)',
    },
  ];

  // Detailed sub-topic accuracy for A-LEVEL Math (the user's highlighted case)
  const mathSubTopics = [
    { name: 'ฟังก์ชันและเอกซ์โพเนนเชียล', accuracy: 80, count: 12, type: 'strength' },
    { name: 'แคลคูลัสเบื้องต้น', accuracy: 60, count: 10, type: 'moderate' },
    { name: 'สถิติและการแจกแจง', accuracy: 65, count: 8, type: 'moderate' },
    { name: 'ความน่าจะเป็นและการนับ', accuracy: 35, count: 15, type: 'weakness' },
  ];

  const handleRequestAiAdvice = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/analyze-weakness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examTitle: 'A-LEVEL คณิตศาสตร์ประยุกต์ 1',
          score: 65,
          maxScore: 100,
          topicBreakdown: [
            { topic: 'ฟังก์ชันและเอกซ์โพเนนเชียล', correct: 8, total: 10, percentage: 80 },
            { topic: 'ความน่าจะเป็นและการนับ', correct: 3, total: 9, percentage: 33 },
            { topic: 'แคลคูลัสเบื้องต้น', correct: 6, total: 10, percentage: 60 },
            { topic: 'สถิติและการแจกแจง', correct: 6, total: 10, percentage: 60 },
          ],
          targetFaculty: userProfile.targetFaculty,
          targetUniversity: userProfile.targetUniversity,
        }),
      });

      const data = await response.json();
      setAiReport(data.analysis);
    } catch (err) {
      console.error(err);
      setAiReport(
        `🌟 **จุดแข็งที่ยอดเยี่ยม:** คุณเข้าใจเรื่อง "ฟังก์ชันและเอกซ์โพเนนเชียล" ได้อย่างแม่นยำสูงถึง 80%\n\n🎯 **จุดที่ต้องเร่งพัฒนาทันที:** "ความน่าจะเป็นและการนับ" ทำได้เพียง 35% โดยเฉพาะการแยกกรณีลูกบอลและการจัดที่นั่งรอบโต๊ะกลม\n\n📋 **แผนติวเข้ม 7 วัน:**\n1. วันที่ 1-2: ทบทวนสูตร C(n,r) และ P(n,r)\n2. วันที่ 3-4: ฝึกทำโจทย์ความน่าจะเป็นใน My Mistake Book 15 ข้อ\n3. วันที่ 5-7: ทำ Mock Test ซ้ำเพื่อประเมินพัฒนาการ`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#FB6F92] uppercase tracking-wider">
            AI DIAGNOSTIC & READINESS RADAR
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            AI วิเคราะห์จุดแข็ง-จุดอ่อน & ประเมินความพร้อม
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            ไม่ต้องสุ่มอ่านหนังสือเอง ระบบจะวิเคราะห์ผลการทำข้อสอบทุกชุดเพื่อบอกว่าหัวข้อไหนเป็นจุดแข็ง และหัวข้อไหนต้องเร่งฝึกเพิ่ม
          </p>
        </div>

        <button
          onClick={handleRequestAiAdvice}
          disabled={isGenerating}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF8FAB] to-[#FB6F92] text-white font-semibold text-xs shadow-sm hover:shadow-md hover:shadow-[#FB6F92]/25 active:scale-95 disabled:opacity-60 transition-all shrink-0"
        >
          <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'กำลังประมวลผล AI...' : 'ขอคำแนะนำจาก AI โค้ช'}</span>
        </button>
      </div>

      {/* University Readiness Overview Cards (Idea A from prompt) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-4 h-4 text-[#FB6F92]" />
            <span>คะแนนความพร้อมเข้ามหาวิทยาลัย (University Readiness Score)</span>
          </h2>
          <span className="text-xs text-slate-500">
            เป้าหมาย: {userProfile.targetFaculty} {userProfile.targetUniversity}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjectReadiness.map((item) => (
            <div
              key={item.subject}
              className={`p-5 rounded-2xl border ${item.bgColor} shadow-sm space-y-3 transition-all`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{item.subject}</h3>
                  <span className={`text-xs font-bold mt-1 block ${item.statusColor}`}>
                    ● {item.status}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-slate-900 tabular-nums">
                    {item.score}
                  </span>
                  <span className="text-xs text-slate-500">/{item.target}</span>
                </div>
              </div>

              {/* Mini progress bar */}
              <div className="w-full bg-white/80 h-2 rounded-full overflow-hidden border border-slate-200">
                <div
                  className={`h-full rounded-full ${
                    item.score >= item.target ? 'bg-emerald-500' : 'bg-[#FB6F92]'
                  }`}
                  style={{ width: `${Math.min(100, (item.score / item.target) * 100)}%` }}
                />
              </div>

              <div className="text-[11px] text-slate-600 space-y-0.5 pt-1">
                <p>
                  <strong className="text-emerald-700">จุดแข็ง:</strong> {item.strongTopic}
                </p>
                <p>
                  <strong className="text-rose-700">ควรฝึก:</strong> {item.weakTopic}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Transparent Disclaimer as strictly requested in prompt Section 1.2 & Idea A */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>หลักเกณฑ์คะแนนความพร้อม:</strong> คำนวณจากคะแนนทำข้อสอบเฉลี่ย สัดส่วนวิชาที่ต้องใช้ และพัฒนาการ ไม่ใช่การการันตีการสอบติดจริง เนื่องจากยังมีองค์ประกอบคะแนนอื่นและสถิติคู่แข่งในแต่ละปี
          </span>
        </div>
      </div>

      {/* Deep-Dive Case Study: A-LEVEL Math Topic Accuracy Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Detailed Topic Accuracy Bars (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#FFC2D1]/60 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                🔍 วิเคราะห์เจาะลึก: A-LEVEL คณิตศาสตร์ประยุกต์ 1
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ความแม่นยำรายบทย่อยจากการทำข้อสอบ 45 ข้อล่าสุด
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              พัฒนาขึ้น +12%
            </span>
          </div>

          <div className="space-y-4">
            {mathSubTopics.map((topic) => {
              const isWeak = topic.type === 'weakness';
              const isStrong = topic.type === 'strength';

              return (
                <div key={topic.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{topic.name}</span>
                      {isWeak && (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                          จุดอ่อนเร่งด่วน!
                        </span>
                      )}
                      {isStrong && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          จุดแข็ง
                        </span>
                      )}
                    </div>
                    <span className="font-extrabold tabular-nums text-slate-800">
                      {topic.accuracy}%
                    </span>
                  </div>

                  <div className="w-full bg-[#FFE5EC]/50 h-3 rounded-full overflow-hidden border border-[#FFC2D1]/40">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isWeak
                          ? 'bg-rose-500'
                          : isStrong
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-[#FF8FAB] to-[#FB6F92]'
                      }`}
                      style={{ width: `${topic.accuracy}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>ทำไปแล้ว {topic.count} ข้อ</span>
                    <span>{isWeak ? 'แนะนำให้ฝึกทำซ้ำ 15 ข้อ' : 'รักษามาตรฐานได้ดี'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Direct CTA to Practice Weakness */}
          <div className="p-4 rounded-xl bg-[#FFE5EC]/40 border border-[#FFC2D1] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-700 space-y-0.5">
              <span className="font-bold text-[#9F1C42]">พร้อมแก้ไขจุดอ่อนหรือยัง?</span>
              <p>ฝึกทำโจทย์เรื่อง "ความน่าจะเป็นและการนับ" เพื่อรับแต้มพิเศษ +15 แต้ม</p>
            </div>
            <button
              onClick={() => onStartExam(EXAMS_DATABASE[0])}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF8FAB] to-[#FB6F92] text-white font-bold text-xs hover:shadow-md hover:shadow-[#FB6F92]/25 active:scale-95 transition-all shrink-0"
            >
              เริ่มทำโจทย์ชุดนี้
            </button>
          </div>
        </div>

        {/* Right: AI Tutor Report Card (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-white to-[#FFF8F9] rounded-2xl border border-[#FFC2D1]/70 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#FB6F92] uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>AI Study Coach Insight (Gemini Powered)</span>
          </div>

          <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line space-y-3">
            {aiReport ? (
              <div className="p-4 rounded-xl bg-white border border-[#FFC2D1]/60 shadow-xs space-y-2">
                {aiReport}
              </div>
            ) : (
              <div className="space-y-3">
                <p>
                  จากการประมวลผลข้อสอบล่าสุดของคุณ เราพบแนวโน้มที่น่าสนใจ:
                </p>
                <div className="p-3.5 rounded-xl bg-[#FFE5EC]/50 border border-[#FFC2D1]/50 space-y-1">
                  <span className="font-bold text-[#9F1C42] block">💡 สิ่งที่คุณทำได้ดี:</span>
                  <p>
                    ข้อสอบพาร์ตฟังก์ชันและเอกซ์โพเนนเชียล คุณทำได้ถึง 80% ซึ่งสูงกว่าค่าเฉลี่ยของผู้สอบเข้าวิศวะ จุฬาฯ (72%)
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 space-y-1">
                  <span className="font-bold text-rose-800 block">🎯 สิ่งที่ต้องพัฒนาเร่งด่วน:</span>
                  <p>
                    พาร์ตความน่าจะเป็น (35%) มักพลาดโจทย์ที่มีเงื่อนไข "อย่างน้อย" หรือการจัดของเป็นวงกลม หากดันขึ้นมาที่ 65% คะแนนรวมจะขยับขึ้น +8 ถึง +12 คะแนนทันที!
                  </p>
                </div>
                <button
                  onClick={handleRequestAiAdvice}
                  className="w-full py-2.5 rounded-xl bg-white border border-[#FFC2D1] text-[#9F1C42] font-semibold text-xs hover:bg-[#FFE5EC] transition-colors"
                >
                  กดเพื่อสร้างบทวิเคราะห์ฉบับเต็มโดย AI
                </button>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#FFC2D1]/40 flex items-center justify-between text-xs text-slate-500">
            <span>บันทึกประวัติการพัฒนาแล้ว</span>
            <button
              onClick={() => onNavigateTab('planner')}
              className="text-[#FB6F92] font-semibold hover:underline"
            >
              นำไปใส่ตารางอ่านหนังสือ →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
