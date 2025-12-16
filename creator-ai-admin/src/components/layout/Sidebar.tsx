import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    CreditCard,
    BarChart3,
    FileText,
    Server,
    Settings,
    X
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const location = useLocation();
    const { role } = useAuth();

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Users', href: '/users', icon: Users },
        { name: 'Payments', href: '/payments', icon: CreditCard },
        { name: 'Analytics', href: '/analytics', icon: BarChart3 },
        { name: 'Content Usage', href: '/content', icon: FileText },
        // System is strictly Super Admin only
        { name: 'System', href: '/system', icon: Server, hidden: role !== 'SUPER_ADMIN' },
        { name: 'Settings', href: '/settings', icon: Settings },
    ];

    return (
        <>
            {/* Mobile backdrop */}
            <div
                className={clsx(
                    "fixed inset-0 z-40 bg-gray-900/50 transition-opacity lg:hidden",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className={clsx(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Creator AI Admin</span>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {navigation.map((item) => (
                        !item.hidden && (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={clsx(
                                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                    location.pathname === item.href
                                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
                                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        )
                    ))}
                </nav>
            </div>
        </>
    );
}
