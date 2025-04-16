import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types/auth';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for auto-login
const defaultUser: User = {
  id: '1',
  name: 'Demo User',
  email: 'demo@example.com'
};

// Mock users array - keeping this for reference but not using it for authentication now
const mockUsers = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'password123'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with authenticated state by default
  const [authState, setAuthState] = useState<AuthState>({
    user: defaultUser,
    isAuthenticated: true,
    isLoading: false
  });
  const { toast } = useToast();

  // Keeping the login function but making it a no-op that always succeeds
  const login = async (email: string, password: string): Promise<void> => {
    // Always authenticate with the default user regardless of credentials
    toast({
      title: "Auto-login active",
      description: "Authentication checks are bypassed for demo purposes.",
    });
    
    // No need to set state as we're already authenticated
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    // Always authenticate with the default user regardless of credentials
    toast({
      title: "Auto-signup active",
      description: "Authentication checks are bypassed for demo purposes.",
    });
    
    // No need to set state as we're already authenticated
  };

  const logout = () => {
    // No actual logout functionality - just show a toast
    toast({
      title: "Logout disabled",
      description: "Authentication is bypassed for demo purposes.",
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, signup, logout }}>
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
