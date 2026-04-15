import type { AppointmentStatus } from '../types';

export function getStatusBadgeClass(status: AppointmentStatus | 'Active' | 'Inactive'): string {
  switch (status) {
    case 'Confirmed':
    case 'Active':
      return 'badge-green';
    case 'Pending':
      return 'badge-amber';
    case 'Cancelled':
      return 'badge-red';
    case 'Completed':
      return 'badge-blue';
    case 'Inactive':
      return 'badge-gray';
    default:
      return 'badge-gray';
  }
}

export function getStatusDot(status: AppointmentStatus): string {
  switch (status) {
    case 'Confirmed': return 'bg-emerald-500';
    case 'Pending':   return 'bg-amber-500';
    case 'Cancelled': return 'bg-red-500';
    case 'Completed': return 'bg-primary-500';
    default:          return 'bg-slate-400';
  }
}

export function formatDate(dateStr: string, lang: 'ar' | 'en'): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function isToday(dateStr: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  return dateStr === today || dateStr === '2025-04-09'; // allow demo data
}
