'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, AuthResponse } from './api/auth';
import { apiClient } from './api/axios';

interface AuthContextType {
  user: AuthResponse['user'] | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: import('./api/auth').RegisterData) => Promise<void>;
  setAuth: (user: AuthResponse['user'], token: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      authApi
        .getMe()
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('auth_token');
          setToken(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const setAuthCookie = (token: string) => {
    document.cookie = `auth_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  };

  const removeAuthCookie = () => {
    document.cookie = 'auth_token=; path=/; max-age=0';
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('auth_token', response.token);
      setAuthCookie(response.token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
    } catch (error: any) {
      console.error('Auth context login error:', error);
      throw error;
    }
  };

  const register = async (data: import('./api/auth').RegisterData) => {
    const response = await authApi.register(data);
    setUser(response.user);
    setToken(response.token);
    localStorage.setItem('auth_token', response.token);
    setAuthCookie(response.token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
  };

  const setAuth = (user: AuthResponse['user'], newToken: string) => {
    setUser(user);
    setToken(newToken);
    localStorage.setItem('auth_token', newToken);
    setAuthCookie(newToken);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    removeAuthCookie();
    delete apiClient.defaults.headers.common['Authorization'];
    router.push('/auth/signin');
  };

  const refreshUser = async () => {
    if (token) {
      try {
        const userData = await authApi.getMe();
        setUser(userData);
      } catch (error) {
        logout();
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, register, setAuth, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
