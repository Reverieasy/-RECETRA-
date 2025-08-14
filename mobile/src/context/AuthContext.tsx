import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, findUserByCredentials } from '../data/mockData';

/**
 * Authentication context type definition
 * Provides user state, loading state, and authentication methods
 */
interface AuthContextType {
  user: User | null;                    // Current logged-in user
  isLoading: boolean;                    // Loading state during auth checks
  login: (username: string, password: string) => Promise<boolean>;  // Login method
  logout: () => Promise<void>;          // Logout method
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Custom hook to use authentication context
 * Throws error if used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Props for the AuthProvider component
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider Component
 * Manages user authentication state and provides auth methods to child components
 * Handles:
 * - User login/logout
 * - Session persistence using AsyncStorage
 * - Loading states during authentication checks
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // State for current user and loading status
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load user data from AsyncStorage on app startup
   * This ensures the user stays logged in between app sessions
   */
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  /**
   * Loads user data from AsyncStorage
   * Called on app startup to restore user session
   */
  const loadUserFromStorage = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Authenticates user with provided credentials
   * @param username - User's username
   * @param password - User's password
   * @returns Promise<boolean> - True if login successful, false otherwise
   */
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Find user in mock data
      const foundUser = findUserByCredentials(username, password);
      if (foundUser) {
        // Set user state and save to AsyncStorage
        setUser(foundUser);
        await AsyncStorage.setItem('user', JSON.stringify(foundUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  /**
   * Logs out the current user
   * Clears user state and removes from AsyncStorage
   */
  const logout = async (): Promise<void> => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Context value containing all auth-related state and methods
  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
