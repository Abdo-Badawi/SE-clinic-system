import clsx from 'clsx';

interface AvatarProps {
  code: string;
  colorClass: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-14 h-14 text-xl',
  xl: 'w-20 h-20 text-3xl',
};

export default function Avatar({ code, colorClass, size = 'md' }: AvatarProps) {
  return (
    <div
      className={clsx(
        'rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0',
        sizeMap[size],
        colorClass
      )}
    >
      {code}
    </div>
  );
}
