
import React from 'react';
import { Clock, Zap } from 'lucide-react';

interface FlashDealBannerProps {
  count: number;
}

const FlashDealBanner: React.FC<FlashDealBannerProps> = ({ count }) => {
  if (count === 0) return null;

  return (
    <div className="bg-red-600 text-white py-2.5 px-6 flex items-center justify-between animate-pulse sticky top-0 z-[60] shadow-lg">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
          <Clock size={14} className="text-white" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.15em]">
          {count} Lot{count > 1 ? 's' : ''} Urgent{count > 1 ? 's' : ''} : Chantier{count > 1 ? 's' : ''} finit demain !
        </span>
      </div>
      <div className="bg-white text-red-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
        FLASH DEAL
      </div>
    </div>
  );
};

export default FlashDealBanner;
