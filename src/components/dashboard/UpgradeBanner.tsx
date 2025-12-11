interface UpgradeBannerProps {
    onUpgrade: () => void;
}

export default function UpgradeBanner({ onUpgrade }: UpgradeBannerProps) {
    return (
        <div className="bg-gradient-to-r from-purple-600/10 to-fuchsia-500/10 dark:from-purple-600/10 dark:to-fuchsia-500/10 border border-purple-500/20 dark:border-purple-500/20 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-1">
                Unlock Pro Features
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                Get 1000 generations/month, full scripts, and SEO insights.
            </p>
            <div className="mb-3">
                <span className="inline-block px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                    Only €4.99/mo
                </span>
            </div>
            <button
                onClick={onUpgrade}
                className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white text-sm font-medium rounded-lg px-4 py-2 hover:shadow-lg hover:shadow-purple-500/30 transition-all"
            >
                Upgrade to Pro
            </button>
        </div>
    );
}
