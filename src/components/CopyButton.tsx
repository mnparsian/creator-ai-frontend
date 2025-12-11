import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
    };

    return (
        <button
            onClick={handleCopy}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition z-10"
            title="Copy to clipboard"
        >
            {copied ? '✅' : '📋'}
            {copied && (
                <span className="absolute -top-8 right-0 bg-black dark:bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                    Copied!
                </span>
            )}
        </button>
    );
}
