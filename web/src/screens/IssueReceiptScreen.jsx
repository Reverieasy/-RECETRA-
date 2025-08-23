import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { mockCategories, mockReceiptTemplates, addReceipt } from '../data/mockData';
import { emailService } from '../services/emailService';
import QRCode from 'qrcode.react';

/**
 * Issue Receipt Screen Component
 * Allows encoders to manually issue receipts for cash transactions
 * 
 * Features:
 * - Manual receipt issuance for cash payments
 * - Optional category and purpose fields
 * - Template selection
 * - Automatic QR code generation
 * - Automatic email notifications to payer
 * - Receipt customization
 */
const IssueReceiptScreen = () => {
  const { user } = useAuth();
  const [receiptData, setReceiptData] = useState({
    payer: '',
    payerEmail: '', // Added email field
    amount: '',
    purpose: '',
    category: '',
    template: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedReceipt, setGeneratedReceipt] = useState(null);

  /**
   * Handles receipt submission
   * Validates input and creates new receipt with QR code and email
   */
  const handleSubmit = async () => {
    if (!receiptData.payer.trim() || !receiptData.amount.trim()) {
      alert('Error: Payer name and amount are required');
      return;
    }

    if (!receiptData.payerEmail.trim()) {
      alert('Error: Payer email is required for receipt delivery');
      return;
    }

    const amount = parseFloat(receiptData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Error: Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate unique receipt number
      const receiptNumber = `OR-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
      
             // Generate QR code data with receipt details for verification
       const qrCodeData = JSON.stringify({
         receiptNumber,
         amount,
         payer: receiptData.payer,
         organization: user?.organization || '',
         purpose: receiptData.purpose || 'Cash Payment',
         timestamp: Date.now()
       });
      
      // Create receipt data with QR code
      const receipt = {
        id: `receipt_${Date.now()}`,
        receiptNumber,
        payer: receiptData.payer,
        payerEmail: receiptData.payerEmail,
        amount,
        purpose: receiptData.purpose || 'Cash Payment',
        category: receiptData.category || 'Manual Receipt',
        organization: user?.organization || '',
        issuedBy: user?.fullName || '',
        issuedAt: new Date().toISOString(),
        paymentStatus: 'completed',
        emailStatus: 'pending',
        smsStatus: 'pending',
        templateId: receiptData.template || '1',
        qrCode: qrCodeData, // Store QR code data
        paymentMethod: 'Cash',
      };

      // Add receipt to mock data
      const newReceipt = addReceipt(receipt);

      // Send email to payer automatically
      if (receiptData.payerEmail) {
        try {
          const emailResult = await emailService.sendReceiptEmail(receipt, receiptData.payerEmail);
          
          if (emailResult.success) {
            console.log('📧 Receipt email sent successfully to:', receiptData.payerEmail);
            receipt.emailStatus = 'sent';
          } else {
            console.error('❌ Failed to send receipt email:', emailResult.error);
            receipt.emailStatus = 'failed';
          }
        } catch (emailError) {
          console.error('❌ Email service error:', emailError);
          receipt.emailStatus = 'failed';
        }
      }

      // Set generated receipt for display
      setGeneratedReceipt(receipt);

      // Show success message
      alert(
        `Receipt Issued Successfully!\n\n` +
        `Receipt ${receiptNumber} has been created.\n` +
        `QR Code generated and email sent to ${receiptData.payerEmail}.\n\n` +
        `The payer will receive their receipt via email.`
      );

      // Reset form
      setReceiptData({
        payer: '',
        payerEmail: '',
        amount: '',
        purpose: '',
        category: '',
        template: '',
      });
    } catch (error) {
      console.error('Error creating receipt:', error);
      alert('Error: Failed to create receipt. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles input changes
   * @param {string} field - Field name to update
   * @param {string} value - New value for the field
   */
  const handleInputChange = (field, value) => {
    setReceiptData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Handles form reset
   */
  const handleReset = () => {
    setReceiptData({
      payer: '',
      payerEmail: '',
      amount: '',
      purpose: '',
      category: '',
      template: '',
    });
    setGeneratedReceipt(null);
  };

  return (
    <Layout title="Issue Receipt" showBackButton={true}>
      <div className="innerContainer">
        <div style={styles.container}>
          <div style={styles.content}>
          {/* Header */}
          <div style={styles.header}>
            <h2 style={styles.title}>Issue New Receipt</h2>
            <p style={styles.subtitle}>Create a receipt for cash payments with automatic email delivery</p>
          </div>

          {/* Receipt Form */}
          <div style={styles.form}>
            {/* Payer Information */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Payer Information</h3>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Payer Name *</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={receiptData.payer}
                    onChange={(e) => handleInputChange('payer', e.target.value)}
                    placeholder="Enter payer's full name"
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Payer Email *</label>
                  <input
                    type="email"
                    style={styles.input}
                    value={receiptData.payerEmail}
                    onChange={(e) => handleInputChange('payerEmail', e.target.value)}
                    placeholder="Enter payer's email address"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Payment Details</h3>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Amount (₱) *</label>
                  <input
                    type="number"
                    style={styles.input}
                    value={receiptData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Purpose</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={receiptData.purpose}
                    onChange={(e) => handleInputChange('purpose', e.target.value)}
                    placeholder="e.g., Event Registration, Membership Fee"
                  />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Category</label>
                  <select
                    style={styles.select}
                    value={receiptData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  >
                    <option value="">Select category</option>
                    {mockCategories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Template</label>
                  <select
                    style={styles.select}
                    value={receiptData.template}
                    onChange={(e) => handleInputChange('template', e.target.value)}
                  >
                    <option value="">Select template</option>
                    {mockReceiptTemplates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Receipt Summary</h3>
              <div style={styles.summary}>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Organization:</span>
                  <span style={styles.summaryValue}>{user?.organization}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Issued By:</span>
                  <span style={styles.summaryValue}>{user?.fullName}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Date:</span>
                  <span style={styles.summaryValue}>{new Date().toLocaleDateString()}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Status:</span>
                  <span style={styles.summaryValue}>Cash Payment</span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Email Delivery:</span>
                  <span style={styles.summaryValue}>Automatic to {receiptData.payerEmail || 'Not specified'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={styles.buttonContainer}>
              <button
                type="button"
                style={styles.resetButton}
                onClick={handleReset}
                disabled={isSubmitting}
              >
                Reset Form
              </button>
              <button
                type="button"
                style={isSubmitting ? {...styles.submitButton, ...styles.submitButtonDisabled} : styles.submitButton}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Issuing Receipt...' : 'Issue Receipt'}
              </button>
            </div>
          </div>

          {/* Generated Receipt Display */}
          {generatedReceipt && (
            <div style={styles.receiptDisplay}>
              <h3 style={styles.receiptTitle}>Generated Receipt</h3>
              <div style={styles.receiptContent}>
                <div style={styles.receiptInfo}>
                  <p><strong>Receipt Number:</strong> {generatedReceipt.receiptNumber}</p>
                  <p><strong>Payer:</strong> {generatedReceipt.payer}</p>
                  <p><strong>Amount:</strong> ₱{generatedReceipt.amount.toLocaleString()}</p>
                  <p><strong>Purpose:</strong> {generatedReceipt.purpose}</p>
                  <p><strong>Email Status:</strong> 
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: generatedReceipt.emailStatus === 'sent' ? '#10b981' : 
                        generatedReceipt.emailStatus === 'pending' ? '#f59e0b' : '#ef4444'
                    }}>
                      {generatedReceipt.emailStatus}
                    </span>
                  </p>
                </div>
                <div style={styles.qrCodeSection}>
                  <h4 style={styles.qrCodeTitle}>Receipt QR Code</h4>
                  <p style={styles.qrCodeDescription}>
                    This QR code contains the receipt information and can be scanned for verification
                  </p>
                  <div style={styles.qrCodeContainer}>
                                                               <QRCode 
                        value={generatedReceipt.qrCode}
                        size={40}
                        level="M"
                        includeMargin={true}
                        style={styles.qrCode}
                      />
                    <p style={styles.qrCodeNote}>
                      Scan this QR code to verify receipt authenticity
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div style={styles.instructionsContainer}>
            <h3 style={styles.instructionsTitle}>Instructions</h3>
            <div style={styles.instructions}>
                         <div style={styles.instructionItem}>
             <h4 style={styles.instructionTitle}>Automatic Email Delivery</h4>
             <p style={styles.instructionText}>
               Every receipt is automatically emailed to the payer with a copy of the receipt and verification QR code.
             </p>
           </div>
           <div style={styles.instructionItem}>
             <h4 style={styles.instructionTitle}>QR Code Verification</h4>
             <p style={styles.instructionText}>
               Each receipt includes a unique QR code that can be scanned to verify authenticity using our mobile app or web verification system.
             </p>
           </div>
           <div style={styles.instructionItem}>
             <h4 style={styles.instructionTitle}>Cash Payment Processing</h4>
             <p style={styles.instructionText}>
               This form is for cash payments. For online payments, use the Payment Gateway screen.
             </p>
           </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

/**
 * Styles for the IssueReceiptScreen component
 */
const styles = {
  container: {
    backgroundColor: '#f5f5f5',
    minHeight: '100%',
  },
  
  content: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0,
  },
  
  form: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  
  section: {
    marginBottom: '32px',
  },
  
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '16px',
    margin: '0 0 16px 0',
    borderBottom: '2px solid #e5e7eb',
    paddingBottom: '8px',
  },
  
  formRow: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
  },
  
  formGroup: {
    flex: 1,
  },
  
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
    display: 'block',
  },
  
  input: {
    width: '100%',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '16px',
    backgroundColor: 'white',
    boxSizing: 'border-box',
  },
  
  select: {
    width: '100%',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '16px',
    backgroundColor: 'white',
    boxSizing: 'border-box',
  },
  
  summary: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '16px',
  },
  
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  
  summaryLabel: {
    fontSize: '14px',
    color: '#6b7280',
  },
  
  summaryValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  },
  
  buttonContainer: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px',
  },
  
  resetButton: {
    backgroundColor: '#6b7280',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  
  submitButton: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
  },
  
  receiptDisplay: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginTop: '24px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  
  receiptTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: '16px',
    margin: '0 0 16px 0',
    borderBottom: '2px solid #e5e7eb',
    paddingBottom: '8px',
  },
  
  receiptContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  
  receiptInfo: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid #e5e7eb',
  },
  
  receiptInfoItem: {
    marginBottom: '8px',
  },
  
  receiptInfoLabel: {
    fontSize: '14px',
    color: '#6b7280',
    marginRight: '8px',
  },
  
  receiptInfoValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  },
  
  qrCodeSection: {
    textAlign: 'center',
  },
  
  qrCodeTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '12px',
    margin: '0 0 12px 0',
  },
  
  qrCodeDescription: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '12px',
    margin: '0 0 12px 0',
  },
  
  qrCodeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '16px',
  },
  
  qrCode: {
    marginBottom: '10px',
  },
  
  qrCodeNote: {
    fontSize: '12px',
    color: '#6b7280',
  },
  
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '6px',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
  },
  
  instructionsContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  
  instructionsTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '16px',
    margin: '0 0 16px 0',
  },
  
  instructions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  
  instructionItem: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid #e5e7eb',
  },
  
  instructionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  
  instructionText: {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.5',
  },
};

export default IssueReceiptScreen;