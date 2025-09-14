import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * Inline Notification Context for showing messages within the UI
 */
const InlineNotificationContext = createContext();

/**
 * Custom hook to use inline notifications
 */
export const useInlineNotification = () => {
  const context = useContext(InlineNotificationContext);
  if (!context) {
    // Return fallback functions that only log to console instead of showing popups
    return {
      showSuccess: (message, title) => {
        console.log('Success:', title, message);
      },
      showError: (message, title) => {
        console.log('Error:', title, message);
      },
      showInfo: (message, title) => {
        console.log('Info:', title, message);
      },
      showWarning: (message, title) => {
        console.log('Warning:', title, message);
      },
    };
  }
  return context;
};

/**
 * Inline Notification Provider Component
 * Shows notifications as part of the UI, not as popups
 */
export const InlineNotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  /**
   * Shows a success message inline
   */
  const showSuccess = useCallback((message, title = 'Success', duration = 5000) => {
    const id = Date.now() + Math.random();
    const notification = {
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
   * Shows an error message inline
   */
  const showError = useCallback((message, title = 'Error', duration = 7000) => {
    const id = Date.now() + Math.random();
    const notification = {
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
   * Shows an info message inline
   */
  const showInfo = useCallback((message, title = 'Info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const notification = {
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
   * Shows a warning message inline
   */
  const showWarning = useCallback((message, title = 'Warning', duration = 6000) => {
    const id = Date.now() + Math.random();
    const notification = {
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
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  /**
   * Clears all notifications
   */
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
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
 * Renders notifications centered on screen like export modal
 */
const InlineNotificationContainer = ({ notifications, onRemove }) => {
  if (notifications.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      pointerEvents: 'auto'
    }}>
      {notifications.map(notification => (
        <InlineNotificationItem
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

/**
 * Individual Inline Notification Item Component
 */
const InlineNotificationItem = ({ notification, onRemove }) => {
  const { id, type, title, message } = notification;

  const handleRemove = () => {
    onRemove(id);
  };

  const getStyles = () => {
    const baseStyles = {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '500px',
      width: '90%',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      border: '1px solid #e5e7eb',
      textAlign: 'center'
    };

    switch (type) {
      case 'success':
        return { ...baseStyles, borderTop: '4px solid #10b981' };
      case 'error':
        return { ...baseStyles, borderTop: '4px solid #ef4444' };
      case 'warning':
        return { ...baseStyles, borderTop: '4px solid #f59e0b' };
      case 'info':
        return { ...baseStyles, borderTop: '4px solid #3b82f6' };
      default:
        return { ...baseStyles, borderTop: '4px solid #3b82f6' };
    }
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

  return (
    <div style={getStyles()}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: type === 'success' ? '#10b981' : 
                     type === 'error' ? '#ef4444' : 
                     type === 'warning' ? '#f59e0b' : '#3b82f6',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          {getIcon()}
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: '600', fontSize: '18px', color: '#1f2937', marginBottom: '8px' }}>
            {title}
          </div>
          <div style={{ fontSize: '16px', color: '#4b5563', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
            {message}
          </div>
        </div>
        <button 
          onClick={handleRemove}
          style={{
            background: type === 'success' ? '#10b981' : 
                       type === 'error' ? '#ef4444' : 
                       type === 'warning' ? '#f59e0b' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            minWidth: '120px'
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default InlineNotificationProvider;