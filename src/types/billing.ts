export interface PaymentHistory {
    id: string;
    amount: number;
    currency: string;
    status: 'INITIATED' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
    date: string;
    planType: 'FREE' | 'PRO';
}

export interface CheckoutResponse {
    approvalUrl: string;
    paymentId: string;
}

export interface ConfirmPaymentRequest {
    paymentId: string;
}

export interface ConfirmPaymentResponse {
    status: string;
    plan: string;
}
