export function isRTL(text: string): boolean {
    if (!text) return false;
    const rtlPattern = /[\u0600-\u06FF]/;
    return rtlPattern.test(text);
}
