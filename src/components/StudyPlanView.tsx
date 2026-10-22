import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Sparkles,
  Target,
  Edit2,
  Save,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { StudyTask, UserProfile } from '../types';

interface StudyPlanViewProps {
  userProfile: UserProfile;
  studyTasks: StudyTask[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onToggleTask: (taskId: string) => void;
  onAddTask: (newTask: StudyTask) => void;
  onResetPlan: () => void;
}

export const StudyPlanView: React.FC<StudyPlanViewProps> = ({
  userProfile,
  studyTasks,
  onUpdateProfile,
  onToggleTask,
  onAddTask,
  onResetPlan,
}) => {
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempFaculty, setTempFaculty] = useState(userProfile.targetFaculty);
  const [tempUni, setTempUni] = useState(userProfile.targetUniversity);
  const [tempExamDate, setTempExamDate] = useState(userProfile.examDate);
  const [tempDailyHours, setTempDailyHours] = useState(userProfile.dailyStudyHours);
  const [tempTargetScore, setTempTargetScore] = useState(userProfile.targetScore);

  // New task form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskDay, setNewTaskDay] = useState('วันจันทร์');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('A-LEVEL คณิตศาสตร์ 1');
  const [newTaskDuration, setNewTaskDuration] = useState('1.5 ชม.');

