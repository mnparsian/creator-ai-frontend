import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Search } from 'lucide-react';
import httpClient from '../lib/httpClient';
import { logError } from '../lib/logger';

interface Payment {
    id: string;
    userId: string;
    userEmail: string; // Added from DTO
    amount: number;
    currency: string;
    status: string;
    provider: string;
    createdAt: string;
}

interface PageData<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    first: boolean;
    last: boolean;
    number: number;
}

export default function Payments() {
    const [data, setData] = useState<PageData<Payment> | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchPayments = async (pageIdx: number, search = searchQuery) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pageIdx.toString(),
                size: '10',
                sortBy: 'createdAt',
                direction: 'desc'
            });
            if (search) params.append('search', search);

            const response = await httpClient<PageData<Payment>>(`/admin/payments?${params.toString()}`);
            setData(response);
            setPage(response.number); // Sync page from server
        } catch (error) {
            logError('Failed to fetch payments', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Debounce search
        const timer = setTimeout(() => {
            fetchPayments(0, searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Page change effect removed to avoid double fetch with search effect
    // Only handle explicit page changes via pagination
    const handlePageChange = (newPage: number) => {
        fetchPayments(newPage, searchQuery);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payments</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Transaction history across the platform</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
                        />
                    </div>
                    <Button variant="outline" size="sm" onClick={() => fetchPayments(page, searchQuery)}>Refresh</Button>
                </div>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                            <tr>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Provider</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center">Loading...</td>
                                </tr>
                            ) : !data ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-red-500">
                                        Failed to load data. Please check backend connection.
                                    </td>
                                </tr>
                            ) : data.content.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center">No records found.</td>
                                </tr>
                            ) : (
                                data.content.map((payment) => {
                                    const getStatusVariant = (status: string) => {
                                        switch (status) {
                                            case 'SUCCESS':
                                            case 'COMPLETED':
                                                return 'success';
                                            case 'INITIATED':
                                            case 'PENDING':
                                                return 'warning';
                                            case 'FAILED':
                                                return 'danger';
                                            default:
                                                return 'neutral';
                                        }
                                    };

                                    return (
                                        <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td className="px-6 py-4 font-mono text-xs text-gray-400">{payment.id.substring(0, 8)}...</td>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                                {payment.userEmail}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                                {payment.amount} {payment.currency}
                                            </td>
                                            <td className="px-6 py-4 uppercase text-xs">{payment.provider}</td>
                                            <td className="px-6 py-4">
                                                <Badge variant={getStatusVariant(payment.status)}>
                                                    {payment.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(payment.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {data && (
                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900 sm:px-6">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            Page <span className="font-medium">{data.number + 1}</span> of <span className="font-medium">{data.totalPages}</span>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={data.first}
                                onClick={() => handlePageChange(data.number - 1)}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={data.last}
                                onClick={() => handlePageChange(data.number + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
