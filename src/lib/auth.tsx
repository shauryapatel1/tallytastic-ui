
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

// Define the structure of the user object
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

// Define the auth context type with isLoading property
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the auth context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

// Custom hook for using the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps your app and makes auth object available
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Check local storage for user on initial load
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const storedUser = localStorage.getItem('formcraft_user');
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error restoring session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const userData = {
        id: '1',
        email,
        name: email.split('@')[0],
      };
      
      setUser(userData);
      
      // Store in localStorage for session persistence
      localStorage.setItem('formcraft_user', JSON.stringify(userData));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name}!`,
      });
    } catch (error) {
      console.error('Login error', error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock signup function
  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const userData = {
        id: '1',
        email,
        name,
      };
      
      setUser(userData);
      
      // Store in localStorage for session persistence
      localStorage.setItem('formcraft_user', JSON.stringify(userData));
      
      toast({
        title: "Account created",
        description: `Welcome to FormCraft, ${name}!`,
      });
    } catch (error) {
      console.error('Signup error', error);
      toast({
        title: "Signup failed",
        description: "There was a problem creating your account. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
      
      // Remove from localStorage
      localStorage.removeItem('formcraft_user');
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Logout error', error);
      toast({
        title: "Logout failed",
        description: "There was a problem logging you out. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // The value that will be available to consumers of this context
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
