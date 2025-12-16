let refreshTokenMemory: string | null = null;
// TODO: Migrate to HttpOnly cookies for better security

export const tokenStorage = {
    getAccessToken: () => localStorage.getItem('accessToken'),
    setAccessToken: (token: string) => localStorage.setItem('accessToken', token),
    clearAccessToken: () => localStorage.removeItem('accessToken'),

    getRefreshToken: () => refreshTokenMemory,
    setRefreshToken: (token: string) => { refreshTokenMemory = token; },
    clearRefreshToken: () => { refreshTokenMemory = null; },
};
