import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockOrganizations } from '../data/mockData';

/**
 * Signup Screen Component
 * Allows new users to create accounts with organization selection
 * 
 * Features:
 * - Email, name, password, and password confirmation
 * - Organization selection
 * - Basic form validation
 * - Navigation to login screen
 * - Actual user creation (adds to mock data)
 * - Role automatically set to 'Viewer' (users cannot choose role)
 */
const SignupScreen = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    organization: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validates the signup form
   * @returns true if form is valid, false otherwise
   */
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Organization validation
    if (!formData.organization.trim()) {
      newErrors.organization = 'Organization is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Creates a new user account
   * @param {Object} userData - User data to create
   * @returns {Object} The created user object
   */
  const createUser = (userData) => {
    const newUser = {
      id: Date.now().toString(),
      username: userData.email.split('@')[0], // Generate username from email
      password: userData.password,
      role: 'Viewer', // Default role - users cannot choose
      organization: userData.organization,
      email: userData.email,
      fullName: userData.name,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    // In a real app, this would be an API call
    // For now, we'll store in localStorage to simulate user creation
    const existingUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    existingUsers.push(newUser);
    localStorage.setItem('mockUsers', JSON.stringify(existingUsers));

    return newUser;
  };

  /**
   * Handles signup form submission
   * Creates new user account and navigates to login
   */
  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create the new user
      const newUser = createUser(formData);

      alert(
        `Account Created Successfully!\n\nWelcome ${newUser.fullName}!\nRole: ${newUser.role} (Default)\nOrganization: ${newUser.organization}\n\nPlease log in with your email and password.`
      );

      // Navigate to login
      navigate('/login');
    } catch (error) {
      alert('Error creating account. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles navigation to login screen
   */
  const handleGoToLogin = () => {
    navigate('/login');
  };

  /**
   * Handles input changes and clears errors
   * @param field - Field name to update
   * @param value - New value for the field
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join RECETRA for NU Dasma</p>
          <p style={styles.roleInfo}>All new accounts are created with Viewer access</p>
        </div>

        {/* Signup Form */}
        <div style={styles.formContainer}>
          {/* Email Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email *</label>
            <input
              type="email"
              style={{
                ...styles.input,
                ...(errors.email && styles.inputError)
              }}
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
            />
            {errors.email && <span style={styles.errorText}>{errors.email}</span>}
          </div>

          {/* Name Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name *</label>
            <input
              type="text"
              style={{
                ...styles.input,
                ...(errors.name && styles.inputError)
              }}
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
              autoComplete="name"
            />
            {errors.name && <span style={styles.errorText}>{errors.name}</span>}
          </div>

          {/* Organization Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Organization *</label>
            <input
              type="text"
              style={{
                ...styles.input,
                ...(errors.organization && styles.inputError)
              }}
              value={formData.organization}
              onChange={(e) => handleInputChange('organization', e.target.value)}
              placeholder="Enter your organization name"
              autoComplete="organization"
            />
            {errors.organization && <span style={styles.errorText}>{errors.organization}</span>}
          </div>

          {/* Password Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password *</label>
            <input
              type="password"
              style={{
                ...styles.input,
                ...(errors.password && styles.inputError)
              }}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Enter your password"
              autoComplete="new-password"
            />
            {errors.password && <span style={styles.errorText}>{errors.password}</span>}
          </div>

          {/* Confirm Password Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password *</label>
            <input
              type="password"
              style={{
                ...styles.input,
                ...(errors.confirmPassword && styles.inputError)
              }}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
            {errors.confirmPassword && <span style={styles.errorText}>{errors.confirmPassword}</span>}
          </div>

          {/* Signup Button */}
          <button
            style={{
              ...styles.signupButton,
              ...(isSubmitting && styles.signupButtonDisabled)
            }}
            onClick={handleSignup}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>

        {/* Login Link */}
        <div style={styles.loginContainer}>
          <span style={styles.loginText}>Already have an account? </span>
          <button 
            style={styles.loginLink}
            onClick={handleGoToLogin}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Styles for the SignupScreen component
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
    padding: '20px',
  },
  
  // Content area
  content: {
    width: '100%',
    maxWidth: '450px',
  },
  
  // Header section
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  
  // Title
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: '8px',
    margin: 0,
  },
  
  // Subtitle
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    textAlign: 'center',
    margin: 0,
    marginBottom: '8px',
  },

  // Role info
  roleInfo: {
    fontSize: '14px',
    color: '#9ca3af',
    textAlign: 'center',
    margin: 0,
    fontStyle: 'italic',
  },
  
  // Form container
  formContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
  },
  
  // Input group
  inputGroup: {
    marginBottom: '20px',
  },
  
  // Label
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
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
  
  // Input error state
  inputError: {
    borderColor: '#ef4444',
  },
  
  // Error text
  errorText: {
    color: '#ef4444',
    fontSize: '12px',
    marginTop: '4px',
    display: 'block',
  },
  
  // Signup button
  signupButton: {
    width: '100%',
    backgroundColor: '#1e3a8a',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  
  // Disabled signup button
  signupButtonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
  },
  
  // Login container
  loginContainer: {
    textAlign: 'center',
  },
  
  // Login text
  loginText: {
    fontSize: '14px',
    color: '#6b7280',
  },
  
  // Login link
  loginLink: {
    fontSize: '14px',
    color: '#1e3a8a',
    fontWeight: '600',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default SignupScreen;
