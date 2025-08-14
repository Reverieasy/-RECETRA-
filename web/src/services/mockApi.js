/**
 * RECETRA Mock API Services
 * This file contains mock implementations of various external services
 * In a real application, these would be replaced with actual API calls
 * 
 * Services included:
 * - Payment Gateway (process payments, refunds)
 * - Email Service (send receipts, notifications)
 * - SMS Service (send receipts, notifications)
 * - QR Code Service (generate, verify QR codes)
 * - Report Service (generate reports)
 * - Backup Service (create, restore backups)
 * - Analytics Service (track events, get analytics)
 */

import { mockReceipts } from '../data/mockData';

// ============================================================================
// PAYMENT GATEWAY SERVICE
// ============================================================================

/**
 * Mock Payment Gateway Service
 * Simulates integration with payment processors like PayPal, Stripe, etc.
 * Handles payment processing and refunds
 */
export const mockPaymentGateway = {
  /**
   * Processes a payment for a receipt
   * @param {string} receiptId - ID of the receipt being paid for
   * @param {number} amount - Payment amount in pesos
   * @returns {Promise<Object>} Promise with success status and transaction details
   */
  processPayment: async (receiptId, amount) => {
    // Simulate API delay (real payment processing takes time)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate 90% success rate (realistic payment success rate)
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      return {
        success: true,
        transactionId,
      };
    } else {
      return {
        success: false,
        error: 'Payment processing failed. Please try again.',
      };
    }
  },

  /**
   * Processes a refund for a payment
   * @param {string} transactionId - Original transaction ID
   * @param {number} amount - Refund amount in pesos
   * @returns {Promise<Object>} Promise with success status
   */
  refundPayment: async (transactionId, amount) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const isSuccess = Math.random() > 0.2;
    
    if (isSuccess) {
      return { success: true };
    } else {
      return {
        success: false,
        error: 'Refund processing failed. Please contact support.',
      };
    }
  },
};

// ============================================================================
// EMAIL SERVICE
// ============================================================================

/**
 * Mock Email Service
 * Simulates email delivery for receipts and notifications
 * In a real app, this would integrate with services like SendGrid, AWS SES, etc.
 */
export const mockEmailService = {
  /**
   * Sends a receipt via email to the payer
   * @param {string} receiptId - ID of the receipt to send
   * @param {string} email - Recipient email address
   * @returns {Promise<Object>} Promise with delivery status
   */
  sendReceiptEmail: async (receiptId, email) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find the receipt in mock data
    const receipt = mockReceipts.find(r => r.id === receiptId);
    if (!receipt) {
      return {
        success: false,
        error: 'Receipt not found',
      };
    }

    // Simulate 95% email delivery success rate
    const isSuccess = Math.random() > 0.05;
    
    if (isSuccess) {
      const messageId = `MSG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Update receipt email status in mock data
      receipt.emailStatus = 'sent';
      
      return {
        success: true,
        messageId,
      };
    } else {
      receipt.emailStatus = 'failed';
      return {
        success: false,
        error: 'Failed to send email. Please check email configuration.',
      };
    }
  },

  /**
   * Sends a general notification email
   * @param {string} to - Recipient email address
   * @param {string} subject - Email subject
   * @param {string} body - Email body content
   * @returns {Promise<Object>} Promise with delivery status
   */
  sendNotificationEmail: async (to, subject, body) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      const messageId = `MSG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      return {
        success: true,
        messageId,
      };
    } else {
      return {
        success: false,
        error: 'Failed to send notification email.',
      };
    }
  },
};

// ============================================================================
// SMS SERVICE
// ============================================================================

/**
 * Mock SMS Service
 * Simulates SMS delivery for receipts and notifications
 * In a real app, this would integrate with services like Twilio, AWS SNS, etc.
 */
export const mockSMSService = {
  /**
   * Sends a receipt via SMS to the payer
   * @param {string} receiptId - ID of the receipt to send
   * @param {string} phoneNumber - Recipient phone number
   * @returns {Promise<Object>} Promise with delivery status
   */
  sendReceiptSMS: async (receiptId, phoneNumber) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Find the receipt in mock data
    const receipt = mockReceipts.find(r => r.id === receiptId);
    if (!receipt) {
      return {
        success: false,
        error: 'Receipt not found',
      };
    }

    // Simulate 90% SMS delivery success rate
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      const messageId = `SMS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Update receipt SMS status in mock data
      receipt.smsStatus = 'sent';
      
      return {
        success: true,
        messageId,
      };
    } else {
      receipt.smsStatus = 'failed';
      return {
        success: false,
        error: 'Failed to send SMS. Please check phone number.',
      };
    }
  },

  /**
   * Sends a general notification SMS
   * @param {string} phoneNumber - Recipient phone number
   * @param {string} message - SMS message content
   * @returns {Promise<Object>} Promise with delivery status
   */
  sendNotificationSMS: async (phoneNumber, message) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const isSuccess = Math.random() > 0.15;
    
    if (isSuccess) {
      const messageId = `SMS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      return {
        success: true,
        messageId,
      };
    } else {
      return {
        success: false,
        error: 'Failed to send SMS notification.',
      };
    }
  },
};

// ============================================================================
// QR CODE SERVICE
// ============================================================================

