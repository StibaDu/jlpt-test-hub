import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const VerifyEmail: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    verifyEmail(token)
      .then(() => {
        setStatus('success');
        setMessage('Email verified successfully! Redirecting to dashboard...');
        setTimeout(() => navigate('/dashboard', { replace: true }), 2000);
      })
      .catch((err: any) => {
        setStatus('error');
        setMessage(err.message || 'Verification failed. Please try again or request a new link.');
      });
  }, [token, navigate]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-2V5a2 2 0 012-2h2a2 2 0 002-2V0h-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2H7.586a1 1 0 00-.707.293l-5.414 5.414a1 1 0 000 1.414l4.586 4.586a1 1 0 001.414 0l4.586-4.586a1 1 0 000-1.414L13.414 4.586a1 1 0 000-1.414L9.586 0.586a1 1 0 00-1.414 0L2.586 7.071a1 1 0 000 1.414l6.293 6.293a1 1 0 010 1.414l3.293 3.293a1 1 0 001.414 0l8.95-8.95a1 1 0 000-1.414l-2.293-2.293a1 1 0 00-1.414 0l-4.586 4.586a1 1 0 010-1.414L13.414 2H7a2 2 0 00-2 2v2a2 2 0 002 2h2.586l4.586 4.586a1 1 0 001.414 0l2.293-2.293a1 1 0 000-1.414L15.414 2H7a2 2 0 01-2-2V0h10a2 2 0 012 2v2h2.586l4.586 4.586a1 1 0 001.414 0l2.293-2.293a1 1 0 000-1.414L15.586 0H7a2 2 0 01-2-2V0h10a2 2 0 012 2v2a2 2 0 002 2h2.586l4.586 4.586a1 1 0 001.414 0l2.293-2.293a1 1 0 000-1.414L15.414 2H7a2 2 0 01-2-2V0h10a2 2 0 012 2v2a2 2 0 012 2h2.586l4.586 4.586a1 1 0 001.414 0l2.293-2.293a1 1 0 000-1.414L15.414 2H7a2 2 0 01-2-2V0h10a2 2 0 012 2v2h2.586l4.586 4.586a1 1 0 001.414 0l2.293-2.293a1 1 0 000-1.414L15.414 0H7a2 2 0 01-2-2V0h10a2 2 0 012 2v2a2 2 0 012 2h2.586l4.586 4.586a1 1 0 001.414 0l2.293-2.293a1 1 0 000-1.414L15.414 2H7a2 2 0 01-2-2V0h10a2 2 0 012 2v2a2 2 0 012 2h2.586l4.586 4.586a1 1 0 001.414 0l2.293-2.293a1 1 0 000-1.414L15.414 2H7a2 2 0 01-2-2V0h10a2 2 0 012 2v2a2 2 0 012 2h2.586l4.586 4.586a1 1 0 001.414 0l2.293-2.293a1 1 0 000-1.414L15.414 2H7a2 2 0 01-2-2V0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Verifying Email...</h1>
          <p className="text-gray-500">Please wait while we verify your email address.</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Verification Failed</h1>
          <p className="text-gray-500 mb-6">{message}</p>
          <Link to="/login" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return null; // Loading state returns the loading UI above
}