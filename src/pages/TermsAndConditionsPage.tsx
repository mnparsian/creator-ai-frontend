export default function TermsAndConditionsPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-12">
                <header className="border-b border-white/10 pb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Terms & Conditions</h1>
                    <p className="mt-4 text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
                </header>

                <main className="space-y-10 text-base leading-relaxed">
                    <section>
                        <p className="text-lg">
                            Creator AI is a digital AI-powered service. By using this website or purchasing access, you agree to these terms.
                        </p>
                    </section>

                    <div className="space-y-8">
                        <section className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                            <h2 className="text-xl font-semibold text-white mb-3">1. Service</h2>
                            <p>You receive instant digital access to AI tools. No physical goods are provided.</p>
                        </section>

                        <section className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                            <h2 className="text-xl font-semibold text-white mb-3">2. Payment</h2>
                            <p>Price: €4.99 one-time payment (not subscription, no auto-renew).</p>
                            <p className="mt-2 text-slate-400 text-sm">Access is granted immediately after successful payment.</p>
                        </section>

                        <section className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                            <h2 className="text-xl font-semibold text-white mb-3">3. Refunds</h2>
                            <p>Refunds follow PayPal policies. Since the service is digital, refunds may be limited unless required by EU law.</p>
                        </section>

                        <section className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                            <h2 className="text-xl font-semibold text-white mb-3">4. Acceptable Use</h2>
                            <p>Do not use the platform for illegal activities or to generate harmful content. Violations may result in restriction or termination.</p>
                        </section>

                        <section className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                            <h2 className="text-xl font-semibold text-white mb-3">5. Liability</h2>
                            <p>We make no guarantees about outcomes or accuracy of generated content. Users are responsible for how outputs are used.</p>
                        </section>

                        <section className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                            <h2 className="text-xl font-semibold text-white mb-3">6. Updates</h2>
                            <p>Terms may be updated at any time. Continued use means acceptance.</p>
                        </section>
                    </div>

                    <section className="border-t border-white/10 pt-8 mt-12">
                        <p className="text-sm text-slate-500">
                            If necessary, this document allows for additional optional sections like "Governing Law", "Age Requirement (18+)", or “Limitation of Liability” to be appended here.
                        </p>
                    </section>
                </main>
            </div>
        </div>
    );
}
