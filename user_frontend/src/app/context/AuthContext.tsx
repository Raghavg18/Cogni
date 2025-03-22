"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AuthContextType = {
  username: string;
  isClient: boolean;
  setAuth: (username: string, isClient: boolean) => void;
  clearAuth: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string>('');
  const [isClient, setIsClient] = useState<boolean>(true);

  // Load auth data from localStorage on initial mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedIsClient = localStorage.getItem('isClient');
    
    if (storedUsername) {
      setUsername(storedUsername);
    }
    
    if (storedIsClient !== null) {
      setIsClient(storedIsClient === 'true');
    }
  }, []);

  const setAuth = (username: string, isClient: boolean) => {
    setUsername(username);
    setIsClient(isClient);
    
    // Store in localStorage for persistence
    localStorage.setItem('username', username);
    localStorage.setItem('isClient', String(isClient));
  };

  const clearAuth = () => {
    setUsername('');
    setIsClient(true);
    
    // Clear from localStorage
    localStorage.removeItem('username');
    localStorage.removeItem('isClient');
  };

  return (
    <AuthContext.Provider value={{ username, isClient, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};