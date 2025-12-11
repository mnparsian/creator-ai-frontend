export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-12">
                <header className="border-b border-white/10 pb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Privacy Policy</h1>
                    <p className="mt-4 text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
                </header>

                <main className="space-y-8 text-base leading-relaxed">
                    <section>
                        <p>
                            Creator AI (“we”, “our”, “the Service”) provides AI-powered content generation tools as a digital online service.
                            This Privacy Policy explains how we collect, use, and protect your data.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-white">Information We Collect:</h2>
                        <ul className="list-disc pl-5 space-y-2 marker:text-purple-500">
                            <li>Account information (name, email)</li>
                            <li>Payment information processed securely by PayPal (we do NOT store credit card or banking details)</li>
                            <li>Usage data, logs, and preferences</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-white">How We Use Your Information:</h2>
                        <ul className="list-disc pl-5 space-y-2 marker:text-purple-500">
                            <li>To provide and improve the Service</li>
                            <li>To manage payments</li>
                            <li>To communicate important updates</li>
                            <li>For security and anti-abuse measures</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-white">Data Sharing:</h2>
                        <p>We do not sell personal data. We only share data with:</p>
                        <ul className="list-disc pl-5 space-y-2 marker:text-purple-500">
                            <li>PayPal (payment processing)</li>
                            <li>Essential technical service providers</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-white">Cookies:</h2>
                        <p>We use essential and analytical cookies.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-white">GDPR Rights:</h2>
                        <p>
                            You may request access, correction, deletion, or limitation of processing by emailing: <a href="mailto:support@mahdinazari.net" className="text-purple-400 hover:text-purple-300 underline">support@mahdinazari.net</a>
                        </p>
                    </section>

                    <section className="border-t border-white/10 pt-8 mt-12">
                        <h2 className="text-lg font-semibold text-white mb-2">Contact</h2>
                        <p>
                            If you have questions, please contact us at: <br />
                            <a href="mailto:support@mahdinazari.net" className="text-purple-400 hover:text-purple-300 font-medium">support@mahdinazari.net</a>
                        </p>
                    </section>
                </main>
            </div>
        </div>
    );
}
