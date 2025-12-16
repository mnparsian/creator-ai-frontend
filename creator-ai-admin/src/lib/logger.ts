const isProduction = import.meta.env.PROD;

export function logError(message: string, error?: unknown) {
    if (!isProduction) {
        console.error(message, error);
    }
    // In production, we might want to send this to a service
}

export function logInfo(message: string, data?: unknown) {
    if (!isProduction) {
        console.log(message, data);
    }
}
