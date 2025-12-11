import httpClient from "../lib/httpClient";
import { CheckoutResponse, ConfirmPaymentResponse, PaymentHistory } from "../types/billing";

const billingService = {
    startProCheckout: async (): Promise<CheckoutResponse> => {
        return await httpClient('/billing/pro/checkout', {
            method: 'POST',
        });
    },

    confirmProPayment: async (paymentId: string): Promise<ConfirmPaymentResponse> => {
        return await httpClient('/billing/pro/confirm', {
            method: 'POST',
            body: JSON.stringify({ paymentId }),
        });
    },

    getHistory: async (): Promise<PaymentHistory[]> => {
        return await httpClient('/billing/history');
    }
};

export default billingService;
