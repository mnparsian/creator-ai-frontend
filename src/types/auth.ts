export interface User {
    email: string;
    role: string;
    currentPlan: 'FREE' | 'PRO';
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface Subscription {
    plan: 'FREE' | 'PRO';
    monthlyQuota: number;
    usedThisPeriod: number;
    nextReset: string;
}
