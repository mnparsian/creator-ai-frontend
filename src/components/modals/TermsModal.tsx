import { useEffect, useRef } from 'react';

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export default function TermsModal({ isOpen, onClose, onConfirm, isLoading = false }: TermsModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent scrolling body when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
            <div
                ref={modalRef}
                className="relative w-full max-w-2xl bg-slate-900/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-white/5">
                    <h2 className="text-xl font-bold text-white">Terms & Conditions</h2>
                    <p className="text-sm text-slate-400 mt-1">Please review and agree to continue.</p>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 text-slate-300 text-sm space-y-4 custom-scrollbar">
                    <p>
                        Creator AI is a digital AI-powered service. By using this website or purchasing access, you agree to these terms.
                    </p>

                    <div className="space-y-4">
                        <section>
                            <h3 className="text-white font-semibold mb-1">1. Service</h3>
                            <p>You receive instant digital access to AI tools. No physical goods are provided.</p>
                        </section>

                        <section>
                            <h3 className="text-white font-semibold mb-1">2. Payment</h3>
                            <p>Price: €4.99 one-time payment (not subscription, no auto-renew).</p>
                            <p>Access is granted immediately after successful payment.</p>
                        </section>

                        <section>
                            <h3 className="text-white font-semibold mb-1">3. Refunds</h3>
                            <p>Refunds follow PayPal policies. Since the service is digital, refunds may be limited unless required by EU law.</p>
                        </section>

                        <section>
                            <h3 className="text-white font-semibold mb-1">4. Acceptable Use</h3>
                            <p>Do not use the platform for illegal activities or to generate harmful content. Violations may result in restriction or termination.</p>
                        </section>

                        <section>
                            <h3 className="text-white font-semibold mb-1">5. Liability</h3>
                            <p>We make no guarantees about outcomes or accuracy of generated content. Users are responsible for how outputs are used.</p>
                        </section>

                        <section>
                            <h3 className="text-white font-semibold mb-1">6. Updates</h3>
                            <p>Terms may be updated at any time. Continued use means acceptance.</p>
                        </section>
                    </div>
                </div>

                {/* Footer / Actions */}
                <div className="p-6 border-t border-white/10 bg-white/5 flex flex-col sm:flex-row gap-3 justify-end">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors font-medium border border-transparent hover:border-white/10 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Processing...
                            </>
                        ) : (
                            'Agree & Continue'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
