import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import billingService from '../services/billingService';
import { useAuth } from '../context/AuthContext';
import { logError } from '../lib/logger';

export default function BillingSuccessPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loadSubscription } = useAuth();
    const [status, setStatus] = useState<'LOADING' | 'SUCCESS' | 'ERROR'>('LOADING');

    // Extract params from PayPal redirect
    // URL usually: /billing/success?paymentId=PAYID-XXX&token=EC-XXX&PayerID=XXX
    const urlPaymentId = searchParams.get('paymentId');
    const token = searchParams.get('token');
    const payerId = searchParams.get('PayerID');

    // PayPal uses 'token' as the Order ID, which maps to our 'paymentId'
    const finalPaymentId = urlPaymentId || token;

    useEffect(() => {
        if (!finalPaymentId || !token || !payerId) {
            setStatus('ERROR');
            return;
        }

        const confirmPayment = async () => {
            try {
                // Call backend to execute payment
                await billingService.confirmProPayment(finalPaymentId);

                // Refresh subscription data in AuthContext
                await loadSubscription();

                setStatus('SUCCESS');

                // Redirect to dashboard after 3 seconds
                setTimeout(() => {
                    navigate('/dashboard');
                }, 3000);

            } catch (err) {
                logError('Payment confirmation failed:', err);
                setStatus('ERROR');
            }
        };

        confirmPayment();
    }, [finalPaymentId, token, payerId, navigate, loadSubscription]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                {status === 'LOADING' && (
                    <>
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Processing Payment...</h2>
                        <p className="text-slate-600 dark:text-slate-400">Please wait while we confirm your subscription.</p>
                    </>
                )}

                {status === 'SUCCESS' && (
                    <>
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                            🎉
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Payment Successful!</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">You are now upgraded to the PRO plan.</p>
                        <p className="text-sm text-slate-500">Redirecting to dashboard...</p>
                    </>
                )}

                {status === 'ERROR' && (
                    <>
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                            ⚠️
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Payment Failed</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">Something went wrong attempting to confirm your payment.</p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2 rounded-lg font-medium hover:opacity-90 transition"
                        >
                            Return to Dashboard
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
