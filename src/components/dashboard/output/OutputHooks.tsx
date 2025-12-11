import CopyButton from "../../CopyButton";
import { isRTL } from "../../../utils/detectRTL";

export default function OutputHooks({ hooks }: { hooks?: string[] }) {
    if (!hooks || hooks.length === 0) return null;
    const content = hooks.join('\n');
    const rtl = isRTL(hooks[0]);

    return (
        <div className={`relative bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-6 shadow-sm ${rtl ? "text-right" : "text-left"}`} dir={rtl ? "rtl" : "ltr"}>
            <CopyButton text={content} />
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">Hooks</h3>
            <ul className="space-y-2">
                {hooks.map((hook, idx) => (
                    <li key={idx} className="text-slate-700 dark:text-slate-300">
                        {idx + 1}. {hook}
                    </li>
                ))}
            </ul>
        </div>
    );
}
