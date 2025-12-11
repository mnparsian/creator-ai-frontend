import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import httpClient from '../lib/httpClient';

export default function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [errorMessage, setErrorMessage] = useState('');

    const ranOnce = useRef(false);

    useEffect(() => {
        // Prevent double execution in React Strict Mode which causes race conditions
        // where one request succeeds (deletes token) and the other fails (token missing).
        if (ranOnce.current) return;
        ranOnce.current = true;

        const verifyEmail = async () => {
            const token = searchParams.get('token');

            if (!token) {
                setStatus('error');
                setErrorMessage('Invalid verification link');
                return;
            }

            try {
                await httpClient(`/auth/verify?token=${token}`, {
                    skipAuth: true,
                });
                setStatus('success');
                // Redirect to success page after 1 second
                setTimeout(() => {
                    navigate('/verify-success');
                }, 1000);
            } catch (err: any) {
                // If the error might be because it resulted in a second call race condition,
                // we should ideally query the user state, but for now we just show the error.
                // With the useRef guard, this potential race is minimized.
                setStatus('error');
                setErrorMessage(err.message || 'Verification failed');
            }
        };

        verifyEmail();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl p-8 text-center">
                    {status === 'verifying' && (
                        <>
                            <div className="mb-6 flex justify-center">
                                <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                                Verifying your email...
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400">
                                Please wait while we verify your email address.
                            </p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="mb-6 flex justify-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-12 h-12 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={3}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                                Verification successful!
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400">
                                Redirecting you...
                            </p>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="mb-6 flex justify-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-12 h-12 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={3}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                                Verification failed
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                {errorMessage}
                            </p>
                            <button
                                onClick={() => navigate('/login')}
                                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                            >
                                Go to Login
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
