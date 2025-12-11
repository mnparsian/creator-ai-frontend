import { ContentHistoryResponse } from '../../types/content';

interface HistoryListProps {
    items: ContentHistoryResponse[];
    onSelect: (id: string) => void;
}

export default function HistoryList({ items, onSelect }: HistoryListProps) {
    if (items.length === 0) {
        return (
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-6 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    No history yet
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Recent Generations
            </h3>
            <div className="space-y-2">
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onSelect(item.id)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                    >
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                            {item.contentType.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}
