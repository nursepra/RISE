import React, { useState, useEffect } from 'react';
import {
  Users,
  Flame,
  Trophy,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Heart,
  TrendingUp,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { INITIAL_SQUAD_MEMBERS } from '../data/rewardsAndPlannerData';
import { SquadMember } from '../types';

export const StudySquadView: React.FC = () => {
  const [members, setMembers] = useState<SquadMember[]>(INITIAL_SQUAD_MEMBERS);
  const [cheerCounts, setCheerCounts] = useState<Record<string, number>>({});

  // Pomodoro Focus Timer State
  const [focusTimeLeft, setFocusTimeLeft] = useState(25 * 60);
  const [isFocusRunning, setIsFocusRunning] = useState(false);
  const [focusMode, setFocusMode] = useState<'study' | 'break'>('study');
  const [ambientSound, setAmbientSound] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isFocusRunning && focusTimeLeft > 0) {
      timer = setInterval(() => {
        setFocusTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (focusTimeLeft === 0) {
      setIsFocusRunning(false);
      if (focusMode === 'study') {
        setFocusMode('break');
        setFocusTimeLeft(5 * 60);
      } else {
        setFocusMode('study');
        setFocusTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(timer);
  }, [isFocusRunning, focusTimeLeft, focusMode]);

  const handleSendCheer = (memberId: string) => {
    setCheerCounts((prev) => ({
      ...prev,
      [memberId]: (prev[memberId] || 0) + 1,
    }));
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#FB6F92] uppercase tracking-wider">
            STUDY SQUAD & COMMUNITY MOTIVATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            เพื่อนร่วมติว & ชุมชนเตรียมสอบ
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            เพราะการเตรียมสอบคนเดียวอาจเหงา ร่วมทำภารกิจอ่านหนังสือกับเพื่อน จัดอันดับจาก <span className="font-semibold text-slate-800">"พัฒนาการและความสม่ำเสมอ"</span> ไม่ใช่แค่คะแนนสูงสุด
          </p>
        </div>
      </div>

      {/* Community Quest Progress Bar (Section 1.6) */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#FFE5EC] via-[#FFF0F4] to-white border border-[#FFC2D1] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#FB6F92]" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              ภารกิจประจำสัปดาห์ร่วมกัน: พิชิตข้อสอบ 500 ข้อ (382 / 500 ข้อ)
            </h2>
          </div>
          <span className="text-xs font-bold text-[#C23259] tabular-nums">76.4%</span>
        </div>

        <div className="w-full bg-white h-3.5 rounded-full overflow-hidden border border-[#FFC2D1] p-0.5">
          <div
            className="bg-gradient-to-r from-[#FF8FAB] to-[#FB6F92] h-full rounded-full transition-all duration-700"
            style={{ width: '76.4%' }}
          />
        </div>
        <p className="text-xs text-slate-500">
          🎉 เมื่อเพื่อนร่วมกลุ่มทำครบ 500 ข้อ ทุกคนใน Squad จะได้รับโบนัสแต้มพิเศษคนละ +50 แต้ม!
        </p>
      </div>

      {/* Split layout: Pomodoro Focus Room & Growth Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Pomodoro Study Room (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#FFC2D1]/70 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#FB6F92] uppercase tracking-wider">
              STUDY FOCUS TIMER
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              {focusMode === 'study' ? '📖 ห้องโฟกัสอ่านหนังสือ' : '☕ เวลาพักผ่อนสมอง'}
            </h3>
            <p className="text-xs text-slate-500">
              เทคนิค Pomodoro (โฟกัส 25 นาที / พัก 5 นาที)
            </p>
          </div>

          {/* Big Circular Countdown Display */}
          <div className="relative w-48 h-48 mx-auto rounded-full bg-[#FFF5F7] border-4 border-[#FFC2D1] flex flex-col items-center justify-center shadow-inner">
            <span className="text-4xl font-black text-slate-900 font-mono tracking-tight tabular-nums">
              {formatTimer(focusTimeLeft)}
            </span>
            <span className="text-xs font-medium text-slate-500 mt-1">
              {focusMode === 'study' ? 'ช่วงมีสมาธิ' : 'พักสายตา'}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIsFocusRunning(!isFocusRunning)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF8FAB] to-[#FB6F92] text-white font-bold text-xs flex items-center gap-2 hover:shadow-md hover:shadow-[#FB6F92]/25 active:scale-95 transition-all"
            >
              {isFocusRunning ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>พักชั่วคราว</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>เริ่มโฟกัส</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setIsFocusRunning(false);
                setFocusTimeLeft(focusMode === 'study' ? 25 * 60 : 5 * 60);
              }}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              title="รีเซ็ตเวลา"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setAmbientSound(!ambientSound)}
              className={`p-2.5 rounded-xl border transition-colors ${
                ambientSound
                  ? 'bg-[#FFE5EC] border-[#FB6F92] text-[#9F1C42]'
                  : 'border-slate-200 text-slate-400 hover:bg-slate-50'
              }`}
              title="เสียง Lo-Fi / บรรยากาศห้องสมุด"
            >
              {ambientSound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            {ambientSound ? '🎵 เปิดโหมดเสียงบรรยากาศฝนตกแผ่วเบาเพื่อสมาธิ' : 'คลิกเปิดเสียงบรรยากาศเพื่อช่วยให้มีสมาธิยาวนานขึ้น'}
          </p>
        </div>

        {/* Right: Growth & Consistency Leaderboard (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#FFC2D1]/70 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                🏆 อันดับพัฒนาการประจำสัปดาห์ (Growth Leaderboard)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                จัดอันดับตาม % พัฒนาการและความสม่ำเสมอ เพื่อความยุติธรรมสำหรับทุกคน
              </p>
            </div>
            <span className="text-xs font-semibold text-[#FB6F92]">สัปดาห์ที่ 42</span>
          </div>

          <div className="space-y-3">
            {members.map((member, index) => (
              <div
                key={member.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  member.isCurrentUser
                    ? 'bg-[#FFE5EC]/40 border-[#FB6F92] ring-1 ring-[#FB6F92]'
                    : 'bg-[#FFF8F9]/50 border-slate-100 hover:border-[#FFC2D1]'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Rank Badge */}
                  <div className="w-7 text-center font-extrabold text-sm text-slate-500 tabular-nums">
                    #{index + 1}
                  </div>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-[#FFC2D1] shrink-0">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* User info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm truncate">
                        {member.name}
                      </span>
                      {member.isCurrentUser && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-[#FB6F92] text-white rounded">
                          คุณ
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>{member.targetFaculty} ({member.targetUni})</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-0.5 text-orange-600 font-semibold tabular-nums">
                        <Flame className="w-3.5 h-3.5 fill-orange-500" />
                        {member.streak} วัน
                      </span>
                    </div>
                  </div>
                </div>

                {/* Growth Metric & Cheer Button */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-emerald-600 block tabular-nums">
                      +{member.growthRate}%
                    </span>
                    <span className="text-[11px] text-slate-400 tabular-nums">
                      {member.weeklyQuestions} ข้อ
                    </span>
                  </div>

                  <button
                    onClick={() => handleSendCheer(member.id)}
                    className="p-2 rounded-xl bg-white border border-[#FFC2D1] text-[#FB6F92] hover:bg-[#FFE5EC] active:scale-95 transition-all flex items-center gap-1 text-xs"
                    title="ส่งกำลังใจให้เพื่อน"
                  >
                    <Heart className="w-3.5 h-3.5 fill-[#FB6F92]" />
                    <span className="tabular-nums font-bold">
                      {cheerCounts[member.id] || 0}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
