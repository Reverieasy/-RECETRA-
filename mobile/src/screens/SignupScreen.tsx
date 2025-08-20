import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const SignupScreen = ({ navigation }: any) => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'username':
        if (!value.trim()) {
          newErrors.username = 'Username is required';
        } else if (value.trim().length < 3) {
          newErrors.username = 'Username must be at least 3 characters';
        } else if (value.trim().length > 20) {
          newErrors.username = 'Username must be less than 20 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(value.trim())) {
          newErrors.username = 'Username can only contain letters, numbers, and underscores';
        } else {
          delete newErrors.username;
        }
        break;
      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value.trim())) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
      case 'fullName':
        if (!value.trim()) {
          newErrors.fullName = 'Full name is required';
        } else if (value.trim().length < 2) {
          newErrors.fullName = 'Full name must be at least 2 characters';
        } else if (value.trim().length > 50) {
          newErrors.fullName = 'Full name must be less than 50 characters';
        } else {
          delete newErrors.fullName;
        }
        break;
      case 'password':
        if (!value) {
          newErrors.password = 'Password is required';
        } else if (value.length < 6) {
          newErrors.password = 'Password must be at least 6 characters';
        } else if (value.length > 128) {
          newErrors.password = 'Password must be less than 128 characters';
        } else {
          delete newErrors.password;
        }
        // Also validate confirm password if it exists
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else if (formData.confirmPassword) {
          delete newErrors.confirmPassword;
        }
        break;
      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== value) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    validateField(field, value);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Validate all fields
    Object.keys(formData).forEach(field => {
      validateField(field, formData[field as keyof typeof formData]);
    });
    
    // Check if there are any errors
    setTimeout(() => {
      const currentErrors = Object.keys(errors);
      if (currentErrors.length > 0) {
        return false;
      }
    }, 100);
    
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async () => {
    // Clear previous errors
    setErrors({});
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    if (Object.keys(errors).length > 0) {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      await signup(
        formData.username.trim(),
        formData.email.trim(),
        formData.password,
        'Viewer' // Default role for new users
      );
      
      Alert.alert(
        'Success!',
        'Account created successfully! You are now logged in.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to main app or dashboard
              navigation.navigate('Home');
            },
          },
        ]
      );
    } catch (error: any) {
      let errorMessage = 'Failed to create account. Please try again.';
      
      if (error.message === 'Username already exists') {
        errorMessage = 'Username already exists. Please choose a different username.';
        setErrors(prev => ({ ...prev, username: 'Username already exists' }));
      } else if (error.message === 'Email already exists') {
        errorMessage = 'Email already exists. Please use a different email address.';
        setErrors(prev => ({ ...prev, email: 'Email already exists' }));
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.username.trim() &&
      formData.email.trim() &&
      formData.password &&
      formData.confirmPassword &&
      formData.fullName.trim() &&
      Object.keys(errors).length === 0
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join RECETRA for NU Dasma</Text>
              <Text style={styles.roleInfo}>All new accounts are created with Viewer access</Text>
            </View>

            {/* Signup Form */}
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Sign Up</Text>
              
              {/* Full Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  style={[styles.input, errors.fullName && styles.inputError]}
                  value={formData.fullName}
                  onChangeText={(value) => handleInputChange('fullName', value)}
                  placeholder="Enter your full name"
                  autoCapitalize="words"
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
                {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
              </View>

              {/* Username Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Username *</Text>
                <TextInput
                  style={[styles.input, errors.username && styles.inputError]}
                  value={formData.username}
                  onChangeText={(value) => handleInputChange('username', value)}
                  placeholder="Choose a username"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
                {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
              </View>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  placeholder="Enter your email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password *</Text>
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  placeholder="Create a password"
                  secureTextEntry
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password *</Text>
                <TextInput
                  style={[styles.input, errors.confirmPassword && styles.inputError]}
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  placeholder="Confirm your password"
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={handleSignup}
                />
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
              </View>

              {/* Signup Button */}
              <TouchableOpacity
                style={[styles.signupButton, (!isFormValid() || isSubmitting) && styles.signupButtonDisabled]}
                onPress={handleSignup}
                disabled={!isFormValid() || isSubmitting}
                activeOpacity={0.8}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.signupButtonText}>Create Account</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: Platform.OS === 'ios' ? 32 : 28,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  roleInfo: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'white',
    minHeight: 52,
    color: '#374151',
  },
  inputError: {
    borderColor: '#ef4444',
    borderWidth: 2,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    marginTop: 6,
    fontWeight: '500',
  },
  signupButton: {
    backgroundColor: '#1e3a8a',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    minHeight: 56,
    shadowColor: '#1e3a8a',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  signupButtonDisabled: {
    backgroundColor: '#9ca3af',
    shadowOpacity: 0,
    elevation: 0,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  loginText: {
    fontSize: 15,
    color: '#6b7280',
  },
  loginLink: {
    fontSize: 15,
    color: '#1e3a8a',
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});

export default SignupScreen;
