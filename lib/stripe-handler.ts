/**
 * Stripe Checkout Handler pour Eco-BTP Deal
 *
 * IMPORTANT: Pour la période d'essai de 30 jours, vous devez la configurer
 * directement dans Stripe Dashboard sur votre prix (pas possible côté client)
 */

// Clé publique Stripe (MODE TEST)
const STRIPE_PUBLIC_KEY = 'pk_test_51Svjd4JCv4lGpXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

// ID du prix Stripe - À REMPLACER par votre vrai price_id depuis Stripe Dashboard
// Dashboard > Products > Votre produit > Copier l'ID du prix (price_...)
export const STRIPE_PRICES = {
  MONTHLY_WITH_TRIAL: 'price_XXXXXXXXXXXXXXXXXX', // Remplacez par votre price_id
};

// URLs de redirection
const getSuccessUrl = () => `${window.location.origin}/?payment=success`;
const getCancelUrl = () => `${window.location.origin}/?payment=cancelled`;

let stripeInstance: any = null;

/**
 * Charge Stripe.js
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
 * Obtient l'instance Stripe
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
 * Ouvre Stripe Checkout
 * FORMAT CORRECT - sans subscriptionData
 */
export const openStripeCheckout = async (priceId: string): Promise<void> => {
  try {
    const stripe = await getStripeInstance();

    // Format correct pour redirectToCheckout côté client
    // La période d'essai doit être configurée sur le prix dans Stripe Dashboard
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
    console.error('Erreur Stripe:', error);
    throw error;
  }
};

/**
 * Ouvre le checkout Club Eco-BTP
 */
export const openClubEcoBTPCheckout = async (): Promise<void> => {
  return openStripeCheckout(STRIPE_PRICES.MONTHLY_WITH_TRIAL);
};

/**
 * Vérifie le statut du paiement
 */
export const checkPaymentStatus = (): 'success' | 'cancelled' | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get('payment');
  if (status === 'success' || status === 'cancelled') {
    window.history.replaceState({}, '', window.location.pathname);
    return status;
  }
  return null;
};

/*
 * CONFIGURATION STRIPE - ÉTAPES :
 *
 * 1. Allez sur https://dashboard.stripe.com/test/products
 *
 * 2. Créez un produit "Abonnement Club Eco-BTP Pro"
 *
 * 3. Ajoutez un prix :
 *    - Montant : 29,90 €
 *    - Récurrence : Mensuel
 *    - IMPORTANT : Cliquez sur "Add free trial" → 30 jours
 *
 * 4. Copiez le price_id (ex: price_1SvXXX...)
 *
 * 5. Remplacez ci-dessus :
 *    - STRIPE_PUBLIC_KEY avec votre pk_test_...
 *    - MONTHLY_WITH_TRIAL avec votre price_...
 *
 * CARTES DE TEST :
 * - Succès : 4242 4242 4242 4242
 * - Refusée : 4000 0000 0000 0002
 * - Exp: 12/34 | CVC: 123
 */

declare global {
  interface Window {
    Stripe: any;
  }
}

export default { openClubEcoBTPCheckout, checkPaymentStatus, STRIPE_PRICES };
