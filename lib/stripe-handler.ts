/**
 * Stripe Checkout Handler pour Eco-BTP Deal
 *
 * Configuration des abonnements :
 * - Abonnement Club Eco-BTP : 29,90 € HT / mois
 * - Offre Spéciale : 1er mois à 0 € (période d'essai configurée dans Stripe Dashboard)
 *
 * IMPORTANT : Remplacez les clés de test par vos clés de production avant le lancement
 */

// Clé publique Stripe (MODE TEST)
// Remplacez par votre clé pk_live_... en production
const STRIPE_PUBLIC_KEY = 'pk_test_51234567890abcdefghijklmnopqrstuvwxyz';

// IDs des prix Stripe (à configurer dans votre Dashboard Stripe)
// IMPORTANT: Créez ces prix dans votre Dashboard Stripe et copiez les IDs ici
// Pour la période d'essai, configurez-la directement sur le prix dans Stripe Dashboard
export const STRIPE_PRICES = {
  // Abonnement mensuel avec période d'essai de 30 jours : 29,90 € HT / mois
  // Configurez la période d'essai dans Stripe Dashboard > Products > Votre produit > Prix
  MONTHLY_WITH_TRIAL: 'price_1234567890abcdef', // Remplacez par votre vrai price_id
};

// URLs de redirection après paiement
const getSuccessUrl = () => `${window.location.origin}/?payment=success`;
const getCancelUrl = () => `${window.location.origin}/?payment=cancelled`;

// Variable pour stocker l'instance Stripe
let stripeInstance: any = null;

/**
 * Charge le script Stripe.js dynamiquement
 */
const loadStripeScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.Stripe) {
      resolve();
      return;
    }

    const existingScript = document.querySelector('script[src="https://js.stripe.com/v3/"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Impossible de charger Stripe.js'));
    document.head.appendChild(script);
  });
};

/**
 * Initialise Stripe et retourne l'instance
 */
const getStripeInstance = async () => {
  await loadStripeScript();

  if (!window.Stripe) {
    throw new Error('Stripe.js non disponible');
  }

  if (!stripeInstance) {
    stripeInstance = window.Stripe(STRIPE_PUBLIC_KEY);
  }

  return stripeInstance;
};

/**
 * Ouvre la page de paiement Stripe Checkout
 * Format correct pour redirectToCheckout côté client
 */
export const openStripeCheckout = async (priceId: string): Promise<void> => {
  try {
    const stripe = await getStripeInstance();

    // Configuration de la session Checkout (format côté client)
    // Note: La période d'essai doit être configurée dans Stripe Dashboard sur le prix
    const result = await stripe.redirectToCheckout({
      lineItems: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      successUrl: getSuccessUrl(),
      cancelUrl: getCancelUrl(),
    });

    if (result.error) {
      throw new Error(result.error.message);
    }
  } catch (error: any) {
    console.error('Erreur Stripe Checkout:', error);
    throw error;
  }
};

/**
 * Ouvre le checkout pour l'abonnement Club Eco-BTP
 * Offre de lancement : 1er mois offert (période d'essai configurée dans Stripe Dashboard)
 */
export const openClubEcoBTPCheckout = async (): Promise<void> => {
  return openStripeCheckout(STRIPE_PRICES.MONTHLY_WITH_TRIAL);
};

/**
 * Vérifie si le paiement a réussi (à appeler au chargement de la page)
 */
export const checkPaymentStatus = (): 'success' | 'cancelled' | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentStatus = urlParams.get('payment');

  if (paymentStatus === 'success') {
    // Nettoyer l'URL
    window.history.replaceState({}, '', window.location.pathname);
    return 'success';
  }

  if (paymentStatus === 'cancelled') {
    window.history.replaceState({}, '', window.location.pathname);
    return 'cancelled';
  }

  return null;
};

/**
 * GUIDE DE CONFIGURATION STRIPE
 * ==============================
 *
 * ÉTAPE 1 : Créer un compte Stripe
 * --------------------------------
 * Allez sur https://dashboard.stripe.com/register
 *
 * ÉTAPE 2 : Créer un Produit
 * --------------------------
 * 1. Dashboard > Products > + Add product
 * 2. Nom : "Abonnement Club Eco-BTP Pro"
 * 3. Description : "Accès illimité aux fonctionnalités Pro - 1er mois offert"
 *
 * ÉTAPE 3 : Créer un Prix avec période d'essai
 * ---------------------------------------------
 * 1. Dans votre produit, cliquez sur "+ Add price"
 * 2. Montant : 29,90 €
 * 3. Récurrence : Mensuel
 * 4. IMPORTANT : Cliquez sur "Add free trial" et mettez 30 jours
 * 5. Sauvegardez et copiez l'ID du prix (commence par price_...)
 *
 * ÉTAPE 4 : Configurer les clés
 * -----------------------------
 * 1. Dashboard > Developers > API Keys
 * 2. Copiez "Publishable key" (pk_test_...)
 * 3. Remplacez STRIPE_PUBLIC_KEY ci-dessus
 * 4. Remplacez STRIPE_PRICES.MONTHLY_WITH_TRIAL avec votre price_id
 *
 * CARTES DE TEST :
 * ----------------
 * Succès : 4242 4242 4242 4242
 * Refusée : 4000 0000 0000 0002
 * 3D Secure : 4000 0025 0000 3155
 * Date : n'importe quelle date future (ex: 12/34)
 * CVC : n'importe quel code à 3 chiffres (ex: 123)
 */

// Déclaration pour TypeScript
declare global {
  interface Window {
    Stripe: any;
  }
}

export default {
  openClubEcoBTPCheckout,
  openStripeCheckout,
  checkPaymentStatus,
  STRIPE_PRICES,
};
