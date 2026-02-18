import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string);

interface CheckoutFormProps {
  onSuccess: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required',
    });

    if (confirmError) {
      setError(confirmError.message ?? 'Erreur de paiement');
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-orange-100 active:scale-95 transition-all disabled:opacity-50"
      >
        {loading ? 'Traitement...' : 'Payer 1,99 €'}
      </button>
    </form>
  );
};

interface PaymentFormProps {
  onSuccess: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSuccess }) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/create-platform-fee-intent', { method: 'POST' })
      .then(r => r.json())
      .then(data => {
        if (data.clientSecret) setClientSecret(data.clientSecret);
        else setFetchError(data.error ?? 'Erreur serveur');
      })
      .catch(() => setFetchError('Impossible de joindre le serveur'));
  }, []);

  if (fetchError) return <p className="text-red-500 text-sm font-medium text-center">{fetchError}</p>;
  if (!clientSecret) return <p className="text-slate-500 text-sm text-center">Chargement...</p>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm onSuccess={onSuccess} />
    </Elements>
  );
};

export default PaymentForm;
