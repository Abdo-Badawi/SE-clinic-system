interface EmptyStateProps {
  message: string;
  icon?: string;
}

export default function EmptyState({ message, icon = '📋' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <p className="text-slate-400 text-sm">{message}</p>
    </div>
  );
}
