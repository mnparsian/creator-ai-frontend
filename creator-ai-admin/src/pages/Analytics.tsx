import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import httpClient from '../lib/httpClient';
import { logError } from '../lib/logger';

interface AnalyticsData {
    revenueOverTime: { name: string; Revenue: number; Cost: number; Profit: number }[];
    activeUsers: number;
    totalContentGenerated: number;
    totalRevenue: number;
    totalAiCost: number;
}

export default function Analytics() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await httpClient<AnalyticsData>('/admin/analytics/detailed');
                setData(response);
            } catch (error) {
                logError('Failed to fetch analytics', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    // Use data directly
    const chartData = data?.revenueOverTime || [];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>

            <div className="grid gap-6 md:grid-cols-4">
                <Card>
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-500">Active Users</p>
                        <h3 className="text-3xl font-bold text-blue-600">{loading ? '...' : data?.activeUsers}</h3>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-500">Total Content</p>
                        <h3 className="text-3xl font-bold text-purple-600">{loading ? '...' : data?.totalContentGenerated}</h3>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                        <h3 className="text-3xl font-bold text-green-600">
                            {loading ? '...' : `€${data?.totalRevenue?.toFixed(2)}`}
                        </h3>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-500">Total AI Cost</p>
                        <h3 className="text-3xl font-bold text-red-600">
                            {loading ? '...' : `€${data?.totalAiCost?.toFixed(7)}`}
                        </h3>
                    </div>
                </Card>
            </div>

            <Card title="Revenue & Profit" description="Revenue vs Operating Costs (OpenAI) vs Profit">
                <div className="h-96 w-full">
                    {loading ? (
                        <div className="flex h-full items-center justify-center">Loading Chart...</div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `€${value}`} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    formatter={(value: number) => [`€${value.toFixed(2)}`, '']}
                                />
                                <Legend />
                                <Bar dataKey="Revenue" fill="#0ea5e9" name="Revenue" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Cost" fill="#ef4444" name="AI Cost" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Profit" fill="#10b981" name="Profit" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </Card>
        </div>
    );
}
