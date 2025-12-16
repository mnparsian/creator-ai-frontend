import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Search } from 'lucide-react';
import httpClient from '../lib/httpClient';
import { logError } from '../lib/logger';

interface ContentRecord {
    id: string;
    userEmail: string; // Added
    contentType: string;
    ideaText: string; // Changed from prompt to match DTO
    brandVoice?: string;
    resultJson?: string;
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

export default function Content() {
    const [data, setData] = useState<PageData<ContentRecord> | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchContent = async (pageIdx: number, search = searchQuery) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pageIdx.toString(),
                size: '10',
                sortBy: 'createdAt',
                direction: 'desc'
            });
            if (search) params.append('search', search);

            const response = await httpClient<PageData<ContentRecord>>(`/admin/content?${params.toString()}`);
            setData(response);
            setPage(response.number); // Sync page from server
        } catch (error) {
            logError('Failed to fetch content history', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Debounce search
        const timer = setTimeout(() => {
            fetchContent(0, searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Only handle explicit page changes via pagination
    const handlePageChange = (newPage: number) => {
        fetchContent(newPage, searchQuery);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content Usage</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Generated AI content logs</p>
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
                    <Button variant="outline" size="sm" onClick={() => fetchContent(page, searchQuery)}>Refresh</Button>
                </div>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                            <tr>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Idea / Prompt</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center">Loading...</td>
                                </tr>
                            ) : !data ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-red-500">
                                        Failed to load data. Please check backend connection.
                                    </td>
                                </tr>
                            ) : data.content.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center">No records found.</td>
                                </tr>
                            ) : (
                                data.content.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="px-6 py-4">
                                            <Badge variant="neutral">{item.contentType}</Badge>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {item.userEmail}
                                        </td>
                                        <td className="px-6 py-4 max-w-xs truncate" title={item.ideaText}>
                                            {item.ideaText}
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(item.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-gray-400">{item.id.substring(0, 8)}...</td>
                                    </tr>
                                ))
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
