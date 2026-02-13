
import React from 'react';
import { Star, MessageSquare, ChevronRight, Zap } from 'lucide-react';

interface FeedbackCardProps {
  onOpenForm: () => void;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ onOpenForm }) => {
  return (
    <div className="bg-orange-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-orange-100 relative overflow-hidden group border-b-4 border-orange-800 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Decorative icon */}
      <div className="absolute -right-6 -top-6 opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
        <Star size={160} fill="currentColor" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md mb-4 shadow-inner">
          <Star size={28} fill="currentColor" className="text-white" />
        </div>
        
        <h3 className="text-xl font-black uppercase tracking-tighter italic leading-none">Votre avis nous aide !</h3>
        <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mt-2 mb-6 italic">Eco-BTP Deal • v3.0</p>
        
        <p className="text-xs font-bold leading-relaxed mb-8 max-w-[240px]">
          Une idée d'amélioration ? Un bug identifié ? <br/> 
          Aidez l'équipe Eco-BTP à bâtir le futur du réemploi.
        </p>

        <button 
          onClick={onOpenForm}
          className="bg-white text-orange-600 px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
        >
          <MessageSquare size={16} fill="currentColor" /> 
          DONNER MON AVIS
        </button>
      </div>
      
      {/* Bottom badge */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-30">
        <div className="flex items-center gap-1">
          <Zap size={10} fill="currentColor" />
          <span className="text-[7px] font-black uppercase tracking-widest">Feedback Accelerator Active</span>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;
