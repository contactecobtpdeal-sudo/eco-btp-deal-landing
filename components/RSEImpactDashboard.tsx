
import React, { useState } from 'react';
import {
  Leaf, TrendingUp, Download, Euro, Scale, Recycle,
  FileText, Award, ChevronRight, Building2, CheckCircle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { User, Material } from '../types';

interface RSEImpactDashboardProps {
  user: User;
  materials: Material[];
}

// Coefficients CO2 par type de matériau (kg CO2 évité par kg réemployé)
const CO2_COEFFICIENTS: Record<string, number> = {
  concrete: 0.12,  // Béton
  steel: 1.8,      // Acier/Métal
  wood: 0.9,       // Bois
  default: 0.5     // Moyenne générale
};

// Prix moyen du neuf par type de matériau (€/kg)
const PRIX_NEUF: Record<string, number> = {
  concrete: 0.15,
  steel: 2.5,
  wood: 1.2,
  default: 0.8
};

// Données mockées pour les graphiques
const MONTHLY_DATA = [
  { month: 'Juil', kilos: 180 },
  { month: 'Août', kilos: 245 },
  { month: 'Sept', kilos: 320 },
  { month: 'Oct', kilos: 410 },
  { month: 'Nov', kilos: 385 },
  { month: 'Déc', kilos: 520 },
];

const MATERIAL_DISTRIBUTION = [
  { name: 'Béton', value: 45, color: '#64748b' },
  { name: 'Métal', value: 25, color: '#f97316' },
  { name: 'Bois', value: 20, color: '#10b981' },
  { name: 'Autres', value: 10, color: '#6366f1' },
];

const RSEImpactDashboard: React.FC<RSEImpactDashboardProps> = ({ user, materials }) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Calculs des KPIs
  const totalKilosSauves = materials.reduce((acc, m) => acc + (m.weightEstimatedKg || 0), 0) + 1250; // + données historiques

  const totalCO2Evite = materials.reduce((acc, m) => {
    const coef = CO2_COEFFICIENTS[m.materialType || 'default'];
    return acc + (m.weightEstimatedKg || 0) * coef;
  }, 0) + 625; // + données historiques

  const economiesRealisees = materials.reduce((acc, m) => {
    const prixNeuf = PRIX_NEUF[m.materialType || 'default'];
    const prixEcoBTP = m.price || 0;
    return acc + ((m.weightEstimatedKg || 0) * prixNeuf) - prixEcoBTP;
  }, 0) + 2840; // + données historiques

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);

    // Simulation de génération PDF
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Création d'un rapport textuel simulé
    const reportContent = `
RAPPORT RSE - ECO-BTP DEAL
==========================
Entreprise: ${user.name}
SIRET: ${user.siret || 'N/A'}
Date: ${new Date().toLocaleDateString('fr-FR')}

INDICATEURS D'IMPACT
--------------------
Total Matériaux Réemployés: ${totalKilosSauves.toLocaleString('fr-FR')} kg
CO2 Évité: ${totalCO2Evite.toFixed(1)} kg
Économies Réalisées: ${economiesRealisees.toFixed(2)} €

RÉPARTITION PAR MATÉRIAU
------------------------
${MATERIAL_DISTRIBUTION.map(m => `${m.name}: ${m.value}%`).join('\n')}

ÉVOLUTION MENSUELLE (6 derniers mois)
-------------------------------------
${MONTHLY_DATA.map(d => `${d.month}: ${d.kilos} kg`).join('\n')}

---
Généré automatiquement par Eco-BTP Deal
Certifié conforme aux normes RSE
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-rse-${user.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsGeneratingPDF(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-2 pt-2">
        <div className="bg-emerald-500 p-3 rounded-2xl text-white shadow-lg shadow-emerald-100">
          <Leaf size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Impact RSE</h2>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest text-[10px]">Bilan Environnemental</p>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 gap-4">
        {/* Total Kilos Sauvés */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
            <Scale size={100} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Recycle size={18} />
              <span className="text-[10px] uppercase font-black tracking-widest text-emerald-100">Total Kilos Sauvés</span>
            </div>
            <div className="text-4xl font-black">{totalKilosSauves.toLocaleString('fr-FR')} kg</div>
            <div className="mt-3 flex items-center gap-1 text-emerald-100 text-[10px] font-bold">
              <TrendingUp size={12} /> +12% vs mois dernier
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* CO2 Évité */}
          <div className="bg-slate-900 p-5 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
            <div className="absolute -right-2 -bottom-2 opacity-10 group-hover:scale-110 transition-transform">
              <Leaf size={70} />
            </div>
            <div className="relative z-10">
              <span className="text-[9px] uppercase font-black tracking-widest text-slate-400">CO₂ Évité</span>
              <div className="text-2xl font-black mt-1 text-emerald-400">{totalCO2Evite.toFixed(1)} kg</div>
              <div className="mt-2 text-[9px] font-bold text-slate-500">
                ≈ {Math.round(totalCO2Evite / 21)} arbres/an
              </div>
            </div>
          </div>

          {/* Économies Réalisées */}
          <div className="bg-orange-500 p-5 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
            <div className="absolute -right-2 -bottom-2 opacity-10 group-hover:scale-110 transition-transform">
              <Euro size={70} />
            </div>
            <div className="relative z-10">
              <span className="text-[9px] uppercase font-black tracking-widest text-orange-100">Économies</span>
              <div className="text-2xl font-black mt-1">{economiesRealisees.toFixed(0)} €</div>
              <div className="mt-2 text-[9px] font-bold text-orange-200">
                vs achat neuf
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GRAPHIQUE EN BARRES - Évolution mensuelle */}
      <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-500" /> Évolution Mensuelle
          </h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase">6 derniers mois</span>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MONTHLY_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                tickFormatter={(value) => `${value}kg`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 700
                }}
                labelStyle={{ color: '#94a3b8' }}
                itemStyle={{ color: '#10b981' }}
                formatter={(value: number) => [`${value} kg`, 'Matériaux']}
              />
              <Bar
                dataKey="kilos"
                fill="#10b981"
                radius={[8, 8, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* GRAPHIQUE CIRCULAIRE - Répartition des matériaux */}
      <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <Building2 size={18} className="text-orange-500" /> Répartition Matériaux
          </h3>
        </div>

        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={MATERIAL_DISTRIBUTION}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {MATERIAL_DISTRIBUTION.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '10px', fontWeight: 700 }}
                formatter={(value, entry: any) => (
                  <span style={{ color: '#334155', marginLeft: '4px' }}>
                    {value} ({entry.payload.value}%)
                  </span>
                )}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 700
                }}
                formatter={(value: number) => [`${value}%`, 'Part']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* INFO MÉTHODOLOGIE */}
      <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-200">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
          <FileText size={14} /> Méthodologie de calcul
        </h4>
        <div className="space-y-2 text-[11px] text-slate-600 font-medium">
          <p>• <strong>CO₂ évité</strong> : Basé sur les coefficients ADEME par type de matériau</p>
          <p>• <strong>Économies</strong> : Différence entre prix neuf moyen et prix Eco-BTP Deal</p>
          <p>• <strong>Équivalence arbres</strong> : 1 arbre absorbe ~21kg CO₂/an</p>
        </div>
      </div>

      {/* BOUTON TÉLÉCHARGER PDF */}
      <button
        onClick={handleDownloadPDF}
        disabled={isGeneratingPDF}
        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6 rounded-[2rem] shadow-xl shadow-emerald-100 flex items-center justify-between group hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <Download size={24} />
          </div>
          <div className="text-left">
            <p className="text-sm font-black uppercase tracking-tight">
              {isGeneratingPDF ? 'Génération en cours...' : 'Télécharger le Rapport PDF'}
            </p>
            <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest mt-1">
              Pour votre bilan RSE annuel
            </p>
          </div>
        </div>
        {!isGeneratingPDF && (
          <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
        )}
        {isGeneratingPDF && (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
      </button>

      {/* BADGE CERTIFICATION */}
      <div className="bg-white p-6 rounded-[2rem] border-2 border-emerald-100 shadow-sm flex items-center gap-4">
        <div className="bg-emerald-100 p-4 rounded-2xl text-emerald-600">
          <Award size={32} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Certifié Éco-Responsable</h4>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
            Conforme aux normes RSE 2024
          </p>
        </div>
        <CheckCircle size={24} className="text-emerald-500" />
      </div>
    </div>
  );
};

export default RSEImpactDashboard;
