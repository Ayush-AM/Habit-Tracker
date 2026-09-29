import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export function ToastContainer({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className="toast">
          <Sparkles size={16} className="text-amber-500" />
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
