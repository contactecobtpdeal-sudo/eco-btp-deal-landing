
import React from 'react';
import { Navigation, Leaf, MapPin, ArrowRight } from 'lucide-react';

interface RouteOptimizerProps {
  distance: string;
  co2Savings: string;
  address: string;
}

const RouteOptimizer: React.FC<RouteOptimizerProps> = ({ distance, co2Savings, address }) => {
  return (
    <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
        <Navigation size={80} />
      </div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="space-y-1">
          <h4 className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Optimisation Logistique</h4>
          <p className="text-xl font-black tracking-tight">{distance} de votre position</p>
        </div>
        <button className="bg-white/10 hover:bg-white/20 p-3 rounded-2xl backdrop-blur-md transition-all active:scale-90 border border-white/10 shadow-lg">
          <Navigation size={20} className="text-white" />
        </button>
      </div>

      <div className="space-y-3 relative z-10">
        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
          <MapPin size={16} className="text-orange-500" />
          <p className="text-[10px] font-bold truncate opacity-80">{address}</p>
        </div>
        
        <div className="flex items-center gap-3 bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20">
          <div className="bg-emerald-500 p-1.5 rounded-lg">
            <Leaf size={14} className="text-white" />
          </div>
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">
            Évitez {co2Savings}kg CO₂ en groupant ce retrait.
          </span>
        </div>
      </div>
    </div>
  );
};

export default RouteOptimizer;
