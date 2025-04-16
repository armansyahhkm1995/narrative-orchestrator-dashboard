
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types/auth';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isTestMode: boolean;
  setTestMode: (mode: boolean) => void;
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
  // Check local storage for persistent auth state
  const savedAuth = localStorage.getItem('auth');
  const initialAuthState = savedAuth ? JSON.parse(savedAuth) : {
    user: defaultUser,
    isAuthenticated: true,
    isLoading: false
  };

  // Use the saved state or default to authenticated
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const [isTestMode, setTestMode] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(authState));
  }, [authState]);

  const login = async (email: string, password: string): Promise<void> => {
    setAuthState({
      ...authState,
      isLoading: true
    });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In test mode, allow any credentials
    const user = {
      id: '1',
      name: email.split('@')[0] || 'Demo User',
      email
    };

    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false
    });

    toast({
      title: "Login successful",
      description: `Welcome back${user.name ? `, ${user.name}` : ''}!`,
    });

    navigate('/');
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    setAuthState({
      ...authState,
      isLoading: true
    });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email
    };

    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false
    });

    toast({
      title: "Account created",
      description: `Welcome, ${name}!`,
    });

    navigate('/');
  };

  const logout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });

    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });

    navigate('/auth');
  };

  return (
    <AuthContext.Provider value={{ 
      ...authState, 
      login, 
      signup, 
      logout,
      isTestMode,
      setTestMode
    }}>
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
