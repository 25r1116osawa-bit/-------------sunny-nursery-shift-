
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
  date: string;
  startTime: string;
  endTime: string;
}

export interface DayRequirement {
  date: string;
  minFullTimeCount: number;
}

export interface Holiday {
  date: string;
  name: string;
}
