import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
  hover?: boolean;
}

export function Card({ children, className, gradient = false, hover = true }: CardProps) {
  return (
    <div className={cn(
      'bg-white rounded-xl shadow-sm overflow-hidden',
      hover && 'hover:shadow-xl transition-all duration-300',
      gradient && 'bg-gradient-to-br from-white to-gray-50',
      className
    )}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('p-6 border-b border-gray-100', className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('p-6', className)}>
      {children}
    </div>
  );
}
