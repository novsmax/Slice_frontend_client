import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setCurrentUser(response.data);
        } catch (err) {
          console.error('Authentication error:', err);
          localStorage.removeItem('token');
          setCurrentUser(null);
        }
      }
      
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Вход в систему
  const login = async (username, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await api.post('/auth/login',
        new URLSearchParams({
          'username': username,
          'password': password
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
      
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
        
        setCurrentUser(response.data.user);
      }
      
      return response.data;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Ошибка входа. Проверьте логин и пароль.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setCurrentUser(null);
  };

  const isAuthenticated = () => {
    return !!currentUser;
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};