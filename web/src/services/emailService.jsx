/**
 * Email Service Placeholder for Web Application
 * This is a placeholder for future email service implementation
 * Currently just logs actions to console
 */

class EmailService {
  constructor() {
    console.log('Email Service initialized - placeholder mode');
  }

  /**
   * Sends receipt email to payer (placeholder)
   * @param {Object} receipt - Receipt data
   * @param {string} payerEmail - Payer's email address
   * @returns {Promise<Object>} Email sending result
   */
  async sendReceiptEmail(receipt, payerEmail) {
    console.log('📧 Email Service: Sending receipt email', { receipt, payerEmail });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return success for now - replace with actual email service later
    return {
      success: true,
      messageId: `EMAIL-${Date.now()}`,
      provider: 'placeholder',
      message: 'Email service placeholder - implement actual email service'
    };
  }

  /**
   * Sends notification email (placeholder)
   * @param {string} to - Recipient email
   * @param {string} subject - Email subject
   * @param {string} body - Email body
   * @returns {Promise<Object>} Email sending result
   */
  async sendNotificationEmail(to, subject, body) {
    console.log('📧 Email Service: Sending notification email', { to, subject, body });
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      messageId: `NOTIF-${Date.now()}`,
      provider: 'placeholder',
      message: 'Email service placeholder - implement actual email service'
    };
  }

  /**
   * Sends a test email (placeholder)
   * @param {string} toEmail - Recipient email
   * @returns {Promise<Object>} Send result
   */
  async sendTestEmail(toEmail) {
    console.log('📧 Email Service: Sending test email', { toEmail });
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      success: true,
      messageId: `TEST-${Date.now()}`,
      provider: 'placeholder',
      message: 'Test email sent via placeholder service'
    };
  }
}

// Export singleton instance
export const emailService = new EmailService();

// Export class for testing or custom instances
export { EmailService };
