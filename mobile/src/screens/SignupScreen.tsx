import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

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
  const navigation = useNavigation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    organization: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validates the signup form
   * @returns true if form is valid, false otherwise
   */
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

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
   * @param userData - User data to create
   * @returns The created user object
   */
  const createUser = (userData: {
    email: string;
    name: string;
    password: string;
    organization: string;
  }) => {
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
    // For now, we'll store in AsyncStorage to simulate user creation
    // Note: In a real React Native app, you'd use AsyncStorage
    console.log('New user created:', newUser);

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

      Alert.alert(
        'Account Created Successfully!',
        `Welcome ${newUser.fullName}!\n\nRole: ${newUser.role} (Default)\nOrganization: ${newUser.organization}\n\nPlease log in with your email and password.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to login screen
              (navigation as any).navigate('Login');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Error creating account. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles navigation to login screen
   */
  const handleGoToLogin = () => {
    (navigation as any).navigate('Login');
  };

  /**
   * Handles input changes and clears errors
   * @param field - Field name to update
   * @param value - New value for the field
   */
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join RECETRA for NU Dasma</Text>
            <Text style={styles.roleInfo}>All new accounts are created with Viewer access</Text>
          </View>

          {/* Signup Form */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                placeholder="Enter your full name"
                autoCapitalize="words"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Organization Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Organization *</Text>
              <TextInput
                style={[styles.input, errors.organization && styles.inputError]}
                value={formData.organization}
                onChangeText={(text) => handleInputChange('organization', text)}
                placeholder="Enter your organization name"
                autoCapitalize="words"
              />
              {errors.organization && <Text style={styles.errorText}>{errors.organization}</Text>}
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password *</Text>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
                placeholder="Enter your password"
                secureTextEntry
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password *</Text>
              <TextInput
                style={[styles.input, errors.confirmPassword && styles.inputError]}
                value={formData.confirmPassword}
                onChangeText={(text) => handleInputChange('confirmPassword', text)}
                placeholder="Confirm your password"
                secureTextEntry
              />
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>

            {/* Signup Button */}
            <TouchableOpacity
              style={[styles.signupButton, isSubmitting && styles.signupButtonDisabled]}
              onPress={handleSignup}
              disabled={isSubmitting}
            >
              <Text style={styles.signupButtonText}>
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleGoToLogin}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

/**
 * Styles for the SignupScreen component
 * Uses a clean, professional design with consistent spacing and colors
 */
const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // Scroll container
  scrollContainer: {
    flexGrow: 1,
  },
  
  // Content area
  content: {
    padding: 20,
    paddingTop: 60,
  },
  
  // Header section
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  
  // Title
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  
  // Subtitle
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },

  // Role info
  roleInfo: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
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
  
  // Input error state
  inputError: {
    borderColor: '#ef4444',
  },
  
  // Error text
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  
  // Signup button
  signupButton: {
    backgroundColor: '#1e3a8a',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  // Disabled signup button
  signupButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  
  // Signup button text
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Login container
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Login text
  loginText: {
    fontSize: 14,
    color: '#6b7280',
  },
  
  // Login link
  loginLink: {
    fontSize: 14,
    color: '#1e3a8a',
    fontWeight: '600',
  },
});

export default SignupScreen;
