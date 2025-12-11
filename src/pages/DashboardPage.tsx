import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PlanBadge from '../components/dashboard/PlanBadge';
import UpgradeBanner from '../components/dashboard/UpgradeBanner';
import ContentForm from '../components/dashboard/ContentForm';
import ContentOutput from '../components/dashboard/ContentOutput';
import HistoryList from '../components/dashboard/HistoryList';
import httpClient from '../lib/httpClient';
import billingService from '../services/billingService';
import { ContentHistoryResponse, GenerateContentRequest, GeneratedContent } from '../types/content';
import { logError } from '../lib/logger';

export default function DashboardPage() {
    const { subscription, loadSubscription } = useAuth();
    const [history, setHistory] = useState<ContentHistoryResponse[]>([]);
    const [currentContent, setCurrentContent] = useState<GeneratedContent | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [searchParams] = useSearchParams();

    useEffect(() => {
        loadSubscription();
        fetchHistory();

        // Check for payment error from redirect
        const paymentError = searchParams.get('paymentError');
        if (paymentError === 'cancelled') {
            setError('Payment process was cancelled. You can retry from your Account settings.');
        }
    }, [searchParams]);

    const fetchHistory = async () => {
        try {
            const data = await httpClient('/content/history?limit=10');
            setHistory(data as ContentHistoryResponse[]);
        } catch (err) {
            logError('Failed to fetch history:', err);
        }
    };

    const handleGenerate = async (data: GenerateContentRequest) => {
        setIsGenerating(true);
        setError(null);
        try {
            const result = await httpClient('/content/generate', {
                method: 'POST',
                body: JSON.stringify(data),
            });

            const newContent = result as GeneratedContent;
            setCurrentContent(newContent);

            // Refresh history and subscription (quota)
            await Promise.all([fetchHistory(), loadSubscription()]);
        } catch (err: any) {
            setError(err.message || 'Failed to generate content. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleUpgrade = async () => {
        try {
            const checkout = await billingService.startProCheckout();
            if (checkout.approvalUrl) {
                window.location.href = checkout.approvalUrl;
            }
        } catch (err: any) {
            logError('Failed to initiate checkout:', err);
            setError('Failed to start upgrade process. Please try again.');
        }
    };

    const handleSelectHistory = (id: string) => {
        const selected = history.find((item) => item.id === id);
        if (selected) {
            setCurrentContent(selected.content);
        }
    };

    if (!subscription) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center text-slate-600 dark:text-slate-400">
                    Loading subscription...
                </div>
            </div>
        );
    }

    const plan = subscription.plan;
    const quota = {
        used: subscription.usedThisPeriod,
        total: subscription.monthlyQuota,
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
                    Dashboard
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Generate AI-powered content for your social media
                </p>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
                {/* Left Column - Sticky */}
                <div className="col-span-1 space-y-6 lg:sticky lg:top-6 h-fit">
                    {/* Plan & Quota */}
                    <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                                Your Plan
                            </h2>
                            <PlanBadge plan={plan} />
                        </div>

                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-600 dark:text-slate-400">Monthly Quota</span>
                                <span className="font-medium text-slate-900 dark:text-slate-50">
                                    {quota.used} / {quota.total}
                                </span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-purple-600 to-fuchsia-500 h-2 rounded-full transition-all"
                                    style={{ width: `${Math.min((quota.used / quota.total) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        {plan === 'FREE' && <UpgradeBanner onUpgrade={handleUpgrade} />}
                    </div>

                    {/* Support Card */}
                    <div className="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-indigo-500/10 rounded-lg">
                                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">Need Help?</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                                    Have questions or need support? Contact us anytime.
                                </p>
                                <a
                                    href="mailto:support@mahdinazari.net"
                                    className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    support@mahdinazari.net
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Content Form */}
                    <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
                            Generate Content
                        </h2>
                        <ContentForm onGenerate={handleGenerate} isLoading={isGenerating} />
                    </div>
                </div>

                {/* Right Column - Scrollable */}
                <div className="col-span-1 lg:col-span-2 space-y-6 pb-12">
                    <ContentOutput content={currentContent} isLoading={isGenerating} />

                    <div className="pt-8 border-t border-slate-200 dark:border-white/10">
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50 mb-4">Recent History</h3>
                        <HistoryList items={history} onSelect={handleSelectHistory} />
                    </div>
                </div>
            </div>
        </div>
    );
}