/**
 * Mock QR Code Service
 * Simulates QR code generation and verification
 * In a real app, this would use libraries like qrcode, qrcode.react
 */
export const mockQRCodeService = {
  /**
   * Generates a QR code for receipt verification
   * @param {string} data - Data to encode in the QR code (usually receipt number)
   * @returns {Promise<Object>} Promise with QR code data
   */
  generateQRCode: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Simulate 98% QR generation success rate
    const isSuccess = Math.random() > 0.02;
    
    if (isSuccess) {
      const qrCodeData = `QR-${data}-${Date.now()}`;
      return {
        success: true,
        qrCodeData,
      };
    } else {
      return {
        success: false,
        error: 'Failed to generate QR code.',
      };
    }
  },

  /**
   * Verifies and decodes a QR code
   * @param {string} qrCodeData - QR code data to verify
   * @returns {Promise<Object>} Promise with decoded data
   */
  verifyQRCode: async (qrCodeData) => {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Simulate 99% QR verification success rate
    const isSuccess = Math.random() > 0.01;
    
    if (isSuccess) {
      // Extract receipt number from QR code data
      const receiptNumber = qrCodeData.split('-')[1];
      return {
        success: true,
        data: receiptNumber,
      };
    } else {
      return {
        success: false,
        error: 'Invalid QR code or corrupted data.',
      };
    }
  },
};

// ============================================================================
// REPORT GENERATION SERVICE
// ============================================================================

/**
 * Mock Report Generation Service
 * Simulates report generation for receipts and system analytics
 * In a real app, this would generate PDF reports or export data
 */
export const mockReportService = {
  /**
   * Generates a receipt report with optional filters
   * @param {Object} filters - Filter criteria for the report
   * @returns {Promise<Object>} Promise with report URL
   */
  generateReceiptReport: async (filters) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const isSuccess = Math.random() > 0.05;
    
    if (isSuccess) {
      const reportUrl = `https://reports.recetra.com/receipt-report-${Date.now()}.pdf`;
      return {
        success: true,
        reportUrl,
      };
    } else {
      return {
        success: false,
        error: 'Failed to generate report. Please try again.',
      };
    }
  },

  /**
   * Generates a system-wide analytics report
   * @returns {Promise<Object>} Promise with report URL
   */
  generateSystemReport: async () => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      const reportUrl = `https://reports.recetra.com/system-report-${Date.now()}.pdf`;
      return {
        success: true,
        reportUrl,
      };
    } else {
      return {
        success: false,
        error: 'Failed to generate system report.',
      };
    }
  },
};

// ============================================================================
// BACKUP SERVICE
// ============================================================================

/**
 * Mock Backup Service
 * Simulates system backup and restore operations
 * In a real app, this would handle database backups and system snapshots
 */
export const mockBackupService = {
  /**
   * Creates a system backup
   * @returns {Promise<Object>} Promise with backup ID
   */
  createBackup: async () => {
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      const backupId = `BACKUP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      return {
        success: true,
        backupId,
      };
    } else {
      return {
        success: false,
        error: 'Failed to create backup. Please check storage space.',
      };
    }
  },

  /**
   * Restores a system from backup
   * @param {string} backupId - ID of the backup to restore from
   * @returns {Promise<Object>} Promise with restore status
   */
  restoreBackup: async (backupId) => {
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    const isSuccess = Math.random() > 0.15;
    
    if (isSuccess) {
      return { success: true };
    } else {
      return {
        success: false,
        error: 'Failed to restore backup. Please try again.',
      };
    }
  },
};

// ============================================================================
// ANALYTICS SERVICE
// ============================================================================

/**
 * Mock Analytics Service
 * Simulates analytics tracking and reporting
 * In a real app, this would integrate with services like Google Analytics, Mixpanel, etc.
 */
export const mockAnalyticsService = {
  /**
   * Tracks an analytics event
   * @param {string} eventName - Name of the event to track
   * @param {Object} properties - Additional properties for the event
   * @returns {Promise<Object>} Promise with tracking status
   */
  trackEvent: async (eventName, properties) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const isSuccess = Math.random() > 0.05;
    
    if (isSuccess) {
      return { success: true };
    } else {
      return {
        success: false,
        error: 'Failed to track analytics event.',
      };
    }
  },

  /**
   * Retrieves analytics data for a date range
   * @param {Object} dateRange - Start and end dates for analytics
   * @returns {Promise<Object>} Promise with analytics data
   */
  getAnalytics: async (dateRange) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      // Generate mock analytics data
      const mockData = {
        totalReceipts: Math.floor(Math.random() * 1000) + 100,
        totalAmount: Math.floor(Math.random() * 500000) + 50000,
        averageAmount: Math.floor(Math.random() * 500) + 100,
        topCategories: [
          { name: 'Membership Fee', count: Math.floor(Math.random() * 200) + 50 },
          { name: 'Event Registration', count: Math.floor(Math.random() * 150) + 30 },
          { name: 'Donation', count: Math.floor(Math.random() * 100) + 20 },
        ],
      };
      
      return {
        success: true,
        data: mockData,
      };
    } else {
      return {
        success: false,
        error: 'Failed to retrieve analytics data.',
      };
    }
  },
};