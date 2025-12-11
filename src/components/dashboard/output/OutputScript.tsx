import CopyButton from "../../CopyButton";
import { isRTL } from "../../../utils/detectRTL";

interface OutputScriptProps {
    longScript?: string;
    shortScript?: string;
    caption?: string;
}

export default function OutputScript({ longScript, shortScript, caption }: OutputScriptProps) {
    const text = longScript || shortScript || caption;
    if (!text) return null;
    const label = caption ? "Caption" : "Script";

    return (
        <div className={`relative bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-6 pb-16 shadow-sm ${isRTL(text) ? "text-right" : "text-left"}`} dir={isRTL(text) ? "rtl" : "ltr"}>
            <CopyButton text={text} />
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">{label}</h3>
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{text}</p>
        </div>
    );
}
