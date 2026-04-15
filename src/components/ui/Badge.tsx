import type { AppointmentStatus } from '../../types';
import type { Lang } from '../../types';
import { tr } from '../../utils/i18n';
import { getStatusBadgeClass } from '../../utils/helpers';

interface BadgeProps {
  status: AppointmentStatus | 'Active' | 'Inactive';
  lang: Lang;
}

const statusKeys: Record<string, string> = {
  Confirmed: 'confirmed',
  Pending: 'pending',
  Cancelled: 'cancelled',
  Completed: 'completed',
  Active: 'active',
  Inactive: 'inactive',
};

export default function Badge({ status, lang }: BadgeProps) {
  const cls = getStatusBadgeClass(status);
  const label = tr(statusKeys[status] || status.toLowerCase(), lang);
  return (
    <span className={cls}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 inline-block" />
      {label}
    </span>
  );
}
