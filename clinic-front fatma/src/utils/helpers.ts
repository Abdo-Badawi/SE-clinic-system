// Appointment.AppointmentStatus enum from source:
// scheduled | checked_in | completed | cancelled | no_show
export function getStatusBadgeClass(status: string): string {
  switch (status?.toLowerCase()) {
    case 'scheduled':  return 'badge-blue';
    case 'checked_in': return 'badge-amber';
    case 'completed':  return 'badge-green';
    case 'cancelled':  return 'badge-red';
    case 'no_show':    return 'badge-gray';
    default:           return 'badge-gray';
  }
}

export function getStatusDot(status: string): string {
  switch (status?.toLowerCase()) {
    case 'scheduled':  return 'bg-primary-400';
    case 'checked_in': return 'bg-amber-500';
    case 'completed':  return 'bg-emerald-500';
    case 'cancelled':  return 'bg-red-500';
    case 'no_show':    return 'bg-slate-400';
    default:           return 'bg-slate-300';
  }
}

/** LocalTime "10:00:00" → "10:00 AM" */
export function formatTime(t?: string): string {
  if (!t) return '—';
  try {
    const [h, m] = t.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour  = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
  } catch { return t; }
}

/** LocalDate "2026-04-29" → "Apr 29, 2026" */
export function formatDate(d?: string, lang: 'ar'|'en' = 'en'): string {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  } catch { return d; }
}

/** LocalDateTime "2026-04-28T10:30:00" → date part */
export function dateOnly(dt?: string): string {
  return dt?.split('T')[0] ?? '—';
}
