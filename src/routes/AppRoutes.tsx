import { Routes, Route } from 'react-router-dom';
import AppLayout from '../layout/AppLayout';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import VerifyEmailPage from '../pages/VerifyEmailPage';
import VerifySuccessPage from '../pages/VerifySuccessPage';
import AccountSettingsPage from '../pages/AccountSettingsPage';
import BillingSuccessPage from '../pages/BillingSuccessPage';
import ProtectedRoute from '../components/routes/ProtectedRoute';

import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<AppLayout />}>
                <Route index element={<LandingPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="verify" element={<VerifyEmailPage />} />
                <Route path="verify-success" element={<VerifySuccessPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />
                <Route path="reset-password" element={<ResetPasswordPage />} />
                <Route
                    path="dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="account"
                    element={
                        <ProtectedRoute>
                            <AccountSettingsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="billing/success"
                    element={
                        <ProtectedRoute>
                            <BillingSuccessPage />
                        </ProtectedRoute>
                    }
                />
            </Route>
        </Routes>
    );
}
