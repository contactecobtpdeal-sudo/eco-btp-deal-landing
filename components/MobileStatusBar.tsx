
import React, { useState, useEffect } from 'react';

const MobileStatusBar: React.FC = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white px-6 py-2 flex items-center text-[10px] font-black text-slate-400 sticky top-0 z-[70] border-b border-slate-50">
      <span className="tracking-tighter">{time}</span>
    </div>
  );
};

export default MobileStatusBar;
