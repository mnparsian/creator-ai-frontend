import CopyButton from "../../CopyButton";
import { isRTL } from "../../../utils/detectRTL";

interface OutputSEOProps {
    description?: string;
    keywords?: string[];
    hashtags?: string[];
}

export default function OutputSEO({ description, keywords, hashtags }: OutputSEOProps) {
    if (!description && (!keywords || keywords.length === 0) && (!hashtags || hashtags.length === 0)) return null;

    const copyText = `Description:\n${description || ''}\n\nKeywords:\n${keywords?.join(', ') || ''}\n\nHashtags:\n${hashtags?.join(' ') || ''}`;

    return (
        <div className="relative bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-6 pb-16 shadow-sm">
            <CopyButton text={copyText} />
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">SEO Insights</h3>
            <div className={`space-y-4 ${isRTL(description || '') ? "text-right" : "text-left"}`} dir={isRTL(description || '') ? "rtl" : "ltr"}>
                {description && (
                    <div>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 uppercase">Description</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{description}</p>
                    </div>
                )}
                {keywords && keywords.length > 0 && (
                    <div className="text-left" dir="ltr"> {/* Keywords usually LTR even in RTL context */}
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 uppercase">Keywords</p>
                        <div className="flex flex-wrap gap-2">
                            {keywords.map((kw, idx) => (
                                <span key={idx} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded">
                                    {kw}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                {hashtags && hashtags.length > 0 && (
                    <div className="text-left" dir="ltr"> {/* Hashtags usually LTR */}
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 uppercase">Hashtags</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            {hashtags.join(' ')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
