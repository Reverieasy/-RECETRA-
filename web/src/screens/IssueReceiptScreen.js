import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { mockCategories, mockReceiptTemplates, addReceipt } from '../data/mockData';

/**
 * Issue Receipt Screen Component
 * Allows encoders to manually issue receipts for cash transactions
 * 
 * Features:
 * - Manual receipt issuance for cash payments
 * - Optional category and purpose fields
 * - Template selection
 * - QR code generation
 * - Email/SMS notifications
 * - Receipt customization
 */
const IssueReceiptScreen = () => {
  const { user } = useAuth();
  const [receiptData, setReceiptData] = useState({
    payer: '',
    amount: '',
    purpose: '',
    category: '',
    template: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handles receipt submission
   * Validates input and creates new receipt
   */
  const handleSubmit = () => {
    if (!receiptData.payer.trim() || !receiptData.amount.trim()) {
      alert('Error: Payer name and amount are required');
      return;
    }

    const amount = parseFloat(receiptData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Error: Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);

    // Generate unique receipt number
    const receiptNumber = `OR-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    
    // Create receipt data
    const receipt = {
      receiptNumber,
      payer: receiptData.payer,
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
    };

    // Add receipt to mock data
    const newReceipt = addReceipt(receipt);

    // Simulate QR code generation and notifications
    setTimeout(() => {
      const receiptDetails = 
        `Receipt Number: ${receiptNumber}\n` +
        `Payer: ${receipt.payer}\n` +
        `Amount: ₱${receipt.amount.toLocaleString()}\n` +
        `Purpose: ${receipt.purpose}\n` +
        `Category: ${receipt.category}\n` +
        `Issued By: ${receipt.issuedBy}\n` +
        `Date: ${new Date(receipt.issuedAt).toLocaleDateString()}`;

      const confirmed = window.confirm(
        `Receipt Issued Successfully!\n\nReceipt ${receiptNumber} has been created.\nQR Code generated and notifications sent.\n\nWould you like to view the receipt details?`
      );
      
      if (confirmed) {
        alert(`Receipt Details:\n\n${receiptDetails}`);
      }

      // Reset form
      setReceiptData({
        payer: '',
        amount: '',
        purpose: '',
        category: '',
        template: '',
      });
      setIsSubmitting(false);
    }, 2000);
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
      amount: '',
      purpose: '',
      category: '',
      template: '',
    });
  };

  return (
    <Layout title="Issue Receipt" showBackButton={true}>
      <div style={styles.container}>
        <div style={styles.content}>
          {/* Header */}
          <div style={styles.header}>
            <h2 style={styles.title}>Issue New Receipt</h2>
            <p style={styles.subtitle}>Create a receipt for cash payments</p>
          </div>

          {/* Receipt Form */}
          <div style={styles.formContainer}>
            {/* Payer Information */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Payer Information</h3>
              
              <div style={styles.inputGroup}>
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

              <div style={styles.inputGroup}>
                <label style={styles.label}>Amount *</label>
                <input
                  type="number"
                  style={styles.input}
                  value={receiptData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            {/* Receipt Details */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Receipt Details</h3>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Purpose</label>
                <input
                  type="text"
                  style={styles.input}
                  value={receiptData.purpose}
                  onChange={(e) => handleInputChange('purpose', e.target.value)}
                  placeholder="e.g., Membership Fee, Event Registration"
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Category</label>
                <select
                  style={styles.select}
                  value={receiptData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  <option value="">Select category (optional)</option>
                  {mockCategories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Receipt Template</label>
                <select
                  style={styles.select}
                  value={receiptData.template}
                  onChange={(e) => handleInputChange('template', e.target.value)}
                >
                  <option value="">Select template (optional)</option>
                  {mockReceiptTemplates
                    .filter(template => template.organization === user?.organization || template.organization === 'General')
                    .map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
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

          {/* Instructions */}
          <div style={styles.instructionsContainer}>
            <h3 style={styles.instructionsTitle}>Instructions</h3>
            <ul style={styles.instructionsList}>
              <li style={styles.instructionItem}>Fill in the payer's name and payment amount (required fields)</li>
              <li style={styles.instructionItem}>Add purpose and category for better record keeping</li>
              <li style={styles.instructionItem}>Select an appropriate template for your organization</li>
              <li style={styles.instructionItem}>Review the summary before issuing the receipt</li>
              <li style={styles.instructionItem}>QR code will be automatically generated for verification</li>
            </ul>
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
  
  formContainer: {
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
  
  inputGroup: {
    marginBottom: '20px',
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
  
  instructionsList: {
    paddingLeft: '20px',
    margin: 0,
  },
  
  instructionItem: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '8px',
    lineHeight: '1.5',
  },
};

export default IssueReceiptScreen;