import React, { createContext, useContext, useEffect, useState } from 'react';
import httpClient from '../lib/httpClient';
import { tokenStorage } from '../lib/tokenStorage';

export interface User {
    id: string;
    email: string;
    role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
    name?: string;
}

interface AuthContextType {
    user: User | null;
    role: User['role'] | null;
    isLoading: boolean;
    login: (user: User, accessToken: string, refreshToken: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const initAuth = async () => {
        const refreshToken = tokenStorage.getRefreshToken();
        if (!refreshToken) {
            setIsLoading(false);
            return;
        }

        try {
            // Restore session by refreshing token (returns fresh User object)
            const response = await httpClient<{ accessToken: string; refreshToken: string; user: User }>('/auth/refresh', {
                method: 'POST',
                body: JSON.stringify({ refreshToken }),
                skipAuth: true // Don't use the potentially expired access token
            });

            tokenStorage.setAccessToken(response.accessToken);
            // Refresh token might remain the same or rotate depending on backend config
            tokenStorage.setRefreshToken(response.refreshToken);
            setUser(response.user);
        } catch (error) {
            console.error("Session restoration failed", error);
            tokenStorage.clearAccessToken();
            tokenStorage.clearRefreshToken();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        initAuth();
    }, []);

    const login = (userData: User, accessToken: string, refreshToken: string) => {
        tokenStorage.setAccessToken(accessToken);
        tokenStorage.setRefreshToken(refreshToken);
        setUser(userData);
    };

    const logout = async () => {
        const refreshToken = tokenStorage.getRefreshToken();
        if (refreshToken) {
            try {
                await httpClient('/auth/logout', {
                    method: 'POST',
                    body: JSON.stringify({ refreshToken }),
                    skipAuth: true
                });
            } catch (error) {
                console.error("Logout API call failed", error);
            }
        }
        tokenStorage.clearAccessToken();
        tokenStorage.clearRefreshToken();
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{
            user,
            role: user?.role || null,
            isLoading,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
