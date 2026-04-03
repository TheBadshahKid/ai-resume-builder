import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock user login checking
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setUser({ name: 'Test User', email: 'test@example.com' });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login
    localStorage.setItem('token', 'mock_token');
    setIsAuthenticated(true);
    setUser({ name: 'Test User', email });
    return true;
  };

  const signup = async (name, email, password) => {
    // Mock signup
    localStorage.setItem('token', 'mock_token');
    setIsAuthenticated(true);
    setUser({ name, email });
    return true;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
