import React from 'react';
import { Sparkles, Flame, Gift, BookOpen } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
  userProfile: UserProfile;
  mistakesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onChangeTab,
  userProfile,
  mistakesCount,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'หน้าแรก' },
    { id: 'exams', label: 'คลังข้อสอบ' },
    { id: 'ai-analysis', label: 'วิเคราะห์ AI' },
    {
      id: 'mistakes',
      label: 'คลังข้อผิดพลาด',
      badge: mistakesCount > 0 ? mistakesCount : undefined,
    },
    { id: 'planner', label: 'วางแผนอ่านหนังสือ' },
    { id: 'rewards', label: 'สะสมแต้ม & รางวัล' },
    { id: 'squad', label: 'เพื่อนร่วมติว' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#FFC2D1]/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => onChangeTab('dashboard')}
            className="flex items-center gap-2 text-left whitespace-nowrap shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB6F92] rounded-md"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FB6F92] to-[#FF8FAB] flex items-center justify-center text-white font-black text-xl shadow-sm shadow-[#FB6F92]/30 group-hover:scale-105 transition-transform">
              R
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-[#FB6F92] transition-colors leading-none">
                RISE
              </span>
              <span className="text-[10px] font-medium text-slate-500 tracking-wider">
                EXAM & MOCK HUB
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Single-Line) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onChangeTab(item.id)}
                  className={`relative px-3 py-1.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors rounded-lg flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#9F1C42] bg-[#FFE5EC] font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-[#FFF5F7]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[11px] font-bold text-white bg-[#FB6F92] rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#FB6F92] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Points Wallet & Streak Counter */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Streak Counter */}
            <div
              title={`ต่อเนื่อง ${userProfile.streakDays} วันแล้ว!`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFE5EC]/70 text-slate-800 text-xs font-semibold whitespace-nowrap border border-[#FFC2D1]/50"
            >
              <Flame className="w-4 h-4 text-[#FB6F92] fill-[#FB6F92]" />
              <span className="tabular-nums">{userProfile.streakDays} วัน</span>
            </div>

            {/* Points Button */}
            <button
              onClick={() => onChangeTab('rewards')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#FF8FAB] to-[#FB6F92] text-white text-xs font-bold hover:shadow-md hover:shadow-[#FB6F92]/25 active:scale-95 transition-all whitespace-nowrap"
            >
              <Gift className="w-4 h-4" />
              <span className="tabular-nums">{userProfile.points.toLocaleString()} แต้ม</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-[#FFC2D1]/30 scrollbar-none">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeTab(item.id)}
                className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap rounded-md shrink-0 transition-colors ${
                  isActive
                    ? 'bg-[#FFE5EC] text-[#9F1C42] font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                {item.badge !== undefined && ` (${item.badge})`}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
