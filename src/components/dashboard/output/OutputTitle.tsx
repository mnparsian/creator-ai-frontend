import CopyButton from "../../CopyButton";
import { isRTL } from "../../../utils/detectRTL";

export default function OutputTitle({ title }: { title?: string }) {
    if (!title) return null;
    return (
        <div className={`relative bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-6 shadow-sm ${isRTL(title) ? "text-right" : "text-left"}`} dir={isRTL(title) ? "rtl" : "ltr"}>
            <CopyButton text={title} />
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Title</h3>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">{title}</p>
        </div>
    );
}
