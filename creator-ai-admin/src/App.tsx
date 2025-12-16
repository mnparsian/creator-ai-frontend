import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoutes } from './routes/PrivateRoutes';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/Login';
import DashboardHelper from './pages/Dashboard';
import UsersPage from './pages/Users';
import PaymentsPage from './pages/Payments';
import ContentPage from './pages/Content';
import AnalyticsPage from './pages/Analytics';
import SystemPage from './pages/System';

import SettingsPage from './pages/Settings';

// Placeholder Helpers for other pages to avoid build errors
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-4">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{title}</h1>
    <div className="p-8 border border-dashed border-gray-300 rounded-lg dark:border-gray-700 text-center text-gray-500">
      Page under construction
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Admin Routes */}
          <Route element={<PrivateRoutes />}>
            <Route element={<AdminLayout />}>
              <Route path="/" element={<DashboardHelper />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/payments" element={<PaymentsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/content" element={<ContentPage />} />
              <Route path="/system" element={<SystemPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
