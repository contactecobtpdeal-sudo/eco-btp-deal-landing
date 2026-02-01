
import React from 'react';
import { Zap, Info } from 'lucide-react';
import { MaterialType } from '../types';

const CO2_FACTORS = {
  concrete: 0.15, // kg CO2 par kg de béton
  steel: 1.85, // kg CO2 par kg d'acier
  wood: 0.50, // kg CO2 par kg de bois (évité via décharge)
  default: 0.35 // Moyenne mixte pour autres matériaux
};

interface CarbonImpactWidgetProps {
  weight: number;
  materialType?: MaterialType;
  compact?: boolean;
}

const CarbonImpactWidget: React.FC<CarbonImpactWidgetProps> = ({ weight, materialType = 'default', compact = false }) => {
  const factor = CO2_FACTORS[materialType] || CO2_FACTORS.default;
  const co2Saved = (weight * factor).toFixed(1);

  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
        <Zap size={10} className="text-emerald-500 fill-emerald-500" />
        <span className="text-[10px] font-black text-emerald-700 uppercase">-{co2Saved}kg CO₂</span>
      </div>
    );
  }

  return (
    <div className="bg-emerald-50 border-2 border-emerald-100 p-5 rounded-[2rem] shadow-sm animate-in zoom-in-95">
      <div className="flex items-center gap-4">
        <div className="bg-emerald-500 p-3 rounded-2xl text-white shadow-lg shadow-emerald-100">
          <Zap size={24} fill="white" />
        </div>
        <div>
          <h4 className="text-[10px] font-black text-emerald-800 uppercase tracking-widest leading-none">Bilan Carbone Évité</h4>
          <p className="text-2xl font-black text-emerald-600 tracking-tighter mt-1">{co2Saved} kg de CO₂</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-emerald-100/50 flex items-start gap-2">
        <Info size={14} className="text-emerald-400 mt-0.5" />
        <p className="text-[10px] text-emerald-700 font-bold leading-relaxed uppercase tracking-tight">
          C'est l'équivalent de l'absorption annuelle de {Math.ceil(parseFloat(co2Saved) / 25)} arbres matures 🌳
        </p>
      </div>
    </div>
  );
};

export default CarbonImpactWidget;
