import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { BudgetPage } from './components/Budget';
import { Reports } from './components/Reports';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Settings } from './components/Settings';
import { SubscriptionPage } from './components/Subscription';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AIProvider } from './contexts/AIContext';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: React.PropsWithChildren) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-background-dark">
            <span className="material-symbols-outlined text-primary text-4xl animate-spin">sync</span>
        </div>
    ); 
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Layout>{children}</Layout>;
};

const App = () => {
  return (
    <AuthProvider>
      <AIProvider>
        <HashRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
            <Route path="/budget" element={<ProtectedRoute><BudgetPage /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/subscription" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
            <Route path="/cards" element={<ProtectedRoute><div className="p-8 text-white">Cards Feature Coming Soon</div></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </AIProvider>
    </AuthProvider>
  );
};

export default App;
