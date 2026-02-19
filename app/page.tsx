
'use client';

import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  AlertCircle,
  Clock,
  LayoutGrid
} from 'lucide-react';
import { Staff, EmploymentType, Shift, DayRequirement } from '../lib/types';
import { 
  START_HOUR, 
  END_HOUR, 
  TIME_SLOTS, 
  MOCK_HOLIDAYS, 
  INITIAL_STAFF, 
  STAFF_COLORS 
} from '../lib/constants';
import { getWeekDays, formatDate, isWeekend, getShiftPosition } from '../lib/utils';

const generateId = () => Math.random().toString(36).substr(2, 9);

type ViewMode = 'WEEK' | 'DAY';

export default function ShiftManagerPage() {
  const [staff, setStaff] = useState<Staff[]>(INITIAL_STAFF);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [requirements, setRequirements] = useState<DayRequirement[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('WEEK');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<EmploymentType | 'ALL'>('ALL');
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState<{staff: Staff, date: string} | null>(null);

  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);
  const activeDateStr = useMemo(() => formatDate(currentDate), [currentDate]);
  
  const filteredStaff = useMemo(() => {
    if (selectedEmploymentType === 'ALL') return staff;
    return staff.filter(s => s.type === selectedEmploymentType);
  }, [staff, selectedEmploymentType]);

  const addStaff = (name: string, type: EmploymentType) => {
    const newStaff: Staff = {
      id: generateId(),
      name,
      type,
      color: STAFF_COLORS[staff.length % STAFF_COLORS.length]
    };
    setStaff([...staff, newStaff]);
    setShowStaffModal(false);
  };

  const deleteStaff = (id: string) => {
    setStaff(staff.filter(s => s.id !== id));
    setShifts(shifts.filter(s => s.staffId !== id));
  };

  const upsertShift = (staffId: string, date: string, startTime: string, endTime: string) => {
    const existingIndex = shifts.findIndex(s => s.staffId === staffId && s.date === date);
    if (existingIndex > -1) {
      const updated = [...shifts];
      updated[existingIndex] = { ...updated[existingIndex], startTime, endTime };
      setShifts(updated);
    } else {
      setShifts([...shifts, { id: generateId(), staffId, date, startTime, endTime }]);
    }
    setShowShiftModal(null);
  };

  const deleteShift = (staffId: string, date: string) => {
    setShifts(shifts.filter(s => !(s.staffId === staffId && s.date === date)));
    setShowShiftModal(null);
  };

  const getRequirementForDate = (date: string) => {
    return requirements.find(r => r.date === date)?.minFullTimeCount || 0;
  };

  const setRequirementForDate = (date: string, count: number) => {
    const existingIndex = requirements.findIndex(r => r.date === date);
    if (existingIndex > -1) {
      const updated = [...requirements];
      updated[existingIndex].minFullTimeCount = count;
      setRequirements(updated);
    } else {
      setRequirements([...requirements, { date, minFullTimeCount: count }]);
    }
  };

  const getStaffingLevel = (date: string) => {
    const dailyShifts = shifts.filter(s => s.date === date);
    const fullTimeIds = staff.filter(s => s.type === EmploymentType.FULL_TIME).map(s => s.id);
    const count = dailyShifts.filter(s => fullTimeIds.includes(s.staffId)).length;
    const req = getRequirementForDate(date);
    return { count, req, isMet: count >= req };
  };

  const navigate = (direction: number) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'WEEK') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else {
      newDate.setDate(newDate.getDate() + direction);
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-lg text-white">
              <CalendarIcon size={24} />
            </div>
            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">保育園 シフト管理</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 rounded-lg p-1 mr-2">
              <button 
                onClick={() => setViewMode('WEEK')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'WEEK' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <LayoutGrid size={16} />
                週間
              </button>
              <button 
                onClick={() => setViewMode('DAY')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'DAY' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Clock size={16} />
                日別
              </button>
            </div>

            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-white rounded-md transition-colors"><ChevronLeft size={20} /></button>
              <span className="px-3 font-medium text-sm whitespace-nowrap min-w-[140px] text-center">
                {viewMode === 'WEEK' ? `${formatDate(weekDays[0])} 〜 ${formatDate(weekDays[6])}` : activeDateStr}
              </span>
              <button onClick={() => navigate(1)} className="p-1.5 hover:bg-white rounded-md transition-colors"><ChevronRight size={20} /></button>
            </div>
            <button 
              onClick={() => setShowStaffModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <Plus size={18} /> 職員追加
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 mt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 w-fit shadow-sm">
            {(['ALL', ...Object.values(EmploymentType)] as const).map(type => (
              <button
                key={type}
                onClick={() => setSelectedEmploymentType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedEmploymentType === type ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {type === 'ALL' ? '全員表示' : type}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500"><Users size={16} /><span>表示人数: {filteredStaff.length}名</span></div>
        </div>

        {viewMode === 'WEEK' ? (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[1200px]">
                <div className="grid grid-cols-[200px_repeat(7,1fr)] bg-gray-50 border-b border-gray-200">
                  <div className="p-4 font-bold text-gray-600 border-r border-gray-200 flex items-center justify-center">時間 / 日</div>
                  {weekDays.map((date) => {
                    const dateStr = formatDate(date);
                    const holiday = MOCK_HOLIDAYS.find(h => h.date === dateStr);
                    const weekend = isWeekend(date);
                    const staffing = getStaffingLevel(dateStr);
                    return (
                      <div key={dateStr} className={`p-3 text-center border-r border-gray-200 last:border-0 ${holiday || weekend ? 'bg-orange-50' : ''}`}>
                        <div className="text-xs font-bold text-gray-500 uppercase">{['日', '月', '火', '水', '木', '金', '土'][date.getDay()]}</div>
                        <div className={`text-lg font-bold ${holiday ? 'text-red-500' : weekend ? 'text-blue-500' : 'text-gray-800'}`}>{date.getDate()}</div>
                        {holiday && <div className="text-[10px] text-red-400 font-bold truncate">{holiday.name}</div>}
                        <div className="mt-2 flex flex-col items-center gap-1">
                          <div className="flex items-center gap-1 text-[10px] font-medium text-gray-500">正社員必要: <input type="number" min="0" className="w-8 border-b border-gray-300 bg-transparent text-center focus:outline-none" value={getRequirementForDate(dateStr)} onChange={(e) => setRequirementForDate(dateStr, parseInt(e.target.value) || 0)}/></div>
                          <div className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${staffing.isMet ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{staffing.count} / {staffing.req}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="divide-y divide-gray-100">
                  {filteredStaff.map(member => (
                    <div key={member.id} className="grid grid-cols-[200px_repeat(7,1fr)] group hover:bg-gray-50 transition-colors">
                      <div className="p-4 border-r border-gray-200 flex flex-col gap-1">
                        <div className="flex items-center justify-between"><span className="font-bold text-gray-800">{member.name}</span><button onClick={() => deleteStaff(member.id)} className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button></div>
                        <span className={`text-[10px] w-fit px-2 py-0.5 rounded-full font-medium ${member.type === EmploymentType.FULL_TIME ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{member.type}</span>
                      </div>
                      {weekDays.map(date => {
                        const dateStr = formatDate(date);
                        const shift = shifts.find(s => s.staffId === member.id && s.date === dateStr);
                        return (
                          <div key={dateStr} className="p-2 border-r border-gray-100 last:border-0 relative h-20 flex flex-col items-center justify-center cursor-pointer" onClick={() => setShowShiftModal({ staff: member, date: dateStr })}>
                            {shift ? (
                              <div className="w-full h-12 rounded-lg flex flex-col items-center justify-center text-[11px] font-bold text-white shadow-sm" style={{ backgroundColor: member.color }}>
                                <div>{shift.startTime}</div><div className="h-0.5 w-4 bg-white/50 my-0.5"></div><div>{shift.endTime}</div>
                              </div>
                            ) : (
                              <div className="w-full h-12 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"><Plus size={16} className="text-gray-300" /></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold text-gray-800">{activeDateStr} の勤務表</h2>
                {MOCK_HOLIDAYS.find(h => h.date === activeDateStr) && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">{MOCK_HOLIDAYS.find(h => h.date === activeDateStr)?.name}</span>
                )}
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">正社員必要数: <input type="number" min="0" className="w-12 px-2 py-1 border border-gray-200 rounded bg-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500" value={getRequirementForDate(activeDateStr)} onChange={(e) => setRequirementForDate(activeDateStr, parseInt(e.target.value) || 0)}/></div>
                {(() => {
                  const staffing = getStaffingLevel(activeDateStr);
                  return <div className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 ${staffing.isMet ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{staffing.isMet ? '充足' : '不足'} : {staffing.count} / {staffing.req} 名</div>;
                })()}
              </div>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[1000px] relative">
                <div className="grid grid-cols-[200px_1fr] bg-gray-50 border-b border-gray-200">
                  <div className="p-4 border-r border-gray-200 text-center text-xs font-bold text-gray-500">職員名</div>
                  <div className="relative h-12 flex">
                    {TIME_SLOTS.filter((_, i) => i % 2 === 0).map((hour) => (<div key={hour} className="flex-1 border-l border-gray-200 text-[10px] text-gray-400 pl-1 pt-1">{hour}</div>))}
                  </div>
                </div>
                <div className="divide-y divide-gray-100 relative">
                  <div className="absolute inset-y-0 left-[200px] right-0 grid grid-cols-14 pointer-events-none">
                    {Array.from({ length: 14 }).map((_, i) => (<div key={i} className="border-l border-gray-50 last:border-r h-full"></div>))}
                  </div>
                  {filteredStaff.map(member => {
                    const shift = shifts.find(s => s.staffId === member.id && s.date === activeDateStr);
                    const position = shift ? getShiftPosition(shift.startTime, shift.endTime, START_HOUR, END_HOUR) : null;
                    return (
                      <div key={member.id} className="grid grid-cols-[200px_1fr] min-h-[64px] group hover:bg-gray-50/50 transition-colors">
                        <div className="p-3 border-r border-gray-200 flex flex-col justify-center"><span className="font-bold text-gray-800 text-sm">{member.name}</span><span className="text-[9px] text-gray-400 mt-0.5">{member.type}</span></div>
                        <div className="relative h-full flex items-center px-0 cursor-pointer" onClick={() => setShowShiftModal({ staff: member, date: activeDateStr })}>
                          {shift ? (
                            <div className="absolute h-10 rounded-lg flex items-center justify-between px-3 text-[10px] font-bold text-white shadow-md hover:brightness-105 transition-all z-10" style={{ backgroundColor: member.color, left: position?.left, width: position?.width }}>
                              <span className="truncate">{shift.startTime}</span><span className="truncate">{shift.endTime}</span>
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><span className="text-gray-300 text-xs flex items-center gap-1 font-medium"><Plus size={14}/> シフト追加</span></div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {showStaffModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-blue-50/50"><h2 className="text-xl font-bold text-gray-800">職員の追加</h2><button onClick={() => setShowStaffModal(false)} className="text-gray-400 hover:text-gray-600"><AlertCircle size={24} className="rotate-45" /></button></div>
            <form onSubmit={(e) => { e.preventDefault(); const formData = new FormData(e.currentTarget); addStaff(formData.get('name') as string, formData.get('type') as EmploymentType); }} className="p-6 space-y-4">
              <div><label className="block text-sm font-bold text-gray-700 mb-1">名前</label><input name="name" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" placeholder="例: 大澤 沙織" /></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1">雇用形態</label><select name="type" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all bg-white">{Object.values(EmploymentType).map(type => <option key={type} value={type}>{type}</option>)}</select></div>
              <div className="pt-4 flex gap-3"><button type="button" onClick={() => setShowStaffModal(false)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors">キャンセル</button><button type="submit" className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all">追加する</button></div>
            </form>
          </div>
        </div>
      )}

      {showShiftModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between"><div><h2 className="text-xl font-bold text-gray-800">{showShiftModal.staff.name}</h2><p className="text-sm text-gray-500">{showShiftModal.date} のシフト設定</p></div><button onClick={() => setShowShiftModal(null)} className="text-gray-400 hover:text-gray-600"><AlertCircle size={24} className="rotate-45" /></button></div>
            <form onSubmit={(e) => { e.preventDefault(); const formData = new FormData(e.currentTarget); upsertShift(showShiftModal.staff.id, showShiftModal.date, formData.get('start') as string, formData.get('end') as string); }} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-bold text-gray-700 mb-1">開始時間</label><select name="start" defaultValue={shifts.find(s => s.staffId === showShiftModal.staff.id && s.date === showShiftModal.date)?.startTime || "09:00"} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">{TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}</select></div>
                <div><label className="block text-sm font-bold text-gray-700 mb-1">終了時間</label><select name="end" defaultValue={shifts.find(s => s.staffId === showShiftModal.staff.id && s.date === showShiftModal.date)?.endTime || "18:00"} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">{TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}</select></div>
              </div>
              <div className="pt-4 flex flex-col gap-3">
                <button type="submit" className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200">{shifts.find(s => s.staffId === showShiftModal.staff.id && s.date === showShiftModal.date) ? '更新する' : '保存する'}</button>
                {shifts.find(s => s.staffId === showShiftModal.staff.id && s.date === showShiftModal.date) && (<button type="button" onClick={() => deleteShift(showShiftModal.staff.id, showShiftModal.date)} className="w-full px-4 py-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-2"><Trash2 size={18} /> シフトを削除</button>)}
                <button type="button" onClick={() => setShowShiftModal(null)} className="w-full px-4 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50">閉じる</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
