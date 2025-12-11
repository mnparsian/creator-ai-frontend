import React, { createContext, useContext, useEffect, useState } from 'react';
import httpClient from '../lib/httpClient';
import { tokenStorage } from '../lib/tokenStorage';
import { logError } from '../lib/logger';
import type { User, AuthResponse, Subscription } from '../types/auth';
import { parseJwt } from '../utils/jwt';

interface AuthContextType {
    user: User | null;
    subscription: Subscription | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    register: (email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loadSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = tokenStorage.getAccessToken();
            if (token) {
                try {
                    await loadSubscription();
                } catch (error) {
                    logError('Failed to load user data:', error);
                    tokenStorage.clearAccessToken();
                    tokenStorage.clearRefreshToken();
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const register = async (email: string, password: string) => {
        await httpClient('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            skipAuth: true,
        });
    };

    const login = async (email: string, password: string) => {
        const response = await httpClient<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            skipAuth: true,
        });

        tokenStorage.setAccessToken(response.accessToken);
        tokenStorage.setRefreshToken(response.refreshToken);
        setUser(response.user);

        // Load subscription data
        await loadSubscription();
    };

    const logout = async () => {
        const refreshToken = tokenStorage.getRefreshToken();

        try {
            if (refreshToken) {
                await httpClient('/auth/logout', {
                    method: 'POST',
                    body: JSON.stringify({ refreshToken }),
                });
            }
        } catch (error) {
            logError('Logout request failed:', error);
        } finally {
            tokenStorage.clearAccessToken();
            tokenStorage.clearRefreshToken();
            setUser(null);
            setSubscription(null);
        }
    };

    const loadSubscription = async () => {
        try {
            const data = await httpClient<Subscription>('/subscription/me');
            setSubscription(data);

            // Also update user's current plan
            if (user) {
                setUser({ ...user, currentPlan: data.plan });
            } else {
                // If we don't have user data yet, create a minimal user object
                // This happens when reloading the page with a valid token
                const token = tokenStorage.getAccessToken();
                let email = '';
                if (token) {
                    const decoded = parseJwt(token);
                    if (decoded && decoded.sub) {
                        email = decoded.sub; // 'sub' usually holds the email/username in JWT
                    } else if (decoded && decoded.email) {
                        email = decoded.email;
                    }
                }

                setUser({
                    email: email,
                    role: 'USER',
                    currentPlan: data.plan,
                });
            }
        } catch (error) {
            logError('Failed to load subscription:', error);
            throw error;
        }
    };

    const value: AuthContextType = {
        user,
        subscription,
        accessToken: tokenStorage.getAccessToken(),
        refreshToken: tokenStorage.getRefreshToken(),
        isAuthenticated: !!user && !!tokenStorage.getAccessToken(),
        isLoading,
        register,
        login,
        logout,
        loadSubscription,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
