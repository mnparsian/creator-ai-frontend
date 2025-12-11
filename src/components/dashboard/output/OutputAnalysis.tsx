import { Analysis } from "../../../types/content";

export default function OutputAnalysis({ analysis }: { analysis?: Analysis }) {
    if (!analysis) return null;

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 border border-indigo-100 dark:border-indigo-900/20 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-4">
                📈 Viral Performance Analysis
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center bg-white dark:bg-white/5 p-3 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{analysis.retention_score}</div>
                    <div className="text-xs text-slate-500">Retention</div>
                </div>
                <div className="text-center bg-white dark:bg-white/5 p-3 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{analysis.viral_score}</div>
                    <div className="text-xs text-slate-500">Viral Score</div>
                </div>
                <div className="text-center bg-white dark:bg-white/5 p-3 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analysis.platform_match}%</div>
                    <div className="text-xs text-slate-500">Platform Fit</div>
                </div>
            </div>
        </div>
    );
}
