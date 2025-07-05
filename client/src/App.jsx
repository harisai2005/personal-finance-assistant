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

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return null; // or spinner

  return isLoggedIn ? children : <Navigate to="/auth" />;
};


const AppLayout = ({ children }) => (
  <>
    <CustomNavbar />
    {children}
  </>
);

const AppRoutes = () => {
  const { login } = useAuth();

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage onLogin={login} />} />

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

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
