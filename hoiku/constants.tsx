
import React from 'react';
import { Phone, History, LayoutDashboard, PlusCircle, Settings, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { EmploymentType, Staff } from './types';

export const COLORS = {
  primary: '#7FB3D5',
  secondary: '#FAD7A0',
  accent: '#F1948A',
  background: '#fdfbf7',
  card: '#ffffff',
  text: '#5D6D7E',
};

export const CLASSES = [
  'ひよこ組',
  'りす組',
  'うさぎ組',
  'くま組',
  'ぞう組'
];

export const STATUS_ICONS = {
  '完了': <CheckCircle className="w-4 h-4 text-green-500" />,
  '要対応': <Clock className="w-4 h-4 text-yellow-500" />,
  '至急連絡': <AlertCircle className="w-4 h-4 text-red-500" />,
};

export const START_HOUR = 7;
export const END_HOUR = 20;

export const TIME_SLOTS = Array.from({ length: (END_HOUR - START_HOUR) * 2 + 1 }, (_, i) => {
  const hour = Math.floor(i / 2) + START_HOUR;
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
});

export const STAFF_COLORS = [
  '#FF8A65', '#4DB6AC', '#7986CB', '#F06292', '#AED581', 
  '#FFD54F', '#4FC3F7', '#BA68C8', '#A1887F', '#90A4AE'
];

export const INITIAL_STAFF: Staff[] = [
  { id: '1', name: '佐藤 先生', type: EmploymentType.FULL_TIME, color: STAFF_COLORS[0] },
  { id: '2', name: '田中 先生', type: EmploymentType.FULL_TIME, color: STAFF_COLORS[1] },
  { id: '3', name: '鈴木 先生', type: EmploymentType.PART_TIME, color: STAFF_COLORS[2] },
  { id: '4', name: '高橋 先生', type: EmploymentType.PART_TIME, color: STAFF_COLORS[3] },
];

export const MOCK_HOLIDAYS = [
  { date: '2026-01-01', name: '元日' },
  { date: '2026-01-12', name: '成人の日' },
  { date: '2026-02-11', name: '建国記念の日' },
  { date: '2026-02-23', name: '天皇誕生日' },
  { date: '2026-03-20', name: '春分の日' },
  { date: '2026-04-29', name: '昭和の日' },
  { date: '2026-05-03', name: '憲法記念日' },
  { date: '2026-05-04', name: 'みどりの日' },
  { date: '2026-05-05', name: 'こどもの日' },
];
