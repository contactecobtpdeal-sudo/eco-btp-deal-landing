
import React, { useState } from 'react';
import { CheckCircle2, Loader2, ShieldCheck, Zap, BarChart3, Star } from 'lucide-react';

interface ProPaywallProps {
  onSubscribe: () => void;
}

const ProPaywall: React.FC<ProPaywallProps> = ({ onSubscribe }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSubscribe();
    }, 2000);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 animate-in fade-in duration-700">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tighter uppercase">
            Boostez votre RSE et <br />
            <span className="text-orange-500 underline decoration-slate-900 underline-offset-4">videz vos chantiers</span>
          </h2>
          <p className="text-slate-500 font-medium px-4">
            Rejoignez la communauté Eco-BTP Deal et transformez vos déchets en opportunités circulaires.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="bg-white rounded-[2.5rem] border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] p-8 text-left space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-slate-900 text-white px-4 py-2 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest">
            OFFRE PRO
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Abonnement Entreprise</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-slate-900">9,99 €</span>
              <span className="text-slate-500 font-bold">/ mois HT</span>
            </div>
            <p className="text-xs font-bold text-orange-600 uppercase tracking-tighter">Sans engagement. 1er mois offert.</p>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            {[
              { icon: <Zap size={18} />, text: "Dépôt d'annonces illimité" },
              { icon: <ShieldCheck size={18} />, text: "Certificats de traçabilité déchets" },
              { icon: <BarChart3 size={18} />, text: "Tableau de bord de stats RSE" },
              { icon: <Star size={18} />, text: "Badge 'Entreprise Éco-Responsable'" },
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="text-green-500">
                  <CheckCircle2 size={20} fill="currentColor" className="text-white stroke-green-500" />
                </div>
                <span className="text-sm font-bold text-slate-700">{benefit.text}</span>
              </div>
            ))}
          </div>

          <button 
            disabled={isLoading}
            onClick={handleSubscribe}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>ACTIVATION DU COMPTE...</span>
              </>
            ) : (
              'DÉMARRER MON ESSAI GRATUIT'
            )}
          </button>
        </div>

        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-8">
          En continuant, vous acceptez les conditions générales de vente aux professionnels Eco-BTP Deal.
        </p>
      </div>
    </div>
  );
};

export default ProPaywall;
