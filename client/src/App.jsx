// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import Home from './pages/HomePage';
import Add from './pages/AddTransactionPage';
import Transactions from './pages/TransactionsPage';
import Analytics from './pages/AnalyticsPage';
import CustomNavbar from './components/CustomNavBar';

// 🔐 Route guard to protect private routes
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return null; // 🚦 Optionally replace with a loader/spinner

  return isLoggedIn ? children : <Navigate to="/auth" />;
};

// 📦 Wraps all protected routes with the global navbar layout
const AppLayout = ({ children }) => (
  <>
    <CustomNavbar />
    {children}
  </>
);

// 🧭 Define all app routes
const AppRoutes = () => {
  const { login } = useAuth(); // used for AuthPage

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/auth" element={<AuthPage onLogin={login} />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Home />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/add"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Add />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Transactions />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Analytics />
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

// 🌐 Root App Component wrapped with Auth Context and Router
const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
