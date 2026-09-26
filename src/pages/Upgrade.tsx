import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Upgrade: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [loading, setLoading] = useState(false);
  const { upgrade } = useAuth();

  const handleUpgrade = async (plan: 'monthly' | 'yearly') => {
    setLoading(true);
    try {
      await upgrade(plan);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const plans: Array<{
    id: 'monthly' | 'yearly';
    name: string;
    price: string;
    period: string;
    priceYearly: string;
    savings: string | null;
    features: string[];
    popular?: boolean;
  }> = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '$4.99',
      period: '/month',
      priceYearly: '$59.88',
      savings: null,
      features: [
        'Unlimited questions per test',
        'Full test history & progress tracking',
        'Detailed analytics & weak-point analysis',
        'Downloadable PDF results',
        'Ad-free experience',
        'All 150+ questions unlocked',
      ],
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: '$29.99',
      period: '/year',
      priceYearly: '$29.99',
      savings: 'Save 50%',
      features: [
        'Everything in Monthly',
        'Best value - 50% off monthly price',
        'Priority support',
        'Early access to new features',
      ],
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Link to="/dashboard" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 text-sm font-medium mb-8 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-black text-gray-900 mb-4">Upgrade to Pro</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Unlock unlimited practice, detailed analytics, and all Pro features to ace your JLPT exam.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl p-8 border-2 transition-all ${
                selectedPlan === plan.id
                  ? 'border-emerald-500 shadow-lg ring-2 ring-emerald-500'
                  : 'border-gray-200 hover:border-emerald-300'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                {plan.savings && (
                  <div className="bg-amber-50 text-amber-700 text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                    {plan.savings}
                  </div>
                )}
                <p className="text-sm text-gray-500">Billed as {plan.priceYearly}/year</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpgrade(selectedPlan);
                }}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                  selectedPlan === plan.id
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {loading ? 'Processing...' : `Get ${plan.name} Plan`}
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <h3 className="text-lg font-bold text-gray-900 p-6 border-b border-gray-100">Feature Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Feature</th>
                  <th className="px-6 py-3 text-center">Free</th>
                  <th className="px-6 py-3 text-center">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { feature: 'Questions per test', free: '30', pro: 'Unlimited (150+)' },
                  { feature: 'Test modes (Real + Learning)', free: '✓', pro: '✓' },
                  { feature: 'Furigana dictionary', free: '✓', pro: '✓' },
                  { feature: 'Instant explanations (Learning)', free: '✓', pro: '✓' },
                  { feature: 'Test history', free: 'Current session only', pro: 'Unlimited + search/filter' },
                  { feature: 'Progress analytics', free: '✗', pro: 'Detailed charts & trends' },
                  { feature: 'Weak-point analysis', free: '✗', pro: 'Category breakdown + review mode' },
                  { feature: 'PDF export', free: '✗', pro: 'Downloadable results' },
                  { feature: 'Ad-free experience', free: '✗', pro: '✓' },
                  { feature: 'All 150+ questions', free: '30/test', pro: 'All unlocked' },
                  { feature: 'Priority support', free: '✗', pro: '✓' },
                ].map((row, i) => (
                  <tr key={i} className={`${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <td className="px-6 py-3 text-sm text-gray-700 font-medium">{row.feature}</td>
                    <td className="px-6 py-3 text-center text-gray-500">{row.free}</td>
                    <td className="px-6 py-3 text-center text-emerald-600 font-semibold">{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {[
                { q: 'Can I cancel anytime?', a: 'Yes, you can cancel anytime. Your Pro features remain active until the end of your billing period.' },
                { q: 'What payment methods do you accept?', a: 'We accept all major credit cards via Stripe and PayPal.' },
                { q: 'Is there a free trial?', a: 'We don\'t offer a free trial, but the Free tier gives you full access to Learning Mode and 30 questions per Real Test.' },
                { q: 'Can I switch between monthly and yearly?', a: 'Yes, you can switch plans at any time. Changes take effect at your next billing cycle.' },
                { q: 'What payment methods do you accept?', a: 'We accept all major credit cards (Visa, Mastercard, Amex) and PayPal via Stripe.' },
              ].map((faq, i) => (
                <details key={i} className="group bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                    <span className="font-medium text-gray-900">{faq.q}</span>
                    <svg className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-5 pt-0 text-gray-600">
                    <p>{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">Ready to ace your JLPT exam?</p>
              <button
                onClick={() => handleUpgrade(selectedPlan)}
                disabled={loading}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Upgrading...
                  </>
                ) : (
                  `Upgrade to ${selectedPlan === 'yearly' ? 'Yearly' : 'Monthly'} Pro - ${selectedPlan === 'yearly' ? '$29.99/year' : '$4.99/month'}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}