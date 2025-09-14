import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useInlineNotification } from '../components/InlineNotificationSystem';


const LoginScreen = () => {
  const { login } = useAuth();
  const { showError, showSuccess } = useInlineNotification();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!credentials.username.trim() || !credentials.password.trim()) {
      showError('Please enter both username and password', 'Validation Error');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(credentials.username, credentials.password);
      if (!success) {
        showError('Invalid username or password', 'Login Failed');
      }
    } catch (error) {
      showError('Login Failed: Invalid username or password', 'Error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToSignup = () => {
    navigate('/signup');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
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
        <div style={styles.loginWrapper}>
          <div style={styles.content}>
            <div style={styles.formContainer}>
              <h2 style={styles.formTitle}>Sign In</h2>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Username</label>
                <input
                  type="text"
                  style={styles.input}
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  placeholder="Enter your username"
                  autoComplete="username"
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  style={styles.input}
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  onKeyPress={handleKeyPress}
                />
              </div>
              <button
                style={isLoading ? { ...styles.loginButton, ...styles.loginButtonDisabled } : styles.loginButton}
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
            
           

            <div style={styles.signupContainer}>
              <span style={styles.signupText}>Don't have an account? </span>
              <button style={styles.signupLink} onClick={handleGoToSignup}>
                Sign Up
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

  loginWrapper: {
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
  background: '#ffffff', // Solid background
  borderRadius: '16px',
  border: 'none',         // Optional: remove border
  color: '#000',          // Switch to dark text for contrast
},


  formContainer: {
    marginBottom: '24px',
  },

  formTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '24px',
    textAlign: 'center',
    color: '#1e3a8a', // Dark blue color for the title
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

  loginButtonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
  },

 

  signupContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  signupText: {
    fontSize: '14px',
  },

  signupLink: {
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

export default LoginScreen;
