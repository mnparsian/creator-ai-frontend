import CopyButton from "../../CopyButton";
import { isRTL } from "../../../utils/detectRTL";

export default function OutputOutline({ outline }: { outline?: string }) {
    if (!outline) return null;
    return (
        <div className={`relative bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-6 shadow-sm ${isRTL(outline) ? "text-right" : "text-left"}`} dir={isRTL(outline) ? "rtl" : "ltr"}>
            <CopyButton text={outline} />
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Outline</h3>
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{outline}</p>
        </div>
    );
}
