import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';

/**
 * Inline Notification Context Type Definition
 */
interface InlineNotificationContextType {
  notifications: NotificationItem[];
  showSuccess: (message: string, title?: string, duration?: number) => number;
  showError: (message: string, title?: string, duration?: number) => number;
  showInfo: (message: string, title?: string, duration?: number) => number;
  showWarning: (message: string, title?: string, duration?: number) => number;
  removeNotification: (id: number) => void;
  clearAll: () => void;
}

interface NotificationItem {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration: number;
  timestamp: Date;
}

interface InlineNotificationProviderProps {
  children: ReactNode;
}

/**
 * Inline Notification Context
 */
const InlineNotificationContext = createContext<InlineNotificationContextType | undefined>(undefined);

/**
 * Custom hook to use inline notifications
 */
export const useInlineNotification = () => {
  const context = useContext(InlineNotificationContext);
  if (!context) {
    throw new Error('useInlineNotification must be used within an InlineNotificationProvider');
  }
  return context;
};

/**
 * Inline Notification Provider Component
 */
export const InlineNotificationProvider: React.FC<InlineNotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  /**
   * Shows a success notification inline
   */
  const showSuccess = useCallback((message: string, title: string = 'Success', duration: number = 5000): number => {
    const id = Date.now() + Math.random();
    const notification: NotificationItem = {
      id,
      type: 'success',
      title,
      message,
      duration,
      timestamp: new Date()
    };
    
    setNotifications(prev => [...prev, notification]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    
    return id;
  }, []);

  /**
   * Shows an error notification inline
   */
  const showError = useCallback((message: string, title: string = 'Error', duration: number = 7000): number => {
    const id = Date.now() + Math.random();
    const notification: NotificationItem = {
      id,
      type: 'error',
      title,
      message,
      duration,
      timestamp: new Date()
    };
    
    setNotifications(prev => [...prev, notification]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    
    return id;
  }, []);

  /**
   * Shows an info notification inline
   */
  const showInfo = useCallback((message: string, title: string = 'Info', duration: number = 5000): number => {
    const id = Date.now() + Math.random();
    const notification: NotificationItem = {
      id,
      type: 'info',
      title,
      message,
      duration,
      timestamp: new Date()
    };
    
    setNotifications(prev => [...prev, notification]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    
    return id;
  }, []);

  /**
   * Shows a warning notification inline
   */
  const showWarning = useCallback((message: string, title: string = 'Warning', duration: number = 6000): number => {
    const id = Date.now() + Math.random();
    const notification: NotificationItem = {
      id,
      type: 'warning',
      title,
      message,
      duration,
      timestamp: new Date()
    };
    
    setNotifications(prev => [...prev, notification]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    
    return id;
  }, []);

  /**
   * Removes a notification by ID
   */
  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  /**
   * Clears all notifications
   */
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value: InlineNotificationContextType = {
    notifications,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    removeNotification,
    clearAll
  };

  return (
    <InlineNotificationContext.Provider value={value}>
      {children}
      <InlineNotificationContainer notifications={notifications} onRemove={removeNotification} />
    </InlineNotificationContext.Provider>
  );
};

/**
 * Inline Notification Container Component
 */
interface InlineNotificationContainerProps {
  notifications: NotificationItem[];
  onRemove: (id: number) => void;
}

const InlineNotificationContainer: React.FC<InlineNotificationContainerProps> = ({ notifications, onRemove }) => {
  if (notifications.length === 0) return null;

  return (
    <View style={styles.container}>
      {notifications.map(notification => (
        <InlineNotificationItem
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </View>
  );
};

/**
 * Individual Inline Notification Item Component
 */
interface InlineNotificationItemProps {
  notification: NotificationItem;
  onRemove: (id: number) => void;
}

const InlineNotificationItem: React.FC<InlineNotificationItemProps> = ({ notification, onRemove }) => {
  const { id, type, title, message } = notification;
  const slideAnim = useState(new Animated.Value(0.9))[0];
  const opacityAnim = useState(new Animated.Value(0))[0];

  React.useEffect(() => {
    // Modal slide in animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRemove = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0.9,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onRemove(id);
    });
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return 'ℹ';
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#3b82f6';
    }
  };

  return (
    <Animated.View
      style={[
        styles.notification,
        {
          transform: [{ scale: slideAnim }, { translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: getBackgroundColor() }]}>
          <Text style={styles.icon}>{getIcon()}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: getBackgroundColor() }]}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
        <TouchableOpacity style={[styles.closeButton, { backgroundColor: getBackgroundColor() }]} onPress={handleRemove}>
          <Text style={styles.closeText}>OK</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10000,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  notification: {
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    maxWidth: 400,
    width: '100%',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    color: '#4b5563',
  },
  closeButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
  },
  closeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default InlineNotificationProvider;
