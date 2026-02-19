
import { EmploymentType } from './types';




export const START_HOUR = 6;
export const END_HOUR = 20;
export const TIME_SLOTS = Array.from({ length: (END_HOUR - START_HOUR) * 2 }, (_, i) => {
  const hour = START_HOUR + Math.floor(i / 2);
  const min = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${min}`;
});

export const STAFF_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
  '#8B5CF6', '#EC4899', '#06B6D4', '#6366F1'
];

export const MOCK_HOLIDAYS = [
  { date: '2024-01-01', name: '元日' },
  { date: '2024-01-08', name: '成人の日' },
  { date: '2024-02-11', name: '建国記念の日' },
  { date: '2024-02-12', name: '振替休日' },
  { date: '2024-02-23', name: '天皇誕生日' },
  { date: '2024-03-20', name: '春分の日' },
  { date: '2024-04-29', name: '昭和の日' },
  { date: '2024-05-03', name: '憲法記念日' },
  { date: '2024-05-04', name: 'みどりの日' },
  { date: '2024-05-05', name: 'こどもの日' },
  { date: '2024-05-06', name: '振替休日' },
];

export const INITIAL_STAFF = [
  { id: 1, name: '大澤 沙織', type: EmploymentType.FULL_TIME, color: STAFF_COLORS[0] ,isDelete:0 },
  { id: 2, name: '鈴木 太郎', type: EmploymentType.FULL_TIME, color: STAFF_COLORS[0] ,isDelete:0},
  { id: 3, name: '高橋 健太', type: EmploymentType.PART_TIME, color: STAFF_COLORS[1] ,isDelete:0},
  { id: 4, name: 'テストデータ', type: EmploymentType.PART_TIME, color: STAFF_COLORS[1] ,isDelete:1},
];
