import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

/**
 * Login Screen Component
 * Provides user authentication with username/password
 * 
 * Features:
 * - Username and password input
 * - Form validation
 * - Loading states
 * - Test account display
 * - Navigation to signup
 */
const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles login form submission
   * Validates input and attempts authentication
   */
  const handleLogin = async () => {
    if (!credentials.username.trim() || !credentials.password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setIsLoading(true);
    
    try {
      await login(credentials.username, credentials.password);
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles navigation to signup screen
   */
  const handleGoToSignup = () => {
    // @ts-ignore - Navigation type is dynamic
    navigation.navigate('Signup');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>RECETRA</Text>
          <Text style={styles.subtitle}>NU Dasma Receipt Management</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Sign In</Text>
          
          {/* Username Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={credentials.username}
              onChangeText={(text) => setCredentials({...credentials, username: text})}
              placeholder="Enter your username"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={credentials.password}
              onChangeText={(text) => setCredentials({...credentials, password: text})}
              placeholder="Enter your password"
              secureTextEntry
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Test Accounts */}
        <View style={styles.testAccountsContainer}>
          <Text style={styles.testAccountsTitle}>Test Accounts</Text>
          <Text style={styles.testAccountsSubtitle}>Use these accounts to test different roles</Text>
          
          <View style={styles.testAccount}>
            <Text style={styles.testAccountLabel}>Admin:</Text>
            <Text style={styles.testAccountText}>admin / password</Text>
          </View>
          
          <View style={styles.testAccount}>
            <Text style={styles.testAccountLabel}>Encoder:</Text>
            <Text style={styles.testAccountText}>encoder / password</Text>
          </View>
          
          <View style={styles.testAccount}>
            <Text style={styles.testAccountLabel}>Viewer:</Text>
            <Text style={styles.testAccountText}>viewer / password</Text>
          </View>
        </View>

        {/* Signup Link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={handleGoToSignup}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

/**
 * Styles for the LoginScreen component
 * Uses a clean, professional design with consistent spacing and colors
 */
const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // Content area
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  
  // Header section
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  
  // Title
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  
  // Subtitle
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  
  // Form container
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Form title
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 24,
    textAlign: 'center',
  },
  
  // Input group
  inputGroup: {
    marginBottom: 20,
  },
  
  // Label
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  
  // Input field
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  
  // Login button
  loginButton: {
    backgroundColor: '#1e3a8a',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  
  // Disabled login button
  loginButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  
  // Login button text
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Test accounts container
  testAccountsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Test accounts title
  testAccountsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  
  // Test accounts subtitle
  testAccountsSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  
  // Test account
  testAccount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  
  // Test account label
  testAccountLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  
  // Test account text
  testAccountText: {
    fontSize: 14,
    color: '#6b7280',
  },
  
  // Signup container
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Signup text
  signupText: {
    fontSize: 14,
    color: '#6b7280',
  },
  
  // Signup link
  signupLink: {
    fontSize: 14,
    color: '#1e3a8a',
    fontWeight: '600',
  },
});

export default LoginScreen;
