import { useLanguage } from '../context/LanguageContext';

export default function PrivacyPolicyPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-12">
                <header className="border-b border-white/10 pb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{t("privacy.title")}</h1>
                    <p className="mt-4 text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
                </header>

                <main className="space-y-8 text-base leading-relaxed">
                    <section>
                        <p>
                            {t("privacy.intro")}
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-white">{t("privacy.collect.title")}</h2>
                        <ul className="list-disc pl-5 space-y-2 marker:text-purple-500">
                            <li>{t("privacy.collect.1")}</li>
                            <li>{t("privacy.collect.2")}</li>
                            <li>{t("privacy.collect.3")}</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-white">{t("privacy.use.title")}</h2>
                        <ul className="list-disc pl-5 space-y-2 marker:text-purple-500">
                            <li>{t("privacy.use.1")}</li>
                            <li>{t("privacy.use.2")}</li>
                            <li>{t("privacy.use.3")}</li>
                            <li>{t("privacy.use.4")}</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-white">{t("privacy.sharing.title")}</h2>
                        <p>{t("privacy.sharing.desc")}</p>
                        <ul className="list-disc pl-5 space-y-2 marker:text-purple-500">
                            <li>{t("privacy.sharing.1")}</li>
                            <li>{t("privacy.sharing.2")}</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-white">{t("privacy.cookies.title")}</h2>
                        <p>{t("privacy.cookies.desc")}</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-white">{t("privacy.gdpr.title")}</h2>
                        <p>
                            {t("privacy.gdpr.desc")} <a href="mailto:support@mahdinazari.net" className="text-purple-400 hover:text-purple-300 underline">support@mahdinazari.net</a>
                        </p>
                    </section>

                    <section className="border-t border-white/10 pt-8 mt-12">
                        <h2 className="text-lg font-semibold text-white mb-2">{t("privacy.contact.title")}</h2>
                        <p>
                            {t("privacy.contact.desc")} <br />
                            <a href="mailto:support@mahdinazari.net" className="text-purple-400 hover:text-purple-300 font-medium">support@mahdinazari.net</a>
                        </p>
                    </section>
                </main>
            </div>
        </div>
    );
}
