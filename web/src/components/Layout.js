import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Main Layout Component
 * Provides the consistent layout structure for all screens including:
 * - Top navigation bar with menu button and user info
 * - Collapsible sidebar with role-based navigation
 * - Main content area
 * - Optional back button for navigation
 * 
 * Props:
 * - children: React.ReactNode (content to be displayed in the main area)
 * - title: string (title to display in the top bar)
 * - showBackButton?: boolean (whether to show the back button)
 * 
 * Features:
 * - Responsive design that adapts to screen size
 * - Role-based menu items with actual navigation
 * - User session management
 * - Logout functionality
 * - Back button for easy navigation
 */
const Layout = ({ children, title, showBackButton = false }) => {
  // State for sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Add debugging
  console.log('Layout rendering with:', { title, showBackButton, user: !!user });

  // Add error boundary
  if (!user) {
    console.warn('Layout: No user found, this might cause issues');
  }

  /**
   * Returns menu items based on user role
   * Each role has different navigation options
   * @returns {Array} Array of menu items for the current user role
   */
  const getMenuItems = () => {
    if (!user) return [];

    const baseUrl = `/${user.role.toLowerCase()}`;

    switch (user.role) {
      case 'Admin':
        return [
          { label: 'Home', path: '/admin' },
          { label: 'User Management', path: '/admin/users' },
          { label: 'Template Management', path: '/admin/templates' },
          { label: 'Receipt Verification', path: '/admin/verify' },
          { label: 'FAQ Chatbot', path: '/admin/faq' },
          { label: 'Profile', path: '/admin/profile' },
        ];
      case 'Encoder':
        return [
          { label: 'Home', path: '/encoder' },
          { label: 'Issue Receipt', path: '/encoder/issue' },
          { label: 'Transaction Archive', path: '/encoder/archive' },
          { label: 'Receipt Verification', path: '/encoder/verify' },
          { label: 'FAQ Chatbot', path: '/encoder/faq' },
          { label: 'Profile', path: '/encoder/profile' },
        ];
      case 'Viewer':
        return [
          { label: 'Home', path: '/viewer' },
          { label: 'Payment Gateway', path: '/viewer/payment' },
          { label: 'Receipt Verification', path: '/viewer/verify' },
          { label: 'FAQ Chatbot', path: '/viewer/faq' },
          { label: 'Profile', path: '/viewer/profile' },
        ];
      default:
        return [];
    }
  };

  /**
   * Handles navigation to a specific path
   * @param {string} path - Path to navigate to
   */
  const handleNavigation = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  /**
   * Handles back button press
   */
  const handleBackPress = () => {
    navigate(-1); // Go back in browser history
  };

  /**
   * Handles user logout
   * Clears user session and redirects to login
   */
  const handleLogout = async () => {
    await logout();
  };

  return (
    <div style={styles.container}>
      {/* Top Navigation Bar */}
      <div style={styles.topBar}>
        {/* Back Button - Only shown when showBackButton is true */}
        {showBackButton && (
          <button
            style={styles.backButton}
            onClick={handleBackPress}
          >
            <span style={styles.backButtonText}>Back</span>
          </button>
          )}
        
        {/* Menu Button - Toggles sidebar */}
        <button
          style={styles.menuButton}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <span style={styles.menuButtonText}>Menu</span>
        </button>
        
        {/* Page Title - Centered */}
        <h1 style={styles.title}>{title}</h1>
        
        {/* User Information - Right side */}
        <div style={styles.userInfo}>
          <span style={styles.userName}>{user?.fullName}</span>
          <span style={styles.userRole}>{user?.role}</span>
        </div>
      </div>

      {/* Sidebar Overlay - Appears when sidebar is open */}
      {sidebarOpen && (
        <div style={styles.sidebarOverlay}>
          {/* Backdrop - Closes sidebar when clicked */}
          <div
            style={styles.sidebarBackdrop}
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Sidebar Content */}
          <div style={styles.sidebar}>
            {/* Sidebar Header */}
            <div style={styles.sidebarHeader}>
              <h2 style={styles.sidebarTitle}>RECETRA</h2>
              <p style={styles.sidebarSubtitle}>NU Dasma</p>
            </div>
            
            {/* Navigation Menu Items */}
            <div style={styles.menuContainer}>
              {getMenuItems().map((item, index) => (
                <button
                  key={index}
                  style={{
                    ...styles.menuItem,
                    backgroundColor: location.pathname === item.path ? '#f3f4f6' : 'transparent'
                  }}
                  onClick={() => handleNavigation(item.path)}
                >
                  <span style={styles.menuItemText}>{item.label}</span>
                </button>
              ))}
            </div>
            
            {/* Logout Button */}
            <button
              style={styles.logoutButton}
              onClick={handleLogout}
            >
              <span style={styles.logoutButtonText}>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div style={styles.content}>
        {children}
      </div>
    </div>
  );
};

/**
 * Styles for the Layout component
 * Uses a consistent blue/white theme throughout the application
 */
const styles = {
  // Main container
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#f5f5f5',
  },
  
  // Top navigation bar
  topBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e3a8a',  // Primary blue color
    padding: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    minHeight: '64px',
  },
  
  // Back button
  backButton: {
    padding: '8px',
    marginRight: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  backButtonText: {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  
  // Menu button (hamburger icon)
  menuButton: {
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  menuButtonText: {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  
  // Page title
  title: {
    flex: 1,
    color: 'white',
    fontSize: '18px',
    fontWeight: '600',
    textAlign: 'center',
    margin: 0,
  },
  
  // User information section
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  userName: {
    color: 'white',
    fontSize: '12px',
    fontWeight: '500',
    margin: 0,
  },
  userRole: {
    color: '#bfdbfe',  // Light blue
    fontSize: '10px',
    margin: 0,
  },
  
  // Sidebar overlay (full screen when sidebar is open)
  sidebarOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  
  // Backdrop (semi-transparent overlay)
  sidebarBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Sidebar container
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '80%',
    maxWidth: '300px',
    height: '100%',
    backgroundColor: 'white',
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    flexDirection: 'column',
  },
  
  // Sidebar header section
  sidebarHeader: {
    backgroundColor: '#1e3a8a',
    padding: '20px',
  },
  sidebarTitle: {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '4px',
    margin: 0,
  },
  sidebarSubtitle: {
    color: '#bfdbfe',
    fontSize: '14px',
    margin: 0,
  },
  
  // Menu items container
  menuContainer: {
    flex: 1,
    paddingTop: '20px',
  },
  
  // Individual menu item
  menuItem: {
    display: 'block',
    width: '100%',
    padding: '16px 20px',
    borderBottom: '1px solid #f3f4f6',
    backgroundColor: 'transparent',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
  },
  menuItemText: {
    fontSize: '16px',
    color: '#374151',
    fontWeight: '500',
  },
  
  // Logout button
  logoutButton: {
    margin: '20px',
    backgroundColor: '#ef4444',  // Red color for logout
    padding: '16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
  },
  
  // Main content area
  content: {
    flex: 1,
    padding: '16px',
    overflow: 'auto',
  },
};

export default Layout;