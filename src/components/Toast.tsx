import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 bg-[#0B3C5D] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 transition-all duration-300 transform translate-y-0 opacity-100 animate-in fade-in slide-in-from-bottom-5">
      <CheckCircle2 className="w-4 h-4 text-[#FDB827] shrink-0" />
      <span className="text-xs font-medium">{message}</span>
    </div>
  );
};
