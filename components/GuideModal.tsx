
import React from 'react';
import { Info, ChevronRight, HardHat, Camera, Signature, X } from 'lucide-react';

interface GuideModalProps {
  onClose: () => void;
}

const GuideModal: React.FC<GuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-white z-[250] p-10 flex flex-col items-center justify-center text-center animate-in slide-in-from-bottom duration-500">
      <div className="max-w-sm w-full">
        <div className="bg-blue-50 w-20 h-20 rounded-[2rem] flex items-center justify-center text-blue-600 mb-8 mx-auto border border-blue-100 shadow-inner">
          <Info size={40} strokeWidth={2.5} />
        </div>
        
        <h2 className="text-2xl font-black uppercase italic mb-8 tracking-tighter">Guide Testeur</h2>
        
        <div className="space-y-6 text-left w-full mb-12">
          <div className="flex gap-5 items-center group">
            <div className="bg-orange-600 text-white w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 shadow-lg shadow-orange-100 group-hover:scale-110 transition-transform italic">1</div>
            <p className="text-xs font-bold text-slate-600 italic uppercase tracking-tight">Publiez vos surplus de chantier</p>
          </div>
          
          <div className="flex gap-5 items-center group">
            <div className="bg-orange-600 text-white w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 shadow-lg shadow-orange-100 group-hover:scale-110 transition-transform italic">2</div>
            <p className="text-xs font-bold text-slate-600 italic uppercase tracking-tight">Vérifiez les EPI du preneur</p>
          </div>
          
          <div className="flex gap-5 items-center group">
            <div className="bg-orange-600 text-white w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 shadow-lg shadow-orange-100 group-hover:scale-110 transition-transform italic">3</div>
            <p className="text-xs font-bold text-slate-600 italic uppercase tracking-tight">Signez pour le certificat RSE</p>
          </div>
        </div>
        
        <button 
          onClick={onClose} 
          className="w-full bg-slate-900 text-white py-5 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all border-b-4 border-slate-950"
        >
          J'AI COMPRIS <ChevronRight size={18} className="inline ml-1" />
        </button>
      </div>
      
      <div className="absolute bottom-8 py-4 text-center opacity-30">
         <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none">
           Eco-BTP Deal • Ready for Launch v3.0
         </p>
      </div>
    </div>
  );
};

export default GuideModal;