  const completedCount = studyTasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / (studyTasks.length || 1)) * 100);

  const handleSaveGoal = () => {
    onUpdateProfile({
      targetFaculty: tempFaculty,
      targetUniversity: tempUni,
      examDate: tempExamDate,
      dailyStudyHours: tempDailyHours,
      targetScore: tempTargetScore,
    });
    setIsEditingGoal(false);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    onAddTask({
      id: `custom-task-${Date.now()}`,
      day: newTaskDay,
      title: newTaskTitle,
      subject: newTaskSubject,
      duration: newTaskDuration,
      completed: false,
      examCategory: 'ALEVEL',
    });

    setNewTaskTitle('');
    setShowAddModal(false);
  };

  // Group tasks by day
  const days = ['วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์', 'วันอาทิตย์'];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#FB6F92] uppercase tracking-wider">
            ADAPTIVE PERSONALIZED STUDY PLAN
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            แผนเตรียมสอบส่วนบุคคล (Personalized Study Plan)
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            จัดตารางอ่านหนังสือรายสัปดาห์อัตโนมัติตามคณะเป้าหมายและจุดอ่อนที่ต้องพัฒนา พร้อมปรับตามความก้าวหน้าจริง
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#FFC2D1] text-xs font-semibold text-slate-700 hover:bg-[#FFE5EC]/40 transition-colors"
          >
            <Plus className="w-4 h-4 text-[#FB6F92]" />
            <span>เพิ่มภารกิจ</span>
          </button>
          <button
            onClick={onResetPlan}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF8FAB] to-[#FB6F92] text-white text-xs font-bold hover:shadow-md hover:shadow-[#FB6F92]/25 active:scale-95 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ปรับแผนตาม AI ใหม่</span>
          </button>
        </div>
      </div>

      {/* Target Goal Setup Banner */}
      <div className="p-6 rounded-3xl bg-white border border-[#FFC2D1]/70 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#FB6F92]" />
            <h2 className="text-base font-bold text-slate-900">เป้าหมายการสอบเข้ามหาวิทยาลัยของคุณ</h2>
          </div>
          <button
            onClick={() => setIsEditingGoal(!isEditingGoal)}
            className="text-xs font-semibold text-[#FB6F92] hover:text-[#C23259] flex items-center gap-1"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditingGoal ? 'ยกเลิก' : 'แก้ไขเป้าหมาย'}</span>
          </button>
        </div>

        {isEditingGoal ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 text-xs">
            <div>
              <label className="text-slate-600 block mb-1 font-medium">คณะเป้าหมาย</label>
              <input
                type="text"
                value={tempFaculty}
                onChange={(e) => setTempFaculty(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white"
              />
            </div>
            <div>
              <label className="text-slate-600 block mb-1 font-medium">มหาวิทยาลัยเป้าหมาย</label>
              <input
                type="text"
                value={tempUni}
                onChange={(e) => setTempUni(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white"
              />
            </div>
            <div>
              <label className="text-slate-600 block mb-1 font-medium">วันสอบจริง</label>
              <input
                type="date"
                value={tempExamDate}
                onChange={(e) => setTempExamDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white"
              />
            </div>
            <div>
              <label className="text-slate-600 block mb-1 font-medium">เวลาอ่านหนังสือต่อวัน (ชั่วโมง)</label>
              <input
                type="number"
                step="0.5"
                value={tempDailyHours}
                onChange={(e) => setTempDailyHours(parseFloat(e.target.value) || 2)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white"
              />
            </div>
            <div>
              <label className="text-slate-600 block mb-1 font-medium">คะแนนเป้าหมายเฉลี่ย (เต็ม 100)</label>
              <input
                type="number"
                value={tempTargetScore}
                onChange={(e) => setTempTargetScore(parseInt(e.target.value, 10) || 75)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSaveGoal}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
              >
                บันทึกเป้าหมาย
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">คณะและมหาวิทยาลัย</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                {userProfile.targetFaculty} ({userProfile.targetUniversity})
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">วันสอบจริง</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block tabular-nums">
                {new Date(userProfile.examDate).toLocaleDateString('th-TH')}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">เวลาอ่านต่อวัน</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block tabular-nums">
                {userProfile.dailyStudyHours} ชั่วโมง
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">คะแนนเป้าหมาย</span>
              <span className="font-bold text-[#C23259] text-sm mt-0.5 block tabular-nums">
                {userProfile.targetScore} / 100
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Weekly Progress Meter */}
      <div className="p-5 rounded-2xl bg-[#FFF8F9] border border-[#FFC2D1]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-bold text-slate-900 text-sm">ความคืบหน้าของตารางสัปดาห์นี้</h3>
          <p className="text-xs text-slate-500">
            สำเร็จไปแล้ว {completedCount} จาก {studyTasks.length} ภารกิจ ({progressPercent}%)
          </p>
        </div>
        <div className="w-full sm:w-64 bg-white h-3 rounded-full overflow-hidden border border-[#FFC2D1]">
          <div
            className="bg-gradient-to-r from-[#FF8FAB] to-[#FB6F92] h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 7-Day Adaptive Schedule Cards */}
      <div className="space-y-6">
        <h2 className="text-base font-bold text-slate-900">
          🗓️ แผนติวเข้ม 7 วัน (โครงสร้างตามแผนที่คุณกำหนด)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {days.map((dayName) => {
            const dayTasks = studyTasks.filter((t) => t.day === dayName);

            return (
              <div
                key={dayName}
                className="bg-white rounded-2xl border border-[#FFC2D1]/60 p-5 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="font-bold text-slate-900 text-sm">{dayName}</h3>
                    <span className="text-[11px] text-slate-400">
                      {dayTasks.filter((t) => t.completed).length}/{dayTasks.length} สำเร็จ
                    </span>
                  </div>

                  <div className="space-y-2 pt-2">
                    {dayTasks.length === 0 ? (
                      <p className="text-xs text-slate-400 py-3 text-center">ไม่มีภารกิจ</p>
                    ) : (
                      dayTasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => onToggleTask(task.id)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            task.completed
                              ? 'bg-[#FFE5EC]/30 border-[#FFC2D1]/40 text-slate-400'
                              : 'bg-[#FFF8F9] hover:bg-[#FFE5EC]/40 border-[#FFC2D1]/50 text-slate-800'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <CheckCircle2
                              className={`w-4 h-4 mt-0.5 shrink-0 ${
                                task.completed ? 'text-[#FB6F92]' : 'text-slate-300'
                              }`}
                            />
                            <div className="min-w-0">
                              <p className={`font-semibold ${task.completed ? 'line-through' : ''}`}>
                                {task.title}
                              </p>
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                                <span>{task.subject}</span>
                                <span aria-hidden="true">·</span>
                                <span className="tabular-nums">{task.duration}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setNewTaskDay(dayName);
                    setShowAddModal(true);
                  }}
                  className="w-full py-1.5 rounded-lg border border-dashed border-[#FFC2D1] text-[11px] font-semibold text-slate-500 hover:text-[#9F1C42] hover:bg-[#FFE5EC]/30 transition-colors"
                >
                  + เพิ่มภารกิจวันนี้
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-60 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateTask}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#FFC2D1] space-y-4 animate-in fade-in zoom-in-95"
          >
            <h3 className="text-base font-bold text-slate-900">เพิ่มภารกิจอ่านหนังสือ</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1">เลือกวันในสัปดาห์</label>
                <select
                  value={newTaskDay}
                  onChange={(e) => setNewTaskDay(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white"
                >
                  {days.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-600 block mb-1">ชื่อภารกิจที่ต้องทำ</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ทำโจทย์แคลคูลัส 20 ข้อ..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">วิชา / หมวดหมู่</label>
                <input
                  type="text"
                  value={newTaskSubject}
                  onChange={(e) => setNewTaskSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">ระยะเวลาที่ใช้</label>
                <input
                  type="text"
                  value={newTaskDuration}
                  onChange={(e) => setNewTaskDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF8FAB] to-[#FB6F92] text-white text-xs font-bold hover:shadow-md hover:shadow-[#FB6F92]/25 active:scale-95 transition-all"
              >
                เพิ่มภารกิจ
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
