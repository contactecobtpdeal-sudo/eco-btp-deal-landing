
import React from 'react';
import { Map, TrendingUp, Users, Building2, Leaf, Award, ChevronRight, BarChart3 } from 'lucide-react';

const TerritorialStats: React.FC = () => {
  const topChantiers = [
    { name: "Eco-Quartier Flaubert", impact: "4.2 T", rank: 1, trend: "+12%" },
    { name: "Rénovation Lycée Hugo", impact: "2.8 T", rank: 2, trend: "+5%" },
    { name: "BatiConstruct Site A", impact: "1.5 T", rank: 3, trend: "stable" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center gap-3 mb-2 pt-2">
        <div className="bg-orange-500 p-3 rounded-2xl text-white shadow-lg shadow-orange-100">
          <Map size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Impact Local</h2>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest text-[10px]">Secteur : Paris & Île-de-France</p>
        </div>
      </div>

      {/* GRILLE D'IMPACT TERRITORIAL */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp size={100} />
          </div>
          <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Matériaux Sauvés</span>
          <div className="text-3xl font-black mt-2">145,2 T</div>
          <div className="mt-4 flex items-center gap-1 text-green-400 text-[10px] font-bold">
            <TrendingUp size={12} /> +8% ce mois
          </div>
        </div>
        
        <div className="bg-green-600 p-6 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
            <Leaf size={100} />
          </div>
          <span className="text-[10px] uppercase font-black tracking-widest text-green-200">CO2 Évité</span>
          <div className="text-3xl font-black mt-2">84,1 T</div>
          <div className="mt-4 flex items-center gap-1 text-white text-[10px] font-bold">
            Équiv. 1200 arbres 🌳
          </div>
        </div>
      </div>

      {/* CHARTS SIMULATION */}
      <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <BarChart3 size={18} className="text-orange-500" /> Répartition du réemploi
          </h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase">30 derniers jours</span>
        </div>
        
        <div className="space-y-4">
          {[
            { label: 'Gros Œuvre', value: '65%', color: 'bg-orange-500' },
            { label: 'Second Œuvre', value: '20%', color: 'bg-slate-800' },
            { label: 'Bois / Menuiserie', value: '15%', color: 'bg-green-500' },
          ].map((item, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                <span className="text-slate-500">{item.label}</span>
                <span className="text-slate-900">{item.value}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${item.color} rounded-full`} style={{ width: item.value }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TOP DES CHANTIERS ÉCO-RESPONSABLES */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Top Chantiers Engagés</h3>
          <button className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-1">
            Voir tout <ChevronRight size={12} />
          </button>
        </div>
        
        <div className="bg-white rounded-[2rem] border-2 border-slate-200 overflow-hidden shadow-sm divide-y-2 divide-slate-100">
          {topChantiers.map((chantier, i) => (
            <div key={i} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                  i === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  #{chantier.rank}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{chantier.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase tracking-tighter">
                      {chantier.impact} sauvés
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      {chantier.trend}
                    </span>
                  </div>
                </div>
              </div>
              <Award size={20} className={i === 0 ? 'text-amber-500' : 'text-slate-200'} />
            </div>
          ))}
        </div>
      </div>

      {/* COMMUNITARY CTA */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-orange-100 text-center space-y-4">
        <Users size={40} className="mx-auto opacity-80" />
        <h3 className="text-xl font-black uppercase tracking-tighter">Faites monter votre ville !</h3>
        <p className="text-sm font-medium opacity-90 px-4">Plus vous publiez de surplus, plus le score RSE de votre commune augmente.</p>
        <button className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-transform active:scale-95">
          Partager l'initiative
        </button>
      </div>
    </div>
  );
};

export default TerritorialStats;
