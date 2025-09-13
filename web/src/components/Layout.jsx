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
        {/* Burger Menu Button - Always shown, toggles sidebar */}
        <button
          style={styles.menuButton}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Open menu"
        >
          {/* Hamburger icon SVG */}
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="5" width="28" height="3" rx="1.5" fill="white"/>
            <rect y="12.5" width="28" height="3" rx="1.5" fill="white"/>
            <rect y="20" width="28" height="3" rx="1.5" fill="white"/>
          </svg>
        </button>
        {/* Page Title - Centered, absolutely centered using flex */}
        <div style={styles.headerCenter}>
          <h1 style={styles.title}>{title}</h1>
        </div>
        {/* User Information - Right side, with avatar */}
        <div style={styles.userInfo}>
          <div style={styles.avatar}>
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : '?'}
          </div>
          <div style={styles.userTextInfo}>
            <span style={styles.userName}>{user?.fullName}</span>
            <span style={styles.userRole}>{user?.role}</span>
          </div>
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
              <img className="sidebarLogo" src='../../assets/Logo_with_Color.png' alt='Logo' style={styles.sidebarLogo} />
              
            </div>
            
            {/* Navigation Menu Items */}
<div style={styles.menuContainer}>
  {getMenuItems().map((item, index) => (
    <button
      key={index}
      style={{
        ...styles.menuItem,
        backgroundColor: location.pathname === item.path ? '#f3f4f6' : 'transparent',
        display: 'flex',
        alignItems: 'center'
      }}
      onClick={() => handleNavigation(item.path)}
    >
      {/* Render icon based on item label */}
      {item.label === 'Home' && (
                        <img
                  src="../../assets/home-icon.png"
                  alt="home"
                  style={{ width: 20, height: 20, marginRight: 8 }}
                />
      )}
              {item.label === 'User Management' && (
          <img
            src="../../assets/user-management.png"
            alt="user-management"
            style={{ width: 20, height: 20, marginRight: 8 }}
          />
        )}
              {item.label === 'Template Management' && (
          <img
            src="../../assets/template.png"
            alt="template"
            style={{ width: 20, height: 20, marginRight: 8 }}
          />
        )}
      {item.label === 'Receipt Verification' && (
        <img
          src="../../assets/receipt-ver.png"
          alt="receipt-ver"
          style={{ width: 20, height: 20, marginRight: 8 }}
        />
      )}
      {item.label === 'FAQ Chatbot' && (
        <img
          src="../../assets/chat.png"
          alt="chat"
          style={{ width: 20, height: 20, marginRight: 8 }}
        />
      )}
      {item.label === 'Profile' && (
        <img
          src="../../assets/profile.png"
          alt="profile"
          style={{ width: 20, height: 20, marginRight: 8 }}
        />
      )}
      {item.label === 'Issue Receipt' && (
        <img
          src="../../assets/Receipt-issue.png"
          alt="issue-receipt"
          style={{ width: 20, height: 20, marginRight: 8 }}
        />
      )}
      {item.label === 'Transaction Archive' && (
        <img
          src="../../assets/archive.png"
          alt="archive"
          style={{ width: 20, height: 20, marginRight: 8 }}
        />
      )}
      {item.label === 'Payment Gateway' && (
        <img
          src="../../assets/payment.png"
          alt="payment"
          style={{ width: 20, height: 20, marginRight: 8 }}
        />
      )}

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
    justifyContent: 'space-between',
    backgroundColor: '#1e3a8a',  // Primary blue color
    padding: '8px 24px',
    boxShadow: '0 4px 16px rgba(30, 58, 138, 0.10)',
    minHeight: '56px',
    position: 'relative',
    zIndex: 10,
  },

  headerCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: 1,
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
    color: 'white',
    fontSize: '20px',
    fontWeight: 500,
    letterSpacing: '0.5px',
    margin: 0,
    textAlign: 'center',
    lineHeight: 1.2,
    pointerEvents: 'auto',
    background: 'transparent',
    boxShadow: 'none',
  },
  
  // User information section
  userInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '10px',
    minWidth: 0,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: 18,
    boxShadow: '0 2px 8px rgba(30,58,138,0.10)',
    marginRight: 4,
    userSelect: 'none',
  },
  userTextInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    minWidth: 0,
  },
  userName: {
    color: 'white',
    fontSize: '13px',
    fontWeight: 400,
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 120,
  },
  userRole: {
    color: '#bfdbfe',  // Light blue
    fontSize: '11px',
    margin: 0,
    fontWeight: 300,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 120,
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

  sidebarLogo: {
     width: 250, 
     height: 250, 
     marginTop: -30, 
     marginBottom: -80, 
     alignSelf: 'center'
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
    padding: '20px',
    '&:hover': {
      backgroundColor: '#a5c1f8ff',
      transition: 'background-color 0.3s ease',
      display: 'flex',
      alignItems: 'center',
    },
  },
  
  // Sidebar header section
  sidebarHeader: {
    backgroundColor: '#ffffffff',
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
    color: '#7cb6fdff',
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
    color: '#19191aff',
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
    marginBottom: '50px',
   
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