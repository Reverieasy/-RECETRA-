import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Signup Screen Component

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.organization.trim()) {
      newErrors.organization = 'Organization is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createUser = (userData) => {
    const newUser = {
      id: Date.now().toString(),
      username: userData.email.split('@')[0],
      password: userData.password,
      role: 'Viewer',
      organization: userData.organization,
      email: userData.email,
      fullName: userData.name,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const existingUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    existingUsers.push(newUser);
    localStorage.setItem('mockUsers', JSON.stringify(existingUsers));

    return newUser;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newUser = createUser(formData);

      alert(
        `Account Created Successfully!\n\nWelcome ${newUser.fullName}!\nRole: ${newUser.role} (Default)\nOrganization: ${newUser.organization}\n\nPlease log in with your email and password.`
      );
      navigate('/login');
    } catch (error) {
      alert('Error creating account. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Panel */}
      <div style={styles.leftPanel}>
        <img
          src='../../assets/Logo_with_Color.png'
          alt='Logo'
          style={styles.logo}
        />
      </div>

      {/* Right Panel */}
      <div style={styles.rightPanel}>
        <div style={styles.blurOverlay}></div>
        <div style={styles.signupWrapper}>
          <div style={styles.content}>
            <div style={styles.formContainer}>
              <h2 style={styles.formTitle}>Create Account</h2>
              <p style={styles.subtitle}>Join RECETRA for NU Dasma</p>
              <p style={styles.roleInfo}>All new accounts are created with Viewer access</p>

              {/* Email */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email *</label>
                <input
                  type="email"
                  style={{ ...styles.input, ...(errors.email && styles.inputError) }}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                />
                {errors.email && <span style={styles.errorText}>{errors.email}</span>}
              </div>

              {/* Full Name */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name *</label>
                <input
                  type="text"
                  style={{ ...styles.input, ...(errors.name && styles.inputError) }}
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                />
                {errors.name && <span style={styles.errorText}>{errors.name}</span>}
              </div>

              {/* Organization */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Organization *</label>
                <input
                  type="text"
                  style={{ ...styles.input, ...(errors.organization && styles.inputError) }}
                  value={formData.organization}
                  onChange={(e) => handleInputChange('organization', e.target.value)}
                  placeholder="Enter your organization name"
                  autoComplete="organization"
                />
                {errors.organization && <span style={styles.errorText}>{errors.organization}</span>}
              </div>

              {/* Password */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Password *</label>
                <input
                  type="password"
                  style={{ ...styles.input, ...(errors.password && styles.inputError) }}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                />
                {errors.password && <span style={styles.errorText}>{errors.password}</span>}
              </div>

              {/* Confirm Password */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Confirm Password *</label>
                <input
                  type="password"
                  style={{ ...styles.input, ...(errors.confirmPassword && styles.inputError) }}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
                {errors.confirmPassword && <span style={styles.errorText}>{errors.confirmPassword}</span>}
              </div>

              {/* Submit */}
              <button
                style={isSubmitting ? { ...styles.signupButton, ...styles.signupButtonDisabled } : styles.signupButton}
                onClick={handleSignup}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>

            {/* Login link */}
            <div style={styles.loginContainer}>
              <span style={styles.loginText}>Already have an account? </span>
              <button style={styles.loginLink} onClick={handleGoToLogin}>
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
  },
  leftPanel: {
    flex: 1,
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 550,
    height: 550,
  },
  rightPanel: {
    flex: 1,
    position: 'relative',
    backgroundImage: 'url("../../assets/Office_background.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'hidden',
    clipPath: 'polygon(20% 0%, 100% 0, 100% 100%, 0% 100%)',
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backdropFilter: 'blur(5px)',
    backgroundColor: 'rgba(136, 163, 238, 0.4)',
    zIndex: 1,
  },
  signupWrapper: {
    marginRight: '-90px',
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  content: {
    width: '100%',
    maxWidth: '400px',
    padding: '20px',
    background: '#ffffff',
    borderRadius: '16px',
    border: 'none',
    color: '#000',
  },
  formContainer: {
    marginBottom: '24px',
  },
  formTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '12px',
    textAlign: 'center',
    color: '#1e3a8a',
  },
  subtitle: {
    fontSize: 'px',
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: '10px',
    
  },
  roleInfo: {
    fontSize: '12px',
    textAlign: 'center',
    color: '#9ca3af',
    fontStyle: 'italic',
    marginBottom: '16px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '8px',
    display: 'block',
  },
  input: {
    width: '100%',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '16px',
    backgroundColor: 'white',
    boxSizing: 'border-box',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: '12px',
    marginTop: '4px',
    display: 'block',
  },
  signupButton: {
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
  signupButtonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
  },
  loginContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: '14px',
  },
  loginLink: {
    fontSize: '14px',
    fontWeight: '600',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    color: '#1e3a8a',
    marginLeft: '4px',
  },
};

export default SignupScreen;
