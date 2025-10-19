import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [userId, setUserId] = useState(() => localStorage.getItem('user_id'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (userId) localStorage.setItem('user_id', userId);
    else localStorage.removeItem('user_id');
  }, [userId]);

  const register = async (name, email, password) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return res.json();
  };

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      setToken(data.token);
      if (data.userId) setUserId(data.userId);
      return { ok: true };
    }
    return { ok: false, error: data.error || 'Login failed' };
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    navigate('/auth');
  };

  const authFetch = async (path, options = {}) => {
    const headers = options.headers || {};
    // If the in-memory token is missing (page reload), fall back to localStorage token so
    // requests still include the Authorization header.
    const effectiveToken = token || localStorage.getItem('token');
    if (effectiveToken) headers['Authorization'] = `Bearer ${effectiveToken}`;
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    return res;
  };

  return (
    <AuthContext.Provider value={{ token, userId, register, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
};
