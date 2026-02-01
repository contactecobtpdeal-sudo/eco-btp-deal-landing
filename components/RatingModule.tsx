
import React, { useState } from 'react';
import { Star, MessageSquare, Send } from 'lucide-react';

interface RatingModuleProps {
  onRatingSubmit: (rating: number, comment: string) => void;
  targetName: string;
}

const RatingModule: React.FC<RatingModuleProps> = ({ onRatingSubmit, targetName }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hovered, setHovered] = useState(0);

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-slate-100 my-6 animate-in zoom-in-95">
      <div className="text-center space-y-2 mb-6">
        <h3 className="font-black text-lg text-slate-900 uppercase tracking-tighter">Évaluer le retrait</h3>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Votre avis sur {targetName}</p>
      </div>

      <div className="flex justify-center gap-3 mb-8">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setRating(s)}
            className={`transition-all transform active:scale-75 ${
              s <= (hovered || rating) ? 'text-yellow-400 scale-110' : 'text-slate-200'
            }`}
          >
            <Star size={36} fill={s <= (hovered || rating) ? "currentColor" : "none"} strokeWidth={2.5} />
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="relative">
          <MessageSquare className="absolute top-4 left-4 text-slate-300" size={18} />
          <textarea 
            placeholder="Matériel conforme ? Chantier facile d'accès ? Laissez un mot..." 
            className="w-full bg-slate-50 p-4 pl-12 rounded-[1.5rem] text-xs font-bold outline-none border-2 border-slate-100 focus:border-orange-500 transition-all h-28 resize-none"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        
        <button 
          onClick={() => onRatingSubmit(rating, comment)}
          disabled={rating === 0}
          className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-orange-100 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
        >
          PUBLIER MON AVIS
        </button>
      </div>
    </div>
  );
};

export default RatingModule;
