'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          } else {
            Cookies.remove('token');
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          Cookies.remove('token');
        }
      }
      setLoading(false);
    };

    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        Cookies.set('token', res.data.token, { expires: 7 });
        setUser(res.data.user);
        router.push('/dashboard');
        return true;
      }
    } catch (error) {
      console.error(error);
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const signup = async (userData) => {
    try {
      const res = await api.post('/auth/signup', userData);
      if (res.data.success) {
        Cookies.set('token', res.data.token, { expires: 7 });
        setUser(res.data.user);
        router.push('/dashboard');
        return true;
      }
    } catch (error) {
      console.error(error);
      throw error.response?.data?.message || 'Signup failed';
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
