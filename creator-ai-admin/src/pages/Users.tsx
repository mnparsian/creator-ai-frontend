import { useEffect, useState } from 'react';
import type { User } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import httpClient from '../lib/httpClient';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Trash2, Shield, Search, Plus, Crown } from 'lucide-react';
import { logError } from '../lib/logger';
import CreateUserModal from '../components/modals/CreateUserModal';
import ConfirmationModal from '../components/modals/ConfirmationModal';

interface UserWithMeta extends User {
    createdAt?: string;
    emailVerified?: boolean;
    currentPlan?: 'FREE' | 'PRO'; // Add plan field
}

// Response shape from Spring Boot Page<User>
interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

export default function UsersPage() {
    const { role: currentUserRole } = useAuth();
    const [users, setUsers] = useState<UserWithMeta[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal States
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; userId: string | null }>({ isOpen: false, userId: null });
    const [upgradeModal, setUpgradeModal] = useState<{ isOpen: boolean; userId: string | null }>({ isOpen: false, userId: null });
    const [isActionLoading, setIsActionLoading] = useState(false);

    // Debounce search could be better, but for now simple effect dependency
    const fetchUsers = async (pageIdx = 0, search = searchQuery) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: pageIdx.toString(),
                size: '10',
                sortBy: 'createdAt',
                direction: 'desc'
            });
            if (search) params.append('search', search);

            const url = `/admin/users?${params.toString()}`;
            console.log('Fetching Users:', url); // Debug
            const data = await httpClient<PageResponse<UserWithMeta>>(url);
            setUsers(data.content);
            setTotalPages(data.totalPages);
            setPage(data.number);
        } catch (error) {
            logError('Failed to fetch users', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Simple debounce for search
        const timer = setTimeout(() => {
            fetchUsers(0, searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleDeleteClick = (userId: string) => {
        setDeleteModal({ isOpen: true, userId });
    };

    const confirmDelete = async () => {
        if (!deleteModal.userId) return;
        setIsActionLoading(true);
        try {
            await httpClient(`/admin/users/${deleteModal.userId}`, { method: 'DELETE' });
            fetchUsers(page);
            setDeleteModal({ isOpen: false, userId: null });
        } catch (error) {
            alert('Failed to delete user. Ensure you have SUPER_ADMIN privileges.');
            logError('Delete failed', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleUpgradeClick = (userId: string) => {
        setUpgradeModal({ isOpen: true, userId });
    };

    const confirmUpgrade = async () => {
        if (!upgradeModal.userId) return;
        setIsActionLoading(true);
        try {
            await httpClient(`/admin/users/${upgradeModal.userId}/plan?plan=PRO`, { method: 'PUT' });
            fetchUsers(page); // Refresh list
            setUpgradeModal({ isOpen: false, userId: null });
        } catch (error) {
            logError('Plan upgrade failed', error);
            alert('Failed to upgrade user plan.');
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users by email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
                        />
                    </div>
                    {currentUserRole === 'SUPER_ADMIN' && (
                        <Button onClick={() => setIsCreateModalOpen(true)} size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Create User
                        </Button>
                    )}
                </div>
            </div>

            <Card className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                        <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase text-gray-700 dark:text-gray-300">
                            <tr>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Plan</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Joined</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center">Loading users...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center">No users found.</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {user.email}
                                                </span>
                                                <span className="text-xs text-gray-400">ID: {user.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                {user.role === 'SUPER_ADMIN' && <Shield className="h-3 w-3 text-purple-500" />}
                                                <span className={`font-medium ${user.role === 'SUPER_ADMIN' ? 'text-purple-600' : user.role === 'ADMIN' ? 'text-indigo-600' : ''}`}>
                                                    {user.role}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={user.currentPlan === 'PRO' ? 'success' : 'neutral'}>
                                                {user.currentPlan || 'FREE'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={user.emailVerified ? 'success' : 'warning'}>
                                                {user.emailVerified ? 'Verified' : 'Pending'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {user.currentPlan !== 'PRO' && (
                                                    <Button variant="outline" size="sm" onClick={() => handleUpgradeClick(user.id)} title="Upgrade to Pro">
                                                        <Crown className="h-4 w-4 text-amber-500" />
                                                    </Button>
                                                )}
                                                {currentUserRole === 'SUPER_ADMIN' && user.role !== 'SUPER_ADMIN' && (
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleDeleteClick(user.id)}
                                                        title="Delete User"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-3">
                    <div className="text-sm text-gray-500">
                        Page {page + 1} of {totalPages || 1}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={page === 0 || isLoading}
                            onClick={() => fetchUsers(page - 1)}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={page >= totalPages - 1 || isLoading}
                            onClick={() => fetchUsers(page + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </Card>

            <CreateUserModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => fetchUsers(0)}
            />

            {/* Confirmation Modals */}
            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, userId: null })}
                onConfirm={confirmDelete}
                title="Delete User"
                message="Are you sure you want to delete this user? This action cannot be undone."
                confirmText="Delete User"
                variant="danger"
                isLoading={isActionLoading}
            />

            <ConfirmationModal
                isOpen={upgradeModal.isOpen}
                onClose={() => setUpgradeModal({ isOpen: false, userId: null })}
                onConfirm={confirmUpgrade}
                title="Upgrade Plan"
                message="Are you sure you want to upgrade this user to the PRO plan?"
                confirmText="Upgrade to PRO"
                variant="warning" // Uses custom logic in component for amber style
                isLoading={isActionLoading}
            />
        </div>
    );
}
