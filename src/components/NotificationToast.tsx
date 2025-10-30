import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  onClose?: () => void;
  autoClose?: boolean;
}

export function NotificationToast({ type, title, message, onClose, autoClose = true }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  };

  const styles = {
    success: 'from-green-500 to-emerald-600',
    error: 'from-red-500 to-rose-600',
    warning: 'from-yellow-500 to-amber-600',
    info: 'from-blue-500 to-indigo-600'
  };

  const Icon = icons[type];

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md">
        <div className={`bg-gradient-to-r ${styles[type]} p-4`}>
          <div className="flex items-start gap-3">
            <Icon className="h-6 w-6 text-white flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-white">{title}</h4>
              {message && <p className="mt-1 text-sm text-white/90">{message}</p>}
            </div>
            <button
              onClick={() => {
                setIsVisible(false);
                onClose?.();
              }}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className={`h-1 bg-gradient-to-r ${styles[type]} animate-shrink-width`}></div>
      </div>
    </div>
  );
}
