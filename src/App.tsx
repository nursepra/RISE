/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { ExamHubView } from './components/ExamHubView';
import { MockTestModal } from './components/MockTestModal';
import { PrintableExamModal } from './components/PrintableExamModal';
import { AiAnalysisView } from './components/AiAnalysisView';
import { MistakeBookView } from './components/MistakeBookView';
import { RewardsShopView } from './components/RewardsShopView';
import { StudyPlanView } from './components/StudyPlanView';
import { StudySquadView } from './components/StudySquadView';
import { ReportErrorModal } from './components/ReportErrorModal';

import {
  ExamItem,
  MistakeEntry,
  MockTestResult,
  Question,
  RedeemedItem,
  Reward,
  StudyTask,
  UserProfile,
} from './types';
import {
  loadMistakes,
  loadRedeemed,
  loadResults,
  loadStudyTasks,
  loadUserProfile,
  saveMistakes,
  saveRedeemed,
  saveResults,
  saveStudyTasks,
  saveUserProfile,
} from './utils/storage';
import { INITIAL_STUDY_TASKS } from './data/rewardsAndPlannerData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile>(loadUserProfile);
  const [mistakes, setMistakes] = useState<MistakeEntry[]>(loadMistakes);
  const [results, setResults] = useState<MockTestResult[]>(loadResults);
  const [redeemedItems, setRedeemedItems] = useState<RedeemedItem[]>(loadRedeemed);
  const [studyTasks, setStudyTasks] = useState<StudyTask[]>(loadStudyTasks);

  // Active modals
  const [activeMockExam, setActiveMockExam] = useState<ExamItem | null>(null);
  const [activePdfExam, setActivePdfExam] = useState<ExamItem | null>(null);
  const [reportingQuestion, setReportingQuestion] = useState<{
    question: Question;
    examTitle: string;
  } | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state to local storage
  useEffect(() => {
    saveUserProfile(userProfile);
  }, [userProfile]);

  useEffect(() => {
    saveMistakes(mistakes);
  }, [mistakes]);

  useEffect(() => {
    saveResults(results);
  }, [results]);

  useEffect(() => {
    saveRedeemed(redeemedItems);
  }, [redeemedItems]);

  useEffect(() => {
    saveStudyTasks(studyTasks);
  }, [studyTasks]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleEarnPoints = (amount: number, reason: string) => {
    setUserProfile((prev) => ({
      ...prev,
      points: prev.points + amount,
    }));
    showToast(`🎉 ได้รับ +${amount} แต้ม! (${reason})`);
  };

  const handleFinishMockTest = (result: MockTestResult, newMistakes: MistakeEntry[]) => {
    // Save result
    setResults((prev) => [...prev, result]);

    // Award points
    setUserProfile((prev) => ({
      ...prev,
      points: prev.points + result.pointsEarned,
    }));

    // Append new mistakes
    if (newMistakes.length > 0) {
      setMistakes((prev) => {
        const existingIds = new Set(prev.map((m) => m.question.id));
        const filteredNew = newMistakes.filter((m) => !existingIds.has(m.question.id));
        return [...prev, ...filteredNew];
      });
    }

    showToast(`🏆 สอบเสร็จสิ้น! ได้รับ +${result.pointsEarned} แต้ม บันทึกข้อที่ผิดลงในคลังเรียบร้อย`);
  };

  const handleUpdateMistake = (id: string, reason: MistakeEntry['reason'], notes: string) => {
    setMistakes((prev) =>
      prev.map((m) => (m.id === id ? { ...m, reason, notes } : m))
    );
    showToast('บันทึกโน้ตช่วยจำเรียบร้อยแล้ว');
  };

  const handleRemoveMistake = (id: string) => {
    setMistakes((prev) => prev.filter((m) => m.id !== id));
    showToast('ลบข้อสอบออกจากคลังข้อผิดพลาดแล้ว');
  };

  const handleMarkMistakeMastered = (id: string, mastered: boolean) => {
    setMistakes((prev) =>
      prev.map((m) => (m.id === id ? { ...m, mastered } : m))
    );
    if (mastered) {
      showToast('🌟 ยินดีด้วย! พิชิตข้อสอบข้อนี้แล้ว');
    }
  };

  const handleRedeemReward = (reward: Reward, shippingAddress?: string) => {
    if (userProfile.points < reward.pointsCost) {
      showToast('⚠️ แต้มของคุณยังไม่เพียงพอสำหรับการแลกรางวัลนี้');
      return;
    }

    setUserProfile((prev) => ({
      ...prev,
      points: prev.points - reward.pointsCost,
    }));

    const newRedeemed: RedeemedItem = {
      id: `redeemed-${Date.now()}`,
      rewardId: reward.id,
      title: reward.title,
      pointsCost: reward.pointsCost,
      category: reward.category,
      redeemedAt: new Date().toISOString(),
      status: reward.category === 'physical' ? 'processing' : 'ready',
      shippingAddress,
      code:
        reward.category === 'digital'
          ? `RISE-${reward.title.slice(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`
          : undefined,
    };

    setRedeemedItems((prev) => [newRedeemed, ...prev]);
    showToast(`🎁 แลกรับ "${reward.title}" สำเร็จ!`);
  };

  const handleToggleTask = (taskId: string) => {
    setStudyTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            handleEarnPoints(10, 'ทำภารกิจอ่านหนังสือสำเร็จ');
          }
          return { ...t, completed: nextCompleted };
        }
        return t;
      })
    );
  };

  const handleAddTask = (newTask: StudyTask) => {
    setStudyTasks((prev) => [...prev, newTask]);
    showToast('เพิ่มภารกิจใหม่ในตารางอ่านหนังสือเรียบร้อย');
  };

  const handleResetPlan = () => {
    setStudyTasks(INITIAL_STUDY_TASKS);
    showToast('รีเซ็ตและปรับแผนอ่านหนังสือตามเป้าหมาย AI เรียบร้อย');
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({
      ...prev,
      ...updated,
    }));
    showToast('อัปเดตเป้าหมายการสอบเข้ามหาวิทยาลัยเรียบร้อย');
  };

  const handleSubmitErrorReport = (errorType: string, detail: string) => {
    handleEarnPoints(10, 'ขอบคุณสำหรับการรายงานข้อผิดพลาด');
  };

  return (
    <div className="min-h-screen bg-[#FFF9FA] text-slate-800 flex flex-col antialiased selection:bg-[#FFC2D1] selection:text-[#9F1239]">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-4 duration-300">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Primary Top Bar Contract */}
      <Navbar
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
        userProfile={userProfile}
        mistakesCount={mistakes.filter((m) => !m.mastered).length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {currentTab === 'dashboard' && (
          <DashboardView
            userProfile={userProfile}
            mistakes={mistakes}
            studyTasks={studyTasks}
            results={results}
            onNavigateTab={setCurrentTab}
            onStartExam={(exam) => setActiveMockExam(exam)}
            onOpenPdfExam={(exam) => setActivePdfExam(exam)}
            onToggleTask={handleToggleTask}
          />
        )}

        {currentTab === 'exams' && (
          <ExamHubView
            onStartExam={(exam) => setActiveMockExam(exam)}
            onOpenPdfExam={(exam) => setActivePdfExam(exam)}
          />
        )}

        {currentTab === 'ai-analysis' && (
          <AiAnalysisView
            userProfile={userProfile}
            results={results}
            onStartExam={(exam) => setActiveMockExam(exam)}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'mistakes' && (
          <MistakeBookView
            mistakes={mistakes}
            onUpdateMistake={handleUpdateMistake}
            onRemoveMistake={handleRemoveMistake}
            onMarkMastered={handleMarkMistakeMastered}
            onEarnPoints={handleEarnPoints}
          />
        )}

        {currentTab === 'planner' && (
          <StudyPlanView
            userProfile={userProfile}
            studyTasks={studyTasks}
            onUpdateProfile={handleUpdateProfile}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onResetPlan={handleResetPlan}
          />
        )}

        {currentTab === 'rewards' && (
          <RewardsShopView
            userProfile={userProfile}
            redeemedItems={redeemedItems}
            onRedeemReward={handleRedeemReward}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'squad' && <StudySquadView />}
      </main>

      {/* Modals */}
      {activeMockExam && (
        <MockTestModal
          exam={activeMockExam}
          userProfile={userProfile}
          onClose={() => setActiveMockExam(null)}
          onFinishTest={handleFinishMockTest}
          onRequestReportError={(question, examTitle) =>
            setReportingQuestion({ question, examTitle })
          }
        />
      )}

      {activePdfExam && (
        <PrintableExamModal
          exam={activePdfExam}
          onClose={() => setActivePdfExam(null)}
        />
      )}

      {reportingQuestion && (
        <ReportErrorModal
          question={reportingQuestion.question}
          examTitle={reportingQuestion.examTitle}
          onClose={() => setReportingQuestion(null)}
          onSubmitReport={handleSubmitErrorReport}
        />
      )}

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-[#FFC2D1]/60 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900">RISE</span>
            <span aria-hidden="true">·</span>
            <span>แพลตฟอร์มคลังข้อสอบและเตรียมสอบอัจฉริยะ</span>
          </div>

          <div className="flex items-center gap-6">
            <span>T-GAT</span>
            <span>T-PAT</span>
            <span>A-LEVEL</span>
            <span>IELTS</span>
            <span>SAT</span>
            <span>NETSAT</span>
          </div>

          <p className="text-slate-400">
            ระบบจำลองเพื่อพัฒนาการเรียนรู้ ไม่ใช่การรับประกันผลการคัดเลือก
          </p>
        </div>
      </footer>
    </div>
  );
}
