
import React, { useState, useEffect } from 'react';
import { Battery, Wifi, Signal } from 'lucide-react';

const MobileStatusBar: React.FC = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white px-6 py-2 flex justify-between items-center text-[10px] font-black text-slate-400 sticky top-0 z-[70] border-b border-slate-50">
      <span className="tracking-tighter">{time}</span>
      <div className="flex gap-2 items-center">
        <Signal size={12} strokeWidth={3} />
        <Wifi size={12} strokeWidth={3} />
        <div className="relative flex items-center">
          <Battery size={14} strokeWidth={3} className="rotate-0" />
          <div className="absolute left-0.5 top-1/2 -translate-y-1/2 h-1 w-2 bg-slate-400 rounded-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default MobileStatusBar;
