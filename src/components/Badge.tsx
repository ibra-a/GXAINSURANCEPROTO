import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    success: 'bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-700 border-emerald-200',
    warning: 'bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-700 border-amber-200',
    error: 'bg-gradient-to-r from-red-100 to-rose-100 text-rose-700 border-rose-200',
    info: 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200',
  };

  return (
    <span className={cn(
      'px-2.5 py-0.5 text-xs font-medium rounded-full border',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
