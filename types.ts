
export enum EmploymentType {
  FULL_TIME = '正社員',
  PART_TIME = 'アルバイト・パート'
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
  date: string; // ISO format (YYYY-MM-DD)
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export interface DayRequirement {
  date: string;
  minFullTimeCount: number; // Minimal regular staff required
}

export interface Holiday {
  date: string;
  name: string;
}
