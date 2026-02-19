
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Public Test Key (Standard Stripe Demo Key)
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

interface PaymentGatewayProps {
  amount: number;
  chefName: string;
  menuName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const CheckoutForm: React.FC<PaymentGatewayProps> = ({ amount, chefName, menuName, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardholderName, setCardholderName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) { setLoading(false); return; }

    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: { name: cardholderName },
    });

    if (stripeError) {
      setError(stripeError.message || 'Payment failed');
      setLoading(false);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
      // Simulate Backend Confirmation
      setTimeout(() => {
          setLoading(false);
          onSuccess();
      }, 1500);
    }
  };

  const cardStyle = {
    style: {
      base: {
        color: "#1f2937",
        fontFamily: '"Inter", sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "14px",
        "::placeholder": { color: "#9ca3af" },
      },
      invalid: { color: "#ef4444", iconColor: "#ef4444" },
    },
    hidePostalCode: true,
  };

  return (
    <div className="max-w-md mx-auto animate-in fade-in duration-500">
      <div className="bg-white py-8 px-10 shadow-2xl sm:rounded-3xl border border-gray-100">
          <div className="text-center mb-8">
              <h2 className="text-3xl font-serif font-bold text-gray-900">Secure Payment</h2>
              <p className="mt-2 text-sm text-gray-600">Final step to book Chef {chefName}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Cardholder Name</label>
                  <input 
                      type="text"
                      required
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      className="block w-full border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold text-sm"
                      placeholder="Full Name on Card"
                  />
              </div>

              <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Card Details</label>
                  <div className="border border-gray-200 rounded-lg p-3.5 bg-white focus-within:ring-1 focus-within:ring-brand-gold focus-within:border-brand-gold transition-all">
                      <CardElement options={cardStyle} />
                  </div>
              </div>

              {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-lg flex items-center">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {error}
                  </div>
              )}

              <button 
                  type="submit"
                  disabled={!stripe || loading}
                  className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-brand-dark/20 hover:bg-black transition-all transform active:scale-[0.99] flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                  {loading ? (
                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                      <span>Pay £{amount.toFixed(2)}</span>
                  )}
              </button>
              
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
                   <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                   <span>Payments processed securely by Stripe</span>
              </div>
          </form>
          <button onClick={onCancel} className="w-full text-center mt-6 text-sm font-bold text-gray-400 hover:text-gray-600">Go Back</button>
      </div>
    </div>
  );
};

const PaymentGateway: React.FC<PaymentGatewayProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
};

export default PaymentGateway;
