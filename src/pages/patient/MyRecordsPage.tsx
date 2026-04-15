import { useAppStore } from '../../store/useAppStore';
import { tr } from '../../utils/i18n';
import PageHeader from '../../components/ui/PageHeader';
import MedicalHistoryPage from '../admin/MedicalHistoryPage';

export default function MyRecordsPage() {
  const { currentUser } = useAppStore();
  const patientId = currentUser?.patientId ?? 1;

  return <MedicalHistoryPage filterPatientId={patientId} readOnly />;
}
