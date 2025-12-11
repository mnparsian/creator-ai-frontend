export const translations = {
    en: {
        // Navbar
        "nav.brand": "Creator AI",
        "nav.tagline": "AI content generator for creators",
        "nav.dashboard": "Dashboard",
        "nav.account": "Account",
        "nav.logout": "Log Out",
        "nav.login": "Login",
        "nav.signup": "Sign Up",

        // Hero
        "hero.title.prefix": "Create content",
        "hero.title.highlight": "10x faster",
        "hero.title.suffix": "with AI",
        "hero.subtitle": "YouTube scripts, TikTok hooks, Instagram captions — all in one place.",
        "hero.cta.dashboard": "Go to Dashboard",
        "hero.cta.start": "Get Started",
        "hero.cta.login": "Login",

        // Features
        "feature.yt.title": "YouTube Scripts",
        "feature.yt.desc": "Generate engaging long-form scripts with hooks, outlines, and SEO optimization.",
        "feature.tiktok.title": "TikTok/Reels Scripts",
        "feature.tiktok.desc": "Create punchy short-form content that captures attention in seconds.",
        "feature.insta.title": "Instagram Captions",
        "feature.insta.desc": "Craft compelling captions with hashtags and keywords for maximum reach.",

        // Footer
        "footer.rights": "Creator AI. All rights reserved.",
        "footer.privacy": "Privacy",
        "footer.terms": "Terms",
        "footer.help": "Need Help?"
    },
    it: {
        // Navbar
        "nav.brand": "Creator AI",
        "nav.tagline": "Generatore di contenuti AI per creator",
        "nav.dashboard": "Dashboard",
        "nav.account": "Account",
        "nav.logout": "Esci",
        "nav.login": "Accedi",
        "nav.signup": "Iscriviti",

        // Hero
        "hero.title.prefix": "Crea contenuti",
        "hero.title.highlight": "10x più veloce",
        "hero.title.suffix": "con l'IA",
        "hero.subtitle": "Script YouTube, ganci TikTok, didascalie Instagram — tutto in un unico posto.",
        "hero.cta.dashboard": "Vai alla Dashboard",
        "hero.cta.start": "Inizia Ora",
        "hero.cta.login": "Accedi",

        // Features
        "feature.yt.title": "Script YouTube",
        "feature.yt.desc": "Genera script lunghi e coinvolgenti con ganci, scalette e ottimizzazione SEO.",
        "feature.tiktok.title": "Script TikTok/Reels",
        "feature.tiktok.desc": "Crea contenuti brevi e incisivi che catturano l'attenzione in pochi secondi.",
        "feature.insta.title": "Didascalie Instagram",
        "feature.insta.desc": "Crea didascalie accattivanti con hashtag e parole chiave per la massima portata.",

        // Footer
        "footer.rights": "Creator AI. Tutti i diritti riservati.",
        "footer.privacy": "Privacy",
        "footer.terms": "Termini",
        "footer.help": "Serve Aiuto?"
    }
};

export type Locale = 'en' | 'it';
export type TranslationKey = keyof typeof translations.en;
