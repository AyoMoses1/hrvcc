'use client';

import { useState, useEffect } from 'react';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Mock auth - in production, this would check actual auth state
    setIsLoading(false);
    setUser(null);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    role: user?.role,
  };
}

