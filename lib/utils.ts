
export const getWeekDays = (baseDate: Date) => {
  const start = new Date(baseDate);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(start.setDate(diff));
  
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
};

export const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const isWeekend = (date: Date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

export const timeToMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

export const getShiftPosition = (startTime: string, endTime: string, startHour: number, endHour: number) => {
  const startMin = timeToMinutes(startTime);
  const endMin = timeToMinutes(endTime);
  const dayStartMin = startHour * 60;
  const dayEndMin = endHour * 60;
  
  const totalWidth = dayEndMin - dayStartMin;
  const left = ((startMin - dayStartMin) / totalWidth) * 100;
  const width = ((endMin - startMin) / totalWidth) * 100;
  
  return { left: `${Math.max(0, left)}%`, width: `${Math.min(100 - left, width)}%` };
};
