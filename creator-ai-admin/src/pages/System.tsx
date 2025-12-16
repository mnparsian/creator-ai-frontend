import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Cpu } from 'lucide-react';
import httpClient from '../lib/httpClient';
import { logError } from '../lib/logger';

interface SystemStats {
    javaVersion: string;
    osName: string;
    maxMemory: number;
    totalMemory: number;
    freeMemory: number;
}

function formatBytes(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function System() {
    const [stats, setStats] = useState<SystemStats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await httpClient<SystemStats>('/admin/system');
            setStats(response);
        } catch (error) {
            logError('Failed to fetch system stats', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const usedMemory = stats ? stats.totalMemory - stats.freeMemory : 0;
    const memoryPercentage = stats ? Math.round((usedMemory / stats.totalMemory) * 100) : 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Status</h1>
                <Badge variant="success">Online</Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card title="Environment">
                    <div className="space-y-4">
                        <div className="flex justify-between border-b pb-2 dark:border-gray-700">
                            <span className="text-gray-500">OS Name</span>
                            <span className="font-mono text-gray-900 dark:text-white">{loading ? '...' : stats?.osName}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2 dark:border-gray-700">
                            <span className="text-gray-500">Java Version</span>
                            <span className="font-mono text-gray-900 dark:text-white">{loading ? '...' : stats?.javaVersion}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Server Time</span>
                            <span className="font-mono text-gray-900 dark:text-white">{new Date().toLocaleTimeString()}</span>
                        </div>
                    </div>
                </Card>

                <Card title="Memory Usage (JVM)">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                            <Cpu className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {loading ? '...' : `${memoryPercentage}%`}
                            </h3>
                            <p className="text-sm text-gray-500">Heap Utilization</p>
                        </div>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Used</span>
                            <span className="font-mono">{loading ? '...' : formatBytes(usedMemory)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Total Allocated</span>
                            <span className="font-mono">{loading ? '...' : formatBytes(stats?.totalMemory || 0)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>Max Available</span>
                            <span className="font-mono">{loading ? '...' : formatBytes(stats?.maxMemory || 0)}</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
