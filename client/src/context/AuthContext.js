import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

/**
 * Provides authentication state and methods to the app.
 */
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Prevent premature rendering

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log("🔑 useEffect: token from localStorage:", storedToken);
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, token, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook for consuming AuthContext
 */
export const useAuth = () => useContext(AuthContext);
