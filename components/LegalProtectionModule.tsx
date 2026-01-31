
import React from 'react';
import { Shield, FileText, Lock, ShieldCheck } from 'lucide-react';

const LegalProtectionModule: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 space-y-5">
      <div className="flex items-center gap-4">
        <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 shadow-sm">
          <Lock size={20} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-xs font-black uppercase tracking-tight text-slate-900 leading-none">Données Sécurisées</h3>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Hébergement conforme RGPD (France)</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => alert("Chargement des CGU...")}
          className="flex items-center justify-center gap-2 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
        >
          <FileText size={14} /> CGU
        </button>
        <button 
          onClick={() => alert("Chargement de la Privacy Policy...")}
          className="flex items-center justify-center gap-2 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
        >
          <ShieldCheck size={14} /> PRIVACY
        </button>
      </div>

      <div className="pt-2">
        <div className="bg-slate-900/5 p-4 rounded-2xl flex items-start gap-3 border border-slate-100">
          <Shield size={16} className="text-blue-500 mt-0.5 shrink-0" />
          <p className="text-[9px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
            Chaque transaction est couverte par nos conditions de cession de matériaux "en l'état" pour limiter votre responsabilité.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LegalProtectionModule;
