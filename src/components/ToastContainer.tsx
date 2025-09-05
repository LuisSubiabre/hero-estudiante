import React from 'react';
import { Alert, Button } from '@heroui/react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Toast, useToast } from '@/hooks/useToast';

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-danger" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'info':
        return <Info className="w-5 h-5 text-primary" />;
      default:
        return <Info className="w-5 h-5 text-primary" />;
    }
  };

  const getColor = () => {
    switch (toast.type) {
      case 'success':
        return 'success';
      case 'error':
        return 'danger';
      case 'warning':
        return 'warning';
      case 'info':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <div className="animate-in slide-in-from-right-full duration-300">
      <Alert
        color={getColor()}
        variant="flat"
        className="mb-2 shadow-lg border"
        startContent={getIcon()}
        endContent={
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={() => onRemove(toast.id)}
            className="text-default-500 hover:text-default-700"
          >
            <X className="w-4 h-4" />
          </Button>
        }
      >
        <div className="flex flex-col">
          <div className="font-semibold text-sm">{toast.title}</div>
          <div className="text-xs text-default-600 mt-1">{toast.message}</div>
        </div>
      </Alert>
    </div>
  );
};

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

export default ToastContainer;
