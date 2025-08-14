import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer, RouteProp } from '@react-navigation/native';
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
import { View, Image, StyleSheet, Animated } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

const Stack = createStackNavigator();

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  AdminDashboard: undefined;
  UserManagement: undefined;
  TemplateManagement: undefined;
  ReceiptVerification: undefined;
  FAQChatbot: undefined;
  Profile: undefined;
  EncoderDashboard: undefined;
  IssueReceipt: undefined;
  TransactionArchive: undefined;
  PaymentGateway: undefined;
  ViewerDashboard: undefined;
};

type SignupScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Signup'>;
  route: RouteProp<RootStackParamList, 'Signup'>;
};

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
  const [showLoading, setShowLoading] = useState(true);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    // Start animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Add a delay of 2 seconds (2000 ms)
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading screen while checking authentication status
  if (isLoading || showLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Animated.Image
          source={require('./assets/Logo_with_Color.png')}
          style={[
            styles.loadingImage,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
          resizeMode="contain"
        />
      </View>
    );
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // or your preferred color
  },
  loadingImage: {
    width: 250,
    height: 250,
  },
});

export default App;
