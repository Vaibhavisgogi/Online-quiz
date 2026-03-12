import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
// jwt-decode removed to avoid dependency issues. Using basic storage check for now.

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        // Simple verification - if we have both, assume active for initial load
        // Real validation happens on API requests via the interceptor
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user: loggedInUser } = res.data;
      
      const userData = { 
        id: loggedInUser.id || loggedInUser._id, 
        name: loggedInUser.name, 
        email: loggedInUser.email, 
        role: loggedInUser.role,
        coins: loggedInUser.coins || 0
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      return { success: true, role: userData.role };
    } catch (error) {
      return { success: false, message: error.response?.data?.msg || 'Login failed' };
    }
  };

  const register = async (name, email, password, role, adminSecretKey) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, role, adminSecretKey });
      const { token, user: newUser } = res.data;
      const userData = { 
        id: newUser.id || newUser._id, 
        name: newUser.name, 
        email: newUser.email, 
        role: newUser.role,
        coins: newUser.coins || 0
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.msg || 'Registration failed' };
    }
  };

  const updateCoins = (newTotal) => {
    setUser(prev => {
      const updated = { ...prev, coins: newTotal };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateCoins, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
