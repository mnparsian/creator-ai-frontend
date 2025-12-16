import { Button } from '../ui/Button';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'primary' | 'warning';
    isLoading?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'primary',
    isLoading = false
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        {variant === 'danger' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                        {variant === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-500" />}
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
                </div>

                <div className="flex justify-end gap-3 p-4 bg-gray-50 dark:bg-gray-800/50">
                    <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant === 'warning' ? 'primary' : variant} // Map warning to primary button style if needed, or keep logic simple
                        className={variant === 'warning' ? 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 text-white border-transparent' : ''}
                        size="sm"
                        onClick={onConfirm}
                        isLoading={isLoading}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
}
