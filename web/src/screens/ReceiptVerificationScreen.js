import React, { useState } from 'react';
import Layout from '../components/Layout';
import { mockReceipts } from '../data/mockData';

/**
 * Receipt Verification Screen Component
 * Allows users to verify receipt authenticity through QR scanning or manual entry
 * 
 * Features:
 * - QR code scanning simulation
 * - Manual receipt number entry
 * - Complete receipt details display
 * - Payment and notification status tracking
 * - Interactive verification process
 */
const ReceiptVerificationScreen = () => {
  const [receiptNumber, setReceiptNumber] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  /**
   * Handles manual receipt verification
   * Validates input and searches for receipt in mock data
   */
  const handleManualVerification = () => {
    if (!receiptNumber.trim()) {
      alert('Error: Please enter a receipt number');
      return;
    }

    setIsVerifying(true);
    // Simulate API call delay for realistic experience
    setTimeout(() => {
      const receipt = mockReceipts.find(r => r.receiptNumber === receiptNumber.trim());
      setVerificationResult(receipt || null);
      setIsVerifying(false);
    }, 1000);
  };

  /**
   * Simulates QR code scanning functionality
   * In a real app, this would open the camera and scan QR codes
   */
  const handleQRScan = () => {
    alert('QR Code Scanner\n\nQR code scanning functionality would be implemented here using the device camera. For this demo, please use manual entry with one of these receipt numbers:\n\n• OR-2024-001\n• OR-2024-002\n• OR-2024-003');
  };

  /**
   * Resets the verification form and results
   */
  const handleReset = () => {
    setReceiptNumber('');
    setVerificationResult(null);
  };

  /**
   * Component to display successful verification results
   * Shows complete receipt details with status indicators
   */
  const VerificationResult = ({ receipt }) => (
    <div style={styles.resultContainer}>
      <div style={styles.resultHeader}>
        <h3 style={styles.resultTitle}>Receipt Verified</h3>
        <div style={{...styles.statusBadge, backgroundColor: '#10b981'}}>
          <span style={styles.statusText}>Valid</span>
        </div>
      </div>
      
      <div style={styles.resultContent}>
        <div style={styles.resultRow}>
          <span style={styles.resultLabel}>Receipt Number:</span>
          <span style={styles.resultValue}>{receipt.receiptNumber}</span>
        </div>
        
        <div style={styles.resultRow}>
          <span style={styles.resultLabel}>Payer:</span>
          <span style={styles.resultValue}>{receipt.payer}</span>
        </div>
        
        <div style={styles.resultRow}>
          <span style={styles.resultLabel}>Amount:</span>
          <span style={styles.resultValue}>₱{receipt.amount.toLocaleString()}</span>
        </div>
        
        <div style={styles.resultRow}>
          <span style={styles.resultLabel}>Purpose:</span>
          <span style={styles.resultValue}>{receipt.purpose}</span>
        </div>
        
        <div style={styles.resultRow}>
          <span style={styles.resultLabel}>Category:</span>
          <span style={styles.resultValue}>{receipt.category}</span>
        </div>
        
        <div style={styles.resultRow}>
          <span style={styles.resultLabel}>Organization:</span>
          <span style={styles.resultValue}>{receipt.organization}</span>
        </div>
        
        <div style={styles.resultRow}>
          <span style={styles.resultLabel}>Issued By:</span>
          <span style={styles.resultValue}>{receipt.issuedBy}</span>
        </div>
        
        <div style={styles.resultRow}>
          <span style={styles.resultLabel}>Date Issued:</span>
          <span style={styles.resultValue}>
            {new Date(receipt.issuedAt).toLocaleDateString()}
          </span>
        </div>
        
        <div style={styles.resultRow}>
          <span style={styles.resultLabel}>Payment Status:</span>
          <div style={{
            ...styles.statusBadge, 
            backgroundColor: receipt.paymentStatus === 'completed' ? '#10b981' : 
              receipt.paymentStatus === 'pending' ? '#f59e0b' : '#ef4444'
          }}>
            <span style={styles.statusText}>{receipt.paymentStatus}</span>
          </div>
        </div>
        
        <div style={styles.resultRow}>
          <span style={styles.resultLabel}>Email Status:</span>
          <div style={{
            ...styles.statusBadge, 
            backgroundColor: receipt.emailStatus === 'sent' ? '#10b981' : 
              receipt.emailStatus === 'pending' ? '#f59e0b' : '#ef4444'
          }}>
            <span style={styles.statusText}>{receipt.emailStatus}</span>
          </div>
        </div>
        
        <div style={styles.resultRow}>
          <span style={styles.resultLabel}>SMS Status:</span>
          <div style={{
            ...styles.statusBadge, 
            backgroundColor: receipt.smsStatus === 'sent' ? '#10b981' : 
              receipt.smsStatus === 'pending' ? '#f59e0b' : '#ef4444'
          }}>
            <span style={styles.statusText}>{receipt.smsStatus}</span>
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Component to display verification failure
   */
  const VerificationFailure = () => (
    <div style={styles.resultContainer}>
      <div style={styles.resultHeader}>
        <h3 style={styles.resultTitle}>Receipt Not Found</h3>
        <div style={{...styles.statusBadge, backgroundColor: '#ef4444'}}>
          <span style={styles.statusText}>Invalid</span>
        </div>
      </div>
      
      <div style={styles.resultContent}>
        <p style={styles.failureText}>
          The receipt number "{receiptNumber}" could not be found in our system.
        </p>
        <p style={styles.failureSubtext}>
          Please check the receipt number and try again, or contact the issuing organization for assistance.
        </p>
      </div>
    </div>
  );

  return (
    <Layout title="Receipt Verification" showBackButton={true}>
      <div style={styles.container}>
        <div style={styles.content}>
          {/* Header */}
          <div style={styles.header}>
            <h2 style={styles.title}>Verify Receipt</h2>
            <p style={styles.subtitle}>Verify receipt authenticity using QR code or receipt number</p>
          </div>

          {/* Verification Methods */}
          <div style={styles.methodsContainer}>
            <div style={styles.method}>
              <h3 style={styles.methodTitle}>Manual Entry</h3>
              <p style={styles.methodDescription}>Enter the receipt number manually</p>
              
              <div style={styles.inputContainer}>
                <input
                  type="text"
                  style={styles.input}
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  placeholder="Enter receipt number (e.g., OR-2024-001)"
                  onKeyPress={(e) => e.key === 'Enter' && handleManualVerification()}
                />
                <button
                  style={isVerifying ? {...styles.verifyButton, ...styles.verifyButtonDisabled} : styles.verifyButton}
                  onClick={handleManualVerification}
                  disabled={isVerifying}
                >
                  {isVerifying ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </div>

            <div style={styles.method}>
              <h3 style={styles.methodTitle}>QR Code Scanner</h3>
              <p style={styles.methodDescription}>Scan QR code from receipt</p>
              
              <button style={styles.qrButton} onClick={handleQRScan}>
                <span style={styles.qrButtonText}>📷 Scan QR Code</span>
              </button>
            </div>
          </div>

          {/* Verification Results */}
          {verificationResult !== null && (
            <div style={styles.resultsSection}>
              {verificationResult ? (
                <VerificationResult receipt={verificationResult} />
              ) : (
                <VerificationFailure />
              )}
              
              <button style={styles.resetButton} onClick={handleReset}>
                Verify Another Receipt
              </button>
            </div>
          )}

          {/* Sample Receipt Numbers */}
          <div style={styles.samplesContainer}>
            <h3 style={styles.samplesTitle}>Sample Receipt Numbers</h3>
            <p style={styles.samplesDescription}>Try these receipt numbers for testing:</p>
            
            <div style={styles.samplesList}>
              {mockReceipts.slice(0, 3).map((receipt) => (
                <div key={receipt.id} style={styles.sampleItem}>
                  <button
                    style={styles.sampleButton}
                    onClick={() => {
                      setReceiptNumber(receipt.receiptNumber);
                      setVerificationResult(null);
                    }}
                  >
                    <span style={styles.sampleNumber}>{receipt.receiptNumber}</span>
                    <span style={styles.sampleDetails}>
                      {receipt.payer} • ₱{receipt.amount.toLocaleString()}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div style={styles.instructionsContainer}>
            <h3 style={styles.instructionsTitle}>How to Verify</h3>
            <ul style={styles.instructionsList}>
              <li style={styles.instructionItem}>
                <strong>QR Code:</strong> Use your device camera to scan the QR code on the receipt
              </li>
              <li style={styles.instructionItem}>
                <strong>Manual Entry:</strong> Type the receipt number exactly as shown on the receipt
              </li>
              <li style={styles.instructionItem}>
                <strong>Verification:</strong> Valid receipts will show complete details and status
              </li>
              <li style={styles.instructionItem}>
                <strong>Issues:</strong> Contact the issuing organization if verification fails
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

/**
 * Styles for the ReceiptVerificationScreen component
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
  
  methodsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  
  method: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  
  methodTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  
  methodDescription: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '20px',
    margin: '0 0 20px 0',
  },
  
  inputContainer: {
    display: 'flex',
    gap: '12px',
  },
  
  input: {
    flex: 1,
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '16px',
    backgroundColor: 'white',
  },
  
  verifyButton: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    minWidth: '100px',
  },
  
  verifyButtonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
  },
  
  qrButton: {
    backgroundColor: '#059669',
    color: 'white',
    padding: '16px 32px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  
  qrButtonText: {
    color: 'white',
  },
  
  resultsSection: {
    marginBottom: '32px',
  },
  
  resultContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '2px solid #e5e7eb',
  },
  
  resultTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#374151',
    margin: 0,
  },
  
  resultContent: {
    display: 'grid',
    gap: '12px',
  },
  
  resultRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #f3f4f6',
  },
  
  resultLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#6b7280',
  },
  
  resultValue: {
    fontSize: '14px',
    color: '#374151',
    fontWeight: '500',
  },
  
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    textAlign: 'center',
  },
  
  statusText: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
    textTransform: 'capitalize',
  },
  
  failureText: {
    fontSize: '16px',
    color: '#374151',
    marginBottom: '12px',
    margin: '0 0 12px 0',
  },
  
  failureSubtext: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
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
    display: 'block',
    margin: '0 auto',
  },
  
  samplesContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  
  samplesTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  
  samplesDescription: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '16px',
    margin: '0 0 16px 0',
  },
  
  samplesList: {
    display: 'grid',
    gap: '12px',
  },
  
  sampleItem: {
    width: '100%',
  },
  
  sampleButton: {
    width: '100%',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '12px 16px',
    cursor: 'pointer',
    textAlign: 'left',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  sampleNumber: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e3a8a',
  },
  
  sampleDetails: {
    fontSize: '12px',
    color: '#6b7280',
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

export default ReceiptVerificationScreen;