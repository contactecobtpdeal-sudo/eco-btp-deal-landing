
import React, { useState } from 'react';
import { 
  Users, CheckCircle, XCircle, FileText, Activity, 
  ShieldCheck, Download, Search, Settings, ArrowUpRight, 
  BarChart3, ShieldAlert, Zap, Leaf, Building2, Trash2, Camera, Clock, Signature
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [pendingPros, setPendingPros] = useState([
    { id: 1, name: "BatiPro IDF", siret: "842 551 223 00014", date: "20/01/2026", status: "En attente" },
    { id: 2, name: "Menuiserie Durand", siret: "410 882 110 00052", date: "19/01/2026", status: "En attente" },
    { id: 3, name: "GrosOeuvre SAS", siret: "332 114 990 00018", date: "18/01/2026", status: "En attente" }
  ]);

  const handleApprove = (id: number) => {
    setPendingPros(prev => prev.filter(p => p.id !== id));
    alert("Entreprise approuvée et badge KBIS activé.");
  };

  const mockEvidences = [
    { id: 1, img: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=400", label: "Lot #4032", status: "Validé" },
    { id: 2, img: "https://images.unsplash.com/photo-1581094288338-2314dddb7bc3?q=80&w=400", label: "Lot #4031", status: "En cours" },
    { id: 3, img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=400", label: "Lot #4030", status: "Validé" },
    { id: 4, img: "https://images.unsplash.com/photo-1590069230002-70cc6a47ee02?q=80&w=400", label: "Lot #4029", status: "A vérifier" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex text-slate-900 animate-in fade-in duration-500">
      
      {/* SIDEBAR ARTISAN MAITRE */}
      <aside className="w-64 bg-slate-900 text-white p-8 flex flex-col gap-10 sticky top-0 h-screen shadow-2xl">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-orange-500 italic uppercase tracking-tighter leading-none">Eco-Admin</h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Console Maître</p>
        </div>

        <nav className="space-y-2">
          <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest bg-white/10 w-full p-4 rounded-2xl border border-white/5 shadow-inner">
            <Activity size={18} className="text-orange-500" /> Overview
          </button>
          <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 w-full p-4 transition-all hover:bg-white/5 rounded-2xl">
            <ShieldCheck size={18} /> Validations Kbis
          </button>
          <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 w-full p-4 transition-all hover:bg-white/5 rounded-2xl">
            <FileText size={18} /> Preuves Terrain
          </button>
          <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 w-full p-4 transition-all hover:bg-white/5 rounded-2xl">
            <Download size={18} /> Reporting RSE
          </button>
        </nav>

        <div className="mt-auto p-5 bg-orange-600/10 border border-orange-600/20 rounded-2xl">
          <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">Statut Système</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-tight text-orange-200">Infrastructure Active</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-12 space-y-10">
        
        {/* STATS HEADER */}
        <div className="grid grid-cols-3 gap-8 text-center">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden group">
            <Leaf className="absolute -right-6 -bottom-6 text-green-500/5 group-hover:scale-110 transition-transform" size={120} />
            <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest italic">Impact Global</p>
            <h2 className="text-5xl font-black text-green-600 italic tracking-tighter leading-none">14.5 T</h2>
          </div>
          
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden group">
            <Signature className="absolute -right-6 -bottom-6 text-slate-500/5 group-hover:scale-110 transition-transform" size={120} />
            <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest italic">Bons Signés</p>
            <h2 className="text-5xl font-black text-slate-900 italic tracking-tighter leading-none">124</h2>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden group">
            <ShieldAlert className="absolute -right-6 -bottom-6 text-orange-500/5 group-hover:scale-110 transition-transform" size={120} />
            <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest italic">Alertes Kbis</p>
            <h2 className="text-5xl font-black text-orange-600 italic tracking-tighter leading-none">02</h2>
          </div>
        </div>

        {/* SURVEILLANCE DES PREUVES TERRAIN */}
        <section className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-8 space-y-6">
           <div className="flex justify-between items-center">
              <h3 className="font-black text-sm uppercase italic flex items-center gap-3">
                <Camera className="text-orange-600" size={22}/> 
                Surveillance des preuves terrain
              </h3>
              <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-orange-500">Flux en direct</button>
           </div>
           
           <div className="grid grid-cols-4 gap-6">
              {mockEvidences.map(evidence => (
                <div key={evidence.id} className="group relative aspect-square bg-slate-50 rounded-[2rem] border-2 border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer">
                  <img src={evidence.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-4 left-4 right-4 text-white translate-y-2 group-hover:translate-y-0 transition-transform">
                    <p className="text-[10px] font-black uppercase tracking-widest italic">{evidence.label}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${evidence.status === 'Validé' ? 'bg-green-400' : 'bg-amber-400'}`} />
                      <p className="text-[8px] font-black uppercase opacity-80 italic tracking-tight">{evidence.status}</p>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </section>

        {/* TOUR DE CONTROLE ACTIVE */}
        <div className="py-20 text-center space-y-6">
           <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-slate-300 animate-pulse">
              <ShieldCheck size={48} />
           </div>
           <h3 className="text-4xl font-black italic text-slate-300 uppercase tracking-tighter">Tour de Contrôle Active</h3>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Toutes les infrastructures opérationnelles</p>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;
