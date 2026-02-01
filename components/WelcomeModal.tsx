
import React from 'react';
import { Mail, ChevronRight, X, ShieldCheck, Lock, CheckCircle } from 'lucide-react';

interface WelcomeModalProps {
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-center justify-center p-6 text-center animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] p-10 w-full max-w-sm shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-500 relative overflow-hidden">
        {/* Decorative safety gradient */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-50 rounded-full blur-3xl opacity-50" />
        
        <div className="bg-orange-50 w-24 h-24 rounded-[2.5rem] flex items-center justify-center text-orange-600 mb-8 mx-auto border border-orange-100 shadow-inner transform rotate-3 hover:rotate-0 transition-transform duration-500">
          <Mail size={48} strokeWidth={1.5} className="animate-bounce" />
        </div>
        
        <div className="space-y-1 mb-2">
          <h2 className="text-xl font-black uppercase tracking-tighter italic text-slate-900 leading-none">Bienvenue chez</h2>
          <h3 className="text-3xl font-black text-orange-600 mb-2 italic tracking-tighter uppercase leading-none">ECO-BTP DEAL</h3>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase mb-10 tracking-[0.4em] italic leading-none">Phase de Lancement • v3.0</p>
        
        <div className="space-y-6 mb-12 text-left">
          <div className="flex items-start gap-4 group">
            <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600 transition-transform group-hover:scale-110 shadow-sm">
              <Lock size={20} />
            </div>
            <p className="text-[11px] font-bold text-slate-600 leading-tight uppercase tracking-tight">
              Données protégées par notre <span className="text-blue-600 underline decoration-2 underline-offset-2 font-black">Politique RGPD France</span>.
            </p>
          </div>
          <div className="flex items-start gap-4 group">
            <div className="bg-green-50 p-2.5 rounded-xl text-green-600 transition-transform group-hover:scale-110 shadow-sm">
              <CheckCircle size={20} />
            </div>
            <p className="text-[11px] font-bold text-slate-600 leading-tight uppercase tracking-tight">
              Certificats de traçabilité carbone automatisés pour vos rapports RSE.
            </p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-orange-600 text-white py-6 rounded-[2rem] font-black text-xs shadow-2xl shadow-orange-100 uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-orange-700 border-b-4 border-orange-800"
        >
          DÉMARRER L'AVENTURE <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;
