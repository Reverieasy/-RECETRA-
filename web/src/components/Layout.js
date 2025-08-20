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
   * Returns an icon element based on the menu item label
   * @param {string} label - The label of the menu item
   * @returns {React.ReactNode} - An icon element (img or span)
   */
  const getMenuItemIcon = (label) => {
    switch (label) {
      case 'Home':
        return <img src="/assets/home-icon.png" alt="home" style={{ width: 20, height: 20, marginRight: 8 }} />;
      case 'User Management':
        return <img src="/assets/user-management.png" alt="user-management" style={{ width: 20, height: 20, marginRight: 8 }} />;
      case 'Template Management':
        return <img src="/assets/template.png" alt="template" style={{ width: 20, height: 20, marginRight: 8 }} />;
      case 'Receipt Verification':
        return <img src="/assets/receipt-ver.png" alt="receipt-ver" style={{ width: 20, height: 20, marginRight: 8 }} />;
      case 'FAQ Chatbot':
        return <img src="/assets/chat.png" alt="chat" style={{ width: 20, height: 20, marginRight: 8 }} />;
      case 'Profile':
        return <img src="/assets/profile.png" alt="profile" style={{ width: 20, height: 20, marginRight: 8 }} />;
      case 'Issue Receipt':
        return <img src="/assets/Receipt-issue.png" alt="issue-receipt" style={{ width: 20, height: 20, marginRight: 8 }} />;
      case 'Transaction Archive':
        return <img src="/assets/archive.png" alt="archive" style={{ width: 20, height: 20, marginRight: 8 }} />;
      case 'Payment Gateway':
        return <img src="/assets/payment.png" alt="payment" style={{ width: 20, height: 20, marginRight: 8 }} />;
      default:
        return null;
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
      <div style={styles.topBar} className="topBar">
        {/* Back Button */}
        {showBackButton && (
          <button
            style={styles.backButton}
            onClick={handleBackPress}
            className="backButton"
          >
            <span style={styles.backButtonText} className="backButtonText">←</span>
          </button>
        )}

        {/* Menu Button */}
        <button
          style={styles.menuButton}
          onClick={() => setSidebarOpen(true)}
          className="menuButton"
        >
          <span style={styles.menuButtonText} className="menuButtonText">☰</span>
        </button>

        {/* Page Title */}
        <h1 style={styles.title} className="title">{title}</h1>

        {/* User Information - Right side */}
        <div style={styles.userInfo} className="userInfo">
          <span style={styles.userName} className="userName">{user?.fullName}</span>
          <span style={styles.userRole} className="userRole">{user?.role}</span>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div style={styles.sidebarOverlay} className="sidebarOverlay">
          {/* Backdrop */}
          <div style={styles.sidebarBackdrop} onClick={() => setSidebarOpen(false)} />
          
          {/* Sidebar */}
          <div style={styles.sidebar} className="sidebar">
            {/* Sidebar Header */}
            <div style={styles.sidebarHeader} className="sidebarHeader">
              <img
                src="/assets/LogoIcon.png"
                alt="RECETRA Logo"
                style={styles.sidebarLogo}
                className="sidebarLogo"
              />
              <h2 style={styles.sidebarTitle} className="sidebarTitle">RECETRA</h2>
              <p style={styles.sidebarSubtitle} className="sidebarSubtitle">Receipt Management System</p>
            </div>

            {/* Menu Items */}
            <div style={styles.menuContainer} className="menuContainer">
              {getMenuItems().map((item) => (
                <button
                  key={item.path}
                  style={styles.menuItem}
                  className="menuItem"
                  onClick={() => handleNavigation(item.path)}
                >
                  {getMenuItemIcon(item.label)}
                  <span style={styles.menuItemText} className="menuItemText">{item.label}</span>
                </button>
              ))}
            </div>
            
            {/* Logout Button */}
            <button
              style={styles.logoutButton}
              onClick={handleLogout}
              className="logoutButton"
            >
              <span style={styles.logoutButtonText} className="logoutButtonText">Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div style={styles.content} className="content">
        {children}
      </div>
    </div>
  );
};

/**
 * Styles for the Layout component
 * Uses a consistent blue/white theme throughout the application
 * Responsive design for all device sizes
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
    padding: '12px 16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    minHeight: '56px',
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
    fontSize: '18px',
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
    fontSize: '18px',
    fontWeight: 'bold',
  },
  
  // Page title
  title: {
    flex: 1,
    color: 'white',
    fontSize: '16px',
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
    fontSize: '11px',
    fontWeight: '500',
    margin: 0,
  },
  userRole: {
    color: '#bfdbfe',  // Light blue
    fontSize: '9px',
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

  sidebarLogo: {
     width: 200, 
     height: 200, 
     marginTop: -20, 
     marginBottom: -60, 
     alignSelf: 'center',
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
    width: '85%',
    maxWidth: '280px',
    height: '100%',
    backgroundColor: 'white',
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
  },
  
  // Sidebar header section
  sidebarHeader: {
    backgroundColor: '#ffffffff',
    padding: '16px',
  },
  sidebarTitle: {
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '4px',
    margin: 0,
  },
  sidebarSubtitle: {
    color: '#7cb6fdff',
    fontSize: '13px',
    margin: 0,
  },
  
  // Menu items container
  menuContainer: {
    flex: 1,
    paddingTop: '16px',
  },
  
  // Individual menu item
  menuItem: {
    display: 'block',
    width: '100%',
    padding: '14px 16px',
    borderBottom: '1px solid #f3f4f6',
    backgroundColor: 'transparent',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
  },
  menuItemText: {
    fontSize: '15px',
    color: '#19191aff',
    fontWeight: '500',
  },
  
  // Logout button
  logoutButton: {
    margin: '16px',
    backgroundColor: '#ef4444',  // Red color for logout
    padding: '14px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    marginBottom: '40px',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: '15px',
    fontWeight: '600',
  },
  
  // Main content area
  content: {
    flex: 1,
    padding: '12px',
    overflow: 'auto',
  },
};

export default Layout;