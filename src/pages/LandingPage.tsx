import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function LandingPage() {
    const { user } = useAuth();
    const { t } = useLanguage();

    return (
        <div className="min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-fuchsia-900/20 to-transparent dark:from-purple-900/20 dark:via-fuchsia-900/20"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-50 mb-6">
                            {t("hero.title.prefix")}{' '}
                            <span className="bg-gradient-to-r from-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
                                {t("hero.title.highlight")}
                            </span>{' '}
                            {t("hero.title.suffix")}
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                            {t("hero.subtitle")}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {user ? (
                                <Link
                                    to="/dashboard"
                                    className="bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white font-medium rounded-xl px-8 py-3 hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
                                >
                                    <span>{t("hero.cta.dashboard")}</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/register"
                                        className="bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white font-medium rounded-xl px-8 py-3 hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                                    >
                                        {t("hero.cta.start")}
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="bg-transparent border border-slate-300 dark:border-slate-500/50 text-slate-900 dark:text-slate-50 font-medium rounded-xl px-8 py-3 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                                    >
                                        {t("hero.cta.login")}
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md rounded-2xl p-6">
                        <div className="text-4xl mb-4">🎬</div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                            {t("feature.yt.title")}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            {t("feature.yt.desc")}
                        </p>
                    </div>

                    <div className="bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md rounded-2xl p-6">
                        <div className="text-4xl mb-4">📱</div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                            {t("feature.tiktok.title")}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            {t("feature.tiktok.desc")}
                        </p>
                    </div>

                    <div className="bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md rounded-2xl p-6">
                        <div className="text-4xl mb-4">📸</div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                            {t("feature.insta.title")}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            {t("feature.insta.desc")}
                        </p>
                    </div>
                </div>
            </div>
            {/* Footer */}
            <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200 dark:border-white/10 mt-12">
                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 dark:text-slate-400">
                    <p>© {new Date().getFullYear()} {t("footer.rights")}</p>
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <a href="#" className="hover:text-slate-900 dark:hover:text-slate-50 transition-colors">{t("footer.privacy")}</a>
                        <a href="#" className="hover:text-slate-900 dark:hover:text-slate-50 transition-colors">{t("footer.terms")}</a>
                        <a href="mailto:support@mahdinazari.net" className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            support@mahdinazari.net
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
