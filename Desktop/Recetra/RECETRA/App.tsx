import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import AdminDashboard from './src/screens/AdminDashboard';
import EncoderDashboard from './src/screens/EncoderDashboard';
import ViewerDashboard from './src/screens/ViewerDashboard';
import IssueReceiptScreen from './src/screens/IssueReceiptScreen';
import ReceiptVerificationScreen from './src/screens/ReceiptVerificationScreen';
import FAQChatbotScreen from './src/screens/FAQChatbotScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import UserManagementScreen from './src/screens/UserManagementScreen';
import TemplateManagementScreen from './src/screens/TemplateManagementScreen';
import PaymentGatewayScreen from './src/screens/PaymentGatewayScreen';
import TransactionArchiveScreen from './src/screens/TransactionArchiveScreen';

const Stack = createStackNavigator();

/**
 * AppContent Component
 * Handles the main application navigation logic
 * 
 * Features:
 * - Conditional rendering based on authentication status
 * - Role-based navigation stacks
 * - Automatic redirection to appropriate dashboard
 * - Login screen for unauthenticated users
 */
const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  // Show loading screen while checking authentication status
  if (isLoading) {
    return null; // You could add a loading spinner here
  }

  // If user is not authenticated, show login/signup screens
  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // If user is authenticated, show role-based navigation
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Admin Navigation Stack */}
        {user.role === 'Admin' && (
          <>
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
            <Stack.Screen name="UserManagement" component={UserManagementScreen} />
            <Stack.Screen name="TemplateManagement" component={TemplateManagementScreen} />
            <Stack.Screen name="ReceiptVerification" component={ReceiptVerificationScreen} />
            <Stack.Screen name="FAQChatbot" component={FAQChatbotScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        )}

        {/* Encoder Navigation Stack */}
        {user.role === 'Encoder' && (
          <>
            <Stack.Screen name="EncoderDashboard" component={EncoderDashboard} />
            <Stack.Screen name="IssueReceipt" component={IssueReceiptScreen} />
            <Stack.Screen name="TransactionArchive" component={TransactionArchiveScreen} />
            <Stack.Screen name="ReceiptVerification" component={ReceiptVerificationScreen} />
            <Stack.Screen name="FAQChatbot" component={FAQChatbotScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        )}

        {/* Viewer Navigation Stack */}
        {user.role === 'Viewer' && (
          <>
            <Stack.Screen name="ViewerDashboard" component={ViewerDashboard} />
            <Stack.Screen name="PaymentGateway" component={PaymentGatewayScreen} />
            <Stack.Screen name="ReceiptVerification" component={ReceiptVerificationScreen} />
            <Stack.Screen name="FAQChatbot" component={FAQChatbotScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

/**
 * Main App Component
 * Wraps the entire application with authentication context
 * 
 * Features:
 * - Provides authentication context to all child components
 * - Handles global app state management
 * - Sets up navigation container
 */
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
