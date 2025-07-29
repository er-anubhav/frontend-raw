export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR');
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('fr-FR');
};

export const getDaysFromStart = (startDate: string): number => {
  const start = new Date(startDate);
  const now = new Date();
  return Math.ceil((now.getTime() - start.getTime()) / (1000 * 3600 * 24));
};

export const getWeekString = (date: Date): string => {
  const year = date.getFullYear();
  const week = getWeekNumber(date);
  return `${year}-W${week.toString().padStart(2, '0')}`;
};

export const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

export const getDateFromWeekString = (weekString: string): Date => {
  const [year, week] = weekString.split('-W');
  const yearNum = parseInt(year, 10);
  const weekNum = parseInt(week, 10);
  
  const jan4 = new Date(yearNum, 0, 4);
  const mondayOfWeek1 = new Date(jan4);
  mondayOfWeek1.setDate(jan4.getDate() - jan4.getDay() + 1);
  
  const targetMonday = new Date(mondayOfWeek1);
  targetMonday.setDate(mondayOfWeek1.getDate() + (weekNum - 1) * 7);
  
  return targetMonday;
};

export const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};