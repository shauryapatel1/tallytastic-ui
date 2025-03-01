
import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  isLoading: boolean; // Add the missing isLoading property
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the auth context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false, // Initialize the isLoading property
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

// Custom hook for using the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps your app and makes auth object available
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Mock login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      setUser({
        id: '1',
        email,
        name: email.split('@')[0],
      });
    } catch (error) {
      console.error('Login error', error);
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
      setUser({
        id: '1',
        email,
        name,
      });
    } catch (error) {
      console.error('Signup error', error);
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
    } catch (error) {
      console.error('Logout error', error);
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
