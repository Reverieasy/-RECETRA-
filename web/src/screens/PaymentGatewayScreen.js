import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { mockOrganizations, mockCategories, addReceipt } from '../data/mockData';

/**
 * Payment Gateway Screen Component
 * Allows viewers to make payments through digital payment methods and receive digital receipts automatically
 * 
 * Features:
 * - Payment form with digital payment integration
 * - Organization and category selection
 * - Payment method selection (card, e-wallet, etc.)
 * - Automatic receipt generation and notifications
 * - Payment status tracking
 */
const PaymentGatewayScreen = () => {
  const { user } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    organization: '',
    category: '',
    amount: '',
    purpose: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    payerName: '',
    payerEmail: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  /**
   * Handles payment form submission
   * Processes payment and generates digital receipt
   */
  const handlePayment = async () => {
    if (!validatePaymentForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate receipt
      const receipt = {
        id: `receipt_${Date.now()}`,
        receiptNumber: `R${Date.now().toString().slice(-8)}`,
        payer: paymentData.payerName,
        amount: parseFloat(paymentData.amount),
        purpose: paymentData.purpose,
        category: paymentData.category,
        organization: paymentData.organization,
        issuedBy: user?.fullName || 'System',
        issuedAt: new Date().toISOString(),
        templateId: 'digital_payment',
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${Date.now()}`,
        paymentMethod: paymentData.paymentMethod,
        paymentStatus: 'completed',
        isDigital: true,
      };

      // Add receipt to system
      addReceipt(receipt);

      setPaymentResult({
        success: true,
        receipt,
        message: 'Payment successful through Paymongo! Digital receipt has been generated and sent to your email.',
      });

      // Reset form
      setPaymentData({
        organization: '',
        category: '',
        amount: '',
        purpose: '',
        paymentMethod: 'card',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        payerName: '',
        payerEmail: '',
      });

      setShowPaymentModal(false);
    } catch (error) {
      setPaymentResult({
        success: false,
        message: 'Payment failed. Please try again or contact support.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Validates payment form data
   * @returns {boolean} True if form is valid
   */
  const validatePaymentForm = () => {
    if (!paymentData.organization || !paymentData.category || !paymentData.amount || 
        !paymentData.purpose || !paymentData.payerName || !paymentData.payerEmail) {
      alert('Please fill in all required fields');
      return false;
    }

    if (paymentData.amount <= 0) {
      alert('Amount must be greater than 0');
      return false;
    }

    if (paymentData.paymentMethod === 'card') {
      if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv) {
        alert('Please fill in all card details');
        return false;
      }
    }

    return true;
  };

  /**
   * Handles input changes in payment form
   * @param {string} field - Field name to update
   * @param {string} value - New value for the field
   */
  const handleInputChange = (field, value) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Opens payment modal
   */
  const openPaymentModal = () => {
    setShowPaymentModal(true);
    setPaymentResult(null);
  };

  /**
   * Closes payment modal
   */
  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentResult(null);
  };

  return (
    <Layout title="Payment Gateway">
      <div style={styles.container}>
        <div style={styles.content}>
          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.title}>Paymongo Payment Gateway</h1>
            <p style={styles.subtitle}>
              Make secure digital payments through Paymongo and receive instant digital receipts
            </p>
          </div>

          {/* Payment Options */}
          <div style={styles.paymentOptions}>
            <div style={styles.optionCard}>
              <h3 style={styles.optionTitle}>Credit/Debit Card</h3>
              <p style={styles.optionDescription}>
                Pay securely with your credit or debit card through Paymongo
              </p>
              <button 
                style={styles.selectButton}
                onClick={() => {
                  setPaymentData(prev => ({ ...prev, paymentMethod: 'card' }));
                  openPaymentModal();
                }}
              >
                Select Card Payment
              </button>
            </div>

            <div style={styles.optionCard}>
              <h3 style={styles.optionTitle}>E-Wallet</h3>
              <p style={styles.optionDescription}>
                Pay using popular e-wallet services through Paymongo
              </p>
              <button 
                style={styles.selectButton}
                onClick={() => {
                  setPaymentData(prev => ({ ...prev, paymentMethod: 'ewallet' }));
                  openPaymentModal();
                }}
              >
                Select E-Wallet
              </button>
            </div>

            <div style={styles.optionCard}>
              <h3 style={styles.optionTitle}>Bank Transfer</h3>
              <p style={styles.optionDescription}>
                Direct bank transfer payment through Paymongo
              </p>
              <button 
                style={styles.selectButton}
                onClick={() => {
                  setPaymentData(prev => ({ ...prev, paymentMethod: 'bank' }));
                  openPaymentModal();
                }}
              >
                Select Bank Transfer
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div style={styles.instructionsContainer}>
            <h3 style={styles.instructionsTitle}>How Paymongo Payments Work</h3>
            <div style={styles.instructionsList}>
              <div style={styles.instructionItem}>
                <span style={styles.instructionNumber}>1</span>
                <span>Select your preferred payment method</span>
              </div>
              <div style={styles.instructionItem}>
                <span style={styles.instructionNumber}>2</span>
                <span>Fill in payment details and organization information</span>
              </div>
              <div style={styles.instructionItem}>
                <span style={styles.instructionNumber}>3</span>
                <span>Complete the payment securely through Paymongo</span>
              </div>
              <div style={styles.instructionItem}>
                <span style={styles.instructionNumber}>4</span>
                <span>Receive digital receipt instantly via email</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>
                  {paymentData.paymentMethod === 'card' && 'Card Payment'}
                  {paymentData.paymentMethod === 'ewallet' && 'E-Wallet Payment'}
                  {paymentData.paymentMethod === 'bank' && 'Bank Transfer'}
                </h2>
                <button 
                  style={styles.closeButton}
                  onClick={closePaymentModal}
                >
                  ×
                </button>
              </div>

              <div style={styles.modalContent}>
                {/* Organization and Category */}
                <div style={styles.formSection}>
                  <h4 style={styles.sectionTitle}>Payment Details</h4>
                  
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Organization *</label>
                    <select
                      style={styles.select}
                      value={paymentData.organization}
                      onChange={(e) => handleInputChange('organization', e.target.value)}
                    >
                      <option value="">Select Organization</option>
                      {mockOrganizations.map(org => (
                        <option key={org.id} value={org.name}>{org.name}</option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Category *</label>
                    <select
                      style={styles.select}
                      value={paymentData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {mockCategories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Amount (₱) *</label>
                    <input
                      type="number"
                      style={styles.input}
                      value={paymentData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      placeholder="Enter amount"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Purpose *</label>
                    <input
                      type="text"
                      style={styles.input}
                      value={paymentData.purpose}
                      onChange={(e) => handleInputChange('purpose', e.target.value)}
                      placeholder="Enter payment purpose"
                    />
                  </div>
                </div>

                {/* Payer Information */}
                <div style={styles.formSection}>
                  <h4 style={styles.sectionTitle}>Payer Information</h4>
                  
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Full Name *</label>
                    <input
                      type="text"
                      style={styles.input}
                      value={paymentData.payerName}
                      onChange={(e) => handleInputChange('payerName', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Email *</label>
                    <input
                      type="email"
                      style={styles.input}
                      value={paymentData.payerEmail}
                      onChange={(e) => handleInputChange('payerEmail', e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Payment Method Specific Fields */}
                {paymentData.paymentMethod === 'card' && (
                  <div style={styles.formSection}>
                    <h4 style={styles.sectionTitle}>Card Details</h4>
                    
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Card Number *</label>
                      <input
                        type="text"
                        style={styles.input}
                        value={paymentData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                    </div>

                    <div style={styles.row}>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Expiry Date *</label>
                        <input
                          type="text"
                          style={styles.input}
                          value={paymentData.expiryDate}
                          onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                      </div>

                      <div style={styles.inputGroup}>
                        <label style={styles.label}>CVV *</label>
                        <input
                          type="text"
                          style={styles.input}
                          value={paymentData.cvv}
                          onChange={(e) => handleInputChange('cvv', e.target.value)}
                          placeholder="123"
                          maxLength="4"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Summary */}
                <div style={styles.paymentSummary}>
                  <h4 style={styles.summaryTitle}>Payment Summary</h4>
                  <div style={styles.summaryRow}>
                    <span style={styles.summaryLabel}>Amount:</span>
                    <span style={styles.summaryValue}>₱{paymentData.amount || '0.00'}</span>
                  </div>
                  <div style={styles.summaryRow}>
                    <span style={styles.summaryLabel}>Organization:</span>
                    <span style={styles.summaryValue}>{paymentData.organization || 'Not selected'}</span>
                  </div>
                  <div style={styles.summaryRow}>
                    <span style={styles.summaryLabel}>Category:</span>
                    <span style={styles.summaryValue}>{paymentData.category || 'Not selected'}</span>
                  </div>
                  <div style={styles.summaryRow}>
                    <span style={styles.summaryLabel}>Purpose:</span>
                    <span style={styles.summaryValue}>{paymentData.purpose || 'Not specified'}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={styles.buttonContainer}>
                  <button 
                    style={styles.cancelButton}
                    onClick={closePaymentModal}
                    disabled={isProcessing}
                  >
                    Cancel
                  </button>
                  <button 
                    style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
                    onClick={handlePayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : `Pay ₱${paymentData.amount || '0.00'}`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Result */}
        {paymentResult && (
          <div style={styles.resultOverlay}>
            <div style={styles.resultModal}>
              <div style={styles.resultHeader}>
                <h2 style={styles.resultTitle}>
                  {paymentResult.success ? 'Payment Successful!' : 'Payment Failed'}
                </h2>
              </div>
              
              <div style={styles.resultContent}>
                <p style={styles.resultMessage}>{paymentResult.message}</p>
                
                {paymentResult.success && paymentResult.receipt && (
                  <div style={styles.receiptInfo}>
                    <h4>Receipt Details:</h4>
                    <p><strong>Receipt Number:</strong> {paymentResult.receipt.receiptNumber}</p>
                    <p><strong>Amount:</strong> ₱{paymentResult.receipt.amount}</p>
                    <p><strong>Organization:</strong> {paymentResult.receipt.organization}</p>
                    <p><strong>Date:</strong> {new Date(paymentResult.receipt.issuedAt).toLocaleDateString()}</p>
                  </div>
                )}
                
                <button 
                  style={styles.closeResultButton}
                  onClick={() => setPaymentResult(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

/**
 * Styles for the PaymentGatewayScreen component
 */
const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  header: {
    textAlign: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  paymentOptions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 20,
    marginBottom: 32,
  },
  optionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 12,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
    lineHeight: 1.5,
  },
  selectButton: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    padding: '12px 24px',
    fontSize: 14,
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  instructionsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 20,
  },
  instructionsList: {
    display: 'grid',
    gap: 16,
  },
  instructionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  instructionNumber: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    borderRadius: '50%',
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxWidth: 600,
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e3a8a',
    margin: 0,
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: 24,
    color: '#6b7280',
    cursor: 'pointer',
    padding: 0,
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    padding: '24px',
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    display: 'block',
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: 8,
    fontSize: 14,
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: 8,
    fontSize: 14,
    backgroundColor: 'white',
    boxSizing: 'border-box',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },
  paymentSummary: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 20,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#6b7280',
    fontSize: 14,
  },
  summaryValue: {
    fontWeight: '500',
    color: '#374151',
    fontSize: 14,
  },
  buttonContainer: {
    display: 'flex',
    gap: 12,
    justifyContent: 'flex-end',
  },
  cancelButton: {
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    padding: '12px 24px',
    fontSize: 14,
    fontWeight: '500',
    cursor: 'pointer',
  },
  payButton: {
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    padding: '12px 24px',
    fontSize: 14,
    fontWeight: '600',
    cursor: 'pointer',
  },
  payButtonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
  },
  resultOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  resultModal: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxWidth: 500,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  resultHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid #e5e7eb',
    textAlign: 'center',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e3a8a',
    margin: 0,
  },
  resultContent: {
    padding: '24px',
    textAlign: 'center',
  },
  resultMessage: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 20,
    lineHeight: 1.5,
  },
  receiptInfo: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    textAlign: 'left',
  },
  closeResultButton: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    padding: '12px 24px',
    fontSize: 14,
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default PaymentGatewayScreen;
