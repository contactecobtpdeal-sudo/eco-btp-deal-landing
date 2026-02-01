
import React from 'react';
import { X, Trophy, Download, Leaf, Share2, ShieldCheck, Smartphone } from 'lucide-react';

interface RSECertificateModalProps {
  onClose: () => void;
  impact: number;
}

const RSECertificateModal: React.FC<RSECertificateModalProps> = ({ onClose, impact }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-[500] p-6 flex items-center justify-center animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 border border-slate-100">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="text-center mb-8">
          <div className="bg-orange-50 w-20 h-20 rounded-[2.5rem] flex items-center justify-center text-orange-600 mx-auto mb-4 border border-orange-100 shadow-inner">
            <Smartphone size={40} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">Impact Certifié</h2>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1 italic leading-none">Édition Mobile • v4.0</p>
        </div>

        <div className="bg-green-50 rounded-[2.5rem] p-8 mb-8 border border-green-100 text-center italic shadow-inner">
          <span className="text-[10px] font-black text-green-800 uppercase tracking-widest block mb-2 opacity-60">CO₂ Évité (ADEME)</span>
          <span className="text-5xl font-black text-green-600 tracking-tighter italic">{impact.toFixed(1)} T</span>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => alert("Génération du visuel mobile sécurisé...")}
            className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-[11px] flex items-center justify-center gap-3 uppercase tracking-widest shadow-xl shadow-blue-100 active:scale-95 transition-all border-b-4 border-blue-800"
          >
            <Share2 size={18} /> PARTAGER L'IMPACT
          </button>
          
          <button 
            onClick={() => alert("Téléchargement du certificat RSE...")}
            className="w-full bg-slate-900 text-white py-4 rounded-[1.5rem] font-black text-[10px] flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg active:scale-95 transition-all"
          >
            <Download size={16} /> TÉLÉCHARGER LE PDF
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-slate-300">
          <ShieldCheck size={14} />
          <p className="text-[8px] font-black uppercase tracking-[0.2em]">Données certifiées • Eco-BTP Deal</p>
        </div>
      </div>
    </div>
  );
};

export default RSECertificateModal;
