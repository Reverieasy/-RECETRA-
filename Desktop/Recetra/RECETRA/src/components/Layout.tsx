import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

/**
 * Props for the Layout component
 */
interface LayoutProps {
  children: React.ReactNode;    // Content to be displayed in the main area
  title: string;                // Title to display in the top bar
  showBackButton?: boolean;     // Whether to show the back button
}

/**
 * Main Layout Component
 * Provides the consistent layout structure for all screens including:
 * - Top navigation bar with menu button and user info
 * - Collapsible sidebar with role-based navigation
 * - Main content area
 * - Optional back button for navigation
 * 
 * Features:
 * - Responsive design that adapts to screen size
 * - Role-based menu items with actual navigation
 * - User session management
 * - Logout functionality
 * - Back button for easy navigation
 */
const Layout: React.FC<LayoutProps> = ({ children, title, showBackButton = false }) => {
  // State for sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  /**
   * Returns menu items based on user role
   * Each role has different navigation options
   * @returns Array of menu items for the current user role
   */
  const getMenuItems = () => {
    if (!user) return [];

    switch (user.role) {
      case 'Admin':
        return [
          { label: 'Home', screen: 'AdminDashboard' },
          { label: 'User Management', screen: 'UserManagement' },
          { label: 'Template Management', screen: 'TemplateManagement' },
          { label: 'Receipt Verification', screen: 'ReceiptVerification' },
          { label: 'FAQ Chatbot', screen: 'FAQChatbot' },
          { label: 'Profile', screen: 'Profile' },
        ];
      case 'Encoder':
        return [
          { label: 'Home', screen: 'EncoderDashboard' },
          { label: 'Issue Receipt', screen: 'IssueReceipt' },
          { label: 'Transaction Archive', screen: 'TransactionArchive' },
          { label: 'Receipt Verification', screen: 'ReceiptVerification' },
          { label: 'FAQ Chatbot', screen: 'FAQChatbot' },
          { label: 'Profile', screen: 'Profile' },
        ];
      case 'Viewer':
        return [
          { label: 'Home', screen: 'ViewerDashboard' },
          { label: 'Payment Gateway', screen: 'PaymentGateway' },
          { label: 'Receipt Verification', screen: 'ReceiptVerification' },
          { label: 'FAQ Chatbot', screen: 'FAQChatbot' },
          { label: 'Profile', screen: 'Profile' },
        ];
      default:
        return [];
    }
  };

  /**
   * Handles navigation to a specific screen
   * @param screenName - Name of the screen to navigate to
   */
  const handleNavigation = (screenName: string) => {
    setSidebarOpen(false);
    // @ts-ignore - Navigation type is dynamic
    navigation.navigate(screenName);
  };

  /**
   * Handles back button press
   */
  const handleBackPress = () => {
  };

  /**
   * Handles user logout
   * Clears user session and redirects to login
   */
  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        {/* Back Button - Only shown when showBackButton is true */}
        {showBackButton && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        )}
        
        {/* Menu Button - Toggles sidebar */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setSidebarOpen(!sidebarOpen)}
        >
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>
        
        {/* Page Title - Centered */}
        <Text style={styles.title}>{title}</Text>
        
        {/* User Information - Right side */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.fullName}</Text>
          <Text style={styles.userRole}>{user?.role}</Text>
        </View>
      </View>

      {/* Sidebar Overlay - Appears when sidebar is open */}
      {sidebarOpen && (
        <View style={styles.sidebarOverlay}>
          {/* Backdrop - Closes sidebar when tapped */}
          <TouchableOpacity
            style={styles.sidebarBackdrop}
            onPress={() => setSidebarOpen(false)}
          />
          
          {/* Sidebar Content */}
          <View style={styles.sidebar}>
            {/* Sidebar Header */}
              <Image
                source={require('../../assets/Logo_with_Color.png')}
                style={{ width: 300, height: 200, marginTop: 0, marginBottom: -110, alignSelf: 'center', }}
                resizeMode="contain"
              />

            
            {/* Navigation Menu Items */}
            <View style={styles.menuContainer}>
              {getMenuItems().map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => handleNavigation(item.screen)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {item.label === 'Home' && (
                      <Image
                        source={require('../../assets/home-icon.png')}
                        style={{ width: 20, height: 20, marginRight: 8 }}
                        resizeMode="contain"
                      />
                    )}
                    {item.label === 'User Management' && (
                      <Image
                        source={require('../../assets/user-management.png')}
                        style={{ width: 20, height: 20, marginRight: 8 }}
                        resizeMode="contain"
                      />
                    )}
                    {item.label === 'Template Management' && (
                      <Image
                        source={require('../../assets/template.png')}
                        style={{ width: 20, height: 20, marginRight: 8 }}
                        resizeMode="contain"
                      />
                    )}
                    {item.label === 'Receipt Verification' && (
                      <Image
                        source={require('../../assets/receipt-ver.png')}
                        style={{ width: 20, height: 20, marginRight: 8 }}
                        resizeMode="contain"
                      />
                    )}
                    {item.label === 'FAQ Chatbot' && (
                      <Image
                        source={require('../../assets/chat.png')}
                        style={{ width: 20, height: 20, marginRight: 8 }}
                        resizeMode="contain"
                      />
                    )}
                    {item.label === 'Profile' && (
                      <Image
                        source={require('../../assets/profile.png')}
                        style={{ width: 20, height: 20, marginRight: 8 }}
                        resizeMode="contain"
                      />
                    )}
                    {item.label === 'Issue Receipt' && (
                      <Image
                        source={require('../../assets/Receipt-issue.png')}
                        style={{ width: 20, height: 20, marginRight: 8 }}
                        resizeMode="contain"
                      />
                    )}
                    {item.label === 'Transaction Archive' && (
                      <Image
                        source={require('../../assets/archive.png')}
                        style={{ width: 20, height: 20, marginRight: 8 }}
                        resizeMode="contain"
                      />
                    )}
                    {item.label === 'Payment Gateway' && (
                      <Image
                        source={require('../../assets/payment.png')}
                        style={{ width: 20, height: 20, marginRight: 8 }}
                        resizeMode="contain"
                      />
                    )}
                    <Text style={styles.menuItemText}>{item.label}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Logout Button */}
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Main Content Area */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

/**
 * Styles for the Layout component
 * Uses a consistent blue/white theme throughout the application
 */
const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // Top navigation bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f3b73',  // Primary blue color
    paddingHorizontal: 16,
    paddingTop: 50,  // Account for status bar
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  
  // Back button
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  
  // Menu button (hamburger icon)
  menuButton: {
    padding: 8,
  },
  menuButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  
  // Page title
  title: {
    flex: 1,
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // User information section
  userInfo: {
    alignItems: 'flex-end',
  },
  userName: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  userRole: {
    color: '#bfdbfe',  // Light blue
    fontSize: 10,
  },
  
  // Sidebar overlay (full screen when sidebar is open)
  sidebarOverlay: {
    position: 'absolute',
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
    width: width * 0.8,  // 80% of screen width
    height: '100%',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  
  // Sidebar header section
  sidebarHeader: {
    backgroundColor: '#1e3a8a',
    padding: 20,
    paddingTop: 60,  // Account for status bar
  },
  sidebarTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sidebarSubtitle: {
    color: '#bfdbfe',
    fontSize: 14,
  },
  
  // Menu items container
  menuContainer: {
    flex: 1,
    paddingTop: 20,
  },
  
  // Individual menu item
  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuItemText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  
  // Logout button
  logoutButton: {
    margin: 20,
    backgroundColor: '#ef4444',  // Red color for logout
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Main content area
  content: {
    flex: 1,
    padding: 16,
  },
});

export default Layout;
