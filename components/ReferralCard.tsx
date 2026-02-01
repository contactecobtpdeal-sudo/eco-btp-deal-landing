
import React from 'react';
import { Users, Copy, Gift, ArrowRight } from 'lucide-react';

const ReferralCard: React.FC = () => {
  const referralCode = "ECO-2026-BATI";
  
  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    alert("Code parrainage copié !");
  };

  return (
    <div className="bg-orange-600 p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl shadow-orange-200 group">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
            <Gift size={20} />
          </div>
          <h3 className="font-black text-sm uppercase tracking-widest leading-none">Parrainez un Pro 🤝</h3>
        </div>
        
        <p className="text-xs font-bold opacity-90 mb-6 max-w-[200px] leading-relaxed">
          Offrez 1 mois Premium à un confrère et gagnez <span className="underline decoration-white underline-offset-4">15€ de crédit</span>.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="bg-white/10 border border-white/20 rounded-2xl px-5 py-3 flex-1 flex justify-between items-center backdrop-blur-sm">
            <span className="font-black text-sm tracking-tighter uppercase">{referralCode}</span>
            <button onClick={copyCode} className="hover:text-orange-200 transition-colors">
              <Copy size={16} />
            </button>
          </div>
          
          <div className="flex gap-4 px-2">
             <div className="text-center">
               <p className="font-black text-lg leading-none">03</p>
               <p className="text-[7px] font-black uppercase tracking-widest opacity-60">Filleuls</p>
             </div>
             <div className="w-px h-8 bg-white/20" />
             <div className="text-center">
               <p className="font-black text-lg leading-none">FREE</p>
               <p className="text-[7px] font-black uppercase tracking-widest opacity-60">Abonnement</p>
             </div>
          </div>
        </div>
      </div>
      
      <Users 
        className="absolute -bottom-6 -right-6 opacity-20 transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500" 
        size={140} 
      />
    </div>
  );
};

export default ReferralCard;
