
import React from 'react';
import { Bell, X } from 'lucide-react';

interface NotificationCenterProps {
  message: string;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ message, onClose }) => {
  return (
    <div className="bg-orange-50 border-b-2 border-orange-100 px-6 py-3 animate-in slide-in-from-top duration-500 sticky top-0 z-30">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="bg-orange-500 p-2 rounded-xl text-white shadow-lg shadow-orange-100">
              <Bell size={16} />
            </div>
            <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white animate-ping"></span>
            <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white"></span>
          </div>
          <p className="text-[11px] font-black text-orange-900 uppercase tracking-tight leading-tight">
            {message}
          </p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-orange-100 rounded-lg text-orange-400 transition-colors">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default NotificationCenter;
