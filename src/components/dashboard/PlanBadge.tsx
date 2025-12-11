type PlanType = 'FREE' | 'PRO';

interface PlanBadgeProps {
    plan: PlanType;
}

export default function PlanBadge({ plan }: PlanBadgeProps) {
    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${plan === 'PRO'
                ? 'bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
            {plan === 'PRO' && <span>✨</span>}
            {plan} Plan
        </div>
    );
}
