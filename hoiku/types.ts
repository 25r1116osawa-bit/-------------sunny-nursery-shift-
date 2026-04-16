
export enum CallStatus {
  COMPLETED = '完了',
  PENDING = '要対応',
  URGENT = '至急連絡',
}

export enum ClassName {
  Hiyoko = 'ひよこ組',
  Risu = 'りす組',
  Usagi = 'うさぎ組',
  Kuma = 'くま組',
  Zou = 'ぞう組',
}

export interface CallLog {
  id: string;
  timestamp: number;
  callerName: string;
  childName: string;
  className: ClassName;
  content: string;
  status: CallStatus;
  recordedBy: string;
}

export interface CallStats {
  date: string;
  count: number;
}

export enum EmploymentType {
  FULL_TIME = '正社員',
  PART_TIME = 'パート',
}

export interface Staff {
  id: string;
  name: string;
  type: EmploymentType;
  color: string;
}

export interface Shift {
  id: string;
  staffId: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface DayRequirement {
  date: string;
  minFullTimeCount: number;
}
