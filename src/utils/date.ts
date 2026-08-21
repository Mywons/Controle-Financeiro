import { addMonths, format, getDaysInMonth, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function monthKeyNow(): string {
  return format(new Date(), 'yyyy-MM');
}

export function monthKeyOf(date: Date): string {
  return format(date, 'yyyy-MM');
}

export function shiftMonthKey(monthKey: string, delta: number): string {
  const base = parse(monthKey, 'yyyy-MM', new Date());
  return format(addMonths(base, delta), 'yyyy-MM');
}

export function monthLabel(monthKey: string): string {
  const base = parse(monthKey, 'yyyy-MM', new Date());
  const label = format(base, "MMMM 'de' yyyy", { locale: ptBR });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function monthShortLabel(monthKey: string): string {
  const base = parse(monthKey, 'yyyy-MM', new Date());
  const label = format(base, 'MMM/yy', { locale: ptBR });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function dateForDayInMonth(monthKey: string, day: number): string {
  const base = parse(monthKey, 'yyyy-MM', new Date());
  const daysInMonth = getDaysInMonth(base);
  const safeDay = Math.min(day, daysInMonth);
  const iso = format(base, 'yyyy-MM');
  return `${iso}-${String(safeDay).padStart(2, '0')}`;
}

export function formatDayMonth(isoDate: string): string {
  const d = parse(isoDate, 'yyyy-MM-dd', new Date());
  return format(d, "dd 'de' MMM", { locale: ptBR });
}

export function todayIso(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function isCurrentMonth(monthKey: string): boolean {
  return monthKey === monthKeyNow();
}
