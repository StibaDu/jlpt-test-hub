import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';

// Page components (lazy loaded for code splitting)
const Login = React.lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Signup = React.lazy(() => import('./pages/Signup').then(m => ({ default: m.Signup })));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword').then(m => ({ default: m.ResetPassword })));
const VerifyEmail = React.lazy(() => import('./pages/VerifyEmail').then(m => ({ default: m.VerifyEmail })));
const Dashboard = React.lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Upgrade = React.lazy(() => import('./pages/Upgrade').then(m => ({ default: m.Upgrade })));
const TestPage = React.lazy(() => import('./pages/TestPage').then(m => ({ default: m.TestPage })));
const Intro = React.lazy(() => import('./pages/Intro').then(m => ({ default: m.Intro })));

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Auth routes — redirect to dashboard if already logged in */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
      <Route path="/verify-email" element={<PublicRoute><VerifyEmail /></PublicRoute>} />

      {/* Public — anyone can use the app without an account */}
      <Route path="/" element={<Intro />} />
      <Route path="/test/:level/:mode" element={<TestPage />} />

      {/* Protected — account features only */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upgrade"
        element={
          <ProtectedRoute>
            <Upgrade />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
      </div>
    }>
      <AppRoutes />
    </React.Suspense>
  );
}