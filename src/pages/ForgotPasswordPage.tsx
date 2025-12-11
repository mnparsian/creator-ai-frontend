import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import httpClient from '../lib/httpClient';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            await httpClient('/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ email })
            });
            setStatus('success');
            setMessage('If this email exists, a reset link has been sent.');
        } catch (error: any) {
            setStatus('error');
            setMessage(error.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-[#0F0F14] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-xl mx-auto mb-4"></div>
                <h2 className="text-center text-3xl font-bold tracking-tight text-white">
                    Reset your password
                </h2>
                <p className="mt-2 text-center text-sm text-slate-400">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-[#18181B] py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-white/10">
                    {status === 'success' ? (
                        <div className="text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 mb-4">
                                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-white mb-2">Check your email</h3>
                            <p className="text-slate-400 text-sm mb-6">
                                {message}
                            </p>
                            <Link
                                to="/login"
                                className="text-purple-400 hover:text-purple-300 font-medium"
                            >
                                Back to login
                            </Link>
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {status === 'error' && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    {message}
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                                    Email address
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full rounded-lg bg-black/50 border border-white/10 px-3 py-2 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="flex w-full justify-center rounded-lg bg-gradient-to-r from-purple-600 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </div>

                            <div className="text-center">
                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                                >
                                    Back to login
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
