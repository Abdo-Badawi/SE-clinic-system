import type { Lang } from '../../types';
import { getStatusBadgeClass } from '../../utils/helpers';

interface BadgeProps {
  status: string;
  lang: Lang;
}

// Backend AppointmentStatus values (exact enum):
// scheduled | checked_in | completed | cancelled | no_show
const LABELS: Record<string, Record<string, string>> = {
  scheduled:  { ar: 'مجدول',       en: 'Scheduled' },
  checked_in: { ar: 'تم الحضور',   en: 'Checked In' },
  completed:  { ar: 'مكتمل',       en: 'Completed' },
  cancelled:  { ar: 'ملغي',        en: 'Cancelled' },
  no_show:    { ar: 'لم يحضر',     en: 'No Show' },
};

export default function Badge({ status, lang }: BadgeProps) {
  const key   = status?.toLowerCase() ?? '';
  const cls   = getStatusBadgeClass(key);
  const label = LABELS[key]?.[lang] ?? status ?? '—';
  return (
    <span className={cls}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 inline-block" />
      {label}
    </span>
  );
}
