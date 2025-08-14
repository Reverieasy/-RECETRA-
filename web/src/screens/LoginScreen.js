import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
const LoginScreen = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
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
      alert('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(credentials.username, credentials.password);
      if (!success) {
        alert('Invalid username or password');
      }
    } catch (error) {
      alert('Login Failed: Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles navigation to signup screen
   */
  const handleGoToSignup = () => {
    navigate('/signup');
  };

  /**
   * Handles Enter key press for form submission
   */
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>RECETRA</h1>
          <p style={styles.subtitle}>NU Dasma Receipt Management</p>
        </div>

        {/* Login Form */}
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>Sign In</h2>
          
          {/* Username Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              style={styles.input}
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              placeholder="Enter your username"
              autoComplete="username"
              onKeyPress={handleKeyPress}
            />
          </div>

          {/* Password Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              style={styles.input}
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              placeholder="Enter your password"
              autoComplete="current-password"
              onKeyPress={handleKeyPress}
            />
          </div>

          {/* Login Button */}
          <button
            style={isLoading ? {...styles.loginButton, ...styles.loginButtonDisabled} : styles.loginButton}
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </div>

        {/* Test Accounts */}
        <div style={styles.testAccountsContainer}>
          <h3 style={styles.testAccountsTitle}>Test Accounts</h3>
          <p style={styles.testAccountsSubtitle}>Use these accounts to test different roles</p>
          
          <div style={styles.testAccount}>
            <span style={styles.testAccountLabel}>Admin:</span>
            <span style={styles.testAccountText}>admin / password</span>
          </div>
          
          <div style={styles.testAccount}>
            <span style={styles.testAccountLabel}>Encoder:</span>
            <span style={styles.testAccountText}>encoder / password</span>
          </div>
          
          <div style={styles.testAccount}>
            <span style={styles.testAccountLabel}>Viewer:</span>
            <span style={styles.testAccountText}>viewer / password</span>
          </div>
        </div>

        {/* Signup Link */}
        <div style={styles.signupContainer}>
          <span style={styles.signupText}>Don't have an account? </span>
          <button style={styles.signupLink} onClick={handleGoToSignup}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Styles for the LoginScreen component
 * Uses a clean, professional design with consistent spacing and colors
 */
const styles = {
  // Main container
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Content area
  content: {
    width: '100%',
    maxWidth: '400px',
    padding: '20px',
  },
  
  // Header section
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  
  // Title
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  
  // Subtitle
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0,
  },
  
  // Form container
  formContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  
  // Form title
  formTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: '24px',
    textAlign: 'center',
    margin: '0 0 24px 0',
  },
  
  // Input group
  inputGroup: {
    marginBottom: '20px',
  },
  
  // Label
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
    display: 'block',
  },
  
  // Input field
  input: {
    width: '100%',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '16px',
    backgroundColor: 'white',
    boxSizing: 'border-box',
  },
  
  // Login button
  loginButton: {
    width: '100%',
    backgroundColor: '#1e3a8a',
    padding: '16px',
    borderRadius: '8px',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
  },
  
  // Disabled login button
  loginButtonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
  },
  
  // Test accounts container
  testAccountsContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  
  // Test accounts title
  testAccountsTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: '4px',
    margin: '0 0 4px 0',
  },
  
  // Test accounts subtitle
  testAccountsSubtitle: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '16px',
    margin: '0 0 16px 0',
  },
  
  // Test account
  testAccount: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  
  // Test account label
  testAccountLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  },
  
  // Test account text
  testAccountText: {
    fontSize: '14px',
    color: '#6b7280',
  },
  
  // Signup container
  signupContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Signup text
  signupText: {
    fontSize: '14px',
    color: '#6b7280',
  },
  
  // Signup link
  signupLink: {
    fontSize: '14px',
    color: '#1e3a8a',
    fontWeight: '600',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default LoginScreen;