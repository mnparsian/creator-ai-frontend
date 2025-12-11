import { useState } from "react";
import { isRTL } from "../utils/detectRTL";

export default function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    const rtl = isRTL(text);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className={`absolute bottom-4 ${rtl ? 'left-4' : 'right-4'} p-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md text-slate-400 hover:text-white hover:bg-white/20 hover:scale-105 hover:shadow-lg transition-all duration-300 z-10 group`}
            title="Copy to clipboard"
        >
            {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
            )}

            {/* Tooltip */}
            <span className={`absolute -top-10 ${rtl ? 'left-0' : 'right-0'} bg-[#0F0F14] text-white text-xs font-medium px-2 py-1 rounded-lg shadow-xl opacity-0 ${copied ? 'opacity-100 translate-y-0' : 'translate-y-2 pointer-events-none'} transition-all duration-300 whitespace-nowrap border border-white/10`}>
                {copied ? 'Copied!' : 'Copy'}
            </span>
        </button>
    );
}
