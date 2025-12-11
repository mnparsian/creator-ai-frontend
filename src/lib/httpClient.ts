/// <reference types="vite/client" />
import { tokenStorage } from './tokenStorage';
import { logError } from './logger';

const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
    throw new Error("VITE_API_URL is missing! Set VITE_API_URL in a .env.production file.");
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(callback: (token: string) => void) {
    refreshSubscribers.push(callback);
}

function onTokenRefreshed(token: string) {
    refreshSubscribers.forEach(callback => callback(token));
    refreshSubscribers = [];
}

async function refreshAccessToken(): Promise<string | null> {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
        return null;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
            tokenStorage.clearAccessToken();
            tokenStorage.clearRefreshToken();
            window.location.href = '/login';
            return null;
        }

        const data = await response.json();
        tokenStorage.setAccessToken(data.accessToken);
        tokenStorage.setRefreshToken(data.refreshToken);
        return data.accessToken;
    } catch (error) {
        logError('Token refresh failed:', error);
        tokenStorage.clearAccessToken();
        tokenStorage.clearRefreshToken();
        window.location.href = '/login';
        return null;
    }
}

interface RequestOptions extends RequestInit {
    skipAuth?: boolean;
}

async function httpClient<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const { skipAuth, ...fetchOptions } = options;

    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(fetchOptions.headers as Record<string, string>),
    };

    // Add Authorization header if not skipped
    if (!skipAuth) {
        const token = tokenStorage.getAccessToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    const config: RequestInit = {
        ...fetchOptions,
        headers,
    };

    try {
        let response = await fetch(url, config);

        // Handle 401 - Unauthorized
        if (response.status === 401 && !skipAuth) {
            if (!isRefreshing) {
                isRefreshing = true;
                const newToken = await refreshAccessToken();
                isRefreshing = false;

                if (newToken) {
                    onTokenRefreshed(newToken);
                    // Retry original request with new token
                    headers['Authorization'] = `Bearer ${newToken}`;
                    response = await fetch(url, { ...config, headers });
                } else {
                    throw new Error('Token refresh failed');
                }
            } else {
                // Wait for the ongoing refresh
                const newToken = await new Promise<string>((resolve) => {
                    subscribeTokenRefresh(resolve);
                });
                headers['Authorization'] = `Bearer ${newToken}`;
                response = await fetch(url, { ...config, headers });
            }
        }

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Request failed' }));
            // Extract error message from backend response (check both 'error' and 'message' fields)
            const errorMessage = error.error || error.message || `HTTP ${response.status}`;
            throw new Error(errorMessage);
        }

        // Handle empty responses
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }

        return {} as T;
    } catch (error) {
        logError('HTTP request failed:', error);
        throw error;
    }
}

export default httpClient;
