
import { format, startOfWeek, addDays, isWeekend as isWeekendFn } from 'date-fns';

export const getWeekDays = (date: Date): Date[] => {
  const start = startOfWeek(date, { weekStartsOn: 0 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const isWeekend = (date: Date): boolean => {
  return isWeekendFn(date);
};

export const getShiftPosition = (startTime: string, endTime: string, startHour: number, endHour: number) => {
  const parseTime = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h + m / 60;
  };

  const start = parseTime(startTime);
  const end = parseTime(endTime);
  const totalHours = endHour - startHour;

  const left = ((start - startHour) / totalHours) * 100;
  const width = ((end - start) / totalHours) * 100;

  return {
    left: `${Math.max(0, left)}%`,
    width: `${Math.min(100 - left, width)}%`,
  };
};
