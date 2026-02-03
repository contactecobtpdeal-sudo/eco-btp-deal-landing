/**
 * Stripe Checkout Handler pour Eco-BTP Deal
 *
 * Configuration des abonnements :
 * - Abonnement Club Eco-BTP : 29,90 € HT / mois
 * - Offre Spéciale : 1er mois à 0 € (période d'essai), puis 29,90 €
 *
 * IMPORTANT : Remplacez les clés de test par vos clés de production avant le lancement
 */

// Clé publique Stripe (MODE TEST)
// Remplacez par votre clé pk_live_... en production
const STRIPE_PUBLIC_KEY = 'pk_test_51234567890abcdefghijklmnopqrstuvwxyz';

// IDs des prix Stripe (à configurer dans votre Dashboard Stripe)
// Ces IDs sont des exemples - créez vos propres prix dans Stripe Dashboard
export const STRIPE_PRICES = {
  // Abonnement mensuel standard : 29,90 € HT / mois
  MONTHLY_STANDARD: 'price_eco_btp_monthly_2990',

  // Abonnement avec 1er mois offert (période d'essai de 30 jours)
  MONTHLY_WITH_TRIAL: 'price_eco_btp_monthly_trial_2990',
};

// URLs de redirection après paiement
const SUCCESS_URL = window.location.origin + '?payment=success';
const CANCEL_URL = window.location.origin + '?payment=cancelled';

// Interface pour les options de checkout
interface CheckoutOptions {
  priceId: string;
  customerEmail?: string;
  siret?: string;
  trialDays?: number;
}

/**
 * Charge le script Stripe.js dynamiquement
 */
const loadStripeScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.Stripe) {
      resolve();
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

  return window.Stripe(STRIPE_PUBLIC_KEY);
};

/**
 * Ouvre la page de paiement Stripe Checkout
 * Avec période d'essai de 30 jours (1er mois offert)
 */
export const openStripeCheckout = async (options: CheckoutOptions): Promise<void> => {
  try {
    const stripe = await getStripeInstance();

    // Configuration de la session Checkout
    // Note: En production, cette session devrait être créée côté serveur
    // Pour le mode test, on utilise un Payment Link ou une redirection

    const checkoutConfig: any = {
      lineItems: [
        {
          price: options.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      successUrl: SUCCESS_URL,
      cancelUrl: CANCEL_URL,
    };

    // Ajouter la période d'essai si spécifiée
    if (options.trialDays && options.trialDays > 0) {
      checkoutConfig.subscriptionData = {
        trialPeriodDays: options.trialDays,
      };
    }

    // Ajouter l'email client si disponible
    if (options.customerEmail) {
      checkoutConfig.customerEmail = options.customerEmail;
    }

    // Ajouter le SIRET comme métadonnée
    if (options.siret) {
      checkoutConfig.metadata = {
        siret: options.siret,
      };
    }

    // Redirection vers Stripe Checkout
    const result = await stripe.redirectToCheckout(checkoutConfig);

    if (result.error) {
      throw new Error(result.error.message);
    }
  } catch (error) {
    console.error('Erreur Stripe Checkout:', error);
    throw error;
  }
};

/**
 * Ouvre le checkout pour l'abonnement Club Eco-BTP
 * Offre de lancement : 1er mois offert (30 jours d'essai)
 */
export const openClubEcoBTPCheckout = async (customerEmail?: string, siret?: string): Promise<void> => {
  return openStripeCheckout({
    priceId: STRIPE_PRICES.MONTHLY_WITH_TRIAL,
    customerEmail,
    siret,
    trialDays: 30, // 1er mois offert
  });
};

/**
 * Ouvre le checkout pour l'abonnement standard (sans période d'essai)
 */
export const openStandardCheckout = async (customerEmail?: string, siret?: string): Promise<void> => {
  return openStripeCheckout({
    priceId: STRIPE_PRICES.MONTHLY_STANDARD,
    customerEmail,
    siret,
    trialDays: 0,
  });
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
 * Configuration Stripe pour le mode test
 *
 * ÉTAPES POUR CONFIGURER STRIPE :
 *
 * 1. Créez un compte Stripe : https://dashboard.stripe.com/register
 *
 * 2. Dans le Dashboard Stripe, créez un Produit :
 *    - Nom : "Abonnement Club Eco-BTP"
 *    - Description : "Accès illimité aux fonctionnalités Pro"
 *
 * 3. Créez un Prix pour ce produit :
 *    - Montant : 29,90 € HT
 *    - Récurrence : Mensuel
 *    - Copiez l'ID du prix (price_xxx) et remplacez STRIPE_PRICES.MONTHLY_WITH_TRIAL
 *
 * 4. Récupérez votre clé publique de test :
 *    - Dashboard > Developers > API Keys
 *    - Copiez "Publishable key" (pk_test_...)
 *    - Remplacez STRIPE_PUBLIC_KEY ci-dessus
 *
 * 5. Pour la période d'essai, configurez dans le produit Stripe :
 *    - Ou utilisez subscriptionData.trialPeriodDays dans le code
 *
 * CARTES DE TEST STRIPE :
 * - Succès : 4242 4242 4242 4242
 * - Refusée : 4000 0000 0000 0002
 * - Authentification requise : 4000 0025 0000 3155
 *
 * Date d'expiration : n'importe quelle date future
 * CVC : n'importe quel code à 3 chiffres
 */

// Déclaration pour TypeScript
declare global {
  interface Window {
    Stripe: any;
  }
}

export default {
  openClubEcoBTPCheckout,
  openStandardCheckout,
  checkPaymentStatus,
  STRIPE_PRICES,
};
