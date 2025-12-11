import { useLanguage } from '../context/LanguageContext';

export default function TermsAndConditionsPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-12">
                <header className="border-b border-white/10 pb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{t("terms.title")}</h1>
                    <p className="mt-4 text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
                </header>

                <main className="space-y-10 text-base leading-relaxed">
                    <section>
                        <p className="text-lg">
                            {t("terms.intro")}
                        </p>
                    </section>

                    <div className="space-y-8">
                        <section className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                            <h2 className="text-xl font-semibold text-white mb-3">{t("terms.1.title")}</h2>
                            <p>{t("terms.1.desc")}</p>
                        </section>

                        <section className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                            <h2 className="text-xl font-semibold text-white mb-3">{t("terms.2.title")}</h2>
                            <p>{t("terms.2.desc.1")}</p>
                            <p className="mt-2 text-slate-400 text-sm">{t("terms.2.desc.2")}</p>
                        </section>

                        <section className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                            <h2 className="text-xl font-semibold text-white mb-3">{t("terms.3.title")}</h2>
                            <p>{t("terms.3.desc")}</p>
                        </section>

                        <section className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                            <h2 className="text-xl font-semibold text-white mb-3">{t("terms.4.title")}</h2>
                            <p>{t("terms.4.desc")}</p>
                        </section>

                        <section className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                            <h2 className="text-xl font-semibold text-white mb-3">{t("terms.5.title")}</h2>
                            <p>{t("terms.5.desc")}</p>
                        </section>

                        <section className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                            <h2 className="text-xl font-semibold text-white mb-3">{t("terms.6.title")}</h2>
                            <p>{t("terms.6.desc")}</p>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}
