import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import httpClient from '../lib/httpClient';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 8) {
            setStatus('error');
            setMessage('Password must be at least 8 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setStatus('error');
            setMessage('Passwords do not match');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            await httpClient('/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify({
                    token,
                    newPassword
                })
            });
            setStatus('success');
            setMessage('Your password has been reset successfully.');
            // Optional: Redirect after delay
            setTimeout(() => navigate('/login'), 3000);
        } catch (error: any) {
            setStatus('error');
            setMessage(error.message || 'Failed to reset password. The link may have expired.');
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-[#0F0F14] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="bg-[#18181B] py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-white/10 max-w-md mx-auto text-center">
                    <h3 className="text-lg font-medium text-red-400 mb-2">Invalid Link</h3>
                    <p className="text-slate-400 text-sm mb-6">
                        This password reset link is invalid or missing the token.
                    </p>
                    <Link to="/forgot-password" className="text-purple-400 hover:text-purple-300">
                        Request a new one
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F0F14] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-xl mx-auto mb-4"></div>
                <h2 className="text-center text-3xl font-bold tracking-tight text-white">
                    Set new password
                </h2>
                <p className="mt-2 text-center text-sm text-slate-400">
                    Please enter your new password below.
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
                            <h3 className="text-lg font-medium text-white mb-2">Password Reset Complete</h3>
                            <p className="text-slate-400 text-sm mb-6">
                                Redirecting to login page...
                            </p>
                            <Link
                                to="/login"
                                className="text-purple-400 hover:text-purple-300 font-medium"
                            >
                                Click here if not redirected
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
                                <label htmlFor="new-password" className="block text-sm font-medium text-slate-300">
                                    New password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="new-password"
                                        name="new-password"
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="block w-full rounded-lg bg-black/50 border border-white/10 px-3 py-2 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-300">
                                    Confirm password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="confirm-password"
                                        name="confirm-password"
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                                    {status === 'loading' ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
