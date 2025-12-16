import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function PrivateRoutes() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        // TODO: Replace with proper loading spinner
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-gray-500 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
                <h1 className="text-2xl font-bold text-red-600">Access Denied (403)</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">You do not have permission to view the Admin Panel.</p>
            </div>
        );
    }

    return <Outlet />;
}
