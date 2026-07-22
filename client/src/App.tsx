import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/enterprise.css';
import './styles/dashboard-enhanced.css';
import './styles/dashboard.css';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import PremiumLandingPage from './pages/PremiumLandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import EnhancedDashboardPage from './pages/EnhancedDashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import EnhancedFraudAnalysisPage from './pages/EnhancedFraudAnalysisPage';
import NetworkPage from './pages/NetworkPage';
import EnhancedReportPage from './pages/EnhancedReportPage';
import SettingsPage from './pages/SettingsPage';
import CommandPalette from './components/CommandPalette';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <CommandPalette />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PremiumLandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <EnhancedDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <TransactionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fraud-analysis"
            element={
              <ProtectedRoute>
                <EnhancedFraudAnalysisPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/network"
            element={
              <ProtectedRoute>
                <NetworkPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <EnhancedReportPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
