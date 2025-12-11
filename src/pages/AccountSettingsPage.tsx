import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import httpClient from '../lib/httpClient';
import { PaymentHistory } from '../types/billing';
import { useSearchParams } from 'react-router-dom';
import billingService from '../services/billingService';
import { logError } from '../lib/logger';
import TermsModal from '../components/modals/TermsModal';

export default function AccountSettingsPage() {
    const { user, subscription } = useAuth();

    // Password Change State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Billing History State
    const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    // Modal State
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [isUpgrading, setIsUpgrading] = useState(false);

    const [paymentError, setPaymentError] = useState('');
    const [searchParams] = useSearchParams();

    useEffect(() => {
        loadPaymentHistory();

        // Check for payment error from redirect (if user came back here)
        // Note: The main cancel_url currently points to dashboard, but we should handle it here too just in case
        // or if we decide to change the redirect later.
        const error = searchParams.get('paymentError');
        if (error === 'cancelled') {
            setPaymentError('Payment process was cancelled. You can retry below.');
        }
    }, [searchParams]);

    const loadPaymentHistory = async () => {
        try {
            const data = await httpClient<PaymentHistory[]>('/billing/history');
            setPaymentHistory(data);
        } catch (error) {
            logError('Failed to load payment history:', error);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (newPassword.length < 8) {
            setPasswordError('New password must be at least 8 characters.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match.');
            return;
        }

        setIsChangingPassword(true);

        try {
            await httpClient('/auth/change-password', {
                method: 'POST',
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            setPasswordSuccess('Password updated successfully.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setPasswordError(err.message || 'Failed to update password.');
        } finally {
            setIsChangingPassword(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handlePayClick = () => {
        setIsTermsModalOpen(true);
    };

    const confirmPayNow = async () => {
        setIsUpgrading(true);
        try {
            // We call startProCheckout which will resume the existing INITIATED payment
            // logic on the backend (finding by user and status)
            const response = await billingService.startProCheckout();
            if (response.approvalUrl) {
                window.location.href = response.approvalUrl;
            }
        } catch (error) {
            logError('Failed to resume payment:', error);
            alert('Failed to proceed to payment. Please try again.');
            setIsTermsModalOpen(false);
        } finally {
            setIsUpgrading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
            <TermsModal
                isOpen={isTermsModalOpen}
                onClose={() => setIsTermsModalOpen(false)}
                onConfirm={confirmPayNow}
                isLoading={isUpgrading}
            />

            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Account Settings</h1>

            {/* SECTION A: User Profile Info */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">Profile Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Email Address</label>
                        <div className="text-slate-900 dark:text-slate-200 font-medium">{user?.email}</div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Account Status</label>
                        <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                Verified
                            </span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Current Plan</label>
                        <div className="text-slate-900 dark:text-slate-200 font-medium">{subscription?.plan}</div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Remaining Monthly Quota</label>
                        <div className="text-slate-900 dark:text-slate-200 font-medium">
                            {subscription ? subscription.monthlyQuota - subscription.usedThisPeriod : '-'} / {subscription?.monthlyQuota}
                        </div>
                    </div>
                    {subscription?.nextReset && (
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Next Quota Reset</label>
                            <div className="text-slate-900 dark:text-slate-200 font-medium">{formatDate(subscription.nextReset)}</div>
                        </div>
                    )}
                </div>
            </div>

            {paymentError && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {paymentError}
                </div>
            )}

            {/* SECTION B: Change Password */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                    {passwordError && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
                            {passwordError}
                        </div>
                    )}
                    {passwordSuccess && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm rounded-lg">
                            {passwordSuccess}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white"
                            required
                            minLength={8}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white"
                            required
                            minLength={8}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isChangingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>

            {/* SECTION C: Billing & Payment History */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Billing & History</h2>
                    {subscription?.plan === 'FREE' ? (
                        <button
                            onClick={handlePayClick}
                            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-orange-500/20"
                        >
                            Upgrade to PRO
                        </button>
                    ) : (
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 rounded-full text-sm font-medium">
                            PRO Active
                        </span>
                    )}
                </div>

                <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Plan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                            {loadingHistory ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-slate-500 dark:text-slate-400">Loading history...</td>
                                </tr>
                            ) : paymentHistory.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-slate-500 dark:text-slate-400">No payment history found.</td>
                                </tr>
                            ) : (
                                paymentHistory.map((payment) => (
                                    <tr key={payment.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-300">
                                            {formatDate(payment.date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-300">
                                            {payment.amount.toFixed(2)} {payment.currency}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-300">
                                            {payment.planType}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${payment.status === 'SUCCESS' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                    payment.status === 'FAILED' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {payment.status === 'INITIATED' && (
                                                <button
                                                    onClick={handlePayClick}
                                                    className="text-xs bg-purple-600 hover:bg-purple-700 text-white font-medium px-3 py-1 rounded transition-colors"
                                                >
                                                    Pay Now
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* SECTION D: Delete Account */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-medium text-slate-900 dark:text-slate-100">Delete Account</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Once you delete your account, there is no going back. Please be certain.
                        </p>
                    </div>
                    <button
                        disabled
                        className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg opacity-60 cursor-not-allowed hover:bg-red-100 transition-colors"
                        title="Coming soon"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}
