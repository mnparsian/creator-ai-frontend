import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Users, DollarSign, ShieldCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import httpClient from '../lib/httpClient';
import { logError } from '../lib/logger';

interface ChartPoint {
    name: string;
    users: number; // Mapped from backend 'users'
}

interface DashboardStats {
    totalUsers: number;
    adminCount: number;
    totalRevenue: number;
    growthData: ChartPoint[];
}

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await httpClient<DashboardStats>('/admin/stats');
                setStats(data);
            } catch (error) {
                logError('Failed to fetch dashboard stats', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Fallback for empty data
    const chartData = stats?.growthData && stats.growthData.length > 0
        ? stats.growthData
        : [{ name: 'No Data', users: 0 }];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Total Users - REAL DATA */}
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {isLoading ? '...' : stats?.totalUsers || 0}
                            </h3>
                            <Badge variant="success">Live</Badge>
                        </div>
                    </div>
                </Card>

                {/* Admins Count - REAL DATA */}
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Admins & Staff</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {isLoading ? '...' : stats?.adminCount || 0}
                            </h3>
                            <Badge variant="neutral">Team</Badge>
                        </div>
                    </div>
                </Card>

                {/* Revenue - REAL DATA */}
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                            <DollarSign className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                ${isLoading ? '...' : stats?.totalRevenue?.toLocaleString() || '0.00'}
                            </h3>
                            <Badge variant="success">Live</Badge>
                        </div>
                    </div>
                </Card>
            </div>

            <Card title="Growth Overview" description="User registration trend (Real Data)">
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="name"
                                stroke="#9ca3af"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#9ca3af"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-800" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--tooltip-bg, #fff)',
                                    borderRadius: '8px',
                                    border: '1px solid var(--tooltip-border, #e5e7eb)',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="users"
                                stroke="#6366f1"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorUsers)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
}
