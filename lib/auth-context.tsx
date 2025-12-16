'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, AuthResponse } from './api/auth';
import { apiClient } from './api/axios';
import { InactivityTimeoutModal } from '@/components/inactivity-timeout-modal';

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

// Inactivity timeout configuration (1 hour = 3600000ms, warning at 4 minutes = 240000ms)
const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds
const WARNING_TIME = 4 * 60 * 1000; // 4 minutes warning before timeout
const COUNTDOWN_INTERVAL = 1000; // Update countdown every second

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Inactivity timeout state
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

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

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    removeAuthCookie();
    delete apiClient.defaults.headers.common['Authorization'];
    router.push('/auth/signin');
  }, [router]);

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

  // Reset inactivity timer
  const resetInactivityTimer = useCallback(() => {
    if (!token || !user) {
      return;
    }

    lastActivityRef.current = Date.now();

    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    setShowTimeoutModal(false);

    // Set warning timeout (show modal 4 minutes before actual timeout)
    const warningTime = INACTIVITY_TIMEOUT - WARNING_TIME;
    warningTimeoutRef.current = setTimeout(() => {
      setShowTimeoutModal(true);
      setSecondsRemaining(Math.floor(WARNING_TIME / 1000));

      // Start countdown
      countdownIntervalRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
            }
            logout();
            return 0;
          }
          return prev - 1;
        });
      }, COUNTDOWN_INTERVAL);
    }, warningTime);

    // Set actual timeout
    timeoutRef.current = setTimeout(() => {
      logout();
    }, INACTIVITY_TIMEOUT);
  }, [token, user, logout]);

  // Track user activity
  useEffect(() => {
    if (!token || !user) {
      return;
    }

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    const handleActivity = () => {
      resetInactivityTimer();
    };

    // Initial timer setup
    resetInactivityTimer();

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity, true);
    });

    return () => {
      // Cleanup
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity, true);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [token, user, resetInactivityTimer]);

  // Handle extend session
  const handleExtendSession = useCallback(() => {
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  // Handle sign out from modal
  const handleSignOut = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, register, setAuth, logout, refreshUser }}
    >
      {children}
      {user && token && (
        <InactivityTimeoutModal
          isOpen={showTimeoutModal}
          secondsRemaining={secondsRemaining}
          onExtend={handleExtendSession}
          onSignOut={handleSignOut}
        />
      )}
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
