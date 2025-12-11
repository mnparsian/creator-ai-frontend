import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    const { t, locale, setLocale } = useLanguage();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="border-b border-white/10 dark:border-white/10 bg-[#0F0F14]/80 dark:bg-[#0F0F14]/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-3 group">
                            {/* 3D Badge Logo - The image itself carries the 3D look with dark background */}
                            <img
                                src="/logo1.png"
                                alt="Creator AI Logo"
                                className="w-10 h-10 object-contain rounded-xl drop-shadow-2xl transition-transform duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                            />
                            <span className="text-lg font-semibold text-slate-50 dark:text-slate-50">
                                {t("nav.brand")}
                            </span>
                        </Link>
                        <span className="hidden md:block text-sm text-slate-400 dark:text-slate-400">
                            {t("nav.tagline")}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="text-slate-300 dark:text-slate-300 hover:text-slate-50 dark:hover:text-slate-50 transition-colors"
                                >
                                    {t("nav.dashboard")}
                                </Link>
                                <Link
                                    to="/account"
                                    className="text-slate-300 dark:text-slate-300 hover:text-slate-50 dark:hover:text-slate-50 transition-colors"
                                >
                                    {t("nav.account")}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                >
                                    {t("nav.logout")}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-slate-300 dark:text-slate-300 hover:text-slate-50 dark:hover:text-slate-50 transition-colors"
                                >
                                    {t("nav.login")}
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white font-medium rounded-xl px-4 py-2 hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                                >
                                    {t("nav.signup")}
                                </Link>
                            </>
                        )}
                        <ThemeToggle />
                        <button
                            onClick={() => setLocale(locale === 'en' ? 'it' : 'en')}
                            className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-colors"
                        >
                            {locale === 'en' ? 'IT' : 'EN'}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
