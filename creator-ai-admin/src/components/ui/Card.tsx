import clsx from 'clsx';
import type { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    title?: string;
    description?: string;
}

export function Card({ children, className, title, description }: CardProps) {
    return (
        <div className={clsx("rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900", className)}>
            {(title || description) && (
                <div className="p-6 pb-2">
                    {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>}
                    {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}
