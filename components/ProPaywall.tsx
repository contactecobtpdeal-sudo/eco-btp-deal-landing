
import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, Zap, BarChart3, Star, Loader2, CreditCard, Lock } from 'lucide-react';
import { openClubEcoBTPCheckout } from '../lib/stripe-handler';

interface ProPaywallProps {
  onSubscribe: () => void;
}

const ProPaywall: React.FC<ProPaywallProps> = ({ onSubscribe }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  const handleStripeCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Ouvrir Stripe Checkout avec période d'essai de 30 jours
      await openClubEcoBTPCheckout(email || undefined);
      // Note: Si tout se passe bien, l'utilisateur est redirigé vers Stripe
      // Cette ligne ne sera atteinte que si la redirection échoue
    } catch (err: any) {
      console.error('Erreur lors de l\'ouverture de Stripe:', err);
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
      setIsLoading(false);
    }
  };

  // Pour le mode démo, on permet aussi de continuer sans paiement
  const handleDemoSubscribe = () => {
    onSubscribe();
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
          <div className="absolute top-0 right-0 bg-orange-500 text-white px-4 py-2 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest animate-pulse">
            OFFRE DE LANCEMENT
          </div>

          {/* Bannière 1er mois offert */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center py-3 px-4 rounded-2xl -mx-2 shadow-lg">
            <p className="text-lg font-black uppercase tracking-wide">1ER MOIS OFFERT - SANS ENGAGEMENT</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Abonnement PRO</h3>

            <div className="bg-orange-50 p-4 rounded-2xl border-2 border-orange-200">
              <div className="flex items-center gap-4 justify-center">
                <div className="text-center">
                  <span className="text-3xl font-black text-green-600">0 €</span>
                  <p className="text-[10px] font-bold text-green-600 uppercase">1er mois</p>
                </div>
                <span className="text-xl text-slate-300">→</span>
                <div className="text-center">
                  <span className="text-3xl font-black text-orange-600">29,90 €</span>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">HT / mois</p>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-bold mt-2 text-center">Résiliez à tout moment pendant le mois gratuit.</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            {[
              { icon: <Zap size={18} />, text: "Réservations illimitées incluses" },
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

          {/* Champ email optionnel */}
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Email professionnel (optionnel)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@votre-entreprise.fr"
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder-slate-400 focus:border-orange-400 focus:outline-none transition-colors"
            />
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* Bouton Stripe Checkout */}
          <button
            onClick={handleStripeCheckout}
            disabled={isLoading}
            className="w-full py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-black text-lg hover:from-orange-600 hover:to-orange-700 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                <span>REDIRECTION VERS STRIPE...</span>
              </>
            ) : (
              <>
                <CreditCard size={24} />
                <span>S'INSCRIRE - PAIEMENT SÉCURISÉ</span>
              </>
            )}
          </button>

          {/* Bouton démo (pour tester sans Stripe) */}
          <button
            onClick={handleDemoSubscribe}
            className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
          >
            Mode démo (sans paiement)
          </button>

          {/* Badge sécurité */}
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <Lock size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Paiement sécurisé par Stripe</span>
          </div>
        </div>

        {/* Cartes de test */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-left">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Mode Test - Cartes de démonstration</p>
          <div className="space-y-1 text-[11px] text-blue-700 font-mono">
            <p><span className="font-bold">Succès :</span> 4242 4242 4242 4242</p>
            <p><span className="font-bold">Refusée :</span> 4000 0000 0000 0002</p>
            <p className="text-blue-500">Exp: 12/34 | CVC: 123</p>
          </div>
        </div>

        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-8">
          En continuant, vous acceptez les conditions générales de vente aux professionnels Eco-BTP Deal.
        </p>
      </div>
    </div>
  );
};

export default ProPaywall;
