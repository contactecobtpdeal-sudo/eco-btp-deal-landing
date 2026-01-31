
import React, { useState } from 'react';
import { 
  QrCode, CheckCircle, ArrowRight, Trash2, MessageCircle, Leaf, Star, 
  HardHat, Signature, FileCheck, ShieldCheck, Megaphone, Share2, Users, 
  Trophy, Download, Camera, ChevronRight, Smartphone 
} from 'lucide-react';
import { User, Material, ListingStatus } from '../types';
import CarbonImpactWidget from './CarbonImpactWidget';
import ReferralCard from './ReferralCard';
import LegalProtectionModule from './LegalProtectionModule';
import PickupSlip from './PickupSlip';
import RSECertificateModal from './RSECertificateModal';

interface ProDashboardProps {
  user: User;
  materials: Material[];
  onUpdateStatus?: (id: string, status: ListingStatus) => void;
  onDelete?: (id: string) => void;
  onOpenChat?: () => void;
  unreadMessages?: number;
}

const QuickPhotoButton = ({ onAction }: { onAction: () => void }) => (
  <button 
    onClick={onAction}
    className="w-full bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between group active:scale-95 transition-all"
  >
    <div className="flex items-center gap-4 italic text-left">
      <div className="bg-orange-100 p-3 rounded-2xl text-orange-600 group-hover:scale-110 transition-transform">
        <Camera size={24} strokeWidth={2.5} />
      </div>
      <div>
        <h4 className="text-xs font-black uppercase text-slate-900 tracking-tight leading-none">Preuve Terrain</h4>
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Scanner un lot</p>
      </div>
    </div>
    <ChevronRight className="text-gray-300 group-hover:translate-x-1 transition-transform" />
  </button>
);

const ImpactCertCard = ({ onAction }: { onAction: () => void }) => (
  <div className="bg-gray-900 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden group border-b-4 border-slate-950">
    <Leaf className="absolute -right-6 -bottom-6 text-green-500/10 group-hover:scale-110 transition-transform" size={140} />
    <div className="relative z-10 text-left">
      <h3 className="text-xs font-black uppercase text-orange-400 mb-2 tracking-widest italic leading-none">Ma Performance RSE</h3>
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-3xl font-black italic tracking-tighter">1.2 T</span>
        <span className="text-[10px] font-bold uppercase opacity-50 tracking-widest leading-none">CO₂ Évité</span>
      </div>
      <button 
        onClick={onAction} 
        className="bg-white text-gray-900 px-8 py-3 rounded-full text-[10px] font-black uppercase flex items-center gap-2 tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
      >
        <Smartphone size={14} /> VOIR CERTIFICAT
      </button>
    </div>
  </div>
);

const ProDashboard: React.FC<ProDashboardProps> = ({ user, materials, onUpdateStatus, onDelete, onOpenChat, unreadMessages = 0 }) => {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | undefined>(undefined);
  const [showSlip, setShowSlip] = useState(false);
  const [showRSESummary, setShowRSESummary] = useState(false);

  const handleScanClick = () => {
    alert("Ouverture du scanner photo pour validation terrain...");
  };

  const handleSignSlip = (material: Material) => {
    setSelectedMaterial(material);
    setShowSlip(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-start">
        <div className="pt-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none italic uppercase">Tableau de bord</h2>
          <div className="flex items-center gap-1.5 mt-2 text-slate-400">
            <ShieldCheck size={12} strokeWidth={3} className="text-green-500" />
            <span className="text-[9px] font-black uppercase tracking-widest italic leading-none">Accès Pro Vérifié</span>
          </div>
        </div>
        <button 
          onClick={onOpenChat}
          className="mt-2 p-3 bg-white border-2 border-slate-100 rounded-2xl text-slate-600 relative hover:border-orange-500 transition-all shadow-sm active:scale-95"
        >
          <MessageCircle size={24} />
          {unreadMessages > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white animate-bounce">
              {unreadMessages}
            </span>
          )}
        </button>
      </div>

      {/* QUICK ACTIONS MOBILE FINAL */}
      <QuickPhotoButton onAction={handleScanClick} />
      
      <ImpactCertCard onAction={() => setShowRSESummary(true)} />

      {/* ACTIVE LISTINGS */}
      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-end px-2">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none italic">Lots Actifs</h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{materials.length} annonces</span>
        </div>
        <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 overflow-hidden shadow-sm divide-y-2 divide-slate-100">
          {materials.map(material => (
            <div key={material.id} className="p-5 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-1 items-center gap-4">
                  <img src={material.photoUrl} className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-sm" />
                  <div className="flex-1">
                    <h4 className="font-black text-sm text-slate-900 leading-tight uppercase tracking-tighter italic">{material.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-green-200 text-green-600 bg-green-50 tracking-wider">
                        {material.status}
                      </div>
                      <CarbonImpactWidget weight={material.weightEstimatedKg} materialType={material.materialType} compact />
                    </div>
                  </div>
                </div>
                <button onClick={() => onDelete?.(material.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all active:scale-90"><Trash2 size={18} /></button>
              </div>
              
              {material.status === ListingStatus.RESERVED && (
                <button 
                  onClick={() => handleSignSlip(material)}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl flex items-center justify-between px-6 shadow-xl hover:bg-orange-600 transition-all border-b-4 border-slate-950 hover:border-orange-700 active:scale-95 group"
                >
                  <div className="flex items-center gap-3">
                    <Signature size={20} className="group-hover:rotate-12 transition-transform" />
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-widest leading-none italic">Signer le Bon de Retrait</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Validation terrain</p>
                    </div>
                  </div>
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <ReferralCard />
      <LegalProtectionModule />

      {showSlip && selectedMaterial && (
        <PickupSlip 
          material={selectedMaterial} 
          onClose={() => setShowSlip(false)} 
          onSigned={() => {
            onUpdateStatus?.(selectedMaterial.id, ListingStatus.COLLECTED);
            setShowSlip(false);
          }} 
        />
      )}

      {showRSESummary && (
        <RSECertificateModal 
          impact={1.2} 
          onClose={() => setShowRSESummary(false)} 
        />
      )}
    </div>
  );
};

export default ProDashboard;
