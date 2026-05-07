import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  message: string;
  onRetry?: () => void;
}

export default function ErrorAlert({ message, onRetry }: Props) {
  return (
    <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
      <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-red-700">Error</p>
        <p className="text-xs text-red-600 mt-0.5">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-800 transition-colors"
        >
          <RefreshCw size={13} /> Retry
        </button>
      )}
    </div>
  );
}
