import { ReactNode } from 'react';

interface AuthCardProps {
    title: string;
    subtitle: string;
    children: ReactNode;
    footer?: ReactNode;
}

export default function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">
                <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-8 backdrop-blur shadow-lg dark:shadow-none">
                    <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
                        {title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8">
                        {subtitle}
                    </p>

                    {children}

                    {footer && (
                        <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
