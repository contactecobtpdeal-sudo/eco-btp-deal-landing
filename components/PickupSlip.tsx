
import React, { useState } from 'react';
import { X, Signature, Camera, ShieldCheck, Info, CheckCircle, ChevronRight, Download } from 'lucide-react';
import { Material } from '../types';

interface PickupSlipProps {
  material: Material;
  onClose: () => void;
  onSigned: () => void;
}

const PickupSlip: React.FC<PickupSlipProps> = ({ material, onClose, onSigned }) => {
  const [isSigned, setIsSigned] = useState(false);
  const [photoProof, setPhotoProof] = useState<string | null>(null);

  const handleSignature = () => {
    setIsSigned(true);
    setTimeout(() => {
      onSigned();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[400] bg-white flex flex-col animate-in slide-in-from-right duration-500">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-2 rounded-xl text-white">
            <Signature size={20} />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tighter italic">Bon de Retrait</h2>
        </div>
        <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
        {/* Info Lot */}
        <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-slate-100 space-y-4">
          <div className="flex items-center gap-4">
            <img src={material.photoUrl} className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm" />
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Lot n°{material.id}</p>
              <h4 className="font-black text-sm uppercase tracking-tight text-slate-900 mt-1">{material.title}</h4>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-2 border-t border-slate-200 pt-4">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-slate-400 uppercase">Donneur :</span>
              <span className="text-slate-900 font-black italic">{material.proName}</span>
            </div>
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-slate-400 uppercase">Preneur :</span>
              <span className="text-slate-900 font-black italic">Particulier Vérifié (ID: 8821)</span>
            </div>
          </div>
        </div>

        {/* Legal Clause */}
        <div className="p-6 bg-blue-50 rounded-[2rem] border-2 border-blue-100 flex items-start gap-4">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-md">
            <ShieldCheck size={18} />
          </div>
          <p className="text-[11px] font-bold text-blue-900 italic leading-relaxed uppercase tracking-tight">
            "En signant ce document numérique, le preneur atteste avoir pris possession des matériaux décrits ci-dessus en l'état. Il accepte le transfert de garde et de responsabilité, dégageant le donneur de toute réclamation ultérieure."
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button 
            onClick={() => setPhotoProof('https://images.unsplash.com/photo-1581094288338-2314dddb7bc3?q=80&w=400')}
            className={`w-full py-5 rounded-2xl border-2 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${photoProof ? 'bg-green-50 border-green-500 text-green-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
          >
            {photoProof ? <CheckCircle size={18} /> : <Camera size={18} />}
            {photoProof ? 'PHOTO PREUVE ENREGISTRÉE' : 'PRENDRE UNE PHOTO DU LOT'}
          </button>

          {!isSigned ? (
            <button 
              onClick={handleSignature}
              className="w-full bg-orange-600 text-white py-6 rounded-[2rem] font-black text-sm shadow-2xl shadow-orange-100 uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 hover:bg-orange-700 transition-all border-b-4 border-orange-800"
            >
              SIGNATURE NUMÉRIQUE ✍️
            </button>
          ) : (
            <div className="w-full bg-green-600 text-white py-6 rounded-[2rem] font-black text-sm uppercase flex items-center justify-center gap-3 animate-pulse">
              <CheckCircle size={20} /> TRANSACTION VALIDÉE
            </div>
          )}
        </div>
      </div>

      <div className="p-6 border-t border-slate-100 bg-white sticky bottom-0">
         <p className="text-[9px] font-black text-slate-400 uppercase text-center tracking-widest">
            Document certifié Eco-BTP Deal • Valeur Juridique France
         </p>
      </div>
    </div>
  );
};

export default PickupSlip;
